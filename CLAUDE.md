# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **documentation repository** containing comprehensive Angular coding standards. It is NOT an Angular application but rather a collection of standards, patterns, and guidelines designed to be used as a reference or Git submodule in actual Angular projects.

## Key Architecture Principles

### Law Code System
Every standard has a unique code (e.g., CS-R01, CS-C01) that must be referenced when implementing or reviewing code. These codes are defined in `angular-cheat-sheet.md` with detailed explanations in `angular_coding_standards.md`.

### Router-First Architecture
- **Routes define the application structure** - All features start with route definitions
- **Resolvers handle all data loading** - Components never fetch data directly
- **Input binding for data flow** - Components receive data via router input binding: `@Input() data = input.required<DataType>()`

### Modern Angular Patterns (v14+)
- **Standalone components only** - Never use NgModules
- **Signal-based state** - Use signals for reactive state management
- **Modern control flow** - Use @if, @for, @switch instead of *ngIf, *ngFor
- **Functional programming** - Prefer functional resolvers and guards

### State Management Architecture
Follow the one-way data flow pattern documented in `angular-state-architecture.md`:
```
Component → Service → Store → Component (via signals)
```
- Components ONLY read state via signals
- Components ONLY update state through service methods
- Services handle business logic and store updates
- Stores manage state using @ngrx/signals

## Critical Standards to Enforce

### Component Standards (CS-C)
- CS-C01: Use standalone components with explicit imports
- CS-C04: Keep components under 200 lines
- CS-C05: Use input() for all inputs, output() for all outputs
- CS-C10: Use modern control flow (@if, @for, @switch)

### Service Standards (CS-S)
- CS-S01: Services handle all business logic
- CS-S02: Services manage store updates
- CS-S03: Use inject() function, never constructor injection
- CS-S05: Return observables/promises/signals only

### Router Standards (CS-R)
- CS-R01: Define all routes in main.config.ts
- CS-R02: Use functional resolvers
- CS-R03: All data loading through resolvers
- CS-R04: Use input binding for resolved data

### Testing Standards (CS-T)
- CS-T01: Test files alongside source files
- CS-T02: Use Jest for all testing
- CS-T03: Aim for 80%+ coverage
- CS-T05: Mock all external dependencies

## Documentation Structure

- `angular-cheat-sheet.md` - Quick reference with all law codes
- `angular_coding_standards.md` - Comprehensive standards (600+ lines)
- `angular-state-architecture.md` - State management patterns and decisions
- `angular-state-pattern.mermaid` - Visual state flow diagram
- `documentation-map.md` - Navigation guide for all docs

## Important Notes

1. **This is a standards repository** - No build commands or application code exists here
2. **Reference law codes** - Always cite the specific law code when implementing features
3. **Check for overrides** - In actual projects, check `project-overrides.md` for any deviations
4. **Feature-first organization** - Keep feature code together, only truly shared code in shared/
5. **No process.env in Firebase** - Use Firebase Functions v2 parameter system

## When Working in Angular Projects Using These Standards

1. Always check if the project has these standards as a submodule
2. Reference the appropriate law codes in commits and PRs
3. Follow the router-first architecture pattern
4. Use the state management patterns from `angular-state-architecture.md`
5. Consult `angular-cheat-sheet.md` for quick law code lookups