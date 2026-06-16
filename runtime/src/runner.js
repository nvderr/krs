import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { transpile, parseLoadAllDirs } from './transpile.js';
import { STDLIB_MAP } from './stdlib/index.js';
import { resolveKrsPackage, getProjectRoot } from './registry.js';

const moduleCache = new Map();

export function createRuntime(entryFile) {
  const entryDir = path.dirname(entryFile);
  const projectRoot = getProjectRoot(entryDir);
  const repoRoot = findRepoRoot(entryDir);
  loadEnv(entryDir, repoRoot, projectRoot);

  const context = { entryFile, entryDir, repoRoot, projectRoot };

  async function importModule(specifier, fromFile = entryFile) {
    // stdlib: @stdlib/log.krs
    if (specifier.startsWith('@stdlib/')) {
      const name = specifier.replace('@stdlib/', '').replace('.krs', '');
      if (STDLIB_MAP[name]) return STDLIB_MAP[name];
      throw new Error(`Unknown stdlib module: ${specifier}`);
    }

    // installed package: krs:colors
    if (specifier.startsWith('krs:')) {
      const pkgName = specifier.slice(4);
      const pkgPath = resolveKrsPackage(pkgName, projectRoot);
      if (!pkgPath) {
        throw new Error(`Package "${pkgName}" not installed. Run: krs install ${pkgName}`);
      }
      return importModule(pkgPath, fromFile);
    }

    const resolved = resolveRelative(specifier, fromFile);

    if (moduleCache.has(resolved)) {
      return moduleCache.get(resolved);
    }

    if (!fs.existsSync(resolved)) {
      throw new Error(`Module not found: ${specifier}\n  → ${resolved}`);
    }

    const source = fs.readFileSync(resolved, 'utf8');
    const js = transpile(source, { filePath: resolved });
    const exports = {};

    const __krs = {
      import: (spec) => importModule(spec, resolved),
    };

    const mod = await executeModule(js, exports, __krs);
    moduleCache.set(resolved, mod);
    return mod;
  }

  async function loadDirectory(dirSpec, fromFile = entryFile) {
    let dirPath = resolveRelative(dirSpec, fromFile);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isFile()) {
      dirPath = path.dirname(dirPath);
    }
    if (!fs.existsSync(dirPath)) {
      throw new Error(`loadAll directory not found: ${dirSpec} → ${dirPath}`);
    }

    const merged = {};
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.krs')).sort();

    for (const file of files) {
      const mod = await importModule(path.join(dirPath, file), fromFile);
      Object.assign(merged, mod);
    }

    return merged;
  }

  return { importModule, loadDirectory, context };
}

async function executeModule(js, exports, __krs, extraScope = {}) {
  const print = (...args) => console.log(...args);
  const range = (a, b) => {
    if (b === undefined) { b = a; a = 0; }
    const out = [];
    for (let i = a; i < b; i++) out.push(i);
    return out;
  };
  const __pipe = (val, ...fns) => fns.reduce((v, f) => f(v), val);

  const scopeNames = Object.keys(extraScope);
  const scopeValues = scopeNames.map((k) => extraScope[k]);

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const fnBody = `${js}\nreturn exports;`;

  const runner = new AsyncFunction(
    'exports',
    '__krs',
    'print',
    'console',
    'process',
    'JSON',
    'Math',
    'Date',
    'Array',
    'Object',
    'Promise',
    'fetch',
    'range',
    '__pipe',
    'AbortSignal',
    ...scopeNames,
    fnBody,
  );

  const result = await runner(
    exports,
    __krs,
    print,
    console,
    process,
    JSON,
    Math,
    Date,
    Array,
    Object,
    Promise,
    globalThis.fetch,
    range,
    __pipe,
    globalThis.AbortSignal,
    ...scopeValues,
  );

  return { ...exports, ...result };
}

function resolveRelative(specifier, fromFile) {
  if (specifier.startsWith('@stdlib/') || specifier.startsWith('krs:')) return specifier;
  const base = path.dirname(fromFile);
  let resolved = path.resolve(base, specifier);
  if (!resolved.endsWith('.krs')) {
    if (fs.existsSync(resolved + '.krs')) resolved += '.krs';
    else if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) return resolved;
  }
  return resolved;
}

function findRepoRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'stdlib')) && fs.existsSync(path.join(dir, 'runtime'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

function loadEnv(entryDir, repoRoot, projectRoot) {
  for (const dir of [entryDir, projectRoot, repoRoot, process.cwd()]) {
    const envFile = path.join(dir, '.env');
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile, override: false });
    }
  }
}

export async function runFile(entryFile) {
  const runtime = createRuntime(entryFile);
  const source = fs.readFileSync(entryFile, 'utf8');
  const js = transpile(source, { filePath: entryFile });

  const scope = {};

  for (const dir of parseLoadAllDirs(source)) {
    const loaded = await runtime.loadDirectory(dir, entryFile);
    Object.assign(scope, loaded);
  }

  const exports = {};
  const __krs = {
    import: (spec) => runtime.importModule(spec, entryFile),
  };

  await executeModule(js, exports, __krs, scope);
}
