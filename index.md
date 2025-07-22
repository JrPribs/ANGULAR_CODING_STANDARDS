# CODING STANDARDS Directory Overview

This directory contains universal Angular and TypeScript coding standards that can be reused across projects

## 📚 Core Standards Files

### angular-cheat-sheet.md
**Purpose**: Quick reference guide with law codes (CS-R01, CS-C01, etc.)  
**Audience**: Developers needing fast lookup of rules  
**Usage**: Start here when coding; each code links to detailed explanation  

### angular_coding_standards.md  
**Purpose**: The comprehensive law book - 600+ lines of detailed standards  
**Author**: Custom curated by John Pribesh (Angular expert since v1 beta)  
**Content**: Router-first architecture, components, state management, async patterns, file organization, testing  
**Status**: Living document - updated based on real-world usage  

### angular-state-architecture.md
**Purpose**: Comprehensive guide to state management architecture and data flow  
**Content**: Detailed layer responsibilities, decision guidelines table, best practices, anti-patterns  
**Unique Value**: Practical "where does X belong?" decision guide and concrete code examples  
**Integration**: Referenced by law codes CS-S01 through CS-S05  

### angular-state-pattern.mermaid
**Purpose**: Visual flowchart of the one-way state management pattern  
**Shows**: Component → Service → Store → Component data flow  
**Key Concept**: Shared state is immutable at component level, only updated via services  
**Note**: Supplementary visualization to angular-state-architecture.md  

## 📖 Reference Documentation

### angular_llms.txt
**Source**: Official Angular team  
**Purpose**: Index file with links to key Angular resources  
**Designed for**: LLMs and AI-assisted development tools  

### angular_llms-full.txt
**Source**: Official Angular team  
**Purpose**: Comprehensive Angular documentation compiled for LLM consumption  
**Content**: Tutorials, examples, API docs, best practices  
**Size**: Extensive document with full Angular knowledge  

## 🗺️ Navigation & Project-Specific

### documentation-map.md
**Purpose**: Navigation guide for all documentation  
**Content**: Where to find/put information, decision trees, directory structure  
**Benefit**: Makes documentation discoverable and maintainable  

### project-overrides.md
**Purpose**: Documents project specific deviations from standards  
**Content**: What rules are broken, why, and when to fix  
**Important**: This file is project-specific and should NOT be copied to other projects  

## 🚀 Using This Pattern in Other Projects

1. **Copy these files** to your new project:
   - angular-cheat-sheet.md
   - angular_coding_standards.md
   - angular-state-pattern.mermaid
   - angular_llms.txt
   - angular_llms-full.txt
   - documentation-map.md
   - index.md (this file)

2. **Create project-specific files**:
   - New project-overrides.md for any deviations
   - New CLAUDE.md at project root

3. **Update** documentation-map.md with your project structure

This creates consistent AI-assisted development across all Angular codebases while allowing for project-specific needs.
