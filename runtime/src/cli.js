
import path from 'node:path';
import { runFile } from './runner.js';
import { runInstall, runSearch, runList, runRegistryInfo } from './package-manager.js';
import { listStdlib } from './stdlib/index.js';
import { startRepl } from './repl.js';
import { initProject } from './init.js';
import { runTests } from './test-runner.js';

const VERSION = '0.3.0';

export async function runCli(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`krs ${VERSION}`);
    return;
  }

  if (args[0] === 'run') {
    const file = args[1];
    if (!file) throw new Error('Usage: krs run <file.krs>');
    await runFile(path.resolve(process.cwd(), file));
    return;
  }

  if (args[0] === 'repl') {
    await startRepl();
    return;
  }

  if (args[0] === 'init') {
    initProject(args[1] || 'my-app');
    return;
  }

  if (args[0] === 'test') {
    await runTests(args[1] || '.');
    return;
  }

  if (args[0] === 'install') {
    await runInstall(args.slice(1));
    return;
  }

  if (args[0] === 'search') {
    await runSearch(args.slice(1).join(' '));
    return;
  }

  if (args[0] === 'list') {
    if (args[1] === 'stdlib') {
      console.log('Built-in stdlib modules:\n');
      for (const name of listStdlib()) console.log(`  @stdlib/${name}.krs`);
      return;
    }
    await runList();
    return;
  }

  if (args[0] === 'registry') {
    await runRegistryInfo();
    return;
  }

  if (args[0].endsWith('.krs')) {
    await runFile(path.resolve(process.cwd(), args[0]));
    return;
  }

  throw new Error(`Unknown command: ${args[0]}\nRun "krs --help" for usage.`);
}

function printHelp() {
  console.log(`Krs runtime v${VERSION}

Usage:
  krs run <file.krs>       Run a script
  krs repl                 Interactive REPL
  krs init [name]          Create a new project
  krs test [dir]           Run *_test.krs files
  krs install [pkg...]     Install packages
  krs search <keyword>     Search registry
  krs list                 Installed packages
  krs list stdlib          Built-in modules
  krs --version            Show version
  krs --help               Show help
`);
}
