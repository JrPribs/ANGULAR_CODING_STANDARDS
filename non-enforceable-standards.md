# Non-Enforceable Angular Standards

This document lists Angular coding standards from the style guide that cannot be automatically enforced through ESLint rules. These standards require human judgment, context awareness, or architectural decisions that static analysis cannot determine.

## 🎨 Subjective Code Quality Standards

### CS-Q02: Prefer Lodash for array/object operations
- **Why not enforceable**: "Cleaner syntax" is subjective and context-dependent
- **Human judgment needed**: Developers must evaluate readability case-by-case
- **Example scenarios**:
  ```typescript
  // Sometimes Lodash is clearer
  const active = filter(users, { status: 'active' });
  
  // Sometimes native is just as clear
  const doubled = numbers.map(n => n * 2);
  ```

### CS-Q04: Use property shorthand with Lodash
- **Why not enforceable**: Readability preferences vary by team and context
- **Human judgment needed**: Balance between consistency and clarity

## 📁 File System Organization

### CS-F03: Shared folder only for 3+ feature usage
- **Why not enforceable**: Requires analyzing entire codebase to count usage
- **Human judgment needed**: 
  - Anticipate future usage patterns
  - Consider logical grouping beyond usage count
  - Evaluate true "cross-cutting" nature

### CS-F04: Each component gets its own folder
- **Why not enforceable**: ESLint operates on file content, not file system
- **Human judgment needed**: Organize based on component complexity

### CS-F05: Resolvers in resolvers/ subfolder
- **Why not enforceable**: File system structure validation beyond ESLint scope
- **Human judgment needed**: Maintain consistent project structure

## 🏗️ Architectural Decisions

### CS-R03: Load ALL data in resolvers, not components
- **Why partially enforceable**: Can detect HTTP calls in components, but not all data loading patterns
- **Human judgment needed**:
  - Determine what constitutes "data loading"
  - Handle edge cases (lazy loading, pagination)
  - Balance between resolver complexity and component simplicity

### CS-S01: One-way data flow pattern
- **Why not fully enforceable**: Architectural pattern requires understanding data flow
- **Human judgment needed**:
  - Design state management architecture
  - Decide when to use stores vs. services
  - Maintain consistency across features

### CS-S05: No HTTP calls in stores
- **Why partially enforceable**: Can detect obvious HTTP calls, but not all async operations
- **Human judgment needed**:
  - Identify what constitutes external data fetching
  - Handle WebSocket connections, IndexedDB, etc.

## 📊 Code Organization & Logic

### CS-T04: Keep templates simple, logic in component
- **Why not enforceable**: "Simple" is subjective
- **Human judgment needed**:
  - Balance template readability with component complexity
  - Decide when to extract computed properties
  - Evaluate template expression complexity

### CS-V03: Separate data/business/UI services
- **Why not enforceable**: Service responsibility boundaries are architectural decisions
- **Human judgment needed**:
  - Define clear service boundaries
  - Determine appropriate separation of concerns
  - Handle services that cross boundaries

## 🔄 Async Pattern Decisions

### CS-A02: Use RxJS only for event streams
- **Why not fully enforceable**: Determining "event stream" vs "one-time operation" requires context
- **Human judgment needed**:
  - Identify true event streams
  - Decide on Observable vs Promise based on use case
  - Consider future requirements

## 📝 Naming and Documentation

### Service Naming Convention
- **Why not fully enforceable**: "Descriptive and specific" is subjective
- **Human judgment needed**:
  - Choose between `EmailNotificationService` vs `NotificationService`
  - Balance specificity with reusability
  - Consider domain context

### Component Naming
- **Why partially enforceable**: Can enforce suffixes, not descriptiveness
- **Human judgment needed**:
  - Create meaningful, self-documenting names
  - Maintain consistency across features

## 🧪 Testing Standards

### CS-X01: Test behavior, not implementation
- **Why not enforceable**: Requires understanding test intent
- **Human judgment needed**:
  - Focus on user-facing behavior
  - Avoid testing internal state
  - Write meaningful test descriptions

## 🎯 Best Practices for Non-Enforceable Standards

1. **Code Reviews**: Use these standards as a checklist during reviews
2. **Team Agreements**: Document team decisions on subjective standards
3. **Architecture Decision Records (ADRs)**: Document why certain patterns were chosen
4. **Pair Programming**: Share knowledge about these standards
5. **Documentation**: Keep examples of good and bad patterns
6. **Regular Audits**: Periodically review codebase for standard violations

## 🔧 Tooling Alternatives

For standards that can't be enforced with ESLint, consider:

1. **Architecture linting tools** (e.g., dependency-cruiser) for module boundaries
2. **Custom build scripts** for file system validation
3. **Git hooks** for pre-commit checks
4. **SonarQube** or similar for code quality metrics
5. **Documentation generators** to ensure proper code organization

## 📚 Related Documentation

- See `angular_coding_standards.md` for full standard descriptions
- See `angular-cheat-sheet.md` for quick reference
- See `.eslintrc.json` for enforceable rules configuration