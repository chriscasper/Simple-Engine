import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  treeshake: true,
  external: [
    'vite',
    'tailwindcss',
    '@tailwindcss/vite',
    'shiki',
    '@shikijs/markdown-it',
    'sharp',
    'png-to-ico',
  ],
});
