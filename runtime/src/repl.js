import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { transpile } from './transpile.js';
import { createRuntime } from './runner.js';
import pathMod from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = pathMod.dirname(fileURLToPath(import.meta.url));

export async function startRepl() {
  const tmpFile = path.join(__dirname, '..', '.repl-tmp.krs');
  const runtime = createRuntime(tmpFile);
  fs.writeFileSync(tmpFile, '// repl\n');

  console.log('Krs REPL v0.3 — type :exit to quit\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let buffer = '';
  let depth = 0;

  const prompt = () => rl.prompt('krs> ');

  rl.on('line', async (line) => {
    buffer += (buffer ? '\n' : '') + line;

    depth += (line.match(/\bthen\b|\bdo\b|\{/g) || []).length;
    depth -= (line.match(/\bend\b|\}/g) || []).length;

    if (line.trim() === ':exit') {
      rl.close();
      return;
    }

    if (depth > 0) {
      rl.setPrompt('...> ');
      rl.prompt();
      return;
    }

    rl.setPrompt('krs> ');

    try {
      const wrapped = `async function __repl() {\n${buffer}\n}\nawait __repl();`;
      fs.writeFileSync(tmpFile, wrapped);
      const js = transpile(wrapped, { filePath: tmpFile });
      const exports = {};
      const __krs = { import: (spec) => runtime.importModule(spec, tmpFile) };
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fn = new AsyncFunction(
        'exports', '__krs', 'print', 'console', 'Ok', 'Err', 'range', js + '\nreturn exports;',
      );
      const Ok = (v) => ({ ok: true, value: v, isOk: () => true, isErr: () => false });
      const Err = (e) => ({ ok: false, error: e, isOk: () => false, isErr: () => true });
      const range = (a, b) => {
        if (b === undefined) { b = a; a = 0; }
        const out = [];
        for (let i = a; i < b; i++) out.push(i);
        return out;
      };
      const result = await fn(exports, __krs, (...a) => console.log(...a), console, Ok, Err, range);
      if (result !== undefined && typeof result !== 'object') console.log(result);
    } catch (e) {
      console.error(e.message || e);
    }

    buffer = '';
    depth = 0;
    prompt();
  });

  rl.on('close', () => {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    console.log('Bye!');
    process.exit(0);
  });

  prompt();
}
