#!/usr/bin/env node
import { runCli } from '../src/cli.js';

runCli(process.argv).catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
