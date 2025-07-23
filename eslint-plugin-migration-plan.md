# ESLint Plugin TypeScript Migration Plan

This document provides detailed instructions for migrating `eslint-plugin-angular-standards` from JavaScript to TypeScript using Angular ESLint utilities and test-driven development.

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Infrastructure Migration](#phase-1-infrastructure-migration)
3. [Phase 2: Test-Driven Development Strategy](#phase-2-test-driven-development-strategy)
4. [Phase 3: Rule Migration Details](#phase-3-rule-migration-details)
5. [Phase 4: Documentation Standards](#phase-4-documentation-standards)
6. [Phase 5: Testing Infrastructure](#phase-5-testing-infrastructure)
7. [Implementation Checklist](#implementation-checklist)
8. [Troubleshooting Guide](#troubleshooting-guide)

## Overview

The migration will transform our custom ESLint rules to:
- Use TypeScript for better type safety and IDE support
- Leverage `@angular-eslint/utils` for Angular-specific functionality
- Follow test-driven development to ensure backward compatibility
- Add auto-fix capabilities where feasible
- Improve accuracy with type checking

## Phase 1: Infrastructure Migration

### 1.1 TypeScript Configuration

Create `tsconfig.json` in the plugin root directory:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "tests", "coverage"]
}
```

### 1.2 Package Dependencies

Update `package.json`:

```json
{
  "name": "eslint-plugin-angular-standards",
  "version": "2.0.0-beta.1",
  "description": "ESLint plugin to enforce Angular coding standards",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "README.md"
  ],
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "prepublishOnly": "npm run build && npm test",
    "clean": "rm -rf lib coverage"
  },
  "dependencies": {
    "@angular-eslint/utils": "^17.0.0",
    "@typescript-eslint/utils": "^6.0.0"
  },
  "devDependencies": {
    "@angular-eslint/test-utils": "^17.0.0",
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "eslint": ">=8.0.0",
    "@angular-eslint/eslint-plugin": ">=17.0.0",
    "@typescript-eslint/eslint-plugin": ">=6.0.0"
  }
}
```

### 1.3 Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 1.4 Directory Structure

```
eslint-plugin-angular-standards/
├── src/
│   ├── rules/
│   │   ├── enforce-signal-inputs.ts
│   │   ├── no-component-data-fetch.ts
│   │   └── ...
│   ├── utils/
│   │   ├── angular-decorators.ts
│   │   └── ast-helpers.ts
│   └── index.ts
├── tests/
│   ├── rules/
│   │   ├── enforce-signal-inputs.test.ts
│   │   └── ...
│   └── test-utils.ts
├── lib/                    # Generated output
├── coverage/               # Generated coverage reports
├── tsconfig.json
├── jest.config.js
└── package.json
```

## Phase 2: Test-Driven Development Strategy

### 2.1 Test Enhancement Process

Before migrating each rule, enhance its tests following this process:

#### Step 1: Analyze Current Test Coverage

```typescript
// Example: Enhanced test structure for enforce-signal-inputs
describe('enforce-signal-inputs', () => {
  // Existing behavior tests
  describe('current functionality', () => {
    it('should detect @Input decorators in components', () => {
      // Test current behavior
    });
  });

  // New comprehensive tests
  describe('edge cases', () => {
    it('should handle components with multiple decorators', () => {
      // Test: @Component @SomeOtherDecorator class
    });

    it('should handle inherited components', () => {
      // Test: class Child extends Parent with inputs
    });

    it('should handle aliased imports', () => {
      // Test: import { Input as NgInput }
    });

    it('should handle namespace imports', () => {
      // Test: import * as ng from '@angular/core'
    });
  });

  describe('error reporting', () => {
    it('should report accurate line and column numbers', () => {
      // Verify exact error location
    });

    it('should include helpful data in error messages', () => {
      // Test message placeholders
    });
  });

  describe('auto-fix scenarios', () => {
    it('should provide fix for simple @Input to input()', () => {
      // Test auto-fix output
    });

    it('should handle @Input with options', () => {
      // Test: @Input({ required: true })
    });
  });
});
```

#### Step 2: Create Behavior Specification

```typescript
// tests/rules/enforce-signal-inputs.spec.md
/**
 * Behavior Specification: enforce-signal-inputs
 * 
 * Rule Purpose: Enforce use of signal inputs (CS-C02)
 * 
 * MUST:
 * - Detect all @Input decorators in component classes
 * - Suggest input() or input.required() replacement
 * - Check for input import from @angular/core
 * 
 * MUST NOT:
 * - Flag @Input in directives or services
 * - Flag other decorators
 * - Modify non-component classes
 * 
 * SHOULD:
 * - Provide auto-fix for simple cases
 * - Handle various import styles
 * - Support TypeScript edge cases
 */
```

### 2.2 Migration Priority and Strategy

#### High Priority Rules (Most Active/Complex)

1. **no-component-data-fetch**
   - Current issues: String matching, false positives
   - Migration benefits: Type checking for HttpClient
   - Test focus: Type detection, configuration options

2. **enforce-signal-inputs**
   - Current issues: No auto-fix, limited import handling
   - Migration benefits: Auto-fix capability
   - Test focus: Import variations, fix output

3. **enforce-inject-function**
   - Current issues: Limited scope, unused message
   - Migration benefits: Better pattern detection
   - Test focus: Mixed patterns, auto-fix

#### Medium Priority Rules

4. **enforce-standalone-components**
5. **enforce-feature-isolation**
6. **enforce-injectable-provided-in-root**
7. **no-promise-in-observable**

### 2.3 Test-First Migration Process

For each rule:

```bash
# 1. Run existing tests to establish baseline
npm test -- enforce-signal-inputs

# 2. Add comprehensive tests (while rule is still JS)
# Edit: tests/rules/enforce-signal-inputs.test.js
# Add edge cases, error accuracy tests, etc.

# 3. Ensure all tests pass with current implementation
npm test -- enforce-signal-inputs

# 4. Create TypeScript implementation
# Create: src/rules/enforce-signal-inputs.ts

# 5. Update tests to TypeScript
# Rename: .test.js → .test.ts

# 6. Run tests against new implementation
npm test -- enforce-signal-inputs

# 7. Add TypeScript-specific tests
# Test type-aware scenarios

# 8. Achieve 100% coverage
npm test -- enforce-signal-inputs --coverage
```

## Phase 3: Rule Migration Details

### 3.1 no-component-data-fetch Migration

#### Current Implementation Issues
- Uses string matching: `callee.object.name.includes('http')`
- False positives on methods like `getHttpHeaders()`
- No configuration options
- Cannot detect HttpClient type

#### TypeScript Implementation Plan

```typescript
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { createESLintRule, getDecoratorName } from '@angular-eslint/utils';

type Options = [{
  allowedMethods?: string[];
  allowedServices?: string[];
}];

type MessageIds = 
  | 'noDataFetch'
  | 'noHttpInComponent'
  | 'noAsyncLifecycle';

export const rule = createESLintRule<Options, MessageIds>({
  name: 'no-component-data-fetch',
  meta: {
    type: 'problem',
    docs: {
      description: 'Components should not fetch data directly (CS-R03)',
    },
    schema: [{
      type: 'object',
      properties: {
        allowedMethods: {
          type: 'array',
          items: { type: 'string' }
        },
        allowedServices: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }],
    messages: {
      noDataFetch: 'Components should not fetch data. Use resolvers instead.',
      noHttpInComponent: 'HTTP calls should be made in resolvers, not components.',
      noAsyncLifecycle: 'Lifecycle methods should not be async. Move to resolver.',
    },
  },
  defaultOptions: [{ allowedMethods: [], allowedServices: [] }],
  create(context, [options]) {
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();

    // Implementation with type checking
    function isHttpClient(node: TSESTree.Node): boolean {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const type = typeChecker.getTypeAtLocation(tsNode);
      const symbol = type.getSymbol();
      
      return symbol?.getName() === 'HttpClient' && 
             symbol.getDeclarations()?.[0]?.getSourceFile()
                   .fileName.includes('@angular/common/http');
    }

    // ... rest of implementation
  },
});
```

#### Migration Benefits
- Accurate HttpClient detection via type checking
- Configuration options for exceptions
- No false positives on method names
- Better integration with Angular tooling

### 3.2 enforce-signal-inputs Migration

#### Auto-Fix Implementation

```typescript
import { TSESTree } from '@typescript-eslint/utils';
import { createESLintRule } from '@angular-eslint/utils';

export const rule = createESLintRule({
  name: 'enforce-signal-inputs',
  meta: {
    fixable: 'code',
    // ... other meta
  },
  create(context) {
    return {
      PropertyDefinition(node: TSESTree.PropertyDefinition) {
        const inputDecorator = findInputDecorator(node);
        if (inputDecorator) {
          context.report({
            node: inputDecorator,
            messageId: 'useSignalInput',
            fix(fixer) {
              const fixes = [];
              
              // Remove @Input decorator
              fixes.push(fixer.remove(inputDecorator));
              
              // Determine if required
              const isRequired = checkIfRequired(inputDecorator);
              
              // Create signal input
              const signalCall = isRequired 
                ? `input.required<${getTypeAnnotation(node)}>()` 
                : `input<${getTypeAnnotation(node)}>()`;
              
              // Replace property definition
              fixes.push(fixer.replaceText(
                node,
                `${node.key.name} = ${signalCall}`
              ));
              
              return fixes;
            }
          });
        }
      }
    };
  }
});
```

### 3.3 enforce-inject-function Migration

#### Comprehensive Pattern Detection

```typescript
export const rule = createESLintRule({
  name: 'enforce-inject-function',
  meta: {
    fixable: 'code',
    messages: {
      useInjectFunction: 'Use inject({{serviceName}}) instead of constructor injection',
      mixedInjection: 'Do not mix inject() with constructor injection',
    },
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!isInjectableClass(node)) return;
        
        const constructor = findConstructor(node);
        if (!constructor) return;
        
        const hasInjectCalls = checkForInjectCalls(node);
        const hasConstructorParams = constructor.params.length > 0;
        
        if (hasInjectCalls && hasConstructorParams) {
          context.report({
            node: constructor,
            messageId: 'mixedInjection',
          });
        } else if (hasConstructorParams) {
          reportConstructorInjection(context, constructor);
        }
      }
    };
  }
});
```

## Phase 4: Documentation Standards

### 4.1 Rule Documentation Template

Create documentation for each rule in `docs/rules/`:

```markdown
# rule-name

Enforces [description] (Law Code: CS-XX)

## Rule Details

This rule [detailed explanation of what the rule does and why].

### Valid Code

```typescript
// Example of valid code
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-example',
  template: ''
})
export class ExampleComponent {
  name = input<string>();
}
```

### Invalid Code

```typescript
// Example of invalid code
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-example',
  template: ''
})
export class ExampleComponent {
  @Input() name: string; // Error: Use signal inputs
}
```

## Options

This rule accepts an options object:

```json
{
  "angular-standards/rule-name": ["error", {
    "option1": true,
    "option2": ["allowed", "values"]
  }]
}
```

### option1 (boolean)
Default: `true`

Description of what this option does.

### option2 (string[])
Default: `[]`

Description of what this option does.

## When Not To Use It

If you are [specific scenarios where the rule should be disabled].

## Related Rules

- [Other related rules]
- [@angular-eslint/related-rule]
```

### 4.2 Migration Notes Template

For each migrated rule, create `migration-notes.md`:

```markdown
# Migration Notes: rule-name

## Version
Migrated in v2.0.0

## Changes from JavaScript Version

### Breaking Changes
- None (backward compatible)

### New Features
- Added auto-fix capability
- Added configuration options
- Improved accuracy with type checking

### Bug Fixes
- Fixed false positives on [specific patterns]
- Improved error message clarity

### Performance
- 20% faster due to optimized AST traversal
- Reduced memory usage with targeted type checking

## Migration Guide for Users

No changes required. The rule maintains backward compatibility while adding new features.

To use new options:
```json
{
  "angular-standards/rule-name": ["error", {
    "newOption": true
  }]
}
```
```

## Phase 5: Testing Infrastructure

### 5.1 Test Utilities

Create `tests/test-utils.ts`:

```typescript
import { RuleTester } from '@angular-eslint/test-utils';

export function createRuleTester(): RuleTester {
  return new RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: './tsconfig.json',
    },
  });
}

