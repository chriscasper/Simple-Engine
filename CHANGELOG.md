# Changelog

All notable changes to Simple Engine will be documented in this file.

## [2.0.0] - 2026-08-01

### Complete Rewrite

Simple Engine 2.0 replaces the Gulp/Bootstrap stack with a modern TypeScript CLI.

### Added

- TypeScript ESM codebase with Commander CLI (`init`, `dev`, `build`, `new`)
- Vite tooling and Tailwind CSS v4 via `@tailwindcss/vite`
- Markdown + Nunjucks templates with Shiki syntax highlighting
- Collections API exposed to templates (`collections.posts`, etc.)
- SEO head partial: canonical, Open Graph, Twitter cards, JSON-LD
- Build artifacts: `sitemap.xml`, `feed.xml`, `robots.txt`, `llms.txt`
- Optional `llms-full.txt` and raw markdown endpoints (`index.md` beside HTML)
- `simple dev --drafts` to preview draft pages
- Zod validation for config and frontmatter
- Real `templates/default` starter with blog, 404, and SEO partials
- Vitest integration/unit tests and Node 20/22 CI matrix

### Fixed

- Layout names without `.njk` extension now resolve correctly
- Date filter supports `'now'` and guards invalid dates
- Dev server serves Tailwind CSS (styled previews)
- `simple build -o` applies to HTML and CSS together
- Templates directory resolves correctly from published `dist/`
- Config reload in watch mode (cache-busting import)
- Scaffolding escapes quotes in site titles; includes `post` layout

### Changed

- Node.js engine requirement is now `>=20`
- Replaced Gulp/Swig/Bootstrap with Vite/Nunjucks/Tailwind
- Replaced `fs-extra` with `node:fs/promises`
- Replaced Inquirer with `@inquirer/prompts`
- Migrated ESLint to flat config (v9)

## [3.0.0] - 2025-10-10 (superseded)

Draft notes from an earlier numbering plan. Shipped as **2.0.0** instead.

### Added

- TypeScript codebase for better type safety and DX
- Modern CLI tool with Commander.js
- Markdown-first content authoring
- Frontmatter support with gray-matter
- Nunjucks templating engine (replacement for deprecated Swig)
- Tailwind CSS v3 integration
- Vite for lightning-fast builds and dev server
- Hot module reload in development
- `simple init` command for project scaffolding
- `simple dev` command with watch mode
- `simple build` command for production builds
- `simple new` command to create pages and posts
- Custom template filters (date, excerpt, limit, etc.)
- Automatic permalink generation
- Draft support
- Static file copying
- Comprehensive documentation
- ESM module support

### Changed

- Switched from Gulp to Vite
- Switched from Swig to Nunjucks
- Switched from HTML to Markdown
- Switched from SASS to Tailwind CSS
- Complete project structure redesign
- Modern ES modules instead of CommonJS

### Removed

- ❌ Gulp build system
- ❌ Swig templates
- ❌ Bootstrap framework
- ❌ SASS preprocessor
- ❌ jQuery dependencies

### Migration from 1.x

2.0 is a breaking change. To migrate:

1. Install 2.0: `npm install simple-engine@2`
2. Initialize a new project: `npx simple-engine@2 init my-new-site`
3. Migrate content from HTML to Markdown
4. Update layouts from Swig to Nunjucks (syntax is similar)
5. Replace Bootstrap/SASS with Tailwind CSS

## [1.0.0] - 2016

### Added

- Initial public release
- Gulp-based build system
- Swig templating
- SASS preprocessing
- Bootstrap framework
- Live reload server

---

[2.0.0]: https://github.com/chriscasper/Simple-Engine/releases/tag/v2.0.0
[1.0.0]: https://github.com/chriscasper/Simple-Engine/releases/tag/v1.0.0




