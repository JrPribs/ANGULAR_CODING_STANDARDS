# eslint-plugin-angular-standards

ESLint plugin for enforcing Angular coding standards as defined in the Angular Coding Standards documentation.

## Installation

```bash
npm install --save-dev eslint-plugin-angular-standards
```

## Usage

Add `angular-standards` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["angular-standards"]
}
```

Then configure the rules you want to use:

```json
{
  "rules": {
    "angular-standards/enforce-injectable-provided-in-root": "error",
    "angular-standards/use-inject-function": "error",
    "angular-standards/enforce-standalone-components": "error",
    "angular-standards/no-promise-in-observable": "error",
    "angular-standards/enforce-feature-isolation": "error"
  }
}
```

Or use a preset configuration:

```json
{
  "extends": ["plugin:angular-standards/recommended"]
}
```

## Rules

### enforce-injectable-provided-in-root (CS-V01)
Ensures all Angular services use `providedIn: 'root'` in their `@Injectable` decorator.

✅ Good:
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {}
```

❌ Bad:
```typescript
@Injectable()
export class UserService {}
```

### use-inject-function (CS-V02)
Enforces the use of the `inject()` function instead of constructor dependency injection.

✅ Good:
```typescript
export class UserComponent {
  private userService = inject(UserService);
}
```

❌ Bad:
```typescript
export class UserComponent {
  constructor(private userService: UserService) {}
}
```

### enforce-standalone-components (CS-C01)
Ensures all components are standalone and prevents NgModule imports.

✅ Good:
```typescript
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule]
})
export class UserComponent {}
```

❌ Bad:
```typescript
@Component({
  selector: 'app-user'
})
export class UserComponent {}
```

### no-promise-in-observable (CS-A03)
Prevents wrapping Promises in Observables using `from()`.

✅ Good:
```typescript
async getUser(id: string): Promise<User> {
  return await this.fetchUser(id);
}
```

❌ Bad:
```typescript
getUser(id: string): Observable<User> {
  return from(this.fetchUser(id));
}
```

### enforce-feature-isolation (CS-F01/F02)
Ensures features don't import from other features and architectural elements stay within features.

✅ Good:
```typescript
// In src/app/users/services/user.service.ts
import { User } from '../models/user.model';
```

❌ Bad:
```typescript
// In src/app/users/services/user.service.ts
import { Product } from '../../products/models/product.model';
```

## Configuration

### Recommended
Enforces all rules as errors:

```json
{
  "extends": ["plugin:angular-standards/recommended"]
}
```

### Strict
Same as recommended (all rules as errors):

```json
{
  "extends": ["plugin:angular-standards/strict"]
}
```

### Warnings
All rules as warnings for gradual adoption:

```json
{
  "extends": ["plugin:angular-standards/warnings"]
}
```

## Options

### enforce-feature-isolation

```json
{
  "angular-standards/enforce-feature-isolation": ["error", {
    "featureRoot": "src/app",
    "sharedPaths": ["shared", "core", "common"]
  }]
}
```

- `featureRoot`: Root path where features are located (default: `"src/app"`)
- `sharedPaths`: Array of folder names considered as shared (default: `["shared", "core"]`)

## License

MIT