export const angularTest = {
  component: (code: string) => ({
    code,
    filename: 'test.component.ts',
  }),
  service: (code: string) => ({
    code,
    filename: 'test.service.ts',
  }),
  directive: (code: string) => ({
    code,
    filename: 'test.directive.ts',
  }),
};

export const expectError = (messageId: string, line: number, column: number) => ({
  messageId,
  line,
  column,
});
```

### 5.2 Test Patterns

```typescript
import { createRuleTester, angularTest, expectError } from '../test-utils';
import { rule } from '../../src/rules/enforce-signal-inputs';

const ruleTester = createRuleTester();

describe('enforce-signal-inputs', () => {
  ruleTester.run('enforce-signal-inputs', rule, {
    valid: [
      angularTest.component(`
        import { Component, input } from '@angular/core';
        
        @Component({
          selector: 'app-test',
          template: ''
        })
        export class TestComponent {
          name = input<string>();
        }
      `),
    ],
    invalid: [
      {
        ...angularTest.component(`
          import { Component, Input } from '@angular/core';
          
          @Component({
            selector: 'app-test',
            template: ''
          })
          export class TestComponent {
            @Input() name: string;
          }
        `),
        errors: [
          expectError('useSignalInput', 9, 13),
          expectError('missingInputImport', 8, 11),
        ],
        output: `
          import { Component, Input, input } from '@angular/core';
          
          @Component({
            selector: 'app-test',
            template: ''
          })
          export class TestComponent {
            name = input<string>();
          }
        `,
      },
    ],
  });
});
```

## Implementation Checklist

### Infrastructure Setup
- [ ] Create new directory structure (src/, tests/)
- [ ] Create tsconfig.json with strict settings
- [ ] Update package.json with TypeScript dependencies
- [ ] Configure Jest with ts-jest
- [ ] Add build and test scripts
- [ ] Set up ESLint for TypeScript files
- [ ] Create test utilities module

### For Each Rule (Following TDD)

#### Phase A: Test Enhancement (JavaScript)
- [ ] Review current test coverage
- [ ] Add edge case tests
- [ ] Add error precision tests
- [ ] Add configuration option tests
- [ ] Document expected behavior
- [ ] Ensure all tests pass

#### Phase B: TypeScript Migration
- [ ] Create TypeScript implementation in src/rules/
- [ ] Use @angular-eslint/utils createESLintRule
- [ ] Implement type checking where beneficial
- [ ] Add configuration options
- [ ] Implement auto-fix where feasible

#### Phase C: Test Migration
- [ ] Convert test file to TypeScript
- [ ] Use new test utilities
- [ ] Add TypeScript-specific tests
- [ ] Add auto-fix tests
- [ ] Verify 100% code coverage

#### Phase D: Documentation
- [ ] Create rule documentation
- [ ] Write migration notes
- [ ] Update main README
- [ ] Add JSDoc comments

### Final Steps
- [ ] Update main index.ts to export all rules
- [ ] Create comprehensive plugin documentation
- [ ] Set up GitHub Actions for CI/CD
- [ ] Create migration guide for users
- [ ] Publish beta version to npm
- [ ] Gather user feedback
- [ ] Fix any reported issues
- [ ] Publish stable v2.0.0

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Type Checking Not Available
**Problem**: `parserServices.program` is undefined

**Solution**: Ensure test configuration includes:
```javascript
parserOptions: {
  project: './tsconfig.json',
}
```

#### 2. Import Resolution Issues
**Problem**: Cannot resolve '@angular-eslint/utils'

**Solution**: Check that all peer dependencies are installed:
```bash
npm install --save-peer @angular-eslint/eslint-plugin @typescript-eslint/eslint-plugin
```

#### 3. Test Timeout Issues
**Problem**: Tests timeout when using type checker

**Solution**: Increase Jest timeout for type-checking tests:
```typescript
jest.setTimeout(10000); // 10 seconds
```

#### 4. Auto-Fix Conflicts
**Problem**: Multiple fixes conflict with each other

**Solution**: Use `fixer.removeRange()` and `fixer.insertTextAfter()` instead of `replaceText()` for complex fixes.

### Performance Optimization

1. **Lazy Type Checking**: Only use type checker when necessary
2. **Cached Results**: Store type checking results to avoid redundant checks
3. **Selective Parsing**: Use `services.program` only for rules that need it
4. **Efficient Selectors**: Use specific AST selectors to reduce traversal

## Conclusion

This migration plan ensures a smooth transition to TypeScript while:
- Maintaining backward compatibility through comprehensive testing
- Improving rule accuracy with type information
- Adding developer-friendly features like auto-fix
- Following Angular ESLint best practices
- Creating maintainable, well-documented code

The test-driven approach guarantees that existing functionality is preserved while new capabilities are added systematically.