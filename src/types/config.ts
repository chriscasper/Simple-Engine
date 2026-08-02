export interface SimpleEngineConfig {
  site: {
    title: string;
    url: string;
    description?: string;
    author?: string;
    language?: string;
  };
  paths: {
    content: string;
    layouts: string;
    output: string;
    styles?: string;
    static?: string;
  };
  markdown?: {
    options?: Record<string, unknown>;
    plugins?: string[];
    shiki?: {
      theme?: string;
      themes?: Record<string, string>;
    };
  };
  tailwind?: {
    config?: string;
  };
  dev?: {
    port?: number;
    open?: boolean;
  };
  collections?: Record<string, CollectionConfig>;
  seo?: SeoConfig;
}

export interface CollectionConfig {
  pattern: string;
  sortBy?: string;
  reverse?: boolean;
  permalink?: string;
}

export interface SeoConfig {
  /** Generate sitemap.xml (default: true) */
  sitemap?: boolean;
  /** Generate feed.xml RSS for posts collection (default: true) */
  rss?: boolean;
  /** Generate robots.txt (default: true) */
  robots?: boolean;
  /** Generate llms.txt for AI crawlers (default: true) */
  llmsTxt?: boolean;
  /** Also generate llms-full.txt with full page content (default: false) */
  llmsFull?: boolean;
  /** Emit raw markdown alongside HTML pages (default: true) */
  rawMarkdown?: boolean;
  /** Inject JSON-LD structured data (default: true) */
  jsonLd?: boolean;
  /** AI crawler rules for robots.txt */
  aiCrawlers?: {
    /** Allow AI crawlers by default (default: true) */
    allow?: boolean;
    /** Explicitly disallow these bots */
    disallow?: string[];
    /** Explicitly allow these bots (overrides disallow when allow is false) */
    allowList?: string[];
  };
}

export interface PageData {
  title: string;
  layout?: string;
  date?: string | Date;
  tags?: string[];
  permalink?: string;
  draft?: boolean;
  description?: string;
  image?: string;
  noindex?: boolean;
  author?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  [key: string]: unknown;
}

export interface ProcessedPage {
  data: PageData;
  content: string;
  html: string;
  path: string;
  url: string;
  inputPath: string;
  outputPath: string;
}

export interface BuildOptions {
  includeDrafts?: boolean;
  outputDir?: string;
}
