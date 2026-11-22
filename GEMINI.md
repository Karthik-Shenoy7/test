# ECC — Agent Operating Guidelines & Rules

This project is configured with the **Everything Claude Code (ECC)** agent operating system adapted natively for Google Antigravity and Gemini CLI.

Version: 2.2.3

## Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks.
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required.
3. **Security-First** — Never compromise on security; validate all inputs.
4. **Immutability** — Always create new objects, never mutate existing ones.
5. **Plan Before Execute** — Plan complex features before writing code.

## ECC Customizations Layout

- **Skills (`.agents/skills/`)**: 314 workflow skills and domain procedures across full-stack, DevOps, security, AI/ML, and architecture.
- **Rules (`.agents/rules/`)**: 158 project rules (common coding style, security, git workflow, performance, plus language/framework rules for TypeScript, Python, C++, Go, Rust, React, Vue, Flutter, etc.).
- **Agents (`.agents/agents/`)**: 71 specialized custom agents (planner, architect, tdd-guide, code-reviewer, security-reviewer, etc.).
- **Workflows (`.agents/workflows/`)**: 104 workflows invokable as slash commands (e.g. `/plan`, `/code-review`, `/tdd-workflow`, etc.).
- **Compiled Web Pipeline (`/webdev`, `/web`)**: All-in-one web development pipeline combining architecture, UI/UX polish, WCAG 2.2 accessibility, SEO, Core Web Vitals performance, security audit, and testing.

## Core Workflow

1. **Plan** — Formulate an implementation plan, identify dependencies, edge cases, and failure modes.
2. **TDD** — Write failing tests first, implement minimal passing solution, refactor.
3. **Review** — Run automated static analysis and code review checks.
4. **Security Checklist** — Validate all external inputs, check authn/authz, eliminate hardcoded secrets, sanitize outputs.
5. **Commit** — Conventional commits format (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`).
