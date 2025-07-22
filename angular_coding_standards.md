# Angular Coding Standards

## 📚 Law Code Quick Index

**Router (CS-R)**: R01-R04 | **Components (CS-C)**: C01-C05 | **Templates (CS-T)**: T01-T04  
**State (CS-S)**: S01-S05 | **Services (CS-V)**: V01-V04 | **Async (CS-A)**: A01-A04  
**Files (CS-F)**: F01-F05 | **Testing (CS-X)**: X01-X04 | **Quality (CS-Q)**: Q01-Q04

> Use Ctrl+F to search for any law code (e.g., "CS-R01") to jump directly to the rule.

---

## 🎯 Core Foundation: Router-First Architecture

### Application Setup (CRITICAL)
```typescript
// main.ts - ALWAYS configure this way
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, 
      withComponentInputBinding() // [CS-R01] REQUIRED - enables automatic input binding
    ),
    // other providers...
  ]
});
```

### Routing Strategy
- **Route Everything**: Every major view should be a route
- **Resolver Pattern**: [CS-R03] All data loading happens in resolvers, NOT in components
- **Auto-Binding**: [CS-R04] Resolver data automatically populates component inputs


### Route + Resolver + Component Pattern
```typescript
// 1. Define the route with functional resolver
{
  path: 'user/:id',
  component: UserProfileComponent,
  resolve: {
    user: userResolver,
    posts: userPostsResolver
  }
}

// 2. [CS-R02] Functional resolver fetches data
export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  return userService.getById(route.params['id']);
};

export const userPostsResolver: ResolveFn<Post[]> = (route) => {
  const postsService = inject(PostsService);
  return postsService.getByUserId(route.params['id']);
};

// 3. Component receives data via inputs (automatic)
@Component({
  standalone: true,
  selector: 'app-user-profile',
  template: `
    <h1>{{ user().name }}</h1>
    <div>{{ user().email }}</div>
  `
})
export class UserProfileComponent {
  user = input.required<User>();    // Populated by userResolver
  posts = input.required<Post[]>(); // Populated by userPostsResolver
}
```

---

## 📦 Component Design

### Single Responsibility
- Each component does ONE thing well
- [CS-C03] File size: Keep under ~300 lines each (TS/HTML/SCSS)
- Descriptive naming: `UserProfileComponent`, `ProductCardComponent`

### Smart File Separation
- [CS-C04] **Separate files by default**: `.ts`, `.html`, `.scss` files
- **Use inline templates**: ONLY when HTML is 3 lines or less (e.g., just `<ng-content>`)
- **Use inline styles**: ONLY when styles are 3 lines or less
- **Skip SCSS files**: When there's no styling needed
- **Be pragmatic**: Don't create empty or near-empty files

```typescript
// ✅ Inline template for simple content (3 lines or less)
@Component({
  standalone: true,  // [CS-C01] Always standalone
  selector: 'app-wrapper',
  template: `<ng-content></ng-content>`
})
export class WrapperComponent {}

// ❌ WRONG - More than 3 lines should use separate files
@Component({
  standalone: true,
  selector: 'app-card',
  template: `
    <div class="card">
      <h2>{{ title() }}</h2>
      <p>{{ description() }}</p>
      <button (click)="onClick()">Click me</button>
    </div>
  `
})
export class WrongCardComponent {}

// ✅ CORRECT - Separate files for substantial content
@Component({
  standalone: true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {}
```

### Signal Inputs Only
```typescript
@Component({
  standalone: true,
  selector: 'app-product-card',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush  // [CS-C05] Always use OnPush
})
export class ProductCardComponent {
  product = input.required<Product>();  // [CS-C02] Signal inputs only
  featured = input<boolean>(false);     // [CS-C02] Signal inputs only
}
```

---

## 🔄 Control Flow & Templates

### Modern Syntax Only
```html
// ✅ ALWAYS use new control flow
  @if (user()) {                        // [CS-T01] Use @if, @for, @switch only
    <h1>Welcome {{ user.name }}!</h1>
  }

  @for (item of items; track item.id) { // [CS-T01] + [CS-T03] Always specify track
    <app-item-card [item]="item" />
  } @empty {
    <p>No items found</p>
  }
  
// ❌ [CS-T02] NEVER use old structural directives
// *ngIf, *ngFor, *ngSwitch are forbidden
```

### Template Logic Rules
- [CS-T04] Keep templates simple and declarative
- Complex logic belongs in component class or services
- Use computed properties for derived data

---

## 📥 State Management

<!-- [CS-S01] One-way data flow: Component → Service → Store → Component -->

### Signal Stores (Use Sparingly)
- **Only when needed**: For shared state across components/features
- **Keep it simple**: Data mutation methods only
- [CS-S05] **No HTTP calls**: Services handle data fetching
- [CS-S04] **Use @ngrx/signals**: Use the signalStore from @ngrx/signals package

