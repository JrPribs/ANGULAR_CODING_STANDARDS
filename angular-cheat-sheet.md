# Angular Quick Reference Cheat Sheet

## 🎯 Router-First Architecture

- **CS-R01**: Always configure `withComponentInputBinding()` in router → [§Router-First Architecture]
- **CS-R02**: Use functional resolvers, never class-based → [§Route + Resolver Pattern]
- **CS-R03**: Load ALL data in resolvers, not components → [§Routing Strategy]
- **CS-R04**: Resolver data auto-populates component inputs → [§Auto-Binding]

## 📦 Components

- **CS-C01**: Always standalone, never use NgModules → [§Component Design]
- **CS-C02**: Use signal inputs only: `input()`, `input.required()` → [§Signal Inputs Only]
- **CS-C03**: Keep components under ~300 lines per file → [§Single Responsibility]
- **CS-C04**: Separate files unless ≤3 lines → [§Smart File Separation]
- **CS-C05**: Always use `ChangeDetectionStrategy.OnPush` → [§Component Design]

## 🔄 Templates & Control Flow

- **CS-T01**: Use `@if`, `@for`, `@switch` only → [§Modern Syntax Only]
- **CS-T02**: NEVER use `*ngIf`, `*ngFor`, `*ngSwitch` → [§Modern Syntax Only]
- **CS-T03**: Always specify track function in `@for` → [§Control Flow]
- **CS-T04**: Keep templates simple, logic in component → [§Template Logic Rules]

## 📥 State Management

- **CS-S01**: One-way flow: Component → Service → Store → Component → [§State Architecture]
- **CS-S02**: Read state via store signals only → [§Read Operations]
- **CS-S03**: Update state via service methods only → [§Write Operations]
- **CS-S04**: Use @ngrx/signals for shared state → [§Signal Stores]
- **CS-S05**: No HTTP calls in stores → [§Signal Stores]
- **📊 Decision Guide**: Where does X belong? → [State Architecture: Decision Guidelines]
- **⚠️ Anti-patterns**: What NOT to do → [State Architecture: Anti-patterns]

## 🔧 Services

- **CS-V01**: Always `@Injectable({ providedIn: 'root' })` → [§Services Architecture]
- **CS-V02**: Use `inject()` function, not constructor → [§Services]
- **CS-V03**: Separate data/business/UI services → [§Service Responsibilities]
- **CS-V04**: Services handle HTTP, stores handle state → [§Service Responsibilities]

## 🔄 Async Patterns

- **CS-A01**: Use async/await for one-time operations → [§Async/Await First]
- **CS-A02**: Use RxJS only for event streams → [§When to Use RxJS]
- **CS-A03**: Never wrap Promises in Observables → [§Core Principle]
- **CS-A04**: Update state in try/catch, not RxJS operators → [§Business Service Pattern]

## 📁 File Organization

- **CS-F01**: Feature folders contain ALL feature code → [§Feature-First Organization]
- **CS-F02**: Keep services/models/guards in feature folder → [§Folder Organization Rules]
- **CS-F03**: Shared folder only for 3+ feature usage → [§Feature-First Organization]
- **CS-F04**: Each component gets its own folder → [§File Structure]
- **CS-F05**: Resolvers in `resolvers/` subfolder → [§File Structure]

## 🧪 Testing

- **CS-X01**: Test behavior, not implementation → [§Behavior-Driven Testing]
- **CS-X02**: All components need unit tests → [§Required Tests]
- **CS-X03**: All services need unit tests → [§Required Tests]
- **CS-X04**: Use Vitest/Jasmine + @ngneat/spectator → [§Testing Tools]

## 🛠️ Code Quality

- **CS-Q01**: Always use TypeScript strict mode → [§TypeScript Configuration]
- **CS-Q02**: Prefer Lodash for array/object operations → [§Utility Functions]
- **CS-Q03**: Import specific Lodash functions → [§Utility Functions]
- **CS-Q04**: Use property shorthand with Lodash → [§When to Use Lodash]

---

## Quick Code Templates

### Component with Resolver
```typescript
// Route
{ path: 'item/:id', component: ItemComponent, resolve: { item: itemResolver } }

// Resolver
export const itemResolver: ResolveFn<Item> = (route) => {
  const service = inject(ItemService);
  return service.getById(route.params['id']);
};

// Component
export class ItemComponent {
  item = input.required<Item>(); // Auto-populated!
}
```

### State Update Pattern
```typescript
// Component
private itemService = inject(ItemService);
selectItem(id: string) {
  this.itemService.setCurrentItem(id);
}

// Service
private itemStore = inject(ItemStore);
setCurrentItem(id: string) {
  const item = this.itemStore.items().find(i => i.id === id);
  patchState(this.itemStore, { currentItem: item });
}
```

### Async/Await Pattern
```typescript
async loadData(): Promise<void> {
  try {
    this.loading.set(true);
    const data = await this.dataService.fetchData();
    this.store.setData(data);
  } catch (error) {
    this.error.set(error.message);
  } finally {
    this.loading.set(false);
  }
}
```

---

**Note**: [§Section] references link to detailed explanations in `angular-coding-standards.md`