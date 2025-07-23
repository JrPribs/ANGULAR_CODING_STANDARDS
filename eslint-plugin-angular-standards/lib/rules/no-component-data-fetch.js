/**
 * @fileoverview Prevent components from fetching data directly - all data loading should happen in resolvers
 * Implements CS-R03: Load ALL data in resolvers, not components
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent components from fetching data directly - use resolvers instead',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noDataFetchInComponent: 'Components should not fetch data directly. Use route resolvers to load data before component initialization.',
      noHttpInComponent: 'HTTP calls should not be made in components. Move data fetching to a resolver.',
      noAsyncInLifecycle: 'Avoid async operations in component lifecycle hooks. Use resolvers for data loading.',
    },
  },

  create(context) {
    let isComponentClass = false;
    let currentClassName = null;
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
    const lifecycleHooks = ['ngOnInit', 'ngAfterViewInit', 'ngOnChanges'];

    return {
      // Check class declarations for component detection
      ClassDeclaration(node) {
        const decorators = node.decorators || [];
        isComponentClass = decorators.some(decorator => {
          if (decorator.expression.type === 'CallExpression' &&
              decorator.expression.callee.type === 'Identifier') {
            return decorator.expression.callee.name === 'Component';
          }
          return false;
        });

        if (isComponentClass) {
          currentClassName = node.id.name;
        }
      },

      // Reset when leaving class
      'ClassDeclaration:exit'() {
        isComponentClass = false;
        currentClassName = null;
      },

      // Check for HTTP calls in components
      CallExpression(node) {
        if (!isComponentClass) return;

        // Check for HttpClient method calls
        if (node.callee.type === 'MemberExpression' &&
            node.callee.property.type === 'Identifier' &&
            httpMethods.includes(node.callee.property.name)) {
          
          // Check if it's likely an HTTP call
          const objectName = node.callee.object.type === 'MemberExpression' 
            ? node.callee.object.property.name 
            : node.callee.object.name;

          if (objectName && (objectName.toLowerCase().includes('http') || 
                             objectName.toLowerCase().includes('api') ||
                             objectName.toLowerCase().includes('service'))) {
            context.report({
              node: node,
              messageId: 'noHttpInComponent',
            });
          }
        }

        // Check for common data fetching patterns
        if (node.callee.type === 'MemberExpression' &&
            node.callee.property.type === 'Identifier') {
          const methodName = node.callee.property.name;
          const suspiciousMethodNames = [
            'fetch', 'load', 'get', 'find', 'search', 'query',
            'fetchData', 'loadData', 'getData', 'retrieveData',
            'fetchUsers', 'loadUsers', 'getUsers',
            'fetchItems', 'loadItems', 'getItems'
          ];

          if (suspiciousMethodNames.some(name => 
              methodName.toLowerCase().includes(name.toLowerCase()))) {
            context.report({
              node: node,
              messageId: 'noDataFetchInComponent',
            });
          }
        }
      },

      // Check for async operations in lifecycle hooks
      MethodDefinition(node) {
        if (!isComponentClass) return;

        if (lifecycleHooks.includes(node.key.name)) {
          // Check if method is async
          if (node.value.async) {
            context.report({
              node: node,
              messageId: 'noAsyncInLifecycle',
            });
          }

          // Check for subscribe calls in lifecycle hooks
          const sourceCode = context.getSourceCode();
          const methodText = sourceCode.getText(node);
          if (methodText.includes('.subscribe(')) {
            context.report({
              node: node,
              messageId: 'noDataFetchInComponent',
            });
          }
        }
      },
    };
  },
};