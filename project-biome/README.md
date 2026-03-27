# Project B — Biome

TypeScript project configured with **Biome + Husky** for linting, formatting, and git hooks.

---

## Setup

```bash
npm install
```

Husky hooks are installed automatically via the `prepare` script.

---

## Scripts

| Script | Description |
|---|---|
| `npm run check` | Run Biome check (lint + format) on all files |
| `npm run check:fix` | Auto-fix all Biome issues |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run benchmark:lint` | Measure check time over 3 runs |
| `npm run benchmark:fix` | Measure check --apply time over 3 runs |

---

## Git Hooks (Husky)

- **pre-commit**: Runs `biome check --apply .` — lint + format auto-fix on all files
- **pre-push**: Runs `biome check .` — full check, fails if issues remain

---

## Tooling Config

| File | Purpose |
|---|---|
| `biome.json` | Single config for linting + formatting (replaces eslintrc + prettierrc) |

### Biome Rules
- `suspicious.noExplicitAny` — error (equivalent to `@typescript-eslint/no-explicit-any`)
- `correctness.noUnusedVariables` — error (equivalent to `@typescript-eslint/no-unused-vars`)
- `correctness.noUnusedImports` — error (equivalent to `import/no-unused-modules`)
- `suspicious.noConsoleLog` — warn (equivalent to `no-console`)
- `organizeImports.enabled` — true (auto-sorted on fix)

### Formatter Config
- Single quotes
- Semicolons
- Line width: 100
- Trailing commas: ES5

---

## Running Benchmarks

```bash
# Measure lint+format check time (3 runs, reports avg/min/max)
npm run benchmark:lint

# Measure auto-fix time (3 runs)
npm run benchmark:fix
```

Compare these numbers against Project A (`project-eslint-prettier/`) to see the speed difference.

---

## Intentional Lint Issues

Same source files as `project-eslint-prettier/` — identical issues:

- `any` types in `types/index.ts`, `services/`, `controllers/`
- Unused variables in `constants/apiEndpoints.ts`, `services/productService.ts`
- `console.log` throughout services and controllers
- Mixed single/double quotes across multiple files
- Long lines exceeding 100 chars in `constants/config.ts`
- Missing semicolons in `utils/dateUtils.ts`

Run `npm run check` before `npm run check:fix` to see the raw issues.

---

## Key Difference from Project A

Biome replaces **all** of these packages with a single binary:
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-prettier`
- `eslint-plugin-import`
- `prettier`
- `lint-staged`

Result: faster installs, faster runs, simpler config.
