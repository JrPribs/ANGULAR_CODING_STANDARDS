/**
 * @fileoverview ESLint plugin for Angular coding standards enforcement
 */

module.exports = {
  rules: {
    'enforce-signal-inputs': require('./rules/enforce-signal-inputs'),
    'enforce-inject-function': require('./rules/enforce-inject-function'),
    'no-component-data-fetch': require('./rules/no-component-data-fetch'),
    'enforce-feature-isolation': require('./rules/enforce-feature-isolation'),
    'enforce-injectable-provided-in-root': require('./rules/enforce-injectable-provided-in-root'),
    'enforce-standalone-components': require('./rules/enforce-standalone-components'),
    'no-promise-in-observable': require('./rules/no-promise-in-observable'),
  },
  
  configs: {
    recommended: {
      plugins: ['angular-standards'],
      rules: {
        'angular-standards/enforce-signal-inputs': 'error',
        'angular-standards/enforce-inject-function': 'error',
        'angular-standards/no-component-data-fetch': 'error',
        'angular-standards/enforce-feature-isolation': 'error',
        'angular-standards/enforce-injectable-provided-in-root': 'error',
        'angular-standards/enforce-standalone-components': 'error',
        'angular-standards/no-promise-in-observable': 'error',
      },
    },
  },
};