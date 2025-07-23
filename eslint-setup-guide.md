# ESLint Setup Guide for Angular Coding Standards

This guide explains how to integrate and use the ESLint configuration that enforces the Angular coding standards in your project.

## Quick Start

### 1. Install Dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  @angular-eslint/eslint-plugin \
  @angular-eslint/eslint-plugin-template \
  @angular-eslint/template-parser \
  eslint-plugin-import
```

### 2. Install the Custom Plugin

#### Option A: Local Development (Recommended for testing)
```bash
# From your Angular project root
npm install --save-dev ../path-to/ANGULAR_CODING_STANDARDS/eslint-plugin-angular-standards
```

#### Option B: Published Package
```bash
# Once published to npm
npm install --save-dev eslint-plugin-angular-standards
```

### 3. Configure ESLint

Create or update `.eslintrc.json` in your project root:

```json
{
  "extends": "./node_modules/@angular-standards/eslint-config/.eslintrc.angular-standards.json"
}
```

Or copy the configuration directly:

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "plugins": ["angular-standards"],
      "rules": {
        // Existing Angular ESLint rules
        "@angular-eslint/prefer-standalone-component": "error",
        "@angular-eslint/prefer-on-push-component-change-detection": "error",
        "@angular-eslint/use-injectable-provided-in": "error",
        
        // Custom Angular Standards rules
        "angular-standards/enforce-signal-inputs": "error",
        "angular-standards/enforce-inject-function": "error",
        "angular-standards/no-component-data-fetch": "error",
        
        // Additional configuration...
      }
    }
  ]
}
```

## Available Rules

### Custom Plugin Rules

| Rule | Description | Standard |
|------|-------------|----------|
| `angular-standards/enforce-signal-inputs` | Enforces use of `input()` and `input.required()` instead of `@Input()` | CS-C02 |
| `angular-standards/enforce-inject-function` | Enforces use of `inject()` function instead of constructor injection | CS-V02 |
| `angular-standards/no-component-data-fetch` | Prevents data fetching in components, enforcing resolver pattern | CS-R03 |

### Existing ESLint Rules for Standards

| Rule | Configuration | Standard |
|------|---------------|----------|
| `@angular-eslint/prefer-standalone-component` | `"error"` | CS-C01 |
| `@angular-eslint/prefer-on-push-component-change-detection` | `"error"` | CS-C05 |
| `max-lines` | `["error", { "max": 350 }]` | CS-C03 |
| `@angular-eslint/component-file-suffix` | `["error", { "suffixes": ["component.ts", "page.ts"] }]` | File naming |
| `@angular-eslint/component-selector` | `["error", { "prefix": "app", "style": "kebab-case" }]` | Selector naming |

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
```

### Pre-commit Hook (using Husky)

```bash
npm install --save-dev husky lint-staged
npx husky-init
```

Update `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Create `.lintstagedrc.json`:
```json
{
  "*.ts": ["eslint --fix", "git add"],
  "*.html": ["eslint --fix", "git add"]
}
```

## Gradual Adoption Strategy

### Phase 1: Warnings Only
Start with rules as warnings to assess impact:

```json
{
  "rules": {
    "angular-standards/enforce-signal-inputs": "warn",
    "angular-standards/enforce-inject-function": "warn",
    "angular-standards/no-component-data-fetch": "warn"
  }
}
```

### Phase 2: Errors for New Code
Use overrides to enforce standards only in new code:

```json
{
  "overrides": [
    {
      "files": ["src/app/features/new-feature/**/*.ts"],
      "rules": {
        "angular-standards/enforce-signal-inputs": "error"
      }
    }
  ]
}
```

### Phase 3: Full Enforcement
Once the codebase is migrated, enforce all rules as errors.

## Common Issues and Solutions

### Issue: "Cannot find module 'eslint-plugin-angular-standards'"
**Solution**: Ensure the plugin is properly installed and the path is correct.

### Issue: Too many linting errors in existing code
**Solution**: 
1. Use `--fix` flag to auto-fix what's possible: `npx eslint . --fix`
2. Create a `.eslintrc.migration.json` with relaxed rules for gradual adoption
3. Use `eslint-disable-next-line` comments sparingly for legitimate exceptions

### Issue: Conflicts with existing ESLint configuration
**Solution**: 
1. Review and merge configurations carefully
2. Use the `overrides` section to apply rules selectively
3. Ensure parser options are compatible

## Scripts for package.json

Add these helpful scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.html",
    "lint:fix": "eslint . --ext .ts,.html --fix",
    "lint:debug": "eslint . --ext .ts,.html --debug",
    "lint:report": "eslint . --ext .ts,.html --format html --output-file eslint-report.html"
  }
}
```

## VS Code Integration

Install the ESLint extension and add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "html"
  ]
}
```

## Custom Rule Configuration

Some rules support additional configuration:

```json
{
  "rules": {
    "max-lines": ["error", {
      "max": 350,
      "skipBlankLines": true,
      "skipComments": true
    }],
    "@angular-eslint/component-selector": ["error", {
      "type": "element",
      "prefix": ["app", "admin"],  // Multiple prefixes
      "style": "kebab-case"
    }]
  }
}
```

## Monitoring and Reporting

### Generate Reports
```bash
# HTML report
npx eslint . --format html -o eslint-report.html

# JSON report for further processing
npx eslint . --format json -o eslint-report.json
```

### Track Progress
Create a script to track linting progress:

```javascript
// scripts/lint-progress.js
const { execSync } = require('child_process');
const output = execSync('npx eslint . --format json', { encoding: 'utf-8' });
const results = JSON.parse(output);

const summary = results.reduce((acc, file) => {
  acc.errors += file.errorCount;
  acc.warnings += file.warningCount;
  return acc;
}, { errors: 0, warnings: 0 });

console.log(`Total Errors: ${summary.errors}`);
console.log(`Total Warnings: ${summary.warnings}`);
```

## Next Steps

1. Review the [non-enforceable standards](./non-enforceable-standards.md) for code review guidelines
2. Customize the configuration based on your team's needs
3. Set up automated linting in your CI/CD pipeline
4. Train your team on the Angular coding standards
5. Monitor and iterate on the rules based on team feedback

Remember: The goal is to improve code quality and consistency, not to create barriers. Adjust the rules as needed for your team's context.