```typescript
import { computed, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';

type UserState = {
  currentUser: User | null;
  preferences: UserPreferences | null;
};

@Injectable({ providedIn: 'root' })
export class UserStore extends signalStore(
  {
    protectedState: false,
    providedIn: 'root'
  },
  withState<UserState>({
    currentUser: null,
    preferences: null
  })
) {
  
  // [CS-S02] Computed signals for derived state - read state via store signals
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly displayName = computed(() => this.currentUser()?.name ?? 'Guest');
  
  // [CS-S03] Simple mutation methods only
  setCurrentUser(user: User | null) {
    patchState(this, { currentUser: user });
  }
  
  setPreferences(preferences: UserPreferences) {
    patchState(this, { preferences });
  }
  
  clearState() {
    patchState(this, { currentUser: null, preferences: null });
  }
}
```

### When NOT to Use Stores
- Component-specific state (use component signals)
- Data that doesn't need sharing
- Temporary UI state
- Form state

---

## 🔧 Services Architecture

### Service Responsibilities
```typescript
// Data Layer
@Injectable({ providedIn: 'root' })  // [CS-V01] Always use providedIn: 'root'
export class UserDataService {
  // [CS-V04] Firebase/API interactions only - services handle HTTP, stores handle state
}

// Business Logic Layer  
@Injectable({ providedIn: 'root' })  // [CS-V01] Always use providedIn: 'root'
export class UserService {
  // [CS-V03] Business rules, validation, coordination - separate data/business/UI services
}

// UI Helper Layer
@Injectable({ providedIn: 'root' })  // [CS-V01] Always use providedIn: 'root'
export class UserUIService {
  // [CS-V03] Formatting, display logic, UI state - separate data/business/UI services
}
```

### Naming Convention
- End with `Service`: `UserAuthService`, `ProductService`
- Descriptive and specific: `EmailNotificationService` not `NotificationService`

---

## 🔄 Async Patterns: Async/Await First

### Core Principle: Use Async/Await for One-Time Operations
- [CS-A01] **ALWAYS use async/await** for HTTP requests, Firebase operations, and one-time async operations
- [CS-A02] **ONLY use RxJS Observables** for actual event streams (auth state changes, real-time updates, user input)
- [CS-A03] **NEVER wrap Promises in Observables** - use Promises/async-await directly
- [CS-A04] **Update state directly** in try/catch blocks, not in RxJS operators (no `tap` for side effects)

### Data Service Pattern (Async/Await)
```typescript
@Injectable({ providedIn: 'root' })
export class BookDataService {
  private db = inject(Firestore);  // [CS-V02] Use inject() function
  
  // ✅ GOOD - Returns Promise directly
  async getBook(id: string): Promise<Book> {
    const docRef = doc(this.db, 'books', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error('Book not found');
    }
    return { id: snapshot.id, ...snapshot.data() } as Book;
  }
  
  // ✅ GOOD - Returns Promise for array
  async getBooks(): Promise<Book[]> {
    const q = query(collection(this.db, 'books'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
  }
  
  // ❌ WRONG - Don't wrap in Observable
  getBookWrong(id: string): Observable<Book> {
    return from(this.getBook(id));
  }
}
```

### Business Service Pattern (Async/Await)
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  private router = inject(Router);
  
  // ✅ GOOD - Async/await with direct state updates
  async loginWithGoogle(): Promise<void> {
    try {
      // Show loading state
      this.authStore.setLoading(true);
      
      // Perform auth
      const userCredential = await signInWithPopup(this.auth, this.googleProvider);
      const user = await this.getUserWithClaims(userCredential.user);
      
      // Verify admin
      if (!user.customClaims?.admin) {
        await signOut(this.auth);
        throw new Error('Admin access required');
      }
      
      // Update state directly
      this.authStore.setCurrentUser(user);
      
      // Navigate
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.authStore.setError(error.message);
      throw error;
    } finally {
      this.authStore.setLoading(false);
    }
  }
  
  // ❌ WRONG - Using RxJS for one-time operations
  loginWithGoogleWrong(): Observable<User> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      switchMap(cred => from(this.getUserWithClaims(cred.user))),
      tap(user => this.authStore.setCurrentUser(user)), // Side effects in tap
      tap(() => this.router.navigate(['/dashboard']))
    );
  }
}
```

### Component Pattern (Async/Await)
```typescript
@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <button (click)="signIn()" [disabled]="isLoading()">
      Sign In with Google
    </button>
    @if (error()) {
      <p class="error">{{ error() }}</p>
    }
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // ✅ GOOD - Async method with try/catch
  async signIn(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.authService.loginWithGoogle();
      // Navigation handled by service
    } catch (error) {
      this.error.set(error.message);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  // ❌ WRONG - Using subscribe for one-time operation
  signInWrong(): void {
    this.authService.loginWithGoogleWrong().subscribe({
      next: () => { /* ... */ },
      error: (err) => { /* ... */ }
    });
  }
}
```

### When to Use RxJS Observables
```typescript
@Injectable({ providedIn: 'root' })
export class AuthDataService {
  // ✅ GOOD - Using Angular Fire's built-in observables
  getCurrentUser(): Observable<User | null> {
    return user(this.auth); // Returns Firebase Auth observable
  }
  
