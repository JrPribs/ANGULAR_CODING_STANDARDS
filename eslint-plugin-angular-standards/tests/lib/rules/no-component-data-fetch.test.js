/**
 * @fileoverview Tests for no-component-data-fetch rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-component-data-fetch');

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

ruleTester.run('no-component-data-fetch', rule, {
  valid: [
    // Valid: Component with data from resolver via input
    {
      code: `
        import { Component, input } from '@angular/core';
        
        @Component({
          selector: 'app-users',
          template: ''
        })
        export class UsersComponent {
          users = input.required<User[]>();
          
          ngOnInit() {
            console.log('Users loaded:', this.users());
          }
        }
      `,
    },
    // Valid: Service can fetch data
    {
      code: `
        import { Injectable, inject } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        
        @Injectable({ providedIn: 'root' })
        export class UserService {
          private http = inject(HttpClient);
          
          getUsers() {
            return this.http.get<User[]>('/api/users');
          }
        }
      `,
    },
    // Valid: Component with simple logic, no data fetching
    {
      code: `
        import { Component } from '@angular/core';
        
        @Component({
          selector: 'app-counter',
          template: ''
        })
        export class CounterComponent {
          count = 0;
          
          increment() {
            this.count++;
          }
        }
      `,
    },
  ],

  invalid: [
    // Invalid: HTTP call in component
    {
      code: `
        import { Component, inject } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        
        @Component({
          selector: 'app-users',
          template: ''
        })
        export class UsersComponent {
          private http = inject(HttpClient);
          users: User[] = [];
          
          ngOnInit() {
            this.http.get<User[]>('/api/users').subscribe(data => {
              this.users = data;
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'noHttpInComponent',
          type: 'CallExpression',
        },
        {
          messageId: 'noDataFetchInComponent',
          type: 'MethodDefinition',
        },
      ],
    },
    // Invalid: Service call in component to fetch data
    {
      code: `
        import { Component, inject } from '@angular/core';
        import { UserService } from './user.service';
        
        @Component({
          selector: 'app-users',
          template: ''
        })
        export class UsersComponent {
          private userService = inject(UserService);
          users: User[] = [];
          
          ngOnInit() {
            this.userService.fetchUsers().subscribe(data => {
              this.users = data;
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'noDataFetchInComponent',
          type: 'CallExpression',
        },
        {
          messageId: 'noDataFetchInComponent',
          type: 'MethodDefinition',
        },
      ],
    },
    // Invalid: Async lifecycle hook
    {
      code: `
        import { Component } from '@angular/core';
        
        @Component({
          selector: 'app-data',
          template: ''
        })
        export class DataComponent {
          async ngOnInit() {
            const data = await this.loadData();
          }
          
          private async loadData() {
            return fetch('/api/data');
          }
        }
      `,
      errors: [
        {
          messageId: 'noAsyncInLifecycle',
          type: 'MethodDefinition',
        },
        {
          messageId: 'noDataFetchInComponent',
          type: 'CallExpression',
        },
      ],
    },
  ],
});