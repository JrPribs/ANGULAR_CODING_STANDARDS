/**
 * @fileoverview Enforce the use of signal inputs (input() and input.required()) instead of @Input() decorator
 * Implements CS-C02: Use signal inputs only
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of signal inputs instead of @Input() decorator',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      useSignalInput: 'Use input() or input.required() instead of @Input() decorator. Signal inputs provide better type safety and performance.',
      missingInputImport: 'Import input from @angular/core to use signal inputs.',
    },
  },

  create(context) {
    let hasInputDecorator = false;
    let hasSignalInputImport = false;
    let componentClassName = null;

    return {
      // Check for @Input decorator imports
      ImportDeclaration(node) {
        if (node.source.value === '@angular/core') {
          node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportSpecifier') {
              if (specifier.imported.name === 'Input') {
                hasInputDecorator = true;
              }
              if (specifier.imported.name === 'input') {
                hasSignalInputImport = true;
              }
            }
          });
        }
      },

      // Check class declarations for component detection
      ClassDeclaration(node) {
        const decorators = node.decorators || [];
        const isComponent = decorators.some(decorator => {
          if (decorator.expression.type === 'CallExpression' &&
              decorator.expression.callee.type === 'Identifier') {
            return decorator.expression.callee.name === 'Component';
          }
          return false;
        });

        if (isComponent) {
          componentClassName = node.id.name;
        }
      },

      // Check for @Input() usage
      PropertyDefinition(node) {
        if (!componentClassName) return;

        const decorators = node.decorators || [];
        const hasInputDecorator = decorators.some(decorator => {
          if (decorator.expression.type === 'CallExpression' &&
              decorator.expression.callee.type === 'Identifier') {
            return decorator.expression.callee.name === 'Input';
          }
          return false;
        });

        if (hasInputDecorator) {
          context.report({
            node: node,
            messageId: 'useSignalInput',
          });
        }
      },

      // Check for proper signal input usage
      'Program:exit'() {
        if (hasInputDecorator && !hasSignalInputImport && componentClassName) {
          context.report({
            node: context.getSourceCode().ast,
            messageId: 'missingInputImport',
          });
        }
      },
    };
  },
};