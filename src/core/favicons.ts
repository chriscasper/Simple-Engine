import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { fileUtils } from '../utils/file.js';
import { logger } from '../utils/logger.js';

export interface FaviconSource {
  path: string;
  type: 'svg' | 'png';
}

export interface FaviconResult {
  /** HTML link tags to inject into <head>, or empty string if none */
  tags: string;
  /** Whether icon files were (re)generated this run */
  generated: boolean;
}

const ICO_SIZES = [16, 32, 48] as const;
const PNG_SIZES = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
] as const;

const OUTPUT_FILES = [
  'favicon.ico',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'site.webmanifest',
] as const;

export const detectFaviconSource = async (
  staticDir: string
): Promise<FaviconSource | null> => {
  const svgPath = path.join(staticDir, 'favicon.svg');
  if (await fileUtils.exists(svgPath)) {
    return { path: svgPath, type: 'svg' };
  }

  const pngPath = path.join(staticDir, 'favicon.png');
  if (await fileUtils.exists(pngPath)) {
    return { path: pngPath, type: 'png' };
  }

  return null;
};

const buildTags = (includeSvg: boolean): string => {
  const lines = [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
  ];

  if (includeSvg) {
    lines.push('<link rel="icon" href="/icon.svg" type="image/svg+xml">');
  }

  lines.push(
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">'
  );

  return lines.join('\n');
};

const outputsAreFresh = async (
  sourcePath: string,
  outputDir: string,
  includeSvg: boolean
): Promise<boolean> => {
  const sourceStat = await fs.stat(sourcePath);
  const files = includeSvg
    ? [...OUTPUT_FILES, 'icon.svg']
    : [...OUTPUT_FILES];

  for (const file of files) {
    const outPath = path.join(outputDir, file);
    if (!(await fileUtils.exists(outPath))) {
      return false;
    }
    const outStat = await fs.stat(outPath);
    if (outStat.mtimeMs < sourceStat.mtimeMs) {
      return false;
    }
  }

  return true;
};

const resizePng = async (
  sourcePath: string,
  size: number
): Promise<Buffer> => {
  return sharp(sourcePath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
};

/**
 * Detect a source favicon in the static dir, generate icon assets into
 * outputDir, and return the HTML tags to inject. No-ops when no source exists.
 */
export const generateFavicons = async (
  staticDir: string,
  outputDir: string,
  siteTitle: string
): Promise<FaviconResult> => {
  const source = await detectFaviconSource(staticDir);
  if (!source) {
    return { tags: '', generated: false };
  }

  if (source.type === 'png') {
    try {
      const meta = await sharp(source.path).metadata();
      const minDim = Math.min(meta.width ?? 0, meta.height ?? 0);
      if (minDim > 0 && minDim < 512) {
        logger.warn(
          `favicon.png is ${minDim}px — recommend 512px or larger for crisp icons`
        );
      }
    } catch {
      // Metadata read failed; continue and let sharp surface errors on resize
    }
  }

  const includeSvg = source.type === 'svg';
  const tags = buildTags(includeSvg);

  if (await outputsAreFresh(source.path, outputDir, includeSvg)) {
    return { tags, generated: false };
  }

  await fileUtils.ensureDir(outputDir);

  // Multi-size ICO
  const icoBuffers = await Promise.all(
    ICO_SIZES.map((size) => resizePng(source.path, size))
  );
  const ico = await pngToIco(icoBuffers);
  await fs.writeFile(path.join(outputDir, 'favicon.ico'), ico);

  // Apple touch + PWA PNGs
  for (const { name, size } of PNG_SIZES) {
    const buf = await resizePng(source.path, size);
    await fs.writeFile(path.join(outputDir, name), buf);
  }

  // SVG icon (copy source when provided)
  if (includeSvg) {
    await fs.copyFile(source.path, path.join(outputDir, 'icon.svg'));
  }

  // Web manifest
  const manifest = {
    name: siteTitle,
    short_name: siteTitle,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  };

  await fileUtils.writeJson(path.join(outputDir, 'site.webmanifest'), manifest);

  return { tags, generated: true };
};

/**
 * Inject favicon link tags before </head>. Skips when the HTML already
 * declares a favicon (rel="icon" or rel="apple-touch-icon").
 */
export const injectFaviconTags = (html: string, tags: string): string => {
  if (!tags) {
    return html;
  }

  if (
    /rel\s*=\s*["']icon["']/i.test(html) ||
    /rel\s*=\s*["']apple-touch-icon["']/i.test(html)
  ) {
    return html;
  }

  if (!/<\/head>/i.test(html)) {
    return html;
  }

  return html.replace(/<\/head>/i, `  ${tags}\n</head>`);
};
