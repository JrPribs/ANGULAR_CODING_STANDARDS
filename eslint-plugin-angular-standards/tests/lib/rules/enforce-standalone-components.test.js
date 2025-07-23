/**
 * @fileoverview Tests for enforce-standalone-components rule
 */
'use strict';

const rule = require('../../../lib/rules/enforce-standalone-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('enforce-standalone-components', rule, {
  valid: [
    // Correct standalone component
    {
      code: `
        @Component({
          selector: 'app-user',
          standalone: true,
          imports: [CommonModule]
        })
        export class UserComponent {}
      `
    },
    // Standalone with other properties
    {
      code: `
        @Component({
          selector: 'app-product',
          templateUrl: './product.component.html',
          styleUrls: ['./product.component.scss'],
          standalone: true,
          changeDetection: ChangeDetectionStrategy.OnPush
        })
        export class ProductComponent {}
      `
    },
    // Not a component decorator
    {
      code: `
        @Injectable({ providedIn: 'root' })
        export class UserService {}
      `
    },
    // Importing Angular standalone APIs
    {
      code: `
        import { Component, inject } from '@angular/core';
        import { AsyncPipe, DatePipe } from '@angular/common';
      `
    }
  ],

  invalid: [
    // Missing standalone property
    {
      code: `
        @Component({
          selector: 'app-user'
        })
        export class UserComponent {}
      `,
      errors: [{
        messageId: 'notStandalone'
      }],
      output: `
        @Component({
          selector: 'app-user',
  standalone: true
        })
        export class UserComponent {}
      `
    },
    // Empty decorator
    {
      code: `
        @Component({})
        export class UserComponent {}
      `,
      errors: [{
        messageId: 'notStandalone'
      }],
      output: `
        @Component({ standalone: true })
        export class UserComponent {}
      `
    },
    // Standalone false
    {
      code: `
        @Component({
          selector: 'app-user',
          standalone: false
        })
        export class UserComponent {}
      `,
      errors: [{
        messageId: 'standaloneNotTrue',
        data: { value: false }
      }],
      output: `
        @Component({
          selector: 'app-user',
          standalone: true
        })
        export class UserComponent {}
      `
    },
    // Importing CommonModule
    {
      code: `
        import { CommonModule } from '@angular/common';
      `,
      errors: [{
        messageId: 'noNgModule'
      }]
    },
    // Importing multiple NgModules
    {
      code: `
        import { BrowserModule } from '@angular/platform-browser';
        import { FormsModule, ReactiveFormsModule } from '@angular/forms';
        import { HttpClientModule } from '@angular/common/http';
      `,
      errors: [
        { messageId: 'noNgModule' },
        { messageId: 'noNgModule' },
        { messageId: 'noNgModule' },
        { messageId: 'noNgModule' }
      ]
    },
    // Complex component missing standalone
    {
      code: `
        @Component({
          selector: 'app-dashboard',
          templateUrl: './dashboard.component.html',
          styleUrls: ['./dashboard.component.scss'],
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [DashboardService]
        })
        export class DashboardComponent {}
      `,
      errors: [{
        messageId: 'notStandalone'
      }],
      output: `
        @Component({
          selector: 'app-dashboard',
  standalone: true,
          templateUrl: './dashboard.component.html',
          styleUrls: ['./dashboard.component.scss'],
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [DashboardService]
        })
        export class DashboardComponent {}
      `
    },
    // Importing RouterModule
    {
      code: `
        import { RouterModule } from '@angular/router';
      `,
      errors: [{
        messageId: 'noNgModule'
      }]
    }
  ]
});