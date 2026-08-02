import path from 'node:path';
import chalk from 'chalk';
import { fileUtils } from '../utils/file.js';
import { logger } from '../utils/logger.js';
import { configUtils } from '../utils/config.js';

interface NewOptions {
  date?: string;
}

export const newCommand = async (
  type: string,
  title: string,
  options: NewOptions
) => {
  const projectDir = process.cwd();

  try {
    const config = await configUtils.loadConfig(projectDir);
    const contentDir = path.join(projectDir, config.paths.content);

    let filePath: string;
    let layout: string;
    const slug = fileUtils.slugify(title);
    const date = options.date || new Date().toISOString();

    switch (type.toLowerCase()) {
      case 'post':
        filePath = path.join(contentDir, 'blog', `${slug}.md`);
        layout = 'post';
        break;
      case 'page':
        filePath = path.join(contentDir, `${slug}.md`);
        layout = 'default';
        break;
      default:
        logger.error(`Unknown type: ${type}. Use 'post' or 'page'.`);
        process.exit(1);
    }

    if (await fileUtils.exists(filePath)) {
      logger.error(`File already exists: ${filePath}`);
      process.exit(1);
    }

    const content = `---
title: ${JSON.stringify(title).slice(1, -1)}
layout: ${layout}
date: ${date}
description: ""
draft: false
---

# ${title}

Start writing your content here...
`;

    await fileUtils.writeFile(filePath, content);

    logger.success(
      `Created new ${type}: ${chalk.cyan(path.relative(projectDir, filePath))}`
    );
    logger.break();
    logger.info('Next steps:');
    console.log(chalk.cyan('  1.'), 'Edit the file to add your content');
    console.log(chalk.cyan('  2.'), 'Run npm run dev to see your changes');
    logger.break();
  } catch (error) {
    logger.error('Failed to create new content');
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};
