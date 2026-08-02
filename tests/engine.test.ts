import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { fileUtils } from '../src/utils/file.js';
import { configUtils } from '../src/utils/config.js';
import { SimpleEngine } from '../src/core/engine.js';
import { TemplateEngine } from '../src/core/template.js';
import { MarkdownProcessor } from '../src/core/markdown.js';
import { SeoGenerator, buildJsonLd } from '../src/core/seo.js';

describe('fileUtils.slugify', () => {
  it('slugifies titles', () => {
    expect(fileUtils.slugify('Hello World!')).toBe('hello-world');
    expect(fileUtils.slugify('  My Post -- Title  ')).toBe('my-post-title');
  });
});

describe('TemplateEngine date filter', () => {
  it('supports now and guards invalid dates', () => {
    const engine = new TemplateEngine(os.tmpdir());
    const year = engine.render("{{ 'now' | date('yyyy') }}", {});
    expect(year).toMatch(/^\d{4}$/);

    const invalid = engine.render("{{ 'not-a-date' | date('yyyy') }}", {});
    expect(invalid).toBe('');
  });
});

describe('SimpleEngine URL helpers', () => {
  const engine = new SimpleEngine(process.cwd());

  it('normalizes layout extensions', () => {
    expect(engine.normalizeLayout('default')).toBe('default.njk');
    expect(engine.normalizeLayout('post.njk')).toBe('post.njk');
    expect(engine.normalizeLayout(undefined)).toBe('default.njk');
  });

  it('builds URL paths from content paths', () => {
    expect(engine.getUrlPath('index.md')).toBe('/');
    expect(engine.getUrlPath('about.md')).toBe('/about');
    expect(engine.getUrlPath('blog/hello-world.md')).toBe('/blog/hello-world');
    expect(engine.getUrlPath('blog/index.md')).toBe('/blog');
    expect(engine.getUrlPath('x.md', '/custom')).toBe('/custom');
  });
});

describe('config merge and validation', () => {
  it('merges nested config deeply', () => {
    const merged = configUtils.mergeConfig(configUtils.getDefaultConfig(), {
      site: { title: "Chris's Site", url: 'https://example.com' },
      seo: { llmsFull: true },
    });

    expect(merged.site.title).toBe("Chris's Site");
    expect(merged.seo?.llmsFull).toBe(true);
    expect(merged.seo?.sitemap).toBe(true);
  });

  it('validates frontmatter', () => {
    expect(() =>
      configUtils.validateFrontmatter({ title: 'Ok' })
    ).not.toThrow();

    expect(() => configUtils.validateFrontmatter({})).toThrow(/Invalid frontmatter/);
  });
});

describe('MarkdownProcessor', () => {
  it('parses frontmatter and markdown', async () => {
    const md = new MarkdownProcessor({ shiki: { theme: 'github-dark' } });
    await md.ensureReady();

    const result = md.parse(`---
title: Test
layout: default
---

# Hello

\`\`\`js
console.log(1)
\`\`\`
`);

    expect(result.data.title).toBe('Test');
    expect(result.html).toContain('<h1');
    expect(result.html).toContain('language-js');
    expect(result.html).toMatch(/console/);
  });
});