  // ✅ GOOD - Using Firestore's observable streams
  watchDocument(path: string): Observable<DocumentData | undefined> {
    return docData(doc(this.db, path)); // Returns Firestore observable
  }
  
  // ✅ GOOD - Using HTTP client observables (if using HttpClient)
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`/api/users/search?q=${query}`);
  }
}

// ✅ GOOD - Using observables for form value changes
export class SearchComponent {
  searchControl = new FormControl('');
  
  ngOnInit() {
    // Form value changes are an event stream
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => this.search(value));
  }
}
```

### Summary
- **HTTP/Firebase operations**: Always async/await
- **Event streams**: RxJS Observables (auth state, real-time data, form inputs)
- **State updates**: Direct updates in try/catch, never in RxJS operators
- **Error handling**: try/catch blocks for async/await
- **Loading states**: Set before try, clear in finally

---

## 📁 File Structure

### Feature-First Organization
- [CS-F01] **Feature names** as top-level folders under `src/app/` - feature folders contain ALL feature code
- **Pages**: Routed components (components that have routes)
- **Components**: Non-routed, reusable components within the feature
- [CS-F02] **Services/Models/Guards/Stores**: Keep within the feature folder, NOT in shared
- [CS-F03] **Shared folder**: ONLY for truly cross-cutting concerns used by 3+ unrelated features

```
src/app/
├── auth/                                   # Auth feature - contains ALL auth-related code
│   ├── pages/
│   │   └── login/
│   │       ├── login.component.ts
│   │       ├── login.component.html
│   │       └── login.component.scss
│   ├── services/
│   │   ├── auth.service.ts                # Business logic
│   │   └── auth-data.service.ts           # Firebase/API calls
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   └── user.model.ts
│   └── stores/
│       └── auth.store.ts
├── books/                                  # Books feature - contains ALL book-related code
│   ├── pages/
│   │   ├── books-list/
│   │   │   ├── books-list.component.ts
│   │   │   ├── books-list.component.html
│   │   │   ├── books-list.component.scss
│   │   │   └── resolvers/
│   │   │       └── books-list.resolver.ts
│   │   └── book-detail/
│   │       └── [component files...]
│   ├── components/
│   │   └── book-card/
│   │       └── [component files...]
│   ├── services/
│   │   ├── book.service.ts                # Business logic
│   │   └── book-data.service.ts           # Firebase/API calls
│   └── models/
│       └── book.model.ts
└── shared/                                 # ONLY truly cross-cutting concerns
    ├── components/
    │   └── layout/                         # Used by entire app
    │       └── layout.component.ts
    ├── services/
    │   └── file-upload.service.ts         # Used by multiple features
    └── utils/
        └── date-formatter.ts               # Generic utilities
```

### Folder Organization Rules
- **Feature-first principle**: Keep ALL feature-related code within the feature folder
  - Services (both business and data services)
  - Models/interfaces
  - Guards
  - Stores
  - Components
  - Pages
- **Shared folder minimization**: Only use shared for:
  - Layout components used by the entire app
  - Services used by 3+ unrelated features
  - Generic utilities (date formatters, validators, etc.)
  - Truly cross-cutting components (loading spinners, modals, etc.)
- **Always separate files**: `.ts`, `.html`, `.scss` files (except for templates/styles 3 lines or less)
- **6-7 files maximum** per folder
- [CS-F04] **Each component gets its own folder** with the three separate files
- [CS-F05] **Resolvers in resolvers/ subfolder** under the relevant page
- **Angular is modular at class level**: With standalone components, there's no need to share services/models

---

## 🧪 Testing Standards

### Required Tests
- [CS-X01] ALL TEST MUST BE BEHAVIORALLY DRIVEN; TESTING FUNCTION NOT IMPLEMENTATION
- [CS-X02] Every component should have unit tests 
- [CS-X03] Every service should have unit tests  
- Every resolver should have unit tests


### Testing Tools
- [CS-X04] **Vitest** and **Jasmine** for unit testing
- [CS-X04] **@ngneat/spectator** for component testing
- Focus on behavior, not implementation


### Behavior-Driven Testing
- Test what the component/service DOES, not HOW it does it
- Focus on inputs → outputs and user interactions
- Avoid testing internal implementation details

```typescript
describe('UserProfileComponent', () => {
  it('should display user name when user input is provided', () => {
    // Test behavior: given user input, component displays name
  });
  
  it('should show loading state when posts are being fetched', () => {
    // Test behavior: component responds to loading state
  });
});
```

---

## 🛠️ Code Quality

### TypeScript Configuration
- [CS-Q01] **Strict Mode**: Always enabled
- **Type Safety**: Avoid `any` unless absolutely necessary
- **Explicit Return Types**: On public methods

### Utility Functions - Prefer Lodash
- [CS-Q02] **Always prefer Lodash** for array/object operations when it provides cleaner syntax
- [CS-Q04] **Property shorthand**: Lodash's property shorthand is more readable than native methods
- [CS-Q03] **Import specific functions**: Use tree-shakeable imports

```typescript
import { filter, find, map, groupBy, sortBy, uniqBy } from 'lodash-es';

