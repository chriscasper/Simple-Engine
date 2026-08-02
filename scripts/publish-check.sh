#!/bin/bash

# Pre-publish check script for Simple Engine

set -e

echo "🔍 Running pre-publish checks..."
echo ""

# Check git status
echo "📋 Checking git status..."
if [[ -n $(git status -s) ]]; then
  echo "⚠️  Warning: You have uncommitted changes"
  git status -s
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo "✅ Git working directory clean"
fi
echo ""

# Check npm login
echo "👤 Checking npm login..."
if npm whoami &> /dev/null; then
  NPM_USER=$(npm whoami)
  echo "✅ Logged in as: $NPM_USER"
else
  echo "❌ Not logged in to npm"
  echo "Run: npm login"
  exit 1
fi
echo ""

# Type check
echo "🔍 Running type check..."
npm run typecheck
echo "✅ Type check passed"
echo ""

# Lint
echo "🔍 Running linter..."
npm run lint
echo "✅ Linting passed"
echo ""

# Build
echo "🏗️  Building package..."
npm run build
echo "✅ Build successful"
echo ""

# Check files
echo "📦 Checking package contents..."
npm pack --dry-run
echo ""

# Get version
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All checks passed!"
echo ""
echo "Package: $PACKAGE_NAME"
echo "Version: $VERSION"
echo ""
echo "Ready to publish! Run:"
echo "  npm publish"
echo ""
echo "Or for scoped packages:"
echo "  npm publish --access public"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"




