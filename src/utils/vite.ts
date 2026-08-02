import path from 'node:path';
import { build as viteBuild, type InlineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileUtils } from '../utils/file.js';

export const getViteConfig = (
  projectDir: string,
  outputDir: string,
  stylesEntry?: string
): InlineConfig => {
  const plugins = [tailwindcss()];

  return {
    root: projectDir,
    publicDir: false,
    plugins,
    server: {
      fs: {
        allow: [projectDir, outputDir],
      },
    },
    build: {
      outDir: path.join(outputDir, 'styles'),
      emptyOutDir: false,
      cssMinify: true,
      rollupOptions: stylesEntry
        ? {
            input: stylesEntry,
            output: {
              assetFileNames: 'main.css',
            },
          }
        : undefined,
    },
  };
};

export const buildStyles = async (
  projectDir: string,
  outputDir: string,
  stylesPath = './styles'
): Promise<boolean> => {
  const mainCssPath = path.join(projectDir, stylesPath, 'main.css');

  if (!(await fileUtils.exists(mainCssPath))) {
    return false;
  }

  await viteBuild(getViteConfig(projectDir, outputDir, mainCssPath));
  return true;
};
