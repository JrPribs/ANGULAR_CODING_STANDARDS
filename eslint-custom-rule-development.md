# ESLint Custom Rule Development Guide

This guide provides comprehensive instructions for developing custom ESLint rules for the Angular Coding Standards project, following Angular ESLint best practices.

## Table of Contents

1. [Overview](#overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Understanding ESLint Rule Structure](#understanding-eslint-rule-structure)
4. [Angular ESLint Best Practices](#angular-eslint-best-practices)
5. [Step-by-Step Rule Creation](#step-by-step-rule-creation)
6. [Testing Custom Rules](#testing-custom-rules)
7. [Debugging Techniques](#debugging-techniques)
8. [Integration with Law Codes](#integration-with-law-codes)
9. [Migration Guide](#migration-guide)
10. [Examples from Existing Rules](#examples-from-existing-rules)

## Overview

Custom ESLint rules in this project enforce Angular coding standards defined by our law code system. Each rule should:
- Enforce a specific law code (e.g., CS-C01, CS-V02)
- Follow Angular ESLint patterns and utilities
- Provide clear, actionable error messages
- Include comprehensive tests
- Be written in TypeScript for better maintainability

## Development Environment Setup

### Prerequisites

```bash
npm install --save-dev @angular-eslint/utils @angular-eslint/test-utils @typescript-eslint/utils typescript
```

### Recommended Project Structure

```
eslint-plugin-angular-standards/
├── src/
│   ├── rules/
│   │   ├── enforce-signal-inputs.ts
│   │   └── no-component-data-fetch.ts
│   └── index.ts
├── tests/
│   ├── rules/
│   │   ├── enforce-signal-inputs.test.ts
│   │   └── no-component-data-fetch.test.ts
├── lib/           # Compiled JavaScript output
├── tsconfig.json
└── package.json
```

### TypeScript Configuration

Create a `tsconfig.json` in the plugin directory:

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
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "tests"]
}
```

## Understanding ESLint Rule Structure

### Basic Rule Anatomy

Every ESLint rule consists of two main parts:

1. **Meta object**: Describes the rule
2. **Create function**: Implements the rule logic

```typescript
import { ESLintUtils } from '@angular-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name => `https://github.com/angular-standards/rules/${name}`
);

export const rule = createRule({
  name: 'rule-name',
  meta: {
    type: 'problem', // or 'suggestion' or 'layout'
    docs: {
      description: 'Enforce specific pattern',
      recommended: 'error',
    },
    fixable: 'code', // if the rule provides auto-fix
    schema: [], // for rule options
    messages: {
      messageId: 'Error message with {{placeholder}} support',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // AST visitor methods
      CallExpression(node) {
        // Check the node and report if needed
        context.report({
          node,
          messageId: 'messageId',
          data: { placeholder: 'value' },
        });
      },
    };
  },
});
```

### AST (Abstract Syntax Tree) Concepts

ESLint parses code into an AST, which represents the code structure. Common node types for Angular:

- `ClassDeclaration`: Class definitions
- `Decorator`: Angular decorators (@Component, @Injectable)
- `PropertyDefinition`: Class properties
- `MethodDefinition`: Class methods
- `CallExpression`: Function/method calls
- `ImportDeclaration`: Import statements

## Angular ESLint Best Practices

### 1. Use Angular ESLint Utilities

```typescript
import { 
  getDecoratorName, 
  isAngularClassDecorator,
  getDecoratorProperty,
  getDecoratorArgument
} from '@angular-eslint/utils';
```

### 2. Type-Safe Rule Creation

```typescript
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { createESLintRule } from '@angular-eslint/utils';

type Options = [];
type MessageIds = 'useSignalInput' | 'missingImport';

export const rule = createESLintRule<Options, MessageIds>({
  name: 'enforce-signal-inputs',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of signal inputs instead of @Input() decorator',
    },
    messages: {
      useSignalInput: 'Use input() or input.required() instead of @Input() decorator',
      missingImport: 'Add input to your imports from @angular/core',
    },
  },
  defaultOptions: [],
  create(context) {
    // Implementation
  },
});
```

### 3. Angular-Specific Detection

```typescript
// Check if a class is an Angular component
if (isAngularClassDecorator(node, 'Component')) {
  // This is a component class
}

// Get decorator properties
const templateUrl = getDecoratorProperty(decorator, 'templateUrl');
const standalone = getDecoratorProperty(decorator, 'standalone');
```

### 4. Type Checking (When Available)

```typescript
const parserServices = ESLintUtils.getParserServices(context);
const typeChecker = parserServices.program.getTypeChecker();
const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
const type = typeChecker.getTypeAtLocation(tsNode);
```

## Step-by-Step Rule Creation

### Step 1: Define the Rule Purpose

1. Identify the law code to enforce (e.g., CS-C02)
2. Define what patterns to detect
3. Determine if auto-fix is possible

### Step 2: Create the Rule File

```typescript
// src/rules/enforce-signal-inputs.ts
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { createESLintRule, getDecoratorName } from '@angular-eslint/utils';

type Options = [];
type MessageIds = 'useSignalInput' | 'missingInputImport';

export const rule = createESLintRule<Options, MessageIds>({
  name: 'enforce-signal-inputs',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of signal inputs (CS-C02)',
    },
    messages: {
      useSignalInput: 'Use input() or input.required() instead of @Input() decorator',
      missingInputImport: 'Add input to your imports from @angular/core',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let hasInputImport = false;
    let hasInputDecorator = false;
    let componentNode: TSESTree.ClassDeclaration | null = null;

    return {
      ImportDeclaration(node) {
        // Check for input import
        if (node.source.value === '@angular/core') {
          node.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier' && spec.imported.name === 'input') {
              hasInputImport = true;
            }
          });
        }
      },
      
      ClassDeclaration(node) {
        // Check if it's a component
        const decorator = node.decorators?.find(d => 
          getDecoratorName(d) === 'Component'
        );
        if (decorator) {
          componentNode = node;
        }
      },
      
      PropertyDefinition(node) {
        if (!componentNode || node.parent !== componentNode.body) return;
        
        const inputDecorator = node.decorators?.find(d => 
          getDecoratorName(d) === 'Input'
        );
        
        if (inputDecorator) {
          hasInputDecorator = true;
          context.report({
            node: inputDecorator,
            messageId: 'useSignalInput',
          });
        }
      },
      
      'Program:exit'() {
        if (hasInputDecorator && !hasInputImport && componentNode) {
          context.report({
            node: componentNode,
            messageId: 'missingInputImport',
          });
        }
      },
    };
  },
});
```

### Step 3: Export the Rule

```typescript
// src/index.ts
import { rule as enforceSignalInputs } from './rules/enforce-signal-inputs';
import { rule as noComponentDataFetch } from './rules/no-component-data-fetch';

