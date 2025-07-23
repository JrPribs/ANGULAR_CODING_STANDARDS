# ESLint Configuration Guide for Angular Standards

This guide shows how to set up and use ESLint to enforce the Angular coding standards in your projects.

## 📦 Installation

### 1. Install Dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  @angular-eslint/eslint-plugin \
  @angular-eslint/eslint-plugin-template \
  @angular-eslint/template-parser \
  eslint-plugin-import \
  eslint-plugin-lodash

# Install the custom Angular standards plugin
npm install --save-dev ./eslint-plugin-angular-standards
```

### 2. Copy Configuration

Copy the `.eslintrc.json` file from this repository to your Angular project root.

## 🎯 Configuration Levels

### Strict Mode (Recommended)
Uses all rules as errors. Best for new projects or teams committed to the standards.

```json
{
  "extends": [
    "./node_modules/angular-coding-standards/.eslintrc.json",
    "plugin:angular-standards/strict"
  ]
}
```

### Warning Mode
Uses rules as warnings. Good for gradual migration.

```json
{
  "extends": [
    "./node_modules/angular-coding-standards/.eslintrc.json",
    "plugin:angular-standards/warnings"
  ]
}
```

### Custom Configuration
Pick and choose which rules to enforce:

```json
{
  "extends": ["./node_modules/angular-coding-standards/.eslintrc.json"],
  "rules": {
    "angular-standards/enforce-injectable-provided-in-root": "error",
    "angular-standards/use-inject-function": "warn",
    "angular-standards/enforce-standalone-components": "error",
    "angular-standards/no-promise-in-observable": "error",
    "angular-standards/enforce-feature-isolation": ["error", {
      "featureRoot": "src/app",
      "sharedPaths": ["shared", "core", "common"]
    }]
  }
}
```

## 🔧 IDE Integration

### VS Code
1. Install the ESLint extension
2. Add to `.vscode/settings.json`:
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

### WebStorm/IntelliJ
1. Go to Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

## 🚀 Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.html",
    "lint:fix": "eslint . --ext .ts,.html --fix",
    "lint:staged": "eslint --ext .ts,.html --fix",
    "lint:ci": "eslint . --ext .ts,.html --max-warnings 0"
  }
}
```

## 🪝 Git Hooks

### Using Husky and lint-staged

1. Install dependencies:
```bash
npm install --save-dev husky lint-staged
```

2. Add to `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,html}": ["eslint --fix", "git add"]
  }
}
```

### Using simple-git-hooks

1. Install:
```bash
npm install --save-dev simple-git-hooks
```

2. Add to `package.json`:
```json
{
  "simple-git-hooks": {
    "pre-commit": "npm run lint:staged"
  }
}
```

## 📊 CI/CD Integration

### GitHub Actions

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
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint:ci
```

### GitLab CI

```yaml
lint:
  stage: test
  script:
    - npm ci
    - npm run lint:ci
  only:
    - merge_requests
    - main
```

## 🔍 Rule-Specific Examples

### CS-V01: Injectable ProvidedIn Root

```typescript
// ❌ Wrong
@Injectable()
export class UserService {}

// ✅ Correct (auto-fixed)
@Injectable({ providedIn: 'root' })
export class UserService {}
```

### CS-V02: Use Inject Function

```typescript
// ❌ Wrong
export class UserComponent {
  constructor(private userService: UserService) {}
}

// ✅ Correct
export class UserComponent {
  private userService = inject(UserService);
}
```

### CS-C01: Standalone Components

```typescript
// ❌ Wrong
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {}

// ✅ Correct (auto-fixed)
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html'
})
export class UserComponent {}
```

### CS-A03: No Promise in Observable

```typescript
// ❌ Wrong
getUser(id: string): Observable<User> {
  return from(this.fetchUser(id));
}

// ✅ Correct
async getUser(id: string): Promise<User> {
  return await this.fetchUser(id);
}
```

### CS-F01/F02: Feature Isolation

```typescript
// ❌ Wrong - Cross-feature import
// In src/app/users/services/user.service.ts
import { Product } from '../../products/models/product.model';

// ✅ Correct - Feature isolation
// In src/app/users/services/user.service.ts
import { User } from '../models/user.model';
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Cannot find module 'eslint-plugin-angular-standards'"**
   - Ensure you've installed the plugin from the local path
   - Check your `node_modules` directory

2. **"Parsing error: Cannot read file 'tsconfig.json'"**
   - Ensure `tsconfig.json` exists in your project root
   - Update the `parserOptions.project` path in `.eslintrc.json`

3. **Performance issues**
   - Add an `.eslintignore` file to exclude `node_modules`, `dist`, etc.
   - Use `--cache` flag: `eslint . --cache`

### Gradual Adoption

1. Start with warnings: `"angular-standards/rule-name": "warn"`
2. Fix one rule at a time
3. Use `--max-warnings` to prevent new violations
4. Gradually convert warnings to errors

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint)
- [Angular Coding Standards](./angular_coding_standards.md)
- [Non-Enforceable Standards](./non-enforceable-standards.md)