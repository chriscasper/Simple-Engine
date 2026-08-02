# Publishing Simple Engine to npm

This guide walks you through publishing Simple Engine to npm so users can install it globally or use via npx.

## 📋 Pre-Publishing Checklist

### 1. Create npm Account

If you don't have one:
1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign up for a free account
3. Verify your email

### 2. Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

Verify you're logged in:
```bash
npm whoami
```

### 3. Check Package Name Availability

```bash
npm view simple-engine
```

If the name is taken, you have options:
- Use a scoped package: `@yourusername/simple-engine`
- Choose a different name: `simple-engine-ssg`, `simple-site-engine`, etc.

**Update package.json if needed:**
```json
{
  "name": "@yourusername/simple-engine",
  // or
  "name": "simple-site-engine"
}
```

## ✅ Pre-Publish Verification

### 1. Run All Checks

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Test (if you have tests)
npm test
```

### 2. Test Locally Before Publishing

**Important:** Always test locally first!

```bash
# Build the package
npm run build

# Create a local link
npm link

# Test the CLI
simple --version
simple --help

# Test in a new directory
cd /tmp
simple init test-project
cd test-project
npm install
npm run dev
```

If everything works, unlink:
```bash
npm unlink -g simple-engine
```

### 3. Review Files That Will Be Published

```bash
npm pack --dry-run
```

This shows what will be included. Make sure:
- ✅ `dist/` is included
- ✅ `bin/` is included  
- ✅ `templates/` is included
- ✅ `package.json` is included
- ❌ `src/` is NOT included (users don't need source)
- ❌ `node_modules/` is NOT included
- ❌ Test files are NOT included

Your `.npmignore` already handles this!

## 🚀 Publishing

### First Time Publish

```bash
# Make sure everything is committed
git add .
git commit -m "chore: prepare for v3.0.0 release"
git push origin main

# Build
npm run build

# Publish to npm
npm publish
```

**For scoped packages** (free accounts need `--access public`):
```bash
npm publish --access public
```

### Publish Checklist

Before running `npm publish`:
- [ ] All code committed to git
- [ ] Version number updated in `package.json`
- [ ] `CHANGELOG.md` updated
- [ ] `npm run build` completes successfully
- [ ] All tests pass
- [ ] Tested locally with `npm link`
- [ ] README is up to date

## 🏷️ Version Management

### Semantic Versioning

Simple Engine uses [semver](https://semver.org/):
- **Major** (3.0.0): Breaking changes
- **Minor** (3.1.0): New features, backward compatible
- **Patch** (3.0.1): Bug fixes

### Updating Version

Use npm version commands:

```bash
# Patch release (3.0.0 → 3.0.1)
npm version patch

# Minor release (3.0.0 → 3.1.0)
npm version minor

# Major release (3.0.0 → 4.0.0)
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit
- Creates a git tag

Then push and publish:
```bash
git push origin main --tags
npm publish
```

## 📦 After Publishing

### Verify Publication

```bash
# Check on npm
npm view simple-engine

# Check in browser
# https://www.npmjs.com/package/simple-engine
```

### Test Installation

Test that users can install it:

```bash
# Global install
npm install -g simple-engine

# Test it works
simple --version
simple init test-site

# Or test with npx (recommended way)
npx simple-engine init my-site
```

## 🔄 Publishing Updates

### For Bug Fixes (Patch)

```bash
# 1. Fix the bug
# 2. Update CHANGELOG.md
# 3. Commit changes
git add .
git commit -m "fix: resolve issue with X"

# 4. Bump version
npm version patch

# 5. Build and publish
npm run build
git push origin main --tags
npm publish
```

### For New Features (Minor)

```bash
# 1. Add feature
# 2. Update CHANGELOG.md and README.md
# 3. Commit changes
git add .
git commit -m "feat: add new feature X"

# 4. Bump version
npm version minor

# 5. Build and publish
npm run build
git push origin main --tags
npm publish
```

### For Breaking Changes (Major)

```bash
# 1. Make breaking changes
# 2. Update MIGRATION.md
# 3. Update CHANGELOG.md with breaking changes section
# 4. Commit changes
git add .
git commit -m "feat!: breaking change description"

# 5. Bump version
npm version major

# 6. Build and publish
npm run build
git push origin main --tags
npm publish
```