export const rules = {
  'enforce-signal-inputs': enforceSignalInputs,
  'no-component-data-fetch': noComponentDataFetch,
};

export const configs = {
  recommended: {
    plugins: ['angular-standards'],
    rules: {
      'angular-standards/enforce-signal-inputs': 'error',
      'angular-standards/no-component-data-fetch': 'error',
    },
  },
};
```

## Testing Custom Rules

### Using RuleTester

```typescript
// tests/rules/enforce-signal-inputs.test.ts
import { RuleTester } from '@angular-eslint/test-utils';
import { rule } from '../../src/rules/enforce-signal-inputs';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('enforce-signal-inputs', rule, {
  valid: [
    {
      code: `
        import { Component, input } from '@angular/core';
        
        @Component({
          selector: 'app-test',
          template: ''
        })
        export class TestComponent {
          name = input.required<string>();
          age = input<number>();
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { Component, Input } from '@angular/core';
        
        @Component({
          selector: 'app-test',
          template: ''
        })
        export class TestComponent {
          @Input() name: string;
        }
      `,
      errors: [
        {
          messageId: 'useSignalInput',
          line: 9,
          column: 11,
        },
        {
          messageId: 'missingInputImport',
          line: 8,
          column: 9,
        },
      ],
    },
  ],
});
```

### Testing Best Practices

1. **Test both valid and invalid cases**
2. **Test edge cases**: Multiple decorators, inheritance, etc.
3. **Test error locations**: Ensure errors point to the right place
4. **Test fix output**: If your rule provides fixes
5. **Test with different configurations**: If your rule has options

## Debugging Techniques

### 1. AST Explorer

Use [AST Explorer](https://astexplorer.net/) to understand code structure:
- Select "JavaScript" as language
- Choose "@typescript-eslint/parser" as parser
- Paste your code to see the AST

### 2. Console Logging

```typescript
create(context) {
  return {
    ClassDeclaration(node) {
      console.log('Found class:', node.id?.name);
      console.log('Decorators:', node.decorators);
    },
  };
}
```

### 3. Node Inspection

```typescript
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

