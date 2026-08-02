# Migration Guide: v2.x to v3.0

This guide helps you migrate from Simple Engine v2.x (Gulp-based) to v3.0 (modern CLI tool).

## 🚨 Breaking Changes

v3.0 is a complete rewrite with breaking changes:

- **Build System**: Gulp → Vite
- **Templating**: Swig → Nunjucks
- **Content Format**: HTML → Markdown
- **Styling**: Bootstrap/SASS → Tailwind CSS
- **Module System**: CommonJS → ESM
- **Configuration**: JSON → JavaScript

## 📋 Migration Steps

### 1. Backup Your Current Site

```bash
# Backup your v2.x site
cp -r my-site my-site-v2-backup
```

### 2. Install v3.0

```bash
cd my-site
npm install simple-engine@3 --save-dev
```

### 3. Initialize v3 Structure

Create a new v3 project to see the structure:

```bash
cd ..
npx simple-engine init my-site-v3
```

### 4. Migrate Configuration

**Old (`config.json`):**
```json
{
  "title": "Simple Engine",
  "url": "http://simpleengine.com",
  "author": "Christopher Casper"
}
```

**New (`simple.config.js`):**
```javascript
export default {
  site: {
    title: 'Simple Engine',
    url: 'http://simpleengine.com',
    author: 'Christopher Casper',
  },
  paths: {
    content: './content',
    layouts: './layouts',
    output: './dist',
  },
};
```

### 5. Convert Content: HTML → Markdown

**Old (`source/content/about.html`):**
```html
{% extends 'layouts/index.html' %}

{% block content %}
<h1>About</h1>
<p>This is the about page.</p>
{% endblock %}
```

**New (`content/about.md`):**
```markdown
---
title: About
layout: default
---

# About

This is the about page.
```

**Migration Script:**

```javascript
// convert.js
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const sourceDir = './source/content';
const targetDir = './content';

async function convertFiles() {
  const files = await fs.readdir(sourceDir, { recursive: true });
  
  for (const file of files) {
    if (file.endsWith('.html')) {
      const content = await fs.readFile(path.join(sourceDir, file), 'utf-8');
      
      // Extract title from content or filename
      const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
      const title = titleMatch ? titleMatch[1] : path.basename(file, '.html');
      
      // Create markdown version
      const markdown = `---
title: ${title}
layout: default
---

${content}
`;
      
      const newPath = path.join(targetDir, file.replace('.html', '.md'));
      await fs.ensureDir(path.dirname(newPath));
      await fs.writeFile(newPath, markdown);
    }
  }
}

convertFiles();
```

### 6. Migrate Layouts: Swig → Nunjucks

The syntax is nearly identical, but update extends/includes:

**Old Swig:**
```html
{% extends 'layouts/base.html' %}
```

**New Nunjucks:**
```html
{% extends "base.njk" %}
```

### 7. Migrate Styles: Bootstrap/SASS → Tailwind

**Old (`source/scss/styles.scss`):**
```scss
@import 'bootstrap';

.my-class {
  @extend .container;
  background-color: $primary-color;
}
```

**New (`styles/main.css`):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .my-class {
    @apply container mx-auto bg-blue-500;
  }
}
```

### 8. Update Scripts

**Old (`package.json`):**
```json
{
  "scripts": {
    "start": "gulp",
    "build": "gulp build"
  }
}
```

**New (`package.json`):**
```json
{
  "scripts": {
    "dev": "simple dev",
    "build": "simple build"
  }
}
```

### 9. Directory Structure Mapping

| v2.x                    | v3.0                |
|-------------------------|---------------------|
| `source/content/`       | `content/`          |
| `source/layouts/`       | `layouts/`          |
| `source/scss/`          | `styles/`           |
| `source/js/`            | `public/js/`        |
| `source/img/`           | `public/images/`    |
| `public/`               | `dist/`             |
| `config.json`           | `simple.config.js`  |
| `gulpfile.js`           | *(removed)*         |

## 🔄 Feature Comparison

| Feature           | v2.x              | v3.0              |
|-------------------|-------------------|-------------------|
| Build Tool        | Gulp 3            | Vite              |
| Templates         | Swig              | Nunjucks          |
| Content           | HTML              | Markdown          |
| Styling           | Bootstrap + SASS  | Tailwind CSS      |
| Dev Server        | gulp-server       | Vite dev server   |
| Hot Reload        | LiveReload        | HMR               |
| CLI               | ❌                | ✅                |
| TypeScript        | ❌                | ✅                |
| Frontmatter       | ❌                | ✅                |

## 🆕 New Features in v3.0

### CLI Commands

```bash
# Initialize projects
simple init my-site

# Create content quickly
simple new post "My Post"

# Better dev experience
simple dev --open
```

### Markdown & Frontmatter

```markdown
---
title: My Post
date: 2025-10-10
tags: [news, updates]
draft: false
---

Content here...
```

### Template Filters

```html
{{ date | date('MMMM d, yyyy') }}
{{ content | excerpt(150) }}
{{ posts | limit(5) }}
```

### Collections

Access all pages in templates:

```html
{% for post in pages %}
  <h2>{{ post.data.title }}</h2>
{% endfor %}
```

## 💡 Tips

### Gradual Migration

You can migrate gradually:

1. Start with a new v3 project
2. Copy content one page at a time
3. Convert HTML to Markdown as you go
4. Test each page before moving on

### Reuse Layouts

If your v2 layouts are simple, you might reuse them with minimal changes:

1. Rename `.html` to `.njk`
2. Update `extends` paths
3. Replace Bootstrap classes with Tailwind

### HTML in Markdown

v3 supports HTML in Markdown files:

```markdown
---
title: My Page
---

# Regular Markdown

<div class="custom-component">
  Custom HTML is fine too!
</div>
```

## 🐛 Troubleshooting

### Build Errors

**Error: Cannot find module**

Make sure you're using ESM syntax:
```javascript
// ✅ Correct
import { SimpleEngine } from 'simple-engine';

// ❌ Wrong
const SimpleEngine = require('simple-engine');
```

**Error: Layout not found**

Check your layout file extension (`.njk` not `.html`).

### Style Issues

**Tailwind not working**

Ensure `tailwind.config.js` includes all content paths:
```javascript
export default {
  content: [
    './content/**/*.md',
    './layouts/**/*.njk',
  ],
};
```

## 📚 Resources

- [v3.0 Documentation](../README.md)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)

## 🆘 Need Help?

- [GitHub Issues](https://github.com/Huelio/Simple-Engine/issues)
- [Discussions](https://github.com/Huelio/Simple-Engine/discussions)

---

Happy migrating! 🚀




