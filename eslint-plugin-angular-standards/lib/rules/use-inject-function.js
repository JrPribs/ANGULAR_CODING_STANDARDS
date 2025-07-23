/**
 * @fileoverview Enforce using inject() function instead of constructor injection (CS-V02)
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using inject() function instead of constructor injection (CS-V02)',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/your-org/angular-standards/blob/main/docs/CS-V02.md'
    },
    fixable: null, // Too complex to auto-fix reliably
    schema: [],
    messages: {
      useInjectFunction: 'Use inject() function instead of constructor injection (CS-V02). Move "{{ serviceName }}" to a class property with inject().',
      avoidConstructor: 'Avoid using constructor for dependency injection. Use inject() function in class properties instead (CS-V02).'
    }
  },

  create(context) {
    // Track if we're in an Angular class (Component, Service, Directive, etc.)
    let isAngularClass = false;
    let className = null;

    function checkDecorator(node) {
      if (node.decorators) {
        const angularDecorators = ['Component', 'Injectable', 'Directive', 'Pipe'];
        return node.decorators.some(decorator => {
          if (decorator.expression.type === 'CallExpression') {
            const name = decorator.expression.callee.name;
            return angularDecorators.includes(name);
          }
          return false;
        });
      }
      return false;
    }

    return {
      ClassDeclaration(node) {
        isAngularClass = checkDecorator(node);
        className = node.id ? node.id.name : null;
      },
      
      'ClassDeclaration:exit'() {
        isAngularClass = false;
        className = null;
      },

      MethodDefinition(node) {
        // Only check constructors in Angular classes
        if (!isAngularClass || node.kind !== 'constructor') {
          return;
        }

        const params = node.value.params;
        
        // Check if constructor has parameters
        if (params.length === 0) {
          return;
        }

        // Check each parameter for injection patterns
        params.forEach(param => {
          let serviceName = null;
          let isInjected = false;

          // Check for TypeScript parameter properties (e.g., private service: Service)
          if (param.type === 'TSParameterProperty') {
            serviceName = param.parameter.name;
            isInjected = true;
          }
          // Check for decorator injection (e.g., @Inject(TOKEN) service: Service)
          else if (param.decorators && param.decorators.length > 0) {
            const hasInjectDecorator = param.decorators.some(
              dec => dec.expression.callee && dec.expression.callee.name === 'Inject'
            );
            if (hasInjectDecorator) {
              serviceName = param.name;
              isInjected = true;
            }
          }
          // Check for regular parameters with type annotations (potential injections)
          else if (param.typeAnnotation) {
            // This might be a service injection
            serviceName = param.name;
            isInjected = true;
          }

          if (isInjected && serviceName) {
            context.report({
              node: param,
              messageId: 'useInjectFunction',
              data: { serviceName }
            });
          }
        });

        // If constructor has injection parameters, report on the constructor itself
        if (params.some(p => p.type === 'TSParameterProperty' || 
                             (p.decorators && p.decorators.length > 0) || 
                             p.typeAnnotation)) {
          context.report({
            node: node.key,
            messageId: 'avoidConstructor'
          });
        }
      }
    };
  }
};