// Check node type
if (node.type === AST_NODE_TYPES.CallExpression) {
  // Handle call expression
}

// Traverse parent nodes
let parent = node.parent;
while (parent) {
  if (parent.type === AST_NODE_TYPES.ClassDeclaration) {
    // Found parent class
    break;
  }
  parent = parent.parent;
}
```

### 4. Source Code Access

```typescript
const sourceCode = context.getSourceCode();
const text = sourceCode.getText(node);
const comments = sourceCode.getCommentsBefore(node);
```

## Integration with Law Codes

Each custom rule should:

1. **Reference the law code** in the rule description
2. **Include the law code** in error messages where appropriate
3. **Document the relationship** in rule comments

```typescript
export const rule = createESLintRule({
  name: 'no-component-data-fetch',
  meta: {
    docs: {
      description: 'Prevent components from fetching data directly (CS-R03)',
    },
    messages: {
      noDataFetch: 'Components should not fetch data directly. Use resolvers instead (CS-R03)',
    },
  },
  // ...
});
```

## Migration Guide

### Converting JavaScript Rules to TypeScript

1. **Add type imports**:
```typescript
import { TSESTree, ESLintUtils } from '@typescript-eslint/utils';
import { createESLintRule } from '@angular-eslint/utils';
```

2. **Define types**:
```typescript
type Options = [{ allowedPatterns?: string[] }];
type MessageIds = 'errorId1' | 'errorId2';
```

3. **Type node parameters**:
```typescript
CallExpression(node: TSESTree.CallExpression) {
  // node is now typed
}
```

4. **Use Angular utilities**:
```typescript
// Instead of manual decorator checking:
const isComponent = isAngularClassDecorator(node, 'Component');
```

### Leveraging Official Rules

Before creating a custom rule, check if an official Angular ESLint rule exists:

1. Check [@angular-eslint rules](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin/src/rules)
2. Consider if you can use an official rule with configuration
3. If you need stricter enforcement, consider complementing official rules

## Examples from Existing Rules

### Example 1: Detecting Angular Components

```typescript
// From no-component-data-fetch rule
const isComponentClass = node.decorators?.some(decorator => {
  if (decorator.expression.type === 'CallExpression' &&
      decorator.expression.callee.type === 'Identifier') {
    return decorator.expression.callee.name === 'Component';
  }
  return false;
});
```

### Example 2: Checking Imports

```typescript
// From enforce-signal-inputs rule
ImportDeclaration(node) {
  if (node.source.value === '@angular/core') {
    const hasInput = node.specifiers.some(spec =>
      spec.type === 'ImportSpecifier' && 
      spec.imported.name === 'input'
    );
    if (hasInput) {
      hasInputImport = true;
    }
  }
}
```

### Example 3: Auto-Fix Implementation

```typescript
// From enforce-standalone-components rule
context.report({
  node: decorator,
  messageId: 'missingStandalone',
  fix(fixer) {
    const decoratorText = sourceCode.getText(decorator);
    const hasProperties = decoratorText.includes('{');
    
    if (!hasProperties) {
      return fixer.replaceText(decorator, '@Component({ standalone: true })');
    } else {
      // Insert after opening brace
      const openBrace = decoratorText.indexOf('{');
      return fixer.insertTextAfterRange(
        [decorator.range[0] + openBrace + 1, decorator.range[0] + openBrace + 1],
        ' standalone: true,'
      );
    }
  },
});
```

## Rule Maintenance

### Versioning
- Follow semantic versioning for rule changes
- Breaking changes require major version bump
- New rules or options are minor versions
- Bug fixes are patch versions

### Documentation
- Keep rule documentation up to date
- Include examples of correct and incorrect code
- Document any configuration options
- Reference the specific law code being enforced

### Performance Considerations
- Avoid expensive operations in frequently-called visitors
- Cache results when visiting multiple nodes
- Use early returns to skip unnecessary checks
- Consider using `context.getSourceCode()` sparingly

## Conclusion

Creating custom ESLint rules for Angular requires understanding both ESLint's architecture and Angular's patterns. By following these guidelines and leveraging Angular ESLint utilities, you can create maintainable, efficient rules that enforce your coding standards effectively.

Remember to:
- Use TypeScript for better type safety
- Leverage @angular-eslint/utils for Angular-specific logic  
- Write comprehensive tests
- Document your rules clearly
- Reference law codes consistently
- Consider existing official rules before creating custom ones