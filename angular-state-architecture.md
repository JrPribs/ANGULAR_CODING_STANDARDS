# Angular State Architecture and Data Flow

> This document provides detailed architectural guidance for state management. For quick reference, see the [Angular Cheat Sheet](./angular-cheat-sheet.md). For implementation rules, see [Angular Coding Standards](./angular_coding_standards.md).

## Overview

This document outlines our application's state management architecture and the recommended data flow patterns. Following these patterns ensures consistent, maintainable, and predictable state management across the application.

## Architecture Layers

Our application state architecture consists of three primary layers:

1. **Global State Layer** - Central, shared application state
2. **Service Layer** - Business logic and state mutation
3. **Component Layer** - UI components with local state

## Data Flow Pattern

[CS-S01] Our application follows a bi-directional data flow pattern:

```
                    READ (Direct)
           ┌─────────────────────────┐
           │                         │
           ▼                         │
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│    Components     │     │   Global State    │
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

[CS-S02] Components read data directly from the Global State Layer via Store Signals:

1. Global store signals expose reactive state to components
2. Components subscribe to relevant store signals
3. Components can derive local computed signals from store signals
4. UI automatically updates when signal values change

### Write Operations (Component to State)

[CS-S03] Components write data to the Global State through Services:

1. Component dispatches an action by calling a service method
2. Service performs business logic and validation
3. Service updates the global state
4. State changes propagate back to components via signals

## Responsibilities by Layer

### Global State Layer

**Store:**
- Maintains the single source of truth for application state
- Holds structured data models  
- Provides methods for state mutations [CS-S03]

**Store Signals:**
- Exposes reactive state via signals [CS-S02]
- Provides derived/computed state
- Enables fine-grained reactivity

### Service Layer

**Services:**
- Implement most domain business logic [CS-V03]
- Handle data fetching and API communication [CS-S05]
- Process and validate data before state updates
- Orchestrate complex workflows
- Manage side effects (e.g., logging, analytics)
- Update global state [CS-S03]

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

## Best Practices

1. **Minimize component state** - Only use local state for UI-specific concerns
2. **Keep components pure** - Focus on presentation, delegate logic to services
3. **Services should be stateless** - They orchestrate but don't store state [CS-V04]
4. **Global state should be normalized** - Avoid duplication and nested state
5. **Use computed signals** - Derive values rather than storing calculated results [CS-S02]
6. **Lazy-load state modules** - Only load state relevant to the current route
7. **Dispatch one action per user intent** - Services should orchestrate complex workflows

## Anti-patterns to Avoid

1. ❌ Components mutating store directly (bypass services) [violates CS-S03]
2. ❌ Components containing business logic
3. ❌ Services with their own state
4. ❌ Duplicating store data in component state
5. ❌ Deep nesting in global state
6. ❌ Storing derived data that could be computed

## Example Flow

```typescript
// Component reading from store
@Component({...})
export class ProductListComponent {
  // Read directly from store signals
  products = inject(ProductStore).products;
  
  // Local computed signal
  filteredProducts = computed(() => 
    this.products().filter(p => p.inStock)
  );
  
  // Write through service
  constructor(private productService: ProductService) {}
  
  addToCart(productId: string): void {
    this.productService.addProductToCart(productId);
  }
}
```

By following this architecture and data flow pattern, we create a scalable, maintainable application with clear separation of concerns and predictable state management.
