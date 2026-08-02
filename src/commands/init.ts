import path from 'node:path';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { fileUtils } from '../utils/file.js';
import { logger } from '../utils/logger.js';

interface InitOptions {
  template?: string;
}

interface InitAnswers {
  projectName: string;
  siteTitle: string;
  siteUrl: string;
  description: string;
  author: string;
}

const escapeJsString = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

export const initCommand = async (directory: string, options: InitOptions) => {
  logger.title('Initialize Simple Engine Project');

  const targetDir = path.resolve(process.cwd(), directory);
  const projectName = path.basename(targetDir);

  if (await fileUtils.exists(path.join(targetDir, 'simple.config.js'))) {
    logger.error('Directory already contains a Simple Engine project!');
    process.exit(1);
  }

  const answers: InitAnswers = {
    projectName: await input({
      message: 'Project name:',
      default: projectName,
    }),
    siteTitle: await input({
      message: 'Site title:',
      default: 'My Simple Site',
    }),
    siteUrl: await input({
      message: 'Site URL:',
      default: 'https://example.com',
    }),
    description: await input({
      message: 'Site description:',
      default: 'A simple static site built with Simple Engine',
    }),
    author: await input({
      message: 'Author name:',
      default: '',
    }),
  };

  const spinner = logger.spinner('Creating project structure...');

  try {
    await fileUtils.ensureDir(targetDir);

    const templateDir = path.join(
      fileUtils.getTemplatesDir(),
      options.template || 'default'
    );

    if (await fileUtils.exists(path.join(templateDir, 'layouts'))) {
      await fileUtils.copyDir(templateDir, targetDir);
      await personalizeContent(targetDir, answers);
    } else {
      await createDefaultTemplate(targetDir, answers);
    }

    await writeProjectFiles(targetDir, answers);

    spinner.succeed('Project created successfully!');

    logger.break();
    logger.success(chalk.bold('Your Simple Engine project is ready!'));
    logger.break();
    logger.info('Next steps:');
    console.log(chalk.cyan('  1.'), `cd ${directory !== '.' ? directory : 'your project'}`);
    console.log(chalk.cyan('  2.'), 'npm install');
    console.log(chalk.cyan('  3.'), 'npm run dev');
    logger.break();
  } catch (error) {
    spinner.fail('Failed to create project');
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

const writeProjectFiles = async (
  targetDir: string,
  answers: InitAnswers
): Promise<void> => {
  const configContent = `export default {
  site: {
    title: '${escapeJsString(answers.siteTitle)}',
    url: '${escapeJsString(answers.siteUrl)}',
    description: '${escapeJsString(answers.description)}',
    author: '${escapeJsString(answers.author)}',
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
    rawMarkdown: true,
    jsonLd: true,
    aiCrawlers: {
      allow: true,
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
`;
  await fileUtils.writeFile(path.join(targetDir, 'simple.config.js'), configContent);

  const packageJson = {
    name: answers.projectName,
    version: '1.0.0',
    description: answers.description,
    type: 'module',
    scripts: {
      dev: 'simple dev',
      build: 'simple build',
      'dev:drafts': 'simple dev --drafts',
    },
    devDependencies: {
      'simple-engine': '^2.0.0',
      tailwindcss: '^4.0.0',
      '@tailwindcss/vite': '^4.0.0',
      '@tailwindcss/typography': '^0.5.16',
    },
  };
  await fileUtils.writeJson(path.join(targetDir, 'package.json'), packageJson);

  const gitignore = `node_modules/
dist/
.DS_Store
*.log
.env
.cache/
`;
  await fileUtils.writeFile(path.join(targetDir, '.gitignore'), gitignore);
};

const personalizeContent = async (
  targetDir: string,
  answers: InitAnswers
): Promise<void> => {
  const indexPath = path.join(targetDir, 'content', 'index.md');
  if (await fileUtils.exists(indexPath)) {
    let content = await fileUtils.readFile(indexPath);
    content = content.replace(/\{\{siteTitle\}\}/g, answers.siteTitle);
    await fileUtils.writeFile(indexPath, content);
  }
};

export async function createDefaultTemplate(
  targetDir: string,
  answers: InitAnswers
): Promise<void> {
  const templateDir = fileUtils.getTemplatesDir();
  const defaultTemplate = path.join(templateDir, 'default');

  if (await fileUtils.exists(path.join(defaultTemplate, 'layouts'))) {
    await fileUtils.copyDir(defaultTemplate, targetDir);
    await personalizeContent(targetDir, answers);
    return;
  }

  // Fallback inline scaffolding if templates are missing
  await fileUtils.ensureDir(path.join(targetDir, 'content', 'blog'));
  await fileUtils.ensureDir(path.join(targetDir, 'layouts', 'partials'));
  await fileUtils.ensureDir(path.join(targetDir, 'styles'));
  await fileUtils.ensureDir(path.join(targetDir, 'public'));

  await fileUtils.writeFile(
    path.join(targetDir, 'content', 'index.md'),
    `---
title: Welcome
layout: default
description: Welcome to ${answers.siteTitle}
---

# Welcome to ${answers.siteTitle}

This is your new Simple Engine site. Edit \`content/index.md\` or create new pages.
`
  );
}
