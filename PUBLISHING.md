# Publishing Simple Engine to npm

`simple-engine` is live on npm: **https://www.npmjs.com/package/simple-engine**

This guide is for maintainers publishing updates (patches, minors, majors).

## Prerequisites

```bash
npm login
npm whoami
```

Confirm the package:

```bash
npm view simple-engine version
```

## Pre-publish checks

```bash
./scripts/publish-check.sh
# or
npm run check
npm pack --dry-run
```

Optional local smoke test:

```bash
npm run build
npm link
simple --version
npm unlink -g simple-engine
```

## Publish a new version

1. Update `CHANGELOG.md`
2. Bump the version (creates a commit + tag):

```bash
npm version patch   # 2.0.0 → 2.0.1
npm version minor   # 2.0.0 → 2.1.0
npm version major   # 2.0.0 → 3.0.0
```

3. Push and publish:

```bash
git push origin main --follow-tags
npm publish
```

`prepublishOnly` runs `npm run build` automatically.

If GitHub Actions has `NPM_TOKEN` configured, pushing a `v*` tag can also publish via CI (see `.github/workflows/ci.yml`).

## Verify

```bash
npm view simple-engine version
npx simple-engine@latest --version
```

Package page: https://www.npmjs.com/package/simple-engine

## How users install

```bash
# Recommended
npx simple-engine@latest init my-site

# Global
npm install -g simple-engine

# Project dependency
npm install simple-engine --save-dev

# Specific major
npm install simple-engine@2 --save-dev
npx simple-engine@2 init my-site
```

## Emergency: deprecate (prefer over unpublish)

```bash
npm deprecate simple-engine@2.0.0 "Critical bug — upgrade to 2.0.1"
```

Then publish a fixed patch version.
