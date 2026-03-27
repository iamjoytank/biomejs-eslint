# Project A — ESLint + Prettier

TypeScript project configured with **ESLint + Prettier + Husky** for linting, formatting, and git hooks.

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
| `npm run lint` | Run ESLint on all TypeScript files |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run benchmark:lint` | Measure lint time over 3 runs |
| `npm run benchmark:fix` | Measure auto-fix time over 3 runs |

---

## Git Hooks (Husky)

- **pre-commit**: Runs `lint-staged` → ESLint fix + Prettier write on staged `.ts` files
- **pre-push**: Runs full ESLint check across `src/`

---

## Tooling Config

| File | Purpose |
|---|---|
| `eslint.config.js` | ESLint flat config with TypeScript + import rules |
| `.prettierrc` | Prettier formatting rules |
| `package.json > lint-staged` | What runs on staged files at pre-commit |

### ESLint Rules
- `@typescript-eslint/no-explicit-any` — error
- `@typescript-eslint/no-unused-vars` — error
- `no-console` — warn
- `import/order` — warn
- Prettier formatting handled via `eslint-config-prettier`

### Prettier Config
- Single quotes
- Semicolons
- Print width: 100
- Trailing commas: ES5

---

## Running Benchmarks

```bash
# Measure lint time (3 runs, reports avg/min/max)
npm run benchmark:lint

# Measure auto-fix time (3 runs)
npm run benchmark:fix
```

Compare these numbers against Project B (`project-biome/`) to see the speed difference.

---

## Intentional Lint Issues

The source files contain deliberate issues for tools to find:

- `any` types in `types/index.ts`, `services/`, `controllers/`
- Unused variables in `constants/apiEndpoints.ts`, `services/productService.ts`
- `console.log` throughout services and controllers
- Mixed single/double quotes across multiple files
- Long lines exceeding 100 chars in `constants/config.ts`
- Missing semicolons in `utils/dateUtils.ts`

Run `npm run lint` before `npm run lint:fix` to see the raw issues.
