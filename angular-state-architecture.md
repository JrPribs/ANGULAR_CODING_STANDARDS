# Angular State Architecture and Data Flow

> This document provides detailed architectural guidance for state management. For quick reference, see the [Angular Cheat Sheet](./angular-cheat-sheet.md). For implementation rules, see [Angular Coding Standards](./angular_coding_standards.md).

## Overview

This document outlines our application's state management architecture and the recommended data flow patterns. Following these patterns ensures consistent, maintainable, and predictable state management across the application.

## Guiding Principles

1. **Simplicity First** - Always prioritize simple, maintainable solutions over complex architectural patterns. The best code is code that doesn't need to exist.

2. **Use State Stores Only When Necessary** - NGRX signal stores should only be used for state that is actually shared between multiple components or pages. Don't create stores "just in case" - start with local component state and elevate only when sharing is needed.

3. **Keep Signal Stores Simple** - When using @ngrx/signals, stick to basic features: state and computed signals. Avoid advanced features like effects, hooks, and methods unless there's a clear, compelling need.

4. **Be Pragmatic** - Sometimes breaking patterns is the right choice for maintainability. Don't force architectural patterns when a simpler solution would be clearer and easier to maintain.

5. **Match State Scope to Usage** - State can be shared at different levels (component, feature, application). Choose the narrowest scope that meets your needs.

## Architecture Layers

Our application state architecture consists of three primary layers:

1. **Shared State Layer** - State shared between multiple components (can be feature-level or application-level)
2. **Service Layer** - Business logic and state mutation
3. **Component Layer** - UI components with local state

## State Scope Hierarchy

State in Angular applications exists at three distinct scope levels, each serving different purposes:

### 1. Component State (Narrowest Scope)
- **What**: State used by a single component
- **When**: UI state, form data, temporary values
- **How**: Local signals, component properties
- **Example**: Modal open/closed, form inputs, loading states

### 2. Feature State (Medium Scope)
- **What**: State shared within a single feature module
- **When**: Data used by multiple components in the same feature
- **How**: Signal store provided at feature level
- **Example**: Current user profile in a user feature, shopping cart in e-commerce feature

### 3. Application State (Widest Scope)
- **What**: State shared across multiple features
- **When**: Data needed by unrelated parts of the application
- **How**: Signal store provided at root level
- **Example**: Authentication state, user preferences, app configuration

**Key Principle**: Always use the narrowest scope that meets your needs. Start with component state and only elevate when sharing is required.

## Data Flow Pattern

[CS-S01] Our application follows a unidirectional (one-way) data flow pattern:

```
                    READ (Direct)
           ┌─────────────────────────┐
           │                         │
           ▼                         │
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│    Components     │     │   Shared State    │
│    (Consumers)    │     │    (Storage)      │
│                   │     │                   │
└───────────────────┘     └───────────────────┘
           │                         ▲
           ▼                         │
┌───────────────────┐                │
│                   │                │
│     Services      │────────────────┘
│                   │
└───────────────────┘        
  Services handle:
  - Business Logic
  - API Calls
  - Validation
  - State Updates

```

### Read Operations (State to Component)

[CS-S02] Components read data directly from the Shared State Layer via Store Signals:

1. Global store signals expose reactive state to components
2. Components subscribe to relevant store signals
3. Components can derive local computed signals from store signals
4. UI automatically updates when signal values change

### Write Operations (Component to State)

[CS-S03] Components write data to the Shared State through Services:

1. Component dispatches an action by calling a service method
2. Service performs business logic and validation
3. Service updates the shared state
4. State changes propagate back to components via signals

## Responsibilities by Layer

### Shared State Layer

**Store (using @ngrx/signals):**
- Maintains the single source of truth for shared state (feature or application level)
- Holds structured data models  
- Provides simple methods for state mutations [CS-S03]
- **Keep it simple**: Use only basic signalStore features (state, computed)
- **Avoid unless necessary**: Don't use effects, hooks, or complex methods

**Store Signals:**
- Exposes reactive state via signals [CS-S02]
- Provides derived/computed state
- Enables fine-grained reactivity

**Important**: Stores can be provided at different levels:
- **Feature-level**: Provided in a feature's routes configuration (shared within feature)
- **Application-level**: Provided at root (shared across features)

### Service Layer

**Services:**
- Implement most domain business logic [CS-V03]
- Handle data fetching and API communication [CS-S05]
- Process and validate data before state updates
- Orchestrate complex workflows
- Manage side effects (e.g., logging, analytics)
- Update shared state [CS-S03]

### Component Layer

**Components:**
- Consume store signals for display
- Create local computed signals for component-specific derived state
- Dispatch actions through service methods
- Maintain minimal local state for UI-only concerns
- Handle user interactions
- Focus on presentation logic

## Decision Guidelines

| Concern | Location | Justification |
|---------|----------|---------------|
| Application data | Store | Centralized, shared across components |
| Business logic | Services | Reusable, testable, independent of UI |
| API communication | Services | Encapsulates external dependencies |
| Data transformations | Services & Store Signals | Services for write path, Store Signals for read path |
| Form state | Component local state | Temporary UI state until submission |
| UI state (expanded/collapsed) | Component local state | UI-specific concerns |
| Derived data calculations | Store Signals or Component signals | Global derivations in Store Signals, component-specific in local signals |
| Validations | Services (for business rules), Components (for UI validation) | Business validations in services, immediate feedback in components |

