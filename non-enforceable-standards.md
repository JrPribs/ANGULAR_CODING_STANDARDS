# Non-Enforceable Angular Coding Standards

This document lists Angular coding standards that require human judgment and cannot be automatically enforced through ESLint. These standards are important for code quality but require code review and developer awareness.

## Component Standards

### Single Responsibility (Part of CS-C)
**Standard**: "Components do ONE thing well"
**Why Not Enforceable**: Determining whether a component has a single responsibility requires understanding the business logic and context. What constitutes "one thing" is subjective and context-dependent.
**Review Guidance**: Look for components that:
- Handle multiple unrelated features
- Mix presentation logic with business logic
- Have too many injected dependencies (>5 is often a code smell)

### Descriptive Naming
**Standard**: Component names should be descriptive (e.g., `UserProfileComponent` not `Component1`)
**Why Not Enforceable**: Naming quality is subjective. While we can enforce patterns, we cannot determine if a name accurately describes functionality.
**Review Guidance**: Names should:
- Clearly indicate the component's purpose
- Use domain terminology consistently
- Follow the pattern: `[Feature][Type]Component`

## Service Standards

### CS-V03: Proper Separation of Concerns
**Standard**: Services should be separated by concern - data services for API/Firebase, business services for logic, UI services for display
**Why Not Enforceable**: Determining the "concern" of a service requires understanding its purpose and implementation details.
**Review Guidance**: 
- Data services should only handle API/Firebase calls
- Business services should contain business logic but no HTTP calls
- UI services should handle display-related state and formatting

### CS-V04: Services Handle HTTP, Stores Handle State
**Standard**: Services manage HTTP/Firebase operations, stores manage state
**Why Not Enforceable**: While we can detect HTTP calls in stores or state in services, subtle violations require understanding the code's intent.
**Review Guidance**:
- Services should return Promises/Observables, not store state
- Stores should not make HTTP calls directly
- State updates should flow through services to stores

## Router Standards

### CS-R04: Resolver Data Auto-Populates Component Inputs
**Standard**: Component inputs should be automatically populated from resolver data
**Why Not Enforceable**: This is runtime behavior that depends on proper configuration and naming conventions. Static analysis cannot verify the connection works.
**Review Guidance**:
- Resolver property names must match component input names
- Ensure `withComponentInputBinding()` is configured in main.ts
- Verify data flows correctly from resolver to component

## Testing Standards

### CS-X01: Behavioral vs Implementation Testing
**Standard**: Tests should verify behavior, not implementation details
**Why Not Enforceable**: Distinguishing between behavioral and implementation testing requires understanding the test's intent and what it's actually verifying.
**Review Guidance**:
- Tests should focus on public API and user-facing behavior
- Avoid testing private methods directly
- Don't test internal state changes unless they affect behavior
- Good: "should display error message when login fails"
- Bad: "should set errorFlag to true"

## Architecture Standards

### CS-F04: Smart Organization of Shared Code
**Standard**: Shared code should be "smartly organized" and only contain truly cross-cutting concerns
**Why Not Enforceable**: "Smart organization" is subjective and depends on the application's architecture and team preferences.
**Review Guidance**:
- Shared code should be used by 3+ unrelated features
- Group shared code by type (models, services, components)
- Consider creating sub-modules for large shared areas

### Feature Cohesion
**Standard**: Features should be self-contained and cohesive
**Why Not Enforceable**: Determining feature boundaries and cohesion requires understanding business requirements and domain logic.
**Review Guidance**:
- Features should have minimal dependencies on other features
- All feature-specific code should live within the feature folder
- Cross-feature communication should go through well-defined interfaces

## General Code Quality

### Meaningful Variable and Method Names
**Standard**: Use descriptive, meaningful names throughout the codebase
**Why Not Enforceable**: Name quality and meaning are subjective and context-dependent.
**Review Guidance**:
- Names should clearly express intent
- Avoid abbreviations unless widely understood
- Use consistent naming conventions across the codebase

### Appropriate Abstraction Levels
**Standard**: Code should maintain appropriate levels of abstraction
**Why Not Enforceable**: Determining the "right" level of abstraction requires understanding the problem domain and future requirements.
**Review Guidance**:
- Avoid over-engineering (YAGNI principle)
- Extract common patterns when used 3+ times
- Keep abstractions focused and single-purpose

## Code Review Checklist

When reviewing code for these non-enforceable standards:

1. **Components**
   - [ ] Does the component have a single, clear responsibility?
   - [ ] Is the component name descriptive of its purpose?
   - [ ] Is the component properly scoped to its feature?

2. **Services**
   - [ ] Are services properly separated by concern?
   - [ ] Do data services only handle API calls?
   - [ ] Do business services avoid direct HTTP calls?

3. **Architecture**
   - [ ] Are features properly isolated?
   - [ ] Is shared code truly shared (3+ features)?
   - [ ] Are abstractions appropriate and not over-engineered?

4. **Testing**
   - [ ] Do tests focus on behavior rather than implementation?
   - [ ] Are test descriptions clear about what they verify?
   - [ ] Do tests avoid coupling to internal details?

5. **General Quality**
   - [ ] Are names meaningful and consistent?
   - [ ] Is the code's intent clear?
   - [ ] Would a new developer understand this code?

## Enforcement Strategy

While these standards cannot be automatically enforced, teams should:

1. Include them in code review checklists
2. Discuss them during onboarding
3. Document team-specific interpretations
4. Use pair programming for complex architectural decisions
5. Regularly review and refine interpretations based on team experience

Remember: The goal is not perfection but consistent improvement in code quality and maintainability.