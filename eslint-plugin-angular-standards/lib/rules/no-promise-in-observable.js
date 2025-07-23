/**
 * @fileoverview Prevent wrapping Promises in Observables (CS-A03)
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent wrapping Promises in Observables (CS-A03)',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/your-org/angular-standards/blob/main/docs/CS-A03.md'
    },
    fixable: null, // Complex refactoring required
    schema: [],
    messages: {
      noPromiseInObservable: 'Do not wrap Promises in Observables. Use async/await directly (CS-A03)',
      avoidFromPromise: 'Avoid using from() with Promise-returning methods. Return the Promise directly (CS-A03)',
      avoidObservableWrapper: 'Do not create Observables from async operations. Use async/await pattern (CS-A03)'
    }
  },

  create(context) {
    // Track Promise-returning methods
    const promiseReturningMethods = new Set();
    const knownPromiseMethods = [
      'fetch',
      'getDoc',
      'getDocs',
      'setDoc',
      'updateDoc',
      'deleteDoc',
      'addDoc',
      'signInWithPopup',
      'signInWithEmailAndPassword',
      'createUserWithEmailAndPassword',
      'signOut'
    ];

    function isPromiseReturningCall(node) {
      if (node.type !== 'CallExpression') {
        return false;
      }

      // Check if it's a known Promise-returning method
      if (node.callee.type === 'Identifier') {
        return knownPromiseMethods.includes(node.callee.name);
      }

      // Check for method calls (e.g., this.getData())
      if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
        const methodName = node.callee.property.name;
        
        // Check if method name suggests it returns a Promise
        if (methodName.startsWith('get') || 
            methodName.startsWith('fetch') || 
            methodName.startsWith('load') ||
            methodName.startsWith('save') ||
            methodName.startsWith('create') ||
            methodName.startsWith('update') ||
            methodName.startsWith('delete')) {
          return true;
        }
        
        return promiseReturningMethods.has(methodName);
      }

      return false;
    }

    function isAsyncFunction(node) {
      return node && (node.async === true || 
              (node.type === 'ArrowFunctionExpression' && node.async === true) ||
              (node.type === 'FunctionExpression' && node.async === true));
    }

    return {
      // Track methods that return Promises
      MethodDefinition(node) {
        if (node.value.async || node.value.returnType) {
          const returnType = node.value.returnType;
          if (returnType && returnType.typeAnnotation) {
            const typeStr = context.getSourceCode().getText(returnType.typeAnnotation);
            if (typeStr.includes('Promise')) {
              promiseReturningMethods.add(node.key.name);
            }
          }
        }
      },

      // Check for from() usage with Promises
      CallExpression(node) {
        // Check for from() function from RxJS
        if (node.callee.type === 'Identifier' && node.callee.name === 'from') {
          const firstArg = node.arguments[0];
          
          if (!firstArg) return;

          // Check if argument is a Promise-returning call
          if (isPromiseReturningCall(firstArg)) {
            context.report({
              node,
              messageId: 'avoidFromPromise'
            });
          }

          // Check if argument is an async function call
          if (firstArg.type === 'CallExpression' && 
              firstArg.callee.type === 'MemberExpression' &&
              isAsyncFunction(firstArg.callee.object)) {
            context.report({
              node,
              messageId: 'avoidFromPromise'
            });
          }

          // Check for Promise.resolve/reject
          if (firstArg.type === 'CallExpression' &&
              firstArg.callee.type === 'MemberExpression' &&
              firstArg.callee.object.name === 'Promise' &&
              ['resolve', 'reject', 'all', 'race'].includes(firstArg.callee.property.name)) {
            context.report({
              node,
              messageId: 'noPromiseInObservable'
            });
          }
        }

        // Check for new Observable with Promise inside
        if (node.callee.type === 'NewExpression' && 
            node.callee.callee.name === 'Observable' &&
            node.arguments.length > 0) {
          const observerFunction = node.arguments[0];
          
          // Look for Promise patterns inside the Observable
          if (observerFunction && (observerFunction.type === 'FunctionExpression' || 
                                  observerFunction.type === 'ArrowFunctionExpression')) {
            const sourceCode = context.getSourceCode();
            const functionText = sourceCode.getText(observerFunction);
            
            // Check for Promise patterns in the Observable body
            if (functionText.includes('await') || 
                functionText.includes('.then(') || 
                functionText.includes('Promise.')) {
              context.report({
                node,
                messageId: 'avoidObservableWrapper'
              });
            }
          }
        }
      },

      // Check for methods that return Observable wrappers around Promises
      ReturnStatement(node) {
        if (!node.argument) return;

        // Check if returning from() with a Promise
        if (node.argument.type === 'CallExpression' && 
            node.argument.callee.name === 'from') {
          const firstArg = node.argument.arguments[0];
          
          if (firstArg && isPromiseReturningCall(firstArg)) {
            context.report({
              node: node.argument,
              messageId: 'avoidFromPromise'
            });
          }
        }
      }
    };
  }
};