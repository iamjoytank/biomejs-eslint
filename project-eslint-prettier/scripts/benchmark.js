#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

const mode = process.argv[2];
const RUNS = 3;

const commands = {
  lint: 'npx eslint "src/**/*.ts"',
  fix: 'npx eslint "src/**/*.ts" --fix && npx prettier --write "src/**/*.ts"',
};

if (!commands[mode]) {
  console.error('Usage: node benchmark.js lint|fix');
  process.exit(1);
}

const cmd = commands[mode];
const toolName = 'ESLint + Prettier';

console.log(`\n${'='.repeat(60)}`);
console.log(`  Benchmark: ${toolName}`);
console.log(`  Mode:      ${mode}`);
console.log(`  Runs:      ${RUNS}`);
console.log(`${'='.repeat(60)}\n`);

const times = [];

for (let i = 1; i <= RUNS; i++) {
  process.stdout.write(`  Run ${i}/${RUNS}... `);
  const start = performance.now();
  try {
    execSync(cmd, { stdio: 'pipe', shell: true });
  } catch (_err) {
    // lint errors produce non-zero exit — that's expected
  }
  const elapsed = performance.now() - start;
  times.push(elapsed);
  console.log(`${elapsed.toFixed(0)}ms`);
}

const avg = times.reduce((a, b) => a + b, 0) / RUNS;
const min = Math.min(...times);
const max = Math.max(...times);

console.log(`\n  Results:`);
console.log(`    Average : ${avg.toFixed(0)}ms`);
console.log(`    Min     : ${min.toFixed(0)}ms`);
console.log(`    Max     : ${max.toFixed(0)}ms`);
console.log(`${'='.repeat(60)}\n`);
