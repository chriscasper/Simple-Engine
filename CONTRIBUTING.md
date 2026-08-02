# Contributing to Simple Engine

Thank you for your interest in contributing to Simple Engine! 🎉

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Git

### Setup Development Environment

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Simple-Engine.git
cd Simple-Engine
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Link for local testing:

```bash
npm link
```

Now you can use the `simple` command locally to test your changes.

## Project Structure

```
Simple-Engine/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── index.ts            # Package exports
│   ├── commands/           # init, dev, build, new
│   ├── core/               # engine, markdown, template, seo
│   ├── utils/              # file, config, logger, vite
│   └── types/
├── templates/default/      # Starter site scaffold
├── tests/                  # Vitest suite
├── bin/cli.js              # Executable shim
├── scripts/publish-check.sh
└── dist/                   # Built output (generated)
```

## Development Workflow

### Checks

```bash
npm run check   # typecheck + lint + test
npm test
npm run typecheck
npm run lint
npm run build
```

### Testing Local Changes

1. Build: `npm run build`
2. Link: `npm link`
3. Scaffold a throwaway site:

```bash
cd /tmp
simple init test-site
cd test-site
npm install
npm run dev
```

## 🐛 Reporting Bugs

Before creating an issue:

1. Check if the issue already exists
2. Use the latest version
3. Provide a minimal reproduction

**Good bug report includes:**

- Simple Engine version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Code samples or error messages

## ✨ Suggesting Features

We love feature suggestions! Please:

1. Check if it's already suggested
2. Explain the use case
3. Provide examples
4. Consider backward compatibility

## 🔧 Pull Requests

### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Types check (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG.md updated

### PR Guidelines

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**:
   - Write clear, concise code
   - Follow existing code style
   - Add comments for complex logic
   - Update types as needed

3. **Write tests** (when applicable):
   ```typescript
   // src/__tests__/example.test.ts
   import { describe, it, expect } from 'vitest';
   
   describe('MyFeature', () => {
     it('should work', () => {
       expect(true).toBe(true);
     });
   });
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push and create PR**:
   ```bash
   git push origin feature/my-new-feature
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Checklist
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Prefer `interface` over `type` for objects
- Export types separately from values
- Use explicit return types for public APIs

```typescript
// ✅ Good
export interface Config {
  title: string;
}

export const loadConfig = async (path: string): Promise<Config> => {
  // implementation
};

// ❌ Avoid
export const loadConfig = async (path: string) => {
  // implementation
};
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Error Handling

```typescript
// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed');
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

// ❌ Avoid
try {
  await riskyOperation();
} catch (e) {
  console.log(e);
}
```

## 🧪 Testing

### Test Structure

```typescript
describe('Feature', () => {
  it('should handle normal case', () => {
    // test
  });

  it('should handle edge case', () => {
    // test
  });

  it('should throw on invalid input', () => {
    // test
  });
});
```

### What to Test

- ✅ Public APIs
- ✅ Edge cases
- ✅ Error conditions
- ❌ Private functions (test via public API)
- ❌ External dependencies (mock them)

## 📚 Documentation

### Code Comments

```typescript
/**
 * Processes markdown content and returns HTML.
 * 
 * @param content - Raw markdown string
 * @param options - Processing options
 * @returns Processed HTML string
 */
export const processMarkdown = (
  content: string,
  options?: MarkdownOptions
): string => {
  // implementation
};
```

### README Updates

Update README.md if you:
- Add a new feature
- Change existing behavior
- Add new configuration options

### CHANGELOG

Add entry to CHANGELOG.md:

```markdown
## [Unreleased]

### Added
- New feature X

### Fixed
- Bug Y

### Changed
- Behavior Z
```

## 🤝 Community

### Code of Conduct

Be respectful, inclusive, and professional.

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions

## 🎯 Areas for Contribution

Looking to help? Here are some areas:

### Good First Issues

- Documentation improvements
- Example projects
- Bug fixes
- Test coverage

### Advanced Contributions

- New CLI commands
- Plugin system
- Performance optimizations
- New template engines

### Documentation

- Tutorials
- Video guides
- Blog posts
- Example sites

## 📋 Checklist for Major Features

- [ ] Design document or RFC
- [ ] Community feedback
- [ ] Implementation
- [ ] Tests (>80% coverage)
- [ ] Documentation
- [ ] Examples
- [ ] Migration guide (if breaking)

## ❓ Questions?

- Check [Documentation](README.md)
- Search [Issues](https://github.com/chriscasper/Simple-Engine/issues)
- Ask in [Discussions](https://github.com/chriscasper/Simple-Engine/discussions)

## 🙏 Thank You!

Every contribution helps make Simple Engine better for everyone.

Happy coding! 🚀

---

Built with ❤️ by the Simple Engine community




