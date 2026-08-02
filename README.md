# Simple Engine

[![npm version](https://img.shields.io/npm/v/simple-engine.svg)](https://www.npmjs.com/package/simple-engine)
[![Node.js](https://img.shields.io/node/v/simple-engine.svg)](https://www.npmjs.com/package/simple-engine)
[![License: MIT](https://img.shields.io/npm/l/simple-engine.svg)](https://www.npmjs.com/package/simple-engine)

> A seriously simple static site generator

Simple Engine is a fast, modern static site generator that lets you build websites with Markdown and Tailwind CSS. Write content in Markdown, customize layouts with Nunjucks templates, and deploy static HTML with zero runtime dependencies.

**Package:** [npmjs.com/package/simple-engine](https://www.npmjs.com/package/simple-engine)

## Features

- **Markdown-based content** — Write in Markdown with frontmatter support
- **Tailwind CSS v4** — Utility-first styling via `@tailwindcss/vite`
- **Vite tooling** — Fast production builds and a Vite-powered dev server
- **Hot reload** — Instant updates while editing content and layouts
- **Nunjucks templates** — Flexible layouts with custom filters
- **Collections** — Group posts and pages for indexes and feeds
- **Syntax highlighting** — Shiki-powered code blocks
- **SEO ready** — Canonical URLs, Open Graph, Twitter cards, JSON-LD
- **AI discoverability** — `llms.txt`, raw markdown endpoints, configurable AI crawler rules
- **Sitemap + RSS** — Generated at build time
- **Drafts** — Preview unpublished content with `simple dev --drafts`
- **Zero config defaults** — Configure only when you need to

## Quick Start

### Using npx (Recommended)

No global install needed — pull the published package from npm:

```bash
npx simple-engine@latest init my-site
cd my-site
npm install
npm run dev
```

Your site is now running at `http://localhost:3000`.

### Global Installation

```bash
npm install -g simple-engine
simple init my-site
cd my-site
npm install
npm run dev
```

## Requirements

- Node.js >= 20.0.0
- npm or yarn

## Installation

Install from npm as a project dependency:

```bash
npm install simple-engine --save-dev
```

Or pin a version:

```bash
npm install simple-engine@2 --save-dev
npx simple-engine@2 --version
```

## CLI Commands

### `simple init [directory]`

Initialize a new Simple Engine project.

```bash
simple init                    # Initialize in current directory
simple init my-site            # Initialize in new directory
simple init my-site -t default # Use a specific template
```

**Options:**
- `-t, --template <name>` - Template to use (default: "default")

### `simple dev`

Start the development server with hot reload.

```bash
simple dev                     # Start on port 3000
simple dev -p 8080             # Start on custom port
simple dev -o                  # Open browser automatically
simple dev --drafts            # Include draft pages
```

**Options:**
- `-p, --port <port>` - Port to run server on (default: 3000)
- `-o, --open` - Open browser automatically
- `--drafts` - Include pages with `draft: true`

### `simple build`

Build your site for production.

```bash
simple build                   # Build to ./dist
simple build -o ./public       # Build to custom directory
```

**Options:**
- `-o, --output <dir>` - Output directory (default: from config, usually `dist`)

### `simple new <type> <title>`

Create a new page or blog post.

```bash
simple new page "About"                    # Create new page
simple new post "My First Post"            # Create new blog post
simple new post "Hello" -d 2026-01-15      # With custom date
```

**Options:**
- `-d, --date <date>` - Custom date (ISO format)

## Project Structure

```
my-site/
├── content/              # Your Markdown content
│   ├── index.md
│   ├── about.md
│   ├── blog.md
│   └── blog/
│       └── first-post.md
├── layouts/              # Nunjucks templates
│   ├── base.njk
│   ├── default.njk
│   ├── post.njk
│   ├── blog.njk
│   ├── not-found.njk
│   └── partials/
│       └── head.njk      # SEO meta, Open Graph, JSON-LD
├── styles/
│   └── main.css          # Tailwind v4 entry (`@import "tailwindcss"`)
├── public/               # Static files (copied to output)
├── dist/                 # Built site (generated)
├── simple.config.js
└── package.json
```

## Configuration

### simple.config.js

```javascript
export default {
  site: {
    title: 'My Site',
    url: 'https://mysite.com',
    description: 'A simple static site',
    author: 'Your Name',
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
    llmsFull: false,
    rawMarkdown: true,
    jsonLd: true,
    aiCrawlers: {
      allow: true,
      // disallow: ['GPTBot'],
    },
  },
  markdown: {
    options: {
      html: true,
      linkify: true,
      typographer: true,
    },
    shiki: {
      theme: 'github-dark',
    },
  },
  dev: {
    port: 3000,
    open: false,
  },
};
```

### Collections

Collections group pages for templates. The default `posts` collection matches `blog/**/*.md`.

```njk
{% for post in collections.posts %}
  <a href="{{ post.url }}">{{ post.data.title }}</a>
{% endfor %}
```

### SEO and AI discoverability

Every production build can emit:

| Artifact | Purpose |
|---|---|
| Meta / Open Graph / Twitter tags | Classic SEO via `layouts/partials/head.njk` |
| JSON-LD | `WebSite`, `BlogPosting`, or custom `schema` frontmatter |
| `sitemap.xml` | Crawl map of all indexable pages |
| `feed.xml` | RSS feed of the posts collection |
| `robots.txt` | Crawl rules + AI bot allow/deny |
| `llms.txt` | AI-oriented site index |
| `llms-full.txt` | Optional full-content dump for agents |
| `**/index.md` | Raw markdown sibling of each HTML page |

Frontmatter SEO fields:

- `description` — meta description / OG description
- `image` — social share image path
- `noindex` — exclude from sitemap / robots indexing
- `schema` — custom JSON-LD object or array

## Writing Content

### Markdown Files

Create `.md` files in your `content` directory:

```markdown
---
title: My Page Title
layout: default
date: 2026-01-15
description: A short summary for SEO and social cards
tags: [tutorial, guide]
---

# Welcome

This is my content written in **Markdown**.

- Easy to write
- Clean syntax
- Syntax highlighting for code blocks
```

### Frontmatter

All frontmatter fields are available in your templates:

- `title` — Page title
- `layout` — Layout template (extension optional; `default` → `default.njk`)
- `date` — Publication date
- `description` — SEO / social description
- `image` — Social image path
- `tags` — Array of tags
- `permalink` — Custom URL path
- `draft` — Set to `true` to exclude from production builds
- `noindex` — Hide from sitemap / search indexing
- `schema` — Custom JSON-LD
- Custom fields — Add any fields you need

### Permalinks

Control your URL structure with `permalink`:

```markdown
---
title: About
permalink: /about-us
---
```

Or use the file structure:
- `content/index.md` → `/`
- `content/about.md` → `/about`
- `content/blog/hello.md` → `/blog/hello`

## 🎨 Templates

### Nunjucks Basics

Simple Engine uses [Nunjucks](https://mozilla.github.io/nunjucks/) for templating:

```html
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }} - {{ site.title }}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

### Built-in Filters

Simple Engine includes helpful filters:

```html
{{ date | date('MMMM d, yyyy') }}      <!-- Format date -->
{{ content | safe }}                   <!-- Render HTML -->
{{ text | upper }}                     <!-- Uppercase -->
{{ text | lower }}                     <!-- Lowercase -->
{{ text | excerpt(150) }}              <!-- Limit length -->
{{ posts | limit(5) }}                 <!-- Limit array -->
```

### Available Variables

In your templates:

```html
{{ site.title }}              <!-- Site config -->
{{ site.description }}
{{ site.url }}

{{ title }}                   <!-- Page frontmatter -->
{{ date }}
{{ tags }}

{{ content }}                 <!-- Rendered HTML content -->

{{ page.url }}                <!-- Current page info -->
{{ page.path }}

{{ pages }}                   <!-- All pages array -->
```

### Example Layout

`layouts/post.njk`:

```html
{% extends "base.njk" %}

{% block content %}
<article class="prose lg:prose-xl mx-auto">
  <header>
    <h1 class="text-4xl font-bold mb-2">{{ title }}</h1>
    <time class="text-gray-600">{{ date | date('MMMM d, yyyy') }}</time>
  </header>
  
  <div class="mt-8">
    {{ content | safe }}
  </div>
  
  {% if tags %}
  <footer class="mt-8">
    <div class="flex gap-2">
      {% for tag in tags %}
      <span class="px-3 py-1 bg-gray-200 rounded-full text-sm">
        {{ tag }}
      </span>
      {% endfor %}
    </div>
  </footer>
  {% endif %}
</article>
{% endblock %}
```

## Styling with Tailwind

Simple Engine uses **Tailwind CSS v4** through `@tailwindcss/vite`. No `tailwind.config.js` or PostCSS config is required.

### Main CSS File

`styles/main.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-brand: #0f766e;
}

@layer components {
  .btn {
    @apply px-4 py-2 bg-brand text-white rounded hover:opacity-90;
  }
}
```

Theme tokens and plugins are configured in CSS. See the [Tailwind v4 docs](https://tailwindcss.com/docs) for details.

### Using Tailwind in Templates

```html
<div class="max-w-4xl mx-auto px-4">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">
    {{ title }}
  </h1>
  <div class="prose prose-lg">
    {{ content | safe }}
  </div>
</div>
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Your production-ready site is in the `dist` directory.

### Deploy to Netlify

1. Push your project to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Deploy Anywhere

The `dist` directory contains static HTML/CSS/JS. Upload to any static hosting:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages
- Or any web server

## 📚 Examples

### Blog Setup

Create a blog with Simple Engine:

1. Create blog posts in `content/blog/`:

```markdown
---
title: My First Post
layout: post
date: 2025-10-10
tags: [news, update]
---

# Hello World

This is my first blog post!
```

2. Create a blog index page `content/blog/index.md`:

```markdown
---
title: Blog
layout: blog-list
---

# Blog Posts
```

3. Create `layouts/blog-list.njk`:

```html
{% extends "base.njk" %}

{% block content %}
<div class="max-w-4xl mx-auto">
  <h1 class="text-4xl font-bold mb-8">{{ title }}</h1>
  
  {% for post in pages %}
    {% if post.path.startsWith('blog/') and post.path != 'blog/index.md' %}
    <article class="mb-8 pb-8 border-b">
      <h2 class="text-2xl font-bold mb-2">
        <a href="{{ post.url }}">{{ post.data.title }}</a>
      </h2>
      <time class="text-gray-600">
        {{ post.data.date | date('MMMM d, yyyy') }}
      </time>
      <p class="mt-2">{{ post.content | excerpt(200) }}</p>
    </article>
    {% endif %}
  {% endfor %}
</div>
{% endblock %}
```

## 🔧 Advanced Usage

### Custom Filters

Add custom template filters in your build script:

```javascript
import { SimpleEngine } from 'simple-engine';

const engine = new SimpleEngine('./');
engine.template.addFilter('reverse', (str) => {
  return str.split('').reverse().join('');
});
```

### Collections

Organize content into collections for blogs, portfolios, etc.:

```javascript
// simple.config.js
export default {
  collections: {
    posts: {
      pattern: 'blog/**/*.md',
      sortBy: 'date',
      reverse: true,
    },
  },
};
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests welcome.

## Publishing updates

`simple-engine` is published on [npm](https://www.npmjs.com/package/simple-engine). For maintainers publishing a new version, see [PUBLISHING.md](PUBLISHING.md).

## License

MIT License - see LICENSE file for details

## Support

- [npm package](https://www.npmjs.com/package/simple-engine)
- [GitHub repository](https://github.com/chriscasper/Simple-Engine)
- [Issue Tracker](https://github.com/chriscasper/Simple-Engine/issues)
- [Discussions](https://github.com/chriscasper/Simple-Engine/discussions)

## What's New

Simple Engine 2.0 is on a modern 2026 stack:

- TypeScript + Vite + Tailwind CSS v4
- Nunjucks templates with Markdown + Shiki
- Collections, drafts preview, sitemap, and RSS
- SEO + AI discoverability (`llms.txt`, JSON-LD, raw markdown)
- Validated config/frontmatter and a real default starter template

Migrating from the old Gulp-based 1.x? See [MIGRATION.md](MIGRATION.md).

---

Built by [Christopher Casper](https://christophercasper.com)
