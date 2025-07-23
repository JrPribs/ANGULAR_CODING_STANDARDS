/**
 * @fileoverview ESLint plugin for Angular coding standards enforcement
 */

module.exports = {
  rules: {
    'enforce-signal-inputs': require('./rules/enforce-signal-inputs'),
    'enforce-inject-function': require('./rules/enforce-inject-function'),
    'no-component-data-fetch': require('./rules/no-component-data-fetch'),
  },
  
  configs: {
    recommended: {
      plugins: ['angular-standards'],
      rules: {
        'angular-standards/enforce-signal-inputs': 'error',
        'angular-standards/enforce-inject-function': 'error',
        'angular-standards/no-component-data-fetch': 'error',
      },
    },
  },
};