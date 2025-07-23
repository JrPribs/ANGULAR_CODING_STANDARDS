/**
 * @fileoverview Tests for no-promise-in-observable rule
 */
'use strict';

const rule = require('../../../lib/rules/no-promise-in-observable');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('no-promise-in-observable', rule, {
  valid: [
    // Direct async/await usage
    {
      code: `
        async function loadUser(id: string) {
          const user = await getDoc(doc(db, 'users', id));
          return user.data();
        }
      `
    },
    // Returning Promise directly
    {
      code: `
        function saveUser(user: User) {
          return setDoc(doc(db, 'users', user.id), user);
        }
      `
    },
    // Using observables for actual streams
    {
      code: `
        function getUserUpdates() {
          return interval(1000).pipe(
            switchMap(() => this.loadData())
          );
        }
      `
    },
    // from() with non-Promise values
    {
      code: `
        const numbers$ = from([1, 2, 3, 4, 5]);
        const iterable$ = from(myIterable);
      `
    },
    // Observable without Promise operations
    {
      code: `
        new Observable(observer => {
          observer.next(value);
          observer.complete();
        })
      `
    }
  ],

  invalid: [
    // from() with Promise
    {
      code: `
        const user$ = from(getDoc(doc(db, 'users', id)));
      `,
      errors: [{
        messageId: 'avoidFromPromise'
      }]
    },
    // from() with fetch
    {
      code: `
        const data$ = from(fetch('/api/users'));
      `,
      errors: [{
        messageId: 'avoidFromPromise'
      }]
    },
    // from() with Firebase auth
    {
      code: `
        const auth$ = from(signInWithEmailAndPassword(auth, email, password));
      `,
      errors: [{
        messageId: 'avoidFromPromise'
      }]
    },
    // from() with Promise.resolve
    {
      code: `
        const value$ = from(Promise.resolve(42));
      `,
      errors: [{
        messageId: 'noPromiseInObservable'
      }]
    },
    // from() with Promise.all
    {
      code: `
        const results$ = from(Promise.all([promise1, promise2]));
      `,
      errors: [{
        messageId: 'noPromiseInObservable'
      }]
    },
    // New Observable with async/await inside
    {
      code: `
        const user$ = new Observable(async (observer) => {
          const user = await getDoc(doc(db, 'users', id));
          observer.next(user.data());
          observer.complete();
        });
      `,
      errors: [{
        messageId: 'avoidObservableWrapper'
      }]
    },
    // New Observable with .then()
    {
      code: `
        const data$ = new Observable(observer => {
          fetch('/api/data').then(response => {
            observer.next(response);
            observer.complete();
          });
        });
      `,
      errors: [{
        messageId: 'avoidObservableWrapper'
      }]
    },
    // Method returning from() with Promise
    {
      code: `
        loadUser(id: string) {
          return from(this.getUserData(id));
        }
      `,
      errors: [{
        messageId: 'avoidFromPromise'
      }]
    },
    // Complex example with multiple issues
    {
      code: `
        getUserWithPosts(id: string) {
          return from(Promise.all([
            this.getUser(id),
            this.getUserPosts(id)
          ]));
        }
      `,
      errors: [{
        messageId: 'noPromiseInObservable'
      }]
    },
    // from() with async method call
    {
      code: `
        const result$ = from(this.saveData(data));
      `,
      errors: [{
        messageId: 'avoidFromPromise'
      }]
    }
  ]
});