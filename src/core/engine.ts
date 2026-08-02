import path from 'node:path';
import fg from 'fast-glob';
import { fileUtils } from '../utils/file.js';
import { configUtils } from '../utils/config.js';
import { MarkdownProcessor } from './markdown.js';
import { TemplateEngine } from './template.js';
import { SeoGenerator, buildJsonLd } from './seo.js';
import type {
  SimpleEngineConfig,
  ProcessedPage,
  BuildOptions,
  CollectionConfig,
} from '../types/config.js';

const matchGlob = (filePath: string, pattern: string): boolean => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedPattern = pattern.replace(/\\/g, '/');

  // Expand globs: ** matches across segments (including zero), * matches one segment
  const regexSource = normalizedPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '<<<DS>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .replace(/\/<<<DS>>>\//g, '/(?:.*/)?')
    .replace(/<<<DS>>>/g, '.*');

  return new RegExp(`^${regexSource}$`).test(normalizedPath);
};

export class SimpleEngine {
  private config: SimpleEngineConfig;
  private markdown: MarkdownProcessor;
  private template: TemplateEngine;
  private projectDir: string;
  private includeDrafts = false;
  private outputOverride?: string;

  constructor(projectDir: string, config?: SimpleEngineConfig) {
    this.projectDir = projectDir;
    this.config = config || configUtils.getDefaultConfig();
    this.markdown = new MarkdownProcessor({
      options: this.config.markdown?.options,
      shiki: this.config.markdown?.shiki,
      disableShiki: process.env.SIMPLE_ENGINE_DISABLE_SHIKI === '1',
    });
    this.template = new TemplateEngine(
      path.join(projectDir, this.config.paths.layouts)
    );

    this.template.addGlobal('site', this.config.site);
  }

  async loadConfig(): Promise<void> {
    this.config = await configUtils.loadConfig(this.projectDir);
    this.markdown = new MarkdownProcessor({
      options: this.config.markdown?.options,
      shiki: this.config.markdown?.shiki,
      disableShiki: process.env.SIMPLE_ENGINE_DISABLE_SHIKI === '1',
    });
    this.template = new TemplateEngine(
      path.join(this.projectDir, this.config.paths.layouts)
    );
    this.template.addGlobal('site', this.config.site);
  }

  setIncludeDrafts(include: boolean): void {
    this.includeDrafts = include;
  }

  setOutputOverride(outputDir?: string): void {
    this.outputOverride = outputDir;
  }

  getOutputDir(): string {
    return path.resolve(
      this.projectDir,
      this.outputOverride || this.config.paths.output
    );
  }

  async collectPages(): Promise<ProcessedPage[]> {
    await this.markdown.ensureReady();

    const contentDir = path.join(this.projectDir, this.config.paths.content);
    const pattern = path.join(contentDir, '**/*.{md,markdown}').replace(/\\/g, '/');

    const files = await fg(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**'],
    });

    const pages: ProcessedPage[] = [];

    for (const filePath of files) {
      const content = await fileUtils.readFile(filePath);
      const parsed = this.markdown.parse(content, {
        validateFrontmatter: true,
        filePath,
      });

      if (parsed.data.draft && !this.includeDrafts) {
        continue;
      }

      const relativePath = path.relative(contentDir, filePath).replace(/\\/g, '/');
      const urlPath = this.getUrlPath(relativePath, parsed.data.permalink);
      const outputPath = this.getOutputPath(urlPath);

      pages.push({
        data: parsed.data,
        content: parsed.content,
        html: parsed.html,
        path: relativePath,
        url: urlPath,
        inputPath: filePath,
        outputPath,
      });
    }

