import path from 'node:path';
import { createServer, type ViteDevServer } from 'vite';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';
import { SimpleEngine } from '../core/engine.js';
import { buildStyles, getViteConfig } from '../utils/vite.js';
import { fileUtils } from '../utils/file.js';

interface DevOptions {
  port?: string;
  open?: boolean;
  drafts?: boolean;
}

export const devCommand = async (options: DevOptions) => {
  logger.title('Starting development server');

  const projectDir = process.cwd();

  try {
    const engine = new SimpleEngine(projectDir);
    await engine.loadConfig();
    const config = engine.getConfig();

    const includeDrafts = Boolean(options.drafts);
    engine.setIncludeDrafts(includeDrafts);

    const port = parseInt(
      options.port || String(config.dev?.port || 3000),
      10
    );
    const open = options.open ?? config.dev?.open ?? false;
    const outputDir = engine.getOutputDir();
    const stylesDir = path.join(projectDir, config.paths.styles || './styles');
    const mainCssPath = path.join(stylesDir, 'main.css');

    logger.info('Building site...');
    await engine.cleanOutput();
    await engine.build({ includeDrafts });
    await buildStyles(projectDir, outputDir, config.paths.styles || './styles');
    logger.success('Initial build complete');
    if (includeDrafts) {
      logger.info('Including draft pages');
    }
    logger.break();

    const viteConfig = getViteConfig(projectDir, outputDir);
    const server: ViteDevServer = await createServer({
      ...viteConfig,
      root: outputDir,
      plugins: [
        ...(viteConfig.plugins || []),
        {
          name: 'simple-engine-css',
          configureServer(devServer) {
            devServer.middlewares.use(async (req, res, next) => {
              if (req.url === '/styles/main.css' || req.url?.startsWith('/styles/main.css?')) {
                if (await fileUtils.exists(mainCssPath)) {
                  // Let Vite transform CSS from the project styles entry
                  try {
                    const result = await devServer.transformRequest(
                      `/@fs${mainCssPath}`
                    );
                    if (result) {
                      res.setHeader('Content-Type', 'text/css');
                      res.end(result.code);
                      return;
                    }
                  } catch {
                    // fall through to static file
                  }
                }
              }
              next();
            });
          },
        },
      ],
      server: {
        port,
        open,
        watch: {
          ignored: [outputDir],
        },
      },
    });

    await server.listen();

    logger.success(`Server running at ${chalk.cyan(`http://localhost:${port}`)}`);
    logger.info('Watching for changes...');
    logger.break();

    const contentDir = path.join(projectDir, config.paths.content);
    const layoutsDir = path.join(projectDir, config.paths.layouts);
    const configFile = path.join(projectDir, 'simple.config.js');
    const staticDir = path.join(projectDir, config.paths.static || 'public');

    const watcher = chokidar.watch(
      [contentDir, layoutsDir, configFile, stylesDir, staticDir],
      {
        ignored: /(^|[\\/])\../,
        persistent: true,
        ignoreInitial: true,
      }
    );

    let rebuilding = false;

    const rebuild = async (filePath: string) => {
      if (rebuilding) return;
      rebuilding = true;

      try {
        logger.info(`${chalk.yellow('change')} ${path.relative(projectDir, filePath)}`);

        if (filePath === configFile) {
          await engine.loadConfig();
          engine.setIncludeDrafts(includeDrafts);
          logger.info('Config reloaded');
        }

        // Rebuild pages in place without wiping styles
        await engine.build({ includeDrafts });

        // Rebuild styles if CSS changed or always keep styles fresh
        if (
          filePath.startsWith(stylesDir) ||
          filePath === configFile
        ) {
          await buildStyles(
            projectDir,
            outputDir,
            engine.getConfig().paths.styles || './styles'
          );
        }

        logger.success('Rebuilt');
        server.ws.send({ type: 'full-reload' });
      } catch (error) {
        logger.error('Build error:');
        console.error(error instanceof Error ? error.message : String(error));
      } finally {
        rebuilding = false;
      }
    };

    watcher.on('all', async (_event, filePath) => {
      await rebuild(filePath);
    });

    const cleanup = async () => {
      await watcher.close();
      await server.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (error) {
    logger.error('Failed to start dev server');
    logger.error(error instanceof Error ? error.message : String(error));
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
};
