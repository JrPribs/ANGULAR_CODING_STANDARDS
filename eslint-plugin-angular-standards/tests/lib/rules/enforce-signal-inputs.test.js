/**
 * @fileoverview Tests for enforce-signal-inputs rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/enforce-signal-inputs');

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('enforce-signal-inputs', rule, {
  valid: [
    // Valid: Using signal inputs
    {
      code: `
        import { Component, input } from '@angular/core';
        
        @Component({
          selector: 'app-example',
          template: ''
        })
        export class ExampleComponent {
          name = input<string>();
          age = input.required<number>();
        }
      `,
    },
    // Valid: Non-component class can use @Input
    {
      code: `
        import { Directive, Input } from '@angular/core';
        
        @Directive({
          selector: '[appExample]'
        })
        export class ExampleDirective {
          @Input() value: string;
        }
      `,
    },
  ],

  invalid: [
    // Invalid: Using @Input decorator in component
    {
      code: `
        import { Component, Input } from '@angular/core';
        
        @Component({
          selector: 'app-example',
          template: ''
        })
        export class ExampleComponent {
          @Input() name: string;
          @Input() age: number;
        }
      `,
      errors: [
        {
          messageId: 'useSignalInput',
          type: 'PropertyDefinition',
        },
        {
          messageId: 'useSignalInput',
          type: 'PropertyDefinition',
        },
        {
          messageId: 'missingInputImport',
          type: 'Program',
        },
      ],
    },
    // Invalid: Mixed usage
    {
      code: `
        import { Component, Input, input } from '@angular/core';
        
        @Component({
          selector: 'app-example',
          template: ''
        })
        export class ExampleComponent {
          name = input<string>();
          @Input() age: number;
        }
      `,
      errors: [
        {
          messageId: 'useSignalInput',
          type: 'PropertyDefinition',
        },
      ],
    },
  ],
});