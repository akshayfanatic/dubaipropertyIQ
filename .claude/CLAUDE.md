# Dubai Property IQ

A Next.js application for Dubai real estate intelligence and property analysis.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Fonts:** Geist Sans & Geist Mono (via next/font/google)

## Project Structure

```
app/
├── layout.tsx    # Root layout with font configuration
├── page.tsx      # Home page
└── globals.css   # Global styles
```

## Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Development Guidelines

- Use TypeScript for all new files
- Follow Tailwind CSS v4 conventions
- Utilize Next.js App Router patterns (Server Components by default)
- Keep components small and reusable

---

## MCP Servers Configuration

This project has the following MCP (Model Context Protocol) servers configured in `.mcp.json`:

| Server | Purpose | Command |
|--------|---------|---------|
| **sequential-thinking** | Structured thinking and analysis for complex problems | `uvx mcp-sequential-thinking` |
| **chrome-devtools** | Chrome DevTools integration for debugging | `npx chrome-devtools-mcp@latest` |
| **serena** | Semantic code analysis (symbols, refs, code navigation) | `uvx serena start-mcp-server` |
| **context7** | Up-to-date documentation for any library/framework | `npx @upstash/context7-mcp@latest` |
| **linear** | Linear project management integration | `npx mcp-remote https://mcp.linear.app/sse` |

### Serena Tools Summary

The `serena` MCP server provides powerful semantic code tools:
- **`find_symbol`** - Find classes, functions, methods by name pattern
- **`find_referencing_symbols`** - Find all references to a symbol
- **`get_symbols_overview`** - Get high-level structure of a file
- **`replace_symbol_body`** - Replace entire function/class definitions
- **`replace_content`** - Regex-based file content replacement
- **`search_for_pattern`** - Search codebase with regex patterns
- **`insert_before/after_symbol`** - Insert code relative to symbols
- **`rename_symbol`** - Rename symbols across the entire codebase

---

## Superpowers Skills

This project uses the "superpowers" skill system for enhanced workflows. Available skills:

### Process Skills
- **brainstorming** - Explore user intent and design before implementation (MUST use for creative work)
- **systematic-debugging** - Structured approach to bugs and unexpected behavior
- **test-driven-development** - TDD workflow for features and bugfixes
- **writing-plans** - Create implementation plans from specs/requirements
- **verification-before-completion** - Verify work before claiming completion

### Workflow Skills
- **dispatching-parallel-agents** - Handle 2+ independent tasks concurrently
- **executing-plans** - Execute written implementation plans with checkpoints
- **subagent-driven-development** - Execute implementation tasks with independent subagents
- **using-git-worktrees** - Create isolated worktrees for feature work

### Code Review Skills
- **requesting-code-review** - Review work before merging
- **receiving-code-review** - Handle code review feedback rigorously
- **finishing-a-development-branch** - Decide merge/PR/cleanup options

### Meta Skills
- **using-superpowers** - How to find and use skills (loaded automatically)
- **writing-skills** - Create or modify skills

**Important:** Always invoke relevant skills BEFORE starting work. Even 1% chance a skill applies = use it.

---

## Mandatory Workflow Requirements

### 1. Prompt Improvement
**Before executing ANY user prompt**, use the **`prompt-engineering-pattern`** skill to improve and refine the prompt itself.

### 2. Code Quality Guidelines
**Before writing or editing ANY code**, use the **`karpathy-guidelines`** skill and ensure all instructions are followed.

### 3. Next.js/React Best Practices
For all Next.js code, adhere to:
- **`next-best-practice`** skill
- **`vercel-react-best-practices`** skill
- **`vercel-composition-patterns`** skill

### 4. Code Search
For searching code, use **LSP JS** for comprehensive code searching.

### 5. Verification After Code Changes
**After writing or editing ANY code**, always run:
```bash
npm run lint    # ESLint check
npx tsc --noEmit # TypeScript type check
```

### 6. Documentation & Latest Information
When documentation or latest information is needed on code patterns or libraries:
- Use **`ref tools mcp`** AND **`exa mcp`** simultaneously
- Gather information FIRST, then proceed with implementation

---

## MCP Servers for Documentation

**Note:** The following MCP servers are referenced in workflow but may need to be added to `.mcp.json`:
- **`ref tools mcp`** - For referencing documentation
- **`exa mcp`** - For web search and latest information

---

## Skills to Configure

The following skills are referenced but may need to be installed/configured:
- `prompt-engineering-pattern` - Improve prompts before execution
- `karpathy-guidelines` - Andrej Karpathy's code quality guidelines
- `next-best-practice` - Next.js best practices
- `vercel-react-best-practices` - Vercel React patterns
- `vercel-composition-patterns` - Vercel composition patterns

---

## Development Environment

### API Configuration
- **Base URL:** `https://api.z.ai/api/anthropic` (custom API)
- **Models:**
  - Opus: `glm-4.6`
  - Sonnet: `glm-4.6`
  - Haiku: `glm-4.5-air`

### Permissions (settings.local.json)
Allowed operations include:
- All Serena semantic tools
- Bash commands for `npx:*`
- Read operations on `/media/fanatic/**`

### TypeScript Configuration
- Path aliases: `@/*` maps to project root
- Strict mode enabled
- Target: ES2017
- JSX: `react-jsx`