describe('integration: fixture site build', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `simple-engine-test-${Date.now()}`);
    await fileUtils.ensureDir(tempDir);

    const layoutsDir = path.join(tempDir, 'layouts');
    await fileUtils.ensureDir(path.join(layoutsDir, 'partials'));
    await fileUtils.ensureDir(path.join(tempDir, 'content', 'blog'));
    await fileUtils.ensureDir(path.join(tempDir, 'styles'));
    await fileUtils.ensureDir(path.join(tempDir, 'public'));

    await fileUtils.writeFile(
      path.join(layoutsDir, 'partials', 'head.njk'),
      `<title>{{ title }}</title>
<link rel="canonical" href="{{ seo.canonical }}">
{% if seo.jsonLd %}<script type="application/ld+json">{{ seo.jsonLd | json | safe }}</script>{% endif %}
`
    );

    await fileUtils.writeFile(
      path.join(layoutsDir, 'base.njk'),
      `<!DOCTYPE html><html><head>{% include "partials/head.njk" %}</head>
<body>{% block content %}{% endblock %}<footer>{{ 'now' | date('yyyy') }}</footer></body></html>`
    );

    await fileUtils.writeFile(
      path.join(layoutsDir, 'default.njk'),
      `{% extends "base.njk" %}{% block content %}<article>{{ content | safe }}</article>{% endblock %}`
    );

    await fileUtils.writeFile(
      path.join(layoutsDir, 'post.njk'),
      `{% extends "base.njk" %}{% block content %}<article><h1>{{ title }}</h1>{{ content | safe }}</article>{% endblock %}`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'content', 'index.md'),
      `---
title: Home
layout: default
description: Home page
---

# Home

Welcome.
`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'content', 'about.md'),
      `---
title: About
layout: default
description: About page
---

# About
`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'content', 'blog', 'hello.md'),
      `---
title: Hello
layout: post
date: 2026-01-15
description: First post
draft: false
---

# Hello

Post body.
`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'content', 'blog', 'draft.md'),
      `---
title: Draft
layout: post
date: 2026-01-16
draft: true
---

# Draft
`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'simple.config.js'),
      `export default {
  site: {
    title: "Chris's Test Site",
    url: 'https://example.com',
    description: 'Test site',
    author: 'Chris',
    language: 'en',
  },
  paths: {
    content: './content',
    layouts: './layouts',
    output: './dist',
    styles: './styles',
    static: './public',
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
    llmsFull: true,
    rawMarkdown: true,
    jsonLd: true,
    aiCrawlers: { allow: true },
  },
};
`
    );

    await fileUtils.writeFile(
      path.join(tempDir, 'styles', 'main.css'),
      `@import "tailwindcss";\n`
    );
  });

  afterEach(async () => {
    await fileUtils.remove(tempDir);
  });

  it('builds pages, collections, and SEO artifacts', async () => {
    const engine = new SimpleEngine(tempDir);
    await engine.loadConfig();
    await engine.cleanOutput();
    const pages = await engine.build({ includeDrafts: false });

    expect(pages.map((p) => p.url).sort()).toEqual([
      '/',
      '/about',
      '/blog/hello',
    ]);

    const home = await fileUtils.readFile(path.join(tempDir, 'dist', 'index.html'));
    expect(home).toContain('<title>Home</title>');
    expect(home).toContain('canonical');
    expect(home).toContain('WebSite');
    expect(home).toMatch(/\d{4}/); // date filter now

    const postHtml = await fileUtils.readFile(
      path.join(tempDir, 'dist', 'blog', 'hello', 'index.html')
    );
    expect(postHtml).toContain('BlogPosting');

    const sitemap = await fileUtils.readFile(path.join(tempDir, 'dist', 'sitemap.xml'));
    expect(sitemap).toContain('https://example.com/about');
    expect(sitemap).toContain('https://example.com/blog/hello');

    const feed = await fileUtils.readFile(path.join(tempDir, 'dist', 'feed.xml'));
    expect(feed).toContain('Hello');
    expect(feed).toContain('Chris&apos;s Test Site');

    const robots = await fileUtils.readFile(path.join(tempDir, 'dist', 'robots.txt'));
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(robots).toContain('GPTBot');

    const llms = await fileUtils.readFile(path.join(tempDir, 'dist', 'llms.txt'));
    expect(llms).toContain("Chris's Test Site");
    expect(llms).toContain('[About]');

    const llmsFull = await fileUtils.readFile(path.join(tempDir, 'dist', 'llms-full.txt'));
    expect(llmsFull).toContain('Post body.');

    const rawMd = await fileUtils.readFile(path.join(tempDir, 'dist', 'about', 'index.md'));
    expect(rawMd).toContain('title: "About"');
    expect(rawMd).toContain('# About');
  });

  it('includes drafts when requested', async () => {
    const engine = new SimpleEngine(tempDir);
    await engine.loadConfig();
    await engine.cleanOutput();
    const pages = await engine.build({ includeDrafts: true });

    expect(pages.some((p) => p.url === '/blog/draft')).toBe(true);
  });

  it('builds collections from config patterns', async () => {
    const engine = new SimpleEngine(tempDir);
    await engine.loadConfig();
    const pages = await engine.collectPages();
    const collections = engine.buildCollections(pages);

    expect(collections.posts).toHaveLength(1);
    expect(collections.posts[0].data.title).toBe('Hello');
  });
});

describe('buildJsonLd', () => {
  it('uses custom schema when provided', () => {
    const config = configUtils.getDefaultConfig();
    config.site.url = 'https://example.com';

    const page = {
      data: {
        title: 'Custom',
        schema: { '@type': 'FAQPage' },
      },
      content: '',
      html: '',
      path: 'custom.md',
      url: '/custom',
      inputPath: '',
      outputPath: '',
    };

    expect(buildJsonLd(page, config, {})).toEqual({ '@type': 'FAQPage' });
  });
});

describe('SeoGenerator robots', () => {
  it('can disallow AI crawlers', async () => {
    const tempDir = path.join(os.tmpdir(), `simple-seo-${Date.now()}`);
    await fileUtils.ensureDir(tempDir);

    const config = configUtils.getDefaultConfig();
    config.site.url = 'https://example.com';
    config.seo = {
      robots: true,
      sitemap: false,
      rss: false,
      llmsTxt: false,
      rawMarkdown: false,
      jsonLd: false,
      aiCrawlers: {
        allow: false,
        disallow: ['GPTBot'],
      },
    };

    const seo = new SeoGenerator(config, tempDir);
    await seo.generate([], {});

    const robots = await fileUtils.readFile(path.join(tempDir, 'robots.txt'));
    expect(robots).toContain('User-agent: GPTBot');
    expect(robots).toContain('Disallow: /');

    await fileUtils.remove(tempDir);
  });
});
