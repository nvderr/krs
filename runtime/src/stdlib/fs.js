import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

export async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

export function readTextSync(filePath) {
  return fsSync.readFileSync(filePath, 'utf8');
}

export async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}

export function writeTextSync(filePath, content) {
  fsSync.mkdirSync(path.dirname(filePath), { recursive: true });
  fsSync.writeFileSync(filePath, content, 'utf8');
}

export function exists(filePath) {
  return fsSync.existsSync(filePath);
}

export async function mkdir(dir, opts = {}) {
  await fs.mkdir(dir, { recursive: opts.recursive !== false });
}

export function list(dir) {
  return fsSync.readdirSync(dir, { withFileTypes: true }).map((e) => ({
    name: e.name,
    isFile: e.isFile(),
    isDirectory: e.isDirectory(),
  }));
}

export function readJson(filePath) {
  return JSON.parse(readTextSync(filePath));
}

export function writeJson(filePath, data) {
  writeTextSync(filePath, JSON.stringify(data, null, 2));
}

export function remove(target, opts = {}) {
  if (opts.recursive) fsSync.rmSync(target, { recursive: true, force: true });
  else fsSync.unlinkSync(target);
}

export function copy(from, to) {
  fsSync.copyFileSync(from, to);
}
