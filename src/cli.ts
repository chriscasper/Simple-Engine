#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { newCommand } from './commands/new.js';

const program = new Command();

program
  .name('simple')
  .description('A seriously simple static site generator')
  .version('2.0.0');

program
  .command('init')
  .description('Initialize a new Simple Engine project')
  .argument('[directory]', 'Project directory', '.')
  .option('-t, --template <name>', 'Template to use', 'default')
  .action(initCommand);

program
  .command('dev')
  .description('Start development server with hot reload')
  .option('-p, --port <port>', 'Port to run server on')
  .option('-o, --open', 'Open browser automatically')
  .option('--drafts', 'Include draft pages in the preview')
  .action(devCommand);

program
  .command('build')
  .description('Build site for production')
  .option('-o, --output <dir>', 'Output directory')
  .action(buildCommand);

program
  .command('new')
  .description('Create a new page or post')
  .argument('<type>', 'Type of content (page, post)')
  .argument('<title>', 'Title of the content')
  .option('-d, --date <date>', 'Custom date (ISO format)')
  .action(newCommand);

program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log(chalk.yellow('See --help for a list of available commands.'));
  process.exit(1);
});

program.parse();
