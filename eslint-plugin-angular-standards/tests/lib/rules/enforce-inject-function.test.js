/**
 * @fileoverview Tests for enforce-inject-function rule
 */

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/enforce-inject-function');

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

ruleTester.run('enforce-inject-function', rule, {
  valid: [
    // Valid: Using inject() function
    {
      code: `
        import { Injectable, inject } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        
        @Injectable({ providedIn: 'root' })
        export class UserService {
          private http = inject(HttpClient);
          
          constructor() {}
          
          getUsers() {
            return this.http.get('/api/users');
          }
        }
      `,
    },
    // Valid: Service with no dependencies
    {
      code: `
        import { Injectable } from '@angular/core';
        
        @Injectable({ providedIn: 'root' })
        export class UtilityService {
          constructor() {}
          
          formatDate(date: Date): string {
            return date.toISOString();
          }
        }
      `,
    },
    // Valid: Non-injectable class can use constructor injection
    {
      code: `
        export class RegularClass {
          constructor(private value: string) {}
        }
      `,
    },
  ],

  invalid: [
    // Invalid: Using constructor injection
    {
      code: `
        import { Injectable } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        
        @Injectable({ providedIn: 'root' })
        export class UserService {
          constructor(private http: HttpClient) {}
          
          getUsers() {
            return this.http.get('/api/users');
          }
        }
      `,
      errors: [
        {
          messageId: 'useInjectFunction',
          type: 'MethodDefinition',
        },
        {
          messageId: 'useInjectFunction',
          type: 'Program',
        },
      ],
    },
    // Invalid: Multiple constructor parameters
    {
      code: `
        import { Injectable } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        import { Router } from '@angular/router';
        
        @Injectable({ providedIn: 'root' })
        export class AuthService {
          constructor(
            private http: HttpClient,
            private router: Router
          ) {}
        }
      `,
      errors: [
        {
          messageId: 'useInjectFunction',
          type: 'MethodDefinition',
        },
        {
          messageId: 'useInjectFunction',
          type: 'Program',
        },
      ],
    },
  ],
});