/**
 * @fileoverview Enforce the use of inject() function instead of constructor injection
 * Implements CS-V02: Use inject() function, not constructor injection
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of inject() function instead of constructor injection in services',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      useInjectFunction: 'Use inject() function instead of constructor injection. Example: private userService = inject(UserService);',
      constructorShouldBeEmpty: 'Constructor should be empty when using inject() function pattern.',
    },
  },

  create(context) {
    let isInjectableClass = false;
    let hasInjectImport = false;

    return {
      // Check for inject import
      ImportDeclaration(node) {
        if (node.source.value === '@angular/core') {
          node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'inject') {
              hasInjectImport = true;
            }
          });
        }
      },

      // Check class declarations for Injectable decorator
      ClassDeclaration(node) {
        const decorators = node.decorators || [];
        isInjectableClass = decorators.some(decorator => {
          if (decorator.expression.type === 'CallExpression' &&
              decorator.expression.callee.type === 'Identifier') {
            return decorator.expression.callee.name === 'Injectable';
          }
          return false;
        });

        if (isInjectableClass) {
          // Check constructor for parameters
          const constructor = node.body.body.find(
            member => member.type === 'MethodDefinition' && member.key.name === 'constructor'
          );

          if (constructor && constructor.value.params.length > 0) {
            // Check if any parameters have type annotations (indicating DI)
            const hasDependencyInjection = constructor.value.params.some(param => {
              return param.type === 'TSParameterProperty' || 
                     (param.typeAnnotation && param.typeAnnotation.type === 'TSTypeAnnotation');
            });

            if (hasDependencyInjection) {
              context.report({
                node: constructor,
                messageId: 'useInjectFunction',
              });

              if (!hasInjectImport) {
                context.report({
                  node: context.getSourceCode().ast,
                  messageId: 'useInjectFunction',
                });
              }
            }
          }
        }
      },
    };
  },
};