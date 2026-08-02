# Changelog

All notable changes to Simple Engine will be documented in this file.

## [Unreleased]

### Added

- Tailwind CSS v4 via `@tailwindcss/vite` (no PostCSS/autoprefixer required)
- Collections API exposed to templates (`collections.posts`, etc.)
- Shiki syntax highlighting for Markdown code blocks
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
- Replaced `fs-extra` with `node:fs/promises`
- Replaced Inquirer with `@inquirer/prompts`
- Migrated ESLint to flat config (v9)

## [3.0.0] - 2025-10-10

### Complete Rewrite

Simple Engine v3.0 is a ground-up rewrite with modern tooling and best practices.

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

### Migration from v2.x

v3.0 is a breaking change. To migrate:

1. Install v3.0: `npm install simple-engine@3`
2. Initialize a new project: `simple init my-new-site`
3. Migrate content from HTML to Markdown
4. Update layouts from Swig to Nunjucks (syntax is similar)
5. Replace Bootstrap/SASS with Tailwind CSS

## [2.0.0] - 2016

### Added

- Initial public release
- Gulp-based build system
- Swig templating
- SASS preprocessing
- Bootstrap framework
- Live reload server

---

[3.0.0]: https://github.com/Huelio/Simple-Engine/releases/tag/v3.0.0
[2.0.0]: https://github.com/Huelio/Simple-Engine/releases/tag/v2.0.0




