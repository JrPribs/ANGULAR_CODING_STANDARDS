/**
 * @fileoverview Enforce that all services use providedIn: 'root' (CS-V01)
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Enforce that all services use providedIn: 'root' (CS-V01)",
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/your-org/angular-standards/blob/main/docs/CS-V01.md'
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingProvidedIn: "Injectable services must use providedIn: 'root' (CS-V01)",
      incorrectProvidedIn: "Injectable services must use providedIn: 'root', not '{{ value }}' (CS-V01)"
    }
  },

  create(context) {
    return {
      'Decorator[expression.callee.name="Injectable"]'(node) {
        const args = node.expression.arguments;
        
        // Check if @Injectable has no arguments
        if (args.length === 0) {
          context.report({
            node,
            messageId: 'missingProvidedIn',
            fix(fixer) {
              // Find the opening and closing parentheses
              const openParen = context.getSourceCode().getTokenAfter(
                node.expression.callee,
                token => token.value === '('
              );
              const closeParen = context.getSourceCode().getTokenAfter(
                openParen,
                token => token.value === ')'
              );
              
              return fixer.insertTextBefore(closeParen, "{ providedIn: 'root' }");
            }
          });
          return;
        }

        // Check if the first argument is an object literal
        const firstArg = args[0];
        if (firstArg.type !== 'ObjectExpression') {
          return;
        }

        // Find providedIn property
        const providedInProp = firstArg.properties.find(
          prop => prop.key && prop.key.name === 'providedIn'
        );

        // Check if providedIn is missing
        if (!providedInProp) {
          context.report({
            node: firstArg,
            messageId: 'missingProvidedIn',
            fix(fixer) {
              if (firstArg.properties.length === 0) {
                // Empty object
                return fixer.replaceText(firstArg, "{ providedIn: 'root' }");
              } else {
                // Add as first property
                const firstProperty = firstArg.properties[0];
                return fixer.insertTextBefore(firstProperty, "providedIn: 'root', ");
              }
            }
          });
          return;
        }

        // Check if providedIn value is 'root'
        const providedInValue = providedInProp.value;
        if (
          providedInValue.type === 'Literal' &&
          providedInValue.value !== 'root'
        ) {
          context.report({
            node: providedInProp.value,
            messageId: 'incorrectProvidedIn',
            data: { value: providedInValue.value },
            fix(fixer) {
              return fixer.replaceText(providedInValue, "'root'");
            }
          });
        }
      }
    };
  }
};