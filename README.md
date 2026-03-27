# ESLint + Prettier vs Biome — Tooling Comparison

A side-by-side comparison of two identical TypeScript projects using different linting and formatting toolchains. The goal is to measure and experience real-world differences between the traditional **ESLint + Prettier** stack and the modern all-in-one **Biome** tool.

---

## Repository Structure

```
biomejs-eslint/
├── project-eslint-prettier/   ← Project A: ESLint + Prettier + Husky
└── project-biome/             ← Project B: Biome + Husky
```

Both projects have **identical source code** — same 18 TypeScript files with the same logic, same intentional lint/format issues. Only the tooling configuration differs.

---

## Tooling Comparison

| Feature | ESLint + Prettier | Biome |
|---|---|---|
| Linting | ESLint + @typescript-eslint | Biome (built-in) |
| Formatting | Prettier | Biome (built-in) |
| Import ordering | eslint-plugin-import | Biome (built-in) |
| Config files | `eslint.config.js` + `.prettierrc` + `.lintstagedrc` | `biome.json` |
| Dependencies | ~10 packages | 1 package |
| Language | JavaScript/Node | Rust (native binary) |
| Pre-commit | lint-staged → eslint + prettier | biome check --apply |

---

## Script Comparison

| Task | Project A (ESLint+Prettier) | Project B (Biome) |
|---|---|---|
| Lint check | `npm run lint` | `npm run check` |
| Auto-fix | `npm run lint:fix` | `npm run check:fix` |
| Format check | `npm run format:check` | _(included in check)_ |
| Format write | `npm run format` | _(included in check:fix)_ |
| Benchmark lint | `npm run benchmark:lint` | `npm run benchmark:lint` |
| Benchmark fix | `npm run benchmark:fix` | `npm run benchmark:fix` |

---

## Getting Started

### Project A — ESLint + Prettier

```bash
cd project-eslint-prettier
npm install
npm run lint           # see all lint errors
npm run format:check   # see formatting issues
npm run benchmark:lint # measure lint time (3 runs)
npm run benchmark:fix  # measure fix time (3 runs)
```

### Project B — Biome

```bash
cd project-biome
npm install
npm run check          # see all lint + format issues
npm run benchmark:lint # measure check time (3 runs)
npm run benchmark:fix  # measure check --apply time (3 runs)
```

---

## Expected Observations

- **Speed**: Biome is typically 10–100x faster than ESLint + Prettier combined (Rust binary vs Node.js)
- **Config complexity**: Biome requires 1 file vs 3–4 files for ESLint + Prettier
- **Dependencies**: Biome adds 1 package; ESLint + Prettier stack adds ~10 packages
- **Pre-commit speed**: Biome's single-pass check is noticeably faster in git hooks
- **Rule parity**: Biome covers most ESLint recommended rules but not all plugins (e.g., no `eslint-plugin-react` equivalent yet for some rules)

---

## Intentional Code Issues

Both projects contain the same intentional issues to give tools something to find:

- Unused variables
- Explicit `any` type annotations
- Mixed single/double quotes
- `console.log` debug statements
- Lines exceeding 100 characters
- Missing semicolons in some files
- Trailing whitespace

Run `npm run lint` (Project A) or `npm run check` (Project B) before any fixes to see the raw output.

---

## CI

GitHub Actions workflows run linting for both projects on every push, with execution time logged to the job summary for easy comparison.

- [ESLint + Prettier CI](.github/workflows/ci-eslint-prettier.yml)
- [Biome CI](.github/workflows/ci-biome.yml)