## 🏷️ GitHub Releases

Create a release on GitHub to match your npm version:

1. Go to your repo on GitHub
2. Click "Releases" → "Create a new release"
3. Tag: `v3.0.0`
4. Title: `v3.0.0 - Complete Rewrite`
5. Description: Copy from CHANGELOG.md
6. Publish release

## 🤖 Automated Publishing (Optional)

### Using GitHub Actions

We've included `.github/workflows/ci.yml` that:
- Runs tests on push
- Auto-publishes when you create a git tag

**To use it:**

1. Add npm token to GitHub secrets:
   - Go to npmjs.com → Access Tokens → Generate New Token (Automation)
   - Copy the token
   - Go to GitHub repo → Settings → Secrets → New repository secret
   - Name: `NPM_TOKEN`
   - Value: paste token

2. Create and push a version tag:
   ```bash
   npm version patch
   git push origin main --tags
   ```

GitHub Actions will automatically publish to npm!

## 📊 Package Stats

After publishing, you can:
- View download stats: `npm view simple-engine`
- See on npm: https://www.npmjs.com/package/simple-engine
- Track downloads: https://npm-stat.com/
- Badge for README: https://badge.fury.io/

## 🐛 Unpublishing (Emergency Only)

**Warning:** Unpublishing is heavily discouraged and has restrictions.

```bash
# Unpublish specific version (within 72 hours)
npm unpublish simple-engine@3.0.0

# Deprecate instead (better option)
npm deprecate simple-engine@3.0.0 "Version 3.0.0 has a critical bug, upgrade to 3.0.1"
```

**Better approach:** Publish a patch version fixing the issue.

## 📱 Installation Methods for Users

Once published, users can install in multiple ways:

### 1. Global Installation (Traditional)
```bash
npm install -g simple-engine
# or
yarn global add simple-engine

# Then use
simple init my-site
```

### 2. npx (Recommended - No Installation)
```bash
npx simple-engine init my-site
```

### 3. Project Dependency
```bash
npm install --save-dev simple-engine
# or  
yarn add -D simple-engine

# Use in package.json scripts
```

### 4. Specific Version
```bash
npm install -g simple-engine@3.0.0
npx simple-engine@latest init my-site
```

## 🎯 Best Practices

### 1. Test Before Publishing
Always test with `npm link` first!

### 2. Use Semantic Versioning
Follow semver strictly so users know what to expect.

### 3. Keep CHANGELOG Updated
Users appreciate knowing what changed.

### 4. Tag Releases
Git tags help track versions.

### 5. Document Breaking Changes
Always provide migration guides for major versions.

### 6. Never Delete Published Versions
It breaks user installations. Deprecate instead.

### 7. Use .npmignore
Only include what users need.

## 🚦 Quick Start Command Reference

```bash
# Initial setup
npm login

# Check name availability
npm view simple-engine

# Test locally
npm run build
npm link
simple init test

# Publish
npm run build
npm publish

# Update version
npm version patch/minor/major
git push origin main --tags
npm publish

# Verify
npm view simple-engine
npx simple-engine --version
```

## 📞 Support & Maintenance

### Monitor Issues
Watch for bug reports and feature requests on GitHub.

### Respond to Users
Help users who have questions or problems.

### Keep Dependencies Updated
```bash
npm outdated
npm update
```

### Security Updates
```bash
npm audit
npm audit fix
```

## 🎉 You're Ready!

Your package is set up for publishing. When ready:

```bash
npm run build
npm publish
```

Then share with the world! 🚀

---

## Troubleshooting

### "You do not have permission to publish"
- Check you're logged in: `npm whoami`
- Check package name isn't taken
- Use scoped package: `@username/simple-engine`

### "No README data"
- Make sure README.md exists
- Rebuild: `npm run build`

### "Package name too similar to existing package"
- Choose a different name
- Use a scoped package

### Files Missing After Install
- Check `.npmignore` isn't excluding needed files
- Test with `npm pack --dry-run`

---

**Need help?** Open an issue on GitHub or check the [npm documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).




