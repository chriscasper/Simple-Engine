import nunjucks from 'nunjucks';
import { format, isValid } from 'date-fns';

export class TemplateEngine {
  private env: nunjucks.Environment;

  constructor(layoutsDir: string) {
    this.env = nunjucks.configure(layoutsDir, {
      autoescape: true,
      noCache: true,
      throwOnUndefined: false,
    });

    this.setupFilters();
  }

  private setupFilters(): void {
    this.env.addFilter('date', (value: string | Date, formatStr = 'MMMM d, yyyy') => {
      let date: Date;

      if (value === 'now' || value === undefined || value === null) {
        date = new Date();
      } else if (typeof value === 'string') {
        date = new Date(value);
      } else {
        date = value;
      }

      if (!isValid(date)) {
        return '';
      }

      return format(date, formatStr);
    });

    this.env.addFilter('limit', (arr: unknown[], limit: number) => {
      return Array.isArray(arr) ? arr.slice(0, limit) : arr;
    });

    this.env.addFilter('upper', (str: string) => {
      return str ? str.toUpperCase() : '';
    });

    this.env.addFilter('lower', (str: string) => {
      return str ? str.toLowerCase() : '';
    });

    this.env.addFilter('excerpt', (str: string, length = 150) => {
      if (!str || str.length <= length) return str;
      return str.substring(0, length).trim() + '...';
    });

    this.env.addFilter('absoluteUrl', (urlPath: string, siteUrl: string) => {
      if (!urlPath) return siteUrl || '';
      if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
        return urlPath;
      }
      const base = (siteUrl || '').replace(/\/$/, '');
      const pathPart = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
      return `${base}${pathPart}`;
    });

    this.env.addFilter('json', (value: unknown) => {
      return JSON.stringify(value);
    });
  }

  render(template: string, context: Record<string, unknown>): string {
    return this.env.renderString(template, context);
  }

  renderFile(templatePath: string, context: Record<string, unknown>): string {
    return this.env.render(templatePath, context);
  }

  addFilter(name: string, fn: (...args: unknown[]) => unknown): void {
    this.env.addFilter(name, fn);
  }

  addGlobal(name: string, value: unknown): void {
    this.env.addGlobal(name, value);
  }
}
