/**
 * @fileoverview Tests for enforce-injectable-provided-in-root rule
 */
'use strict';

const rule = require('../../../lib/rules/enforce-injectable-provided-in-root');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('enforce-injectable-provided-in-root', rule, {
  valid: [
    // Correct usage
    {
      code: `
        @Injectable({ providedIn: 'root' })
        export class UserService {}
      `
    },
    // With other properties
    {
      code: `
        @Injectable({ 
          providedIn: 'root',
          deps: [HttpClient]
        })
        export class DataService {}
      `
    },
    // Not an Injectable decorator
    {
      code: `
        @Component({ selector: 'app-test' })
        export class TestComponent {}
      `
    }
  ],

  invalid: [
    // Missing providedIn
    {
      code: `
        @Injectable()
        export class UserService {}
      `,
      errors: [{
        messageId: 'missingProvidedIn'
      }],
      output: `
        @Injectable({ providedIn: 'root' })
        export class UserService {}
      `
    },
    // Empty object
    {
      code: `
        @Injectable({})
        export class DataService {}
      `,
      errors: [{
        messageId: 'missingProvidedIn'
      }],
      output: `
        @Injectable({ providedIn: 'root' })
        export class DataService {}
      `
    },
    // Wrong providedIn value
    {
      code: `
        @Injectable({ providedIn: 'any' })
        export class AuthService {}
      `,
      errors: [{
        messageId: 'incorrectProvidedIn',
        data: { value: 'any' }
      }],
      output: `
        @Injectable({ providedIn: 'root' })
        export class AuthService {}
      `
    },
    // providedIn with module reference
    {
      code: `
        @Injectable({ providedIn: UserModule })
        export class UserService {}
      `,
      errors: [{
        messageId: 'incorrectProvidedIn'
      }]
    }
  ]
});