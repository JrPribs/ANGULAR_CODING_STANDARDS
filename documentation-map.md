# Documentation Map

## 📍 Quick Navigation Guide

### Where to Find Information

| Looking for... | Go to... |
|----------------|----------|
| Quick coding rules | [angular-cheat-sheet.md](./angular-cheat-sheet.md) |
| Detailed standards with examples | [angular-coding-standards.md](./angular-coding-standards.md) |
| State architecture guide | [angular-state-architecture.md](./angular-state-architecture.md) |
| Visual state flow diagram | [angular-state-pattern.mermaid](./angular-state-pattern.mermaid) |
| Project-specific implementation | [CLAUDE.md](../CLAUDE.md) |
| WhyTV deviations from standards | [project-overrides.md](./project-overrides.md) |
| Library documentation | [/docs](../docs/) directory |
| Angular team's LLM resources | [angular_llms.txt](./angular_llms.txt) & [angular_llms-full.txt](./angular_llms-full.txt) |

## 🗂️ Directory Structure

```
whytv/
├── CLAUDE.md                         # Project-specific guide
├── CODING_STANDARDS/                 # Universal standards (portable)
│   ├── angular-cheat-sheet.md        # Quick reference with law codes
│   ├── angular-coding-standards.md   # Comprehensive law book
│   ├── angular-state-architecture.md # Detailed state management guide
│   ├── angular-state-pattern.mermaid # Visual state flow diagram
│   ├── angular_llms.txt              # Angular's LLM reference
│   ├── angular_llms-full.txt         # Angular's full LLM docs
│   ├── documentation-map.md          # This file
│   ├── index.md                      # Directory overview
│   └── project-overrides.md          # WhyTV-specific deviations
└── docs/                             # External library references
    ├── angular-youtube-player-*.md   # YouTube player docs
    ├── ngrx_signals/                 # NgRx signal docs
    ├── genkit/                       # AI model docs
    └── FLOW.md                       # Firebase functions flow

```

## 🎯 Decision Tree: Where Should I Put/Find This?

### "I need to know how to..."
- **Write Angular code** → Start with `angular-cheat-sheet.md`
- **Understand a specific rule** → Look up the code in `angular-coding-standards.md`
- **Design state architecture** → Read `angular-state-architecture.md`
- **Visualize state flow** → View `angular-state-pattern.mermaid`
- **Decide where code belongs** → Check Decision Guidelines in `angular-state-architecture.md`
- **Work with WhyTV specifically** → Check `CLAUDE.md`
- **Use a library** → Check `/docs` directory

### "I want to document..."
- **A new coding standard** → Add to `angular-coding-standards.md` with a new CS code
- **A project-specific pattern** → Add to `CLAUDE.md`
- **A deviation from standards** → Add to `project-overrides.md`
- **A library/tool reference** → Add to `/docs` directory
- **A new feature's architecture** → Add to `CLAUDE.md` or `/docs`

## 📋 File Purposes

### CODING_STANDARDS/ (Portable Across Projects)

**angular-cheat-sheet.md**
- One-page quick reference
- Law codes (CS-R01, CS-C01, etc.)
- Links to detailed sections
- Common code templates

**angular-coding-standards.md**
- The comprehensive law book
- Detailed explanations with examples
- The source of truth for all standards
- 600+ lines of best practices

**angular-state-architecture.md**
- Comprehensive state management guide
- Decision guidelines table
- Best practices and anti-patterns
- Code examples

**angular-state-pattern.mermaid**
- Visual representation of state flow
- Supplementary diagram to state architecture guide
- Component → Service → Store → Component

**project-overrides.md**
- Documents intentional deviations
- Explains why each override exists
- Defines when to fix (if applicable)
- Project-specific only

### Root Level

**CLAUDE.md**
- Project overview and context
- Current implementation state
- Known issues and TODOs
- WhyTV-specific patterns
- Commands and setup

### docs/ Directory

**Library References**
- External documentation
- API references
- Integration guides
- Not modified by us

**Technical Documentation**
- FLOW.md - Firebase functions
- Data examples
- Architecture diagrams

## 🔄 Usage Pattern for New Projects

When starting a new Angular project with AI assistance:

1. **Copy entire CODING_STANDARDS/ directory** (except project-overrides.md)
2. **Create new CLAUDE.md** with project-specific information
3. **Create new project-overrides.md** as deviations arise
4. **Update documentation-map.md** with project structure

This ensures consistent AI assistance across all codebases while allowing for project-specific needs.