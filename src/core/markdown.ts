import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import matter from 'gray-matter';
import { configUtils } from '../utils/config.js';
import type { PageData } from '../types/config.js';

export interface MarkdownOptions {
  options?: Record<string, unknown>;
  shiki?: {
    theme?: string;
    themes?: Record<string, string>;
  };
  validateFrontmatter?: boolean;
  filePath?: string;
  /** Skip Shiki for faster tests / plain rendering */
  disableShiki?: boolean;
}

type ShikiPlugin = (md: MarkdownIt) => void;

const shikiPluginCache = new Map<string, Promise<ShikiPlugin | null>>();

const getShikiPlugin = (theme: string): Promise<ShikiPlugin | null> => {
  const cached = shikiPluginCache.get(theme);
  if (cached) {
    return cached;
  }

  const pending = (async () => {
    try {
      const { default: markdownItShiki } = await import('@shikijs/markdown-it');
      return await markdownItShiki({
        themes: {
          light: theme,
          dark: theme,
        },
        defaultColor: false,
      });
    } catch {
      return null;
    }
  })();

  shikiPluginCache.set(theme, pending);
  return pending;
};

export class MarkdownProcessor {
  private md: MarkdownIt;
  private ready: Promise<void>;

  constructor(options: MarkdownOptions = {}) {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      ...(options.options || {}),
    });

    this.md.use(anchor, {
      permalink: anchor.permalink.headerLink(),
    });

    this.ready = options.disableShiki
      ? Promise.resolve()
      : this.setupShiki(options.shiki);
  }

  private async setupShiki(shikiConfig?: MarkdownOptions['shiki']): Promise<void> {
    const theme = shikiConfig?.theme || 'github-dark';
    const plugin = await getShikiPlugin(theme);
    if (plugin) {
      this.md.use(plugin);
    }
  }

  async ensureReady(): Promise<void> {
    await this.ready;
  }

  parse(
    content: string,
    options: { validateFrontmatter?: boolean; filePath?: string } = {}
  ): { data: PageData; content: string; html: string } {
    const { data, content: markdownContent } = matter(content);

    if (options.validateFrontmatter !== false) {
      configUtils.validateFrontmatter(data, options.filePath);
    }

    const pageData = { ...data } as PageData;
    if (pageData.date instanceof Date) {
      pageData.date = pageData.date.toISOString();
    }
    if (typeof pageData.layout === 'number') {
      pageData.layout = String(pageData.layout);
    }
    if (typeof pageData.permalink === 'number') {
      pageData.permalink = String(pageData.permalink);
    }

    const html = this.md.render(markdownContent);

    return {
      data: pageData,
      content: markdownContent,
      html,
    };
  }

  render(markdown: string): string {
    return this.md.render(markdown);
  }

  addPlugin(plugin: (md: MarkdownIt, ...args: unknown[]) => void, ...args: unknown[]): void {
    this.md.use(plugin, ...args);
  }
}
