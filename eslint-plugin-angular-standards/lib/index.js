/**
 * @fileoverview ESLint plugin for Angular coding standards
 */
'use strict';

// Import all rules
const enforceInjectableProvidedInRoot = require('./rules/enforce-injectable-provided-in-root');
const useInjectFunction = require('./rules/use-inject-function');
const enforceStandaloneComponents = require('./rules/enforce-standalone-components');
const noPromiseInObservable = require('./rules/no-promise-in-observable');
const enforceFeatureIsolation = require('./rules/enforce-feature-isolation');

// Export plugin
module.exports = {
  rules: {
    'enforce-injectable-provided-in-root': enforceInjectableProvidedInRoot,
    'use-inject-function': useInjectFunction,
    'enforce-standalone-components': enforceStandaloneComponents,
    'no-promise-in-observable': noPromiseInObservable,
    'enforce-feature-isolation': enforceFeatureIsolation
  },
  
  configs: {
    recommended: {
      plugins: ['angular-standards'],
      rules: {
        'angular-standards/enforce-injectable-provided-in-root': 'error',
        'angular-standards/use-inject-function': 'error',
        'angular-standards/enforce-standalone-components': 'error',
        'angular-standards/no-promise-in-observable': 'error',
        'angular-standards/enforce-feature-isolation': 'error'
      }
    },
    
    strict: {
      plugins: ['angular-standards'],
      rules: {
        'angular-standards/enforce-injectable-provided-in-root': 'error',
        'angular-standards/use-inject-function': 'error',
        'angular-standards/enforce-standalone-components': 'error',
        'angular-standards/no-promise-in-observable': 'error',
        'angular-standards/enforce-feature-isolation': 'error'
      }
    },
    
    warnings: {
      plugins: ['angular-standards'],
      rules: {
        'angular-standards/enforce-injectable-provided-in-root': 'warn',
        'angular-standards/use-inject-function': 'warn',
        'angular-standards/enforce-standalone-components': 'warn',
        'angular-standards/no-promise-in-observable': 'warn',
        'angular-standards/enforce-feature-isolation': 'warn'
      }
    }
  }
};