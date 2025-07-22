# Angular Coding Standards

A comprehensive collection of Angular and TypeScript coding standards designed for consistent, maintainable, and AI-assisted development.

## 📋 Overview

This repository contains universal Angular coding standards that can be reused across projects. These standards have been custom-curated by John Pribesh (Angular expert since v1 beta) and represent best practices evolved from real-world Angular applications.

## 🎯 Purpose

- **Consistency**: Ensure all Angular projects follow the same architectural patterns
- **AI-Friendly**: Structured for optimal use with AI development tools like Claude
- **Living Document**: Continuously updated based on real-world usage and feedback
- **Battle-Tested**: Standards derived from production Angular applications

## 📚 What's Included

### Core Standards Files

- **`angular-cheat-sheet.md`** - Quick reference guide with law codes (CS-R01, CS-C01, etc.)
- **`angular_coding_standards.md`** - The comprehensive 600+ line standards document
- **`angular-state-architecture.md`** - Detailed state management patterns and data flow
- **`angular-state-pattern.mermaid`** - Visual diagram of the one-way state pattern

### Reference Documentation

- **`angular_llms.txt`** - Official Angular team's index for AI tools
- **`angular_llms-full.txt`** - Comprehensive Angular documentation for LLM consumption
- **`documentation-map.md`** - Navigation guide for documentation structure
- **`index.md`** - Directory overview and file descriptions

## 🚀 Using These Standards

### In a New Project

1. Clone this repository or add it as a Git submodule:
   ```bash
   git submodule add git@github.com:JrPribs/ANGULAR_CODING_STANDARDS.git CODING_STANDARDS
   ```

2. Create project-specific files:
   - `project-overrides.md` - Document any project-specific deviations
   - `CLAUDE.md` - AI assistant instructions for your project

3. Reference the standards in your development workflow

### As a Git Submodule

When using as a submodule, you can:
- Keep standards synchronized across multiple projects
- Update standards independently of project code
- Track which version of standards each project uses

## 📖 Key Principles

1. **Router-First Architecture** - The router is the source of truth
2. **Standalone Components** - Modern Angular without NgModules
3. **One-Way Data Flow** - Component → Service → Store → Component
4. **Immutable State** - State is read-only at the component level
5. **AI-Assisted Development** - Standards structured for LLM comprehension

## 🔧 Project-Specific Overrides

Each project using these standards should maintain its own `project-overrides.md` file (not included in this repository) to document any deviations from the standards and why they exist.

## 👤 Author

**John Pribesh** - Angular expert since v1 beta

## 📝 License

These standards are provided as-is for use in Angular projects. Feel free to adapt them to your needs.

## 🤝 Contributing

This is a living document. If you have suggestions or improvements based on your experience, please open an issue or submit a pull request.

---

*Note: The `project-overrides.md` file is intentionally excluded from this repository as it contains project-specific information.*