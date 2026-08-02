import path from 'node:path';
import { fileUtils } from '../utils/file.js';
import type {
  ProcessedPage,
  SimpleEngineConfig,
  SeoConfig,
} from '../types/config.js';

const DEFAULT_AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'cohere-ai',
];

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const joinUrl = (base: string, urlPath: string): string => {
  const normalizedBase = base.replace(/\/$/, '');
  if (!urlPath || urlPath === '/') {
    return `${normalizedBase}/`;
  }
  const normalizedPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  return `${normalizedBase}${normalizedPath}`;
};

const getSeoDefaults = (seo?: SeoConfig): Required<Omit<SeoConfig, 'aiCrawlers'>> & {
  aiCrawlers: NonNullable<SeoConfig['aiCrawlers']>;
} => ({
  sitemap: seo?.sitemap ?? true,
  rss: seo?.rss ?? true,
  robots: seo?.robots ?? true,
  llmsTxt: seo?.llmsTxt ?? true,
  llmsFull: seo?.llmsFull ?? false,
  rawMarkdown: seo?.rawMarkdown ?? true,
  jsonLd: seo?.jsonLd ?? true,
  aiCrawlers: {
    allow: seo?.aiCrawlers?.allow ?? true,
    disallow: seo?.aiCrawlers?.disallow ?? [],
    allowList: seo?.aiCrawlers?.allowList ?? [],
  },
});

export const buildJsonLd = (
  page: ProcessedPage,
  config: SimpleEngineConfig,
  collections: Record<string, ProcessedPage[]>
): Record<string, unknown> | Record<string, unknown>[] | null => {
  if (page.data.schema) {
    return page.data.schema;
  }

  const siteUrl = config.site.url;
  const pageUrl = joinUrl(siteUrl, page.url);
  const isHome = page.url === '/';
  const isPost = collections.posts?.some((p) => p.url === page.url);

  if (isHome) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.site.title,
      url: joinUrl(siteUrl, '/'),
      description: config.site.description,
      ...(config.site.author
        ? {
            author: {
              '@type': 'Person',
              name: config.site.author,
            },
          }
        : {}),
    };
  }

  if (isPost) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: page.data.title,
      description: page.data.description || config.site.description,
      datePublished: page.data.date,
      url: pageUrl,
      ...(page.data.image
        ? { image: joinUrl(siteUrl, page.data.image) }
        : {}),
      ...(config.site.author || page.data.author
        ? {
            author: {
              '@type': 'Person',
              name: String(page.data.author || config.site.author),
            },
          }
        : {}),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': pageUrl,
      },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.data.title,
    description: page.data.description || config.site.description,
    url: pageUrl,
  };
};

export class SeoGenerator {
  constructor(
    private config: SimpleEngineConfig,
    private outputDir: string
  ) {}

  async generate(
    pages: ProcessedPage[],
    collections: Record<string, ProcessedPage[]>
  ): Promise<void> {
    const seo = getSeoDefaults(this.config.seo);

    if (seo.sitemap) {
      await this.writeSitemap(pages);
    }

    if (seo.rss) {
      await this.writeRss(collections.posts || []);
    }

    if (seo.robots) {
      await this.writeRobots();
    }

    if (seo.llmsTxt) {
      await this.writeLlmsTxt(pages, seo.llmsFull);
    }

    if (seo.rawMarkdown) {
      await this.writeRawMarkdown(pages);
    }
  }

