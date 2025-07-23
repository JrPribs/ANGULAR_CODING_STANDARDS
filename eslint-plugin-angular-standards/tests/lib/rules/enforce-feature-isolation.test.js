/**
 * @fileoverview Tests for enforce-feature-isolation rule
 */
'use strict';

const rule = require('../../../lib/rules/enforce-feature-isolation');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('enforce-feature-isolation', rule, {
  valid: [
    // Importing from same feature
    {
      filename: 'src/app/users/components/user-list.component.ts',
      code: `
        import { UserService } from '../services/user.service';
        import { User } from '../models/user.model';
      `
    },
    // Importing from shared
    {
      filename: 'src/app/users/components/user-list.component.ts',
      code: `
        import { CommonService } from '@shared/services/common.service';
        import { SharedComponent } from '@shared/components/shared.component';
      `
    },
    // Importing external packages
    {
      filename: 'src/app/products/services/product.service.ts',
      code: `
        import { Injectable } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        import * as lodash from 'lodash';
      `
    },
    // Files outside features can import from anywhere
    {
      filename: 'src/app/app.config.ts',
      code: `
        import { UserService } from './users/services/user.service';
        import { ProductService } from './products/services/product.service';
      `
    },
    // Importing utilities from shared (not architectural imports)
    {
      filename: 'src/app/users/components/user-list.component.ts',
      code: `
        import { formatDate } from '@shared/utils/date.utils';
        import { CONSTANTS } from '@shared/constants';
      `
    }
  ],

  invalid: [
    // Cross-feature import
    {
      filename: 'src/app/users/components/user-list.component.ts',
      code: `
        import { ProductService } from '../../products/services/product.service';
      `,
      errors: [{
        messageId: 'crossFeatureImport',
        data: {
          currentFeature: 'users',
          importedFeature: 'products'
        }
      }]
    },
    // Cross-feature import with absolute path
    {
      filename: 'src/app/orders/services/order.service.ts',
      code: `
        import { User } from '@/app/users/models/user.model';
      `,
      errors: [{
        messageId: 'crossFeatureImport',
        data: {
          currentFeature: 'orders',
          importedFeature: 'users'
        }
      }]
    },
    // Importing service from shared (should be in feature)
    {
      filename: 'src/app/users/components/user-list.component.ts',
      code: `
        import { UserService } from '@shared/services/user.service';
      `,
      errors: [{
        messageId: 'importFromShared',
        data: {
          feature: 'users',
          service: 'user'
        }
      }]
    },
    // Importing model from shared
    {
      filename: 'src/app/products/services/product.service.ts',
      code: `
        import { Product } from '../../shared/models/product.model';
      `,
      errors: [{
        messageId: 'importFromShared',
        data: {
          feature: 'products',
          service: 'product'
        }
      }]
    },
    // Importing guard from shared
    {
      filename: 'src/app/admin/components/admin-panel.component.ts',
      code: `
        import { AdminGuard } from '@shared/guards/admin.guard';
      `,
      errors: [{
        messageId: 'importFromShared',
        data: {
          feature: 'admin',
          service: 'admin'
        }
      }]
    },
    // Warning about potential shared overuse
    {
      filename: 'src/app/users/components/user-profile.component.ts',
      code: `
        import { ProfileStore } from '@shared/stores/profile.store';
      `,
      errors: [{
        messageId: 'importFromShared',
        data: {
          feature: 'users',
          service: 'profile'
        }
      }]
    },
    // Multiple violations
    {
      filename: 'src/app/dashboard/components/dashboard.component.ts',
      code: `
        import { UserService } from '../../users/services/user.service';
        import { ProductService } from '@/app/products/services/product.service';
        import { DashboardService } from '@shared/services/dashboard.service';
      `,
      errors: [
        {
          messageId: 'crossFeatureImport',
          data: {
            currentFeature: 'dashboard',
            importedFeature: 'users'
          }
        },
        {
          messageId: 'crossFeatureImport',
          data: {
            currentFeature: 'dashboard',
            importedFeature: 'products'
          }
        },
        {
          messageId: 'importFromShared',
          data: {
            feature: 'dashboard',
            service: 'dashboard'
          }
        }
      ]
    }
  ]
});