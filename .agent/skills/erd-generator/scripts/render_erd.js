#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const inputFile = process.argv[2] || 'docs/architecture/schema.mmd';
const outputFile = process.argv[3] || 'docs/architecture/erd.svg';

try {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file "${inputFile}" does not exist.`);
  }

  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  execSync(`npx mmdc -i "${inputFile}" -o "${outputFile}"`, {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf-8',
  });

  console.log('SUCCESS');
  process.exit(0);
} catch (error) {
  const stderr = error.stderr ? error.stderr.toString() : (error.message || String(error));
  console.error(`SYNTAX_ERROR:\n${stderr}`);
  process.exit(1);
}
