import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RUNTIME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function findRepoRoot(startDir = process.cwd()) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'registry', 'registry.json'))) return dir;
    if (fs.existsSync(path.join(dir, 'stdlib')) && fs.existsSync(path.join(dir, 'runtime'))) return dir;
    dir = path.dirname(dir);
  }
  const bundled = path.resolve(RUNTIME_ROOT, '..');
  if (fs.existsSync(path.join(bundled, 'registry', 'registry.json'))) return bundled;
  return startDir;
}

export function getRegistryPath(projectRoot = findRepoRoot()) {
  return path.join(projectRoot, 'registry', 'registry.json');
}

export function loadRegistry(projectRoot = findRepoRoot()) {
  const regPath = getRegistryPath(projectRoot);
  if (!fs.existsSync(regPath)) {
    return { registry: 'https://registry.krs.dev', packages: {} };
  }
  return JSON.parse(fs.readFileSync(regPath, 'utf8'));
}

export function findPackage(name, projectRoot = findRepoRoot()) {
  const registry = loadRegistry(projectRoot);
  const pkg = registry.packages[name];
  if (!pkg) return null;
  return { name, ...pkg };
}

export function searchPackages(query, projectRoot = findRepoRoot()) {
  const registry = loadRegistry(projectRoot);
  const q = query.toLowerCase();
  return Object.entries(registry.packages)
    .filter(([name, meta]) => {
      const hay = `${name} ${meta.description || ''} ${(meta.keywords || []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    })
    .map(([name, meta]) => ({ name, ...meta }));
}

export function getPackageSourceDir(name, projectRoot = findRepoRoot()) {
  const pkg = findPackage(name, projectRoot);
  if (!pkg) throw new Error(`Package not found in registry: ${name}`);
  if (pkg.local) {
    return path.join(projectRoot, 'registry', 'packages', pkg.local);
  }
  throw new Error(`Package ${name} has no local source (remote: ${pkg.url || 'unknown'})`);
}

export function getProjectRoot(startDir = process.cwd()) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'krs.json'))) return dir;
    dir = path.dirname(dir);
  }
  return startDir;
}

export function getModulesDir(projectRoot = getProjectRoot()) {
  return path.join(projectRoot, 'krs_modules');
}

export function readProjectManifest(projectRoot = getProjectRoot()) {
  const manifestPath = path.join(projectRoot, 'krs.json');
  if (!fs.existsSync(manifestPath)) return { dependencies: {} };
  const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!data.dependencies) data.dependencies = {};
  return data;
}

export function writeProjectManifest(projectRoot, data) {
  fs.writeFileSync(path.join(projectRoot, 'krs.json'), JSON.stringify(data, null, 2) + '\n');
}

export function getInstalledPackages(projectRoot = getProjectRoot()) {
  const modulesDir = getModulesDir(projectRoot);
  const lockPath = path.join(modulesDir, '.krs-lock.json');
  if (!fs.existsSync(lockPath)) return {};
  return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
}

export function saveInstalledPackages(projectRoot, lock) {
  const modulesDir = getModulesDir(projectRoot);
  fs.mkdirSync(modulesDir, { recursive: true });
  fs.writeFileSync(path.join(modulesDir, '.krs-lock.json'), JSON.stringify(lock, null, 2) + '\n');
}

export function resolveKrsPackage(name, projectRoot = getProjectRoot()) {
  const modulesDir = getModulesDir(projectRoot);
  const candidates = [
    path.join(modulesDir, name, 'index.krs'),
    path.join(modulesDir, name, 'main.krs'),
    path.join(modulesDir, name, `${name}.krs`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  const dir = path.join(modulesDir, name);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.krs'));
    if (files.length === 1) return path.join(dir, files[0]);
  }
  return null;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

export function installPackage(name, projectRoot = getProjectRoot()) {
  const root = findRepoRoot(projectRoot);
  const pkg = findPackage(name, root);
  if (!pkg) throw new Error(`Package "${name}" not found. Run: krs search ${name}`);

  const sourceDir = getPackageSourceDir(name, root);
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Package source missing: ${sourceDir}`);
  }

  const destDir = path.join(getModulesDir(projectRoot), name);
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  copyDir(sourceDir, destDir);

  const lock = getInstalledPackages(projectRoot);
  lock[name] = { version: pkg.version, installedAt: new Date().toISOString() };
  saveInstalledPackages(projectRoot, lock);

  return { name, version: pkg.version, path: destDir };
}

export function installAll(projectRoot = getProjectRoot()) {
  const manifest = readProjectManifest(projectRoot);
  const results = [];
  for (const name of Object.keys(manifest.dependencies)) {
    results.push(installPackage(name, projectRoot));
  }
  return results;
}