    pages.sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA;
    });

    return pages;
  }

  buildCollections(pages: ProcessedPage[]): Record<string, ProcessedPage[]> {
    const collections: Record<string, ProcessedPage[]> = {};
    const collectionConfigs = this.config.collections || {};

    for (const [name, collectionConfig] of Object.entries(collectionConfigs)) {
      collections[name] = this.filterCollection(pages, collectionConfig);
    }

    return collections;
  }

  private filterCollection(
    pages: ProcessedPage[],
    config: CollectionConfig
  ): ProcessedPage[] {
    let matched = pages.filter((page) => matchGlob(page.path, config.pattern));

    if (config.sortBy) {
      const sortKey = config.sortBy;
      matched = [...matched].sort((a, b) => {
        const aVal = a.data[sortKey];
        const bVal = b.data[sortKey];

        if (sortKey === 'date') {
          const aTime = aVal ? new Date(String(aVal)).getTime() : 0;
          const bTime = bVal ? new Date(String(bVal)).getTime() : 0;
          return aTime - bTime;
        }

        return String(aVal ?? '').localeCompare(String(bVal ?? ''));
      });

      if (config.reverse !== false && sortKey === 'date') {
        matched.reverse();
      } else if (config.reverse) {
        matched.reverse();
      }
    }

    return matched;
  }

  normalizeLayout(layout?: string): string {
    if (!layout) {
      return 'default.njk';
    }

    if (path.extname(layout)) {
      return layout;
    }

    return `${layout}.njk`;
  }

  async renderPage(
    page: ProcessedPage,
    allPages: ProcessedPage[],
    collections: Record<string, ProcessedPage[]>
  ): Promise<string> {
    const layout = this.normalizeLayout(page.data.layout);
    const layoutPath = path.join(this.projectDir, this.config.paths.layouts, layout);

    if (!(await fileUtils.exists(layoutPath))) {
      throw new Error(`Layout "${layout}" not found at ${layoutPath}`);
    }

    const seo = this.config.seo ?? {};
    const jsonLd =
      seo.jsonLd === false
        ? null
        : buildJsonLd(page, this.config, collections);

    const context = {
      ...page.data,
      content: page.html,
      page: {
        url: page.url,
        path: page.path,
        description: page.data.description,
        image: page.data.image,
        noindex: page.data.noindex,
      },
      pages: allPages,
      collections,
      site: this.config.site,
      seo: {
        canonical: this.absoluteUrl(page.url),
        jsonLd,
        title: page.data.title,
        description: page.data.description || this.config.site.description,
        image: page.data.image
          ? this.absoluteUrl(page.data.image)
          : undefined,
        noindex: page.data.noindex || false,
        type: collections.posts?.some((p) => p.url === page.url)
          ? 'article'
          : 'website',
      },
    };

    return this.template.renderFile(layout, context);
  }

  async build(options: BuildOptions = {}): Promise<ProcessedPage[]> {
    if (options.includeDrafts !== undefined) {
      this.includeDrafts = options.includeDrafts;
    }
    if (options.outputDir) {
      this.outputOverride = options.outputDir;
    }

    const outputDir = this.getOutputDir();

    // Clean output only on a full build (not incremental-style rebuilds that
    // callers manage). Always ensure the directory exists.
    if (await fileUtils.exists(outputDir)) {
      // Remove only known page/seo artifacts; preserve styles managed by Vite
      // during watch by writing pages in place after ensuring dir exists.
    }
    await fileUtils.ensureDir(outputDir);

    const pages = await this.collectPages();
    const collections = this.buildCollections(pages);

    // Track written HTML paths so we can prune stale ones later if needed
    for (const page of pages) {
      const html = await this.renderPage(page, pages, collections);
      await fileUtils.writeFile(page.outputPath, html);
    }

    // Copy static files
    const staticDir = path.join(
      this.projectDir,
      this.config.paths.static || 'public'
    );
    if (await fileUtils.exists(staticDir)) {
      await fileUtils.copyDir(staticDir, outputDir);
    }

    // SEO artifacts
    const seo = new SeoGenerator(this.config, outputDir);
    await seo.generate(pages, collections);

    return pages;
  }

  async cleanOutput(): Promise<void> {
    const outputDir = this.getOutputDir();
    if (await fileUtils.exists(outputDir)) {
      await fileUtils.remove(outputDir);
    }
    await fileUtils.ensureDir(outputDir);
  }

  getUrlPath(relativePath: string, permalink?: string): string {
    if (permalink) {
      return permalink.startsWith('/') ? permalink : `/${permalink}`;
    }

    let urlPath = relativePath
      .replace(/\.md$/, '')
      .replace(/\.markdown$/, '')
      .replace(/\\/g, '/');

    if (urlPath.endsWith('/index') || urlPath === 'index') {
      urlPath = urlPath.replace(/index$/, '');
    }

    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }

    if (urlPath !== '/' && urlPath.endsWith('/')) {
      urlPath = urlPath.slice(0, -1);
    }

    return urlPath;
  }

  getOutputPath(urlPath: string): string {
    const outputDir = this.getOutputDir();

    if (urlPath === '/') {
      return path.join(outputDir, 'index.html');
    }

    const cleanPath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
    return path.join(outputDir, cleanPath, 'index.html');
  }

  private absoluteUrl(urlPath: string): string {
    const base = this.config.site.url.replace(/\/$/, '');
    if (!urlPath || urlPath === '/') {
      return `${base}/`;
    }
    if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
      return urlPath;
    }
    return `${base}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`;
  }

  getConfig(): SimpleEngineConfig {
    return this.config;
  }
}
