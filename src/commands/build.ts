import path from 'node:path';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';
import { SimpleEngine } from '../core/engine.js';
import { buildStyles } from '../utils/vite.js';

interface BuildOptions {
  output?: string;
}

export const buildCommand = async (options: BuildOptions) => {
  logger.title('Building site for production');

  const projectDir = process.cwd();
  const spinner = logger.spinner('Building...');

  try {
    const engine = new SimpleEngine(projectDir);
    await engine.loadConfig();
    const config = engine.getConfig();

    if (options.output) {
      engine.setOutputOverride(options.output);
    }

    const outputDir = engine.getOutputDir();

    spinner.text = 'Cleaning output...';
    await engine.cleanOutput();

    spinner.text = 'Building pages...';
    const pages = await engine.build({ includeDrafts: false });

    spinner.text = 'Building styles...';
    const builtStyles = await buildStyles(
      projectDir,
      outputDir,
      config.paths.styles || './styles'
    );

    spinner.succeed('Build completed successfully!');

    logger.break();
    logger.info(`Pages built: ${chalk.cyan(String(pages.length))}`);
    if (builtStyles) {
      logger.info(`Styles: ${chalk.cyan(path.join(outputDir, 'styles', 'main.css'))}`);
    }
    logger.info(`Output directory: ${chalk.cyan(outputDir)}`);
    logger.info('Ready to deploy!');
    logger.break();
  } catch (error) {
    spinner.fail('Build failed');
    logger.error(error instanceof Error ? error.message : String(error));
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
};