// ✅ GOOD - Lodash with property shorthand
const activeUsers = filter(users, { status: 'active' });
const adminUser = find(users, { role: 'admin' });
const publishedBooks = filter(books, { status: 'published' });
const usersByRole = groupBy(users, 'role');
const sortedByDate = sortBy(events, 'createdAt');
const uniqueByEmail = uniqBy(users, 'email');

// ❌ AVOID - Verbose native methods
const activeUsers = users.filter(u => u.status === 'active');
const adminUser = users.find(u => u.role === 'admin');
const publishedBooks = books.filter(b => b.status === 'published');

// ✅ GOOD - Lodash for complex operations
const processingPages = filter(this.pages(), { processingStatus: 'processing' });
const completedCount = filter(this.pages(), { processingStatus: 'completed' }).length;

// ✅ GOOD - Chain operations with Lodash
const activeAdminEmails = map(
  filter(users, { status: 'active', role: 'admin' }),
  'email'
);

// ❌ AVOID - Multiple chained native methods
const activeAdminEmails = users
  .filter(u => u.status === 'active' && u.role === 'admin')
  .map(u => u.email);
```

### When to Use Lodash
- **Property matching**: When filtering/finding by object properties
- **Deep operations**: For deep cloning, deep equality checks
- **Collection utilities**: groupBy, keyBy, partition, etc.
- **Type safety**: Lodash provides better type inference in many cases
- **Readability**: When Lodash syntax is cleaner than native

### When to Use Native Methods
- **Simple transformations**: When native methods are equally clean
- **Performance critical**: In tight loops where every ms counts
- **Single operations**: For simple map/filter with inline functions

### Linting & Formatting
- **ESLint**: Project-wide rules
- **Prettier**: Automatic formatting
- **Pre-commit hooks**: Ensure consistency

---

## 🧠 Philosophy

### Core Principles
1. **Router-First**: Everything should be routable and data should be resolved
2. **Simplicity**: Favor readability over cleverness
3. **Consistency**: Follow patterns religiously
4. **Separation**: Clear boundaries between data, logic, and presentation


### Decision Framework
- Does this improve developer experience?
- Does this maintain or improve performance?
- Is this pattern consistent with the rest of the codebase?
- Can this be easily understood by AI code generators?

---

## ⚡ Coding Guidelines

### For ALL Developers & Human & Agentic (Claude/Cursor)
1. **Always** set up component input binding in router configuration
2. **Always** use functional resolvers for data loading, never class-based resolvers
3. **Always** use resolvers for data loading, never load data in components
4. **Always** use new control flow syntax (`@if`, `@for`)
5. **Always** make components standalone
6. **Always** use signal inputs, never decorator inputs (`@Input`, `@Output`)
7. **Always** follow the resolver → input binding pattern
8. **Always** prefer Lodash for array/object operations when it provides cleaner syntax
9. **Never** use old structural directives (`*ngIf`, `*ngFor`)
10. **Never** load data directly in component lifecycle hooks
11. **Never** put HTTP calls in signal stores
12. **Only** use signal stores for shared state when actually needed

### Quick Reference

```typescript
// Functional Resolver
export const dataResolver: ResolveFn<Data> = (route) => {
  const service = inject(DataService);
  return service.getById(route.params['id']);
};

// Route Setup
{ path: 'feature/:id', component: FeatureComponent, resolve: { data: dataResolver } }

// Component with Signal Inputs
export class FeatureComponent {
  data = input.required<ResolvedData>(); // Auto-populated by resolver
}

// Template
@if (condition) { <div>Content</div> }
@for (item of items; track item.id) { <app-item [item]="item" /> }

// Signal Store (only when sharing state)
setData(data: Data) {
  this.state.update(state => ({ ...state, data }));
}

// Lodash for cleaner code
import { filter, find, map } from 'lodash-es';
const active = filter(items, { status: 'active' });
const admin = find(users, { role: 'admin' });
const names = map(users, 'name');
```
