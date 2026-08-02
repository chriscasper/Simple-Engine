import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileUtils = {
  async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  },

  async copyDir(src: string, dest: string): Promise<void> {
    await fs.cp(src, dest, { recursive: true });
  },

  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  },

  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  },

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },

  existsSync(filePath: string): boolean {
    return existsSync(filePath);
  },

  async remove(filePath: string): Promise<void> {
    await fs.rm(filePath, { recursive: true, force: true });
  },

  getTemplatesDir(): string {
    // When bundled by tsup, this file lives in dist/ so templates is one level up.
    // When running from source via tsx, it lives in src/utils so templates is two levels up.
    const fromDist = path.join(__dirname, '../templates');
    const fromSrc = path.join(__dirname, '../../templates');

    if (existsSync(fromDist)) {
      return fromDist;
    }
    if (existsSync(fromSrc)) {
      return fromSrc;
    }
    return fromDist;
  },

  async readJson<T = unknown>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  },

  async writeJson(filePath: string, data: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  },

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