  private async writeSitemap(pages: ProcessedPage[]): Promise<void> {
    const urls = pages
      .filter((page) => !page.data.noindex)
      .map((page) => {
        const loc = joinUrl(this.config.site.url, page.url);
        const lastmod = page.data.date
          ? new Date(page.data.date).toISOString().split('T')[0]
          : undefined;

        return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

    await fileUtils.writeFile(path.join(this.outputDir, 'sitemap.xml'), xml);
  }

  private async writeRss(posts: ProcessedPage[]): Promise<void> {
    if (posts.length === 0) {
      return;
    }

    const siteUrl = this.config.site.url.replace(/\/$/, '');
    const items = posts
      .slice(0, 20)
      .map((post) => {
        const link = joinUrl(siteUrl, post.url);
        const pubDate = post.data.date
          ? new Date(post.data.date).toUTCString()
          : new Date().toUTCString();
        const description = post.data.description || post.content.slice(0, 200);

        return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(this.config.site.title)}</title>
    <link>${escapeXml(siteUrl)}/</link>
    <description>${escapeXml(this.config.site.description || '')}</description>
    <language>${escapeXml(this.config.site.language || 'en')}</language>
${items}
  </channel>
</rss>
`;

    await fileUtils.writeFile(path.join(this.outputDir, 'feed.xml'), xml);
  }

  private async writeRobots(): Promise<void> {
    const seo = getSeoDefaults(this.config.seo);
    const siteUrl = this.config.site.url.replace(/\/$/, '');
    const lines: string[] = ['User-agent: *', 'Allow: /', ''];

    const allowAi = seo.aiCrawlers.allow !== false;
    const disallow = new Set(seo.aiCrawlers.disallow || []);
    const allowList = new Set(seo.aiCrawlers.allowList || []);

    for (const bot of DEFAULT_AI_BOTS) {
      if (disallow.has(bot)) {
        lines.push(`User-agent: ${bot}`, 'Disallow: /', '');
        continue;
      }

      if (!allowAi && !allowList.has(bot)) {
        lines.push(`User-agent: ${bot}`, 'Disallow: /', '');
        continue;
      }

      lines.push(`User-agent: ${bot}`, 'Allow: /', '');
    }

    for (const bot of allowList) {
      if (!DEFAULT_AI_BOTS.includes(bot)) {
        lines.push(`User-agent: ${bot}`, 'Allow: /', '');
      }
    }

    lines.push(`Sitemap: ${siteUrl}/sitemap.xml`, '');

    await fileUtils.writeFile(path.join(this.outputDir, 'robots.txt'), lines.join('\n'));
  }

  private async writeLlmsTxt(pages: ProcessedPage[], full: boolean): Promise<void> {
    const siteUrl = this.config.site.url.replace(/\/$/, '');
    const lines = [
      `# ${this.config.site.title}`,
      '',
      `> ${this.config.site.description || ''}`,
      '',
      '## Pages',
      '',
    ];

    for (const page of pages.filter((p) => !p.data.noindex)) {
      const url = joinUrl(siteUrl, page.url);
      const desc = page.data.description ? `: ${page.data.description}` : '';
      lines.push(`- [${page.data.title}](${url})${desc}`);
    }

    lines.push('');
    await fileUtils.writeFile(path.join(this.outputDir, 'llms.txt'), lines.join('\n'));

    if (full) {
      const fullLines = [
        `# ${this.config.site.title}`,
        '',
        `> ${this.config.site.description || ''}`,
        '',
      ];

      for (const page of pages.filter((p) => !p.data.noindex)) {
        fullLines.push(`## ${page.data.title}`, '');
        fullLines.push(`URL: ${joinUrl(siteUrl, page.url)}`, '');
        fullLines.push(page.content.trim(), '', '---', '');
      }

      await fileUtils.writeFile(path.join(this.outputDir, 'llms-full.txt'), fullLines.join('\n'));
    }
  }

  private async writeRawMarkdown(pages: ProcessedPage[]): Promise<void> {
    for (const page of pages) {
      const mdPath =
        page.url === '/'
          ? path.join(this.outputDir, 'index.md')
          : path.join(this.outputDir, page.url.replace(/^\//, ''), 'index.md');

      const frontmatterLines = [
        '---',
        `title: ${JSON.stringify(page.data.title)}`,
      ];

      if (page.data.description) {
        frontmatterLines.push(`description: ${JSON.stringify(page.data.description)}`);
      }
      if (page.data.date) {
        frontmatterLines.push(`date: ${JSON.stringify(page.data.date)}`);
      }

      frontmatterLines.push('---', '', page.content.trim(), '');

      await fileUtils.writeFile(mdPath, frontmatterLines.join('\n'));
    }
  }
}
