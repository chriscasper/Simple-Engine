import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { fileUtils } from './file.js';
import type { SimpleEngineConfig } from '../types/config.js';

const CollectionConfigSchema = z.object({
  pattern: z.string(),
  sortBy: z.string().optional(),
  reverse: z.boolean().optional(),
  permalink: z.string().optional(),
});

const SeoConfigSchema = z
  .object({
    sitemap: z.boolean().optional(),
    rss: z.boolean().optional(),
    robots: z.boolean().optional(),
    llmsTxt: z.boolean().optional(),
    llmsFull: z.boolean().optional(),
    rawMarkdown: z.boolean().optional(),
    jsonLd: z.boolean().optional(),
    aiCrawlers: z
      .object({
        allow: z.boolean().optional(),
        disallow: z.array(z.string()).optional(),
        allowList: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .optional();

export const ConfigSchema = z.object({
  site: z.object({
    title: z.string(),
    url: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    language: z.string().optional(),
  }),
  paths: z.object({
    content: z.string(),
    layouts: z.string(),
    output: z.string(),
    styles: z.string().optional(),
    static: z.string().optional(),
  }),
  markdown: z
    .object({
      options: z.record(z.unknown()).optional(),
      plugins: z.array(z.string()).optional(),
      shiki: z
        .object({
          theme: z.string().optional(),
          themes: z.record(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  tailwind: z
    .object({
      config: z.string().optional(),
    })
    .optional(),
  dev: z
    .object({
      port: z.number().optional(),
      open: z.boolean().optional(),
    })
    .optional(),
  collections: z.record(CollectionConfigSchema).optional(),
  seo: SeoConfigSchema,
});

export const PageFrontmatterSchema = z
  .object({
    title: z.string(),
    layout: z.union([z.string(), z.number()]).transform(String).optional(),
    date: z.union([z.string(), z.date()]).optional(),
    tags: z.array(z.string()).optional(),
    permalink: z.union([z.string(), z.number()]).transform(String).optional(),
    draft: z.boolean().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    noindex: z.boolean().optional(),
    schema: z.union([z.record(z.unknown()), z.array(z.record(z.unknown()))]).optional(),
  })
  .passthrough();

const defaultConfig: SimpleEngineConfig = {
  site: {
    title: 'My Simple Site',
    url: 'http://localhost:3000',
    description: 'A simple static site',
    language: 'en',
  },
  paths: {
    content: './content',
    layouts: './layouts',
    output: './dist',
    styles: './styles',
    static: './public',
  },
  markdown: {
    options: {
      html: true,
      linkify: true,
      typographer: true,
    },
    plugins: [],
    shiki: {
      theme: 'github-dark',
    },
  },
  collections: {
    posts: {
      pattern: 'blog/**/*.md',
      sortBy: 'date',
      reverse: true,
    },
  },
  seo: {
    sitemap: true,
    rss: true,
    robots: true,
    llmsTxt: true,
    llmsFull: false,
    rawMarkdown: true,
    jsonLd: true,
    aiCrawlers: {
      allow: true,
    },
  },
  dev: {
    port: 3000,
    open: false,
  },
};

export const configUtils = {
  async loadConfig(projectDir: string): Promise<SimpleEngineConfig> {
    const configPath = path.join(projectDir, 'simple.config.js');

    if (await fileUtils.exists(configPath)) {
      try {
        // Read + data-URL import works in Node and Vitest, and busts ESM cache
        const source = await fileUtils.readFile(configPath);
        const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(
          `${source}\n//# sourceURL=${pathToFileURL(configPath).href}`
        )}`;
        const configModule = await import(moduleUrl);
        const userConfig = configModule.default || configModule;
        const merged = this.mergeConfig(defaultConfig, userConfig);
        const parsed = ConfigSchema.safeParse(merged);

        if (!parsed.success) {
          const issues = parsed.error.issues
            .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
            .join('\n');
          throw new Error(`Invalid simple.config.js:\n${issues}`);
        }

        return merged;
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('Invalid simple.config.js')) {
          throw error;
        }
        console.error('Error loading config:', error);
        return structuredClone(defaultConfig);
      }
    }

    return structuredClone(defaultConfig);
  },

  mergeConfig(
    defaultConf: SimpleEngineConfig,
    userConf: Partial<SimpleEngineConfig>
  ): SimpleEngineConfig {
    return {
      site: { ...defaultConf.site, ...userConf.site },
      paths: { ...defaultConf.paths, ...userConf.paths },
      markdown: {
        ...defaultConf.markdown,
        ...userConf.markdown,
        options: {
          ...defaultConf.markdown?.options,
          ...userConf.markdown?.options,
        },
        shiki: {
          ...defaultConf.markdown?.shiki,
          ...userConf.markdown?.shiki,
        },
      },
      tailwind: { ...defaultConf.tailwind, ...userConf.tailwind },
      dev: { ...defaultConf.dev, ...userConf.dev },
      collections: { ...defaultConf.collections, ...userConf.collections },
      seo: {
        ...defaultConf.seo,
        ...userConf.seo,
        aiCrawlers: {
          ...defaultConf.seo?.aiCrawlers,
          ...userConf.seo?.aiCrawlers,
        },
      },
    };
  },

  getDefaultConfig(): SimpleEngineConfig {
    return structuredClone(defaultConfig);
  },

  validateFrontmatter(data: unknown, filePath?: string): void {
    const result = PageFrontmatterSchema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      const location = filePath ? ` in ${filePath}` : '';
      throw new Error(`Invalid frontmatter${location}:\n${issues}`);
    }
  },
};