## When to Use Shared State vs Local State

### Use Local Component State When:
- Data is only used by a single component
- State represents UI-only concerns (dropdown open, hover state)
- Data is temporary (form inputs before submission)
- State doesn't need to survive component destruction
- You're building a prototype or MVP (start simple!)

### Use Feature-Level Shared State When:
- Multiple components within the same feature need the data
- State needs to persist across route changes within the feature
- Components need to react to changes made by sibling components
- The feature has complex state interactions but is self-contained

### Use Application-Level Shared State When:
- Data is needed across multiple unrelated features
- State must persist throughout the entire application lifetime
- Multiple features need to react to the same state changes
- Examples: authentication, user preferences, global notifications

### Red Flags (When You're Over-Engineering):
- Creating a store for data used by only one component
- Using shared state for simple parent-child communication
- Creating separate stores for every entity type
- Adding effects/hooks when simple service methods would suffice

## Best Practices

1. **Start with local state, elevate only when needed** - Don't create shared state preemptively
2. **Keep signal stores simple** - Just state and computed signals, avoid effects/hooks unless essential
3. **Choose simplicity over architectural purity** - A straightforward solution beats a "perfect" pattern
4. **Match state scope to actual usage** - Don't make all state application-wide by default
5. **Minimize component state** - Only use local state for UI-specific concerns
6. **Keep components pure** - Focus on presentation, delegate logic to services
7. **Services should be stateless** - They orchestrate but don't store state [CS-V04]
8. **Shared state should be normalized** - Avoid duplication and nested state
9. **Use computed signals** - Derive values rather than storing calculated results [CS-S02]
10. **Lazy-load state modules** - Only load state relevant to the current route
11. **Dispatch one action per user intent** - Services should orchestrate complex workflows
12. **Question every abstraction** - Each layer of abstraction should earn its complexity

## Anti-patterns to Avoid

1. ❌ Components mutating store directly (bypass services) [violates CS-S03]
2. ❌ Components containing business logic
3. ❌ Services with their own state
4. ❌ Duplicating store data in component state
5. ❌ Deep nesting in shared state
6. ❌ Storing derived data that could be computed

## Pragmatic Exceptions

Sometimes breaking the established patterns is the right choice. Here are scenarios where pragmatism should override architectural purity:

### When to Break the Rules:

1. **Simple Parent-Child Communication**
   - If a parent just needs to pass data to a child, use `@Input()`
   - Don't create a store just to avoid prop drilling through 2-3 levels

2. **Temporary UI State**
   - Loading spinners, error messages, form validation can live in components
   - If it doesn't need to survive navigation, keep it local

3. **Prototyping and MVPs**
   - Start with the simplest approach that works
   - Refactor to proper patterns when complexity demands it

4. **Performance Critical Paths**
   - Sometimes direct updates perform better than going through layers
   - Document why you're breaking the pattern

5. **Third-Party Integration**
   - External libraries may force different patterns
   - Wrap them in a service but don't over-abstract

### How to Document Exceptions:

When you break a pattern, always:
- Add a comment explaining WHY
- Reference this document's pragmatic exceptions
- Consider if the pattern itself needs updating

Remember: **The goal is maintainable, understandable code, not architectural perfection.**

## Example Flow

### Example 1: Feature-Level State (Shopping Cart)

```typescript
// Feature-level store (provided in shopping feature routes)
export const CartStore = signalStore(
  { providedIn: 'root' }, // Can be scoped to feature
  withState({
    items: [] as CartItem[],
    isLoading: false
  }),
  withComputed((store) => ({
    totalPrice: computed(() => 
      store.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
    ),
    itemCount: computed(() => 
      store.items().reduce((sum, item) => sum + item.quantity, 0)
    )
  }))
);

// Component using feature store
@Component({...})
export class CartSummaryComponent {
  private cartStore = inject(CartStore);
  private cartService = inject(CartService);
  
  // Read from store signals
  itemCount = this.cartStore.itemCount;
  totalPrice = this.cartStore.totalPrice;
  
  // Write through service
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }
}
```

### Example 2: Application-Level State (Authentication)

```typescript
// Application-level store (provided at root)
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({
    user: null as User | null,
    isAuthenticated: false
  }),
  withComputed((store) => ({
    isAdmin: computed(() => store.user()?.role === 'admin')
  }))
);

// Service handling authentication logic
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  
  async login(credentials: LoginCredentials): Promise<void> {
    const user = await this.api.authenticate(credentials);
    patchState(this.authStore, {
      user,
      isAuthenticated: true
    });
  }
  
  logout(): void {
    patchState(this.authStore, {
      user: null,
      isAuthenticated: false
    });
  }
}
```

### Example 3: Component-Level State (No Store Needed)

```typescript
@Component({...})
export class UserFormComponent {
  // Local state - no store needed!
  formData = signal<UserFormData>({ name: '', email: '' });
  isSubmitting = signal(false);
  errors = signal<string[]>([]);
  
  private userService = inject(UserService);
  
  async submitForm(): Promise<void> {
    this.isSubmitting.set(true);
    this.errors.set([]);
    
    try {
      // Service handles the business logic
      await this.userService.createUser(this.formData());
      // Navigate or show success
    } catch (error) {
      this.errors.set(['Failed to create user']);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
```

By following this architecture and choosing the appropriate state scope, we create a scalable, maintainable application with clear separation of concerns and predictable state management.
