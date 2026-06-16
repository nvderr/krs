/**
 * Transpile Krs source to JavaScript.
 */

const BLOCK_END = '___KRS_END___';

export function transpile(source, { filePath = '<stdin>' } = {}) {
  let raw = stripComments(source);
  const { body, imports, exports } = extractDirectives(raw);

  let js = body;
  js = transformEnum(js);
  js = transformSwitch(js);
  js = transformUnless(js);
  js = transformPipeline(js);
  js = transformClasses(js);
  js = transformInlineFnReturn(js);
  js = transformFunctions(js);
  js = transformControlFlow(js);
  js = transformLoops(js);
  js = transformTryCatch(js);
  js = transformOperators(js);
  js = transformSelf(js);
  js = closeBlocks(js);

  const importLines = imports.map((i) => i.js).join('\n');
  const exportLines = buildExportBlock(exports);

  return `${importLines}
${js}
${exportLines}`.trim();
}

export function parseLoadAllDirs(source) {
  const dirs = [];
  for (const line of stripComments(source).split('\n')) {
    const m = line.trim().match(/^loadAll\s+"([^"]+)"/);
    if (m) dirs.push(m[1]);
  }
  return dirs;
}

function stripComments(source) {
  let result = '';
  let i = 0;
  while (i < source.length) {
    if (source[i] === '"' || source[i] === "'" || source[i] === '`') {
      const quote = source[i];
      result += quote;
      i++;
      while (i < source.length) {
        if (source[i] === '\\') {
          result += source[i] + (source[i + 1] || '');
          i += 2;
          continue;
        }
        result += source[i];
        if (source[i] === quote) { i++; break; }
        i++;
      }
      continue;
    }
    if (source.slice(i, i + 2) === '//') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (source.slice(i, i + 2) === '/*') {
      i += 2;
      while (i < source.length && source.slice(i, i + 2) !== '*/') i++;
      i += 2;
      continue;
    }
    result += source[i++];
  }
  return result;
}

function extractDirectives(source) {
  const imports = [];
  const exports = [];
  const bodyLines = [];

  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) { bodyLines.push(line); continue; }

    let m = trimmed.match(/^use\s+"([^"]+)"(?:\s+as\s+(\w+))?/);
    if (m) {
      const spec = m[1];
      const alias = m[2] || defaultAlias(spec);
      imports.push({
        spec,
        alias,
        js: `const ${alias} = await __krs.import(${JSON.stringify(spec)});`,
      });
      continue;
    }

    m = trimmed.match(/^loadAll\s+"([^"]+)"/);
    if (m) continue;

    m = trimmed.match(/^export\s+default\s+/);
    if (m) {
      bodyLines.push(line.replace(/^export\s+default\s+/, 'const __krs_default = '));
      exports.push({ kind: 'default', name: '__krs_default' });
      continue;
    }

    m = trimmed.match(/^export\s+(let|const|fn|class|async)\s+(\w+)/);
    if (m) {
      exports.push({ kind: m[1], name: m[2] });
      bodyLines.push(line.replace(/^export\s+/, ''));
      continue;
    }

    m = trimmed.match(/^export\s+fn\s+(\w+)/);
    if (m) {
      exports.push({ kind: 'fn', name: m[1] });
      bodyLines.push(line.replace(/^export\s+/, ''));
      continue;
    }

    bodyLines.push(line);
  }

  return { body: bodyLines.join('\n'), imports, exports };
}

function defaultAlias(spec) {
  if (spec.startsWith('krs:')) return spec.slice(4);
  const base = spec.split('/').pop().replace(/\.krs$/, '');
  const stdMap = {
    log: 'log', env: 'env', discord: 'discord', json: 'json',
    http: 'http', fs: 'fs', utils: 'utils', path: 'path',
    crypto: 'crypto', math: 'math', string: 'string', array: 'array',
    colors: 'colors', process: 'process', test: 'test', cli: 'cli', db: 'db',
  };
  for (const [k, v] of Object.entries(stdMap)) {
    if (spec.includes(`stdlib/${k}`)) return v;
  }
  return base.replace(/[^a-zA-Z0-9_]/g, '_') || 'mod';
}

function transformEnum(code) {
  return code.replace(
    /enum\s+(\w+)\s*\{([^}]+)\}/g,
    (_, name, body) => {
      const values = body.split(',').map((v) => v.trim()).filter(Boolean);
      const entries = values.map((v) => `${v}: "${v}"`).join(', ');
      return `const ${name} = { ${entries} };`;
    },
  );
}

function transformSwitch(code) {
  const lines = code.split('\n');
  const out = [];
  for (let line of lines) {
    let t = line;
    t = t.replace(/^(\s*)switch\s+(.+?)\s*$/, '$1switch ($2) {');
    t = t.replace(/^(\s*)case\s+(.+?)\s+then\s*$/, '$1case $2:');
    t = t.replace(/^(\s*)case\s+(.+?)\s+then\s+(.*)$/, '$1case $2: $3');
    t = t.replace(/^(\s*)default\s*$/, '$1default:');
    if (/^\s*end\s*$/.test(t) && out.some((l) => l.includes('switch ('))) {
      // handled by closeBlocks
    }
    out.push(t);
  }
  return out.join('\n');
}

function transformUnless(code) {
  return code.replace(
    /^(\s*)unless\s+(.+?)\s+then\s*$/gm,
    '$1if (!($2)) {',
  ).replace(
    /^(\s*)unless\s+(.+?)\s+then\s+(.+)$/gm,
    '$1if (!($2)) { $3',
  );
}

function transformPipeline(code) {
  return code.replace(
    /([^\n|]+?)\s*\|>\s*(.+)/g,
    (match, val, rest) => {
      if (!rest.includes('|>')) {
        const fns = rest.split('|>').map((f) => f.trim());
        return `__pipe(${val.trim()}, ${fns.join(', ')})`;
      }
      return match;
    },
  );
}

function transformClasses(code) {
  return code
    .replace(/\bclasse\b/g, 'class')
    .replace(/\bfn\s+init\s*\(/g, 'constructor(');
}

function transformFunctions(code) {
  code = code.replace(/\basync\s+fn\s+(\w+)\s*\(([^)]*)\)\s+return\s+(.+)/g, 'async function $1($2) { return $3; }');
  code = code.replace(/\bfn\s+(\w+)\s*\(([^)]*)\)\s+return\s+(.+)/g, 'function $1($2) { return $3; }');
  code = code.replace(/\basync\s+fn\s+/g, 'async function ');
  code = code.replace(/\bfn\s*\(/g, 'function(');
  code = code.replace(/\bfn\s+/g, 'function ');
  return code;
}

function transformInlineFnReturn(code) {
  return code.replace(/\bfn\s+(\w+)\s+return\s+(\([^)]*\)|[^),]+)/g, 'function($1) { return $2; }');
}

function transformControlFlow(code) {
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    let t = line;
    t = t.replace(/^(\s*)if\s+(.+?)\s+then\s+return\s+end\s*$/, '$1if ($2) { return; }');
    t = t.replace(/^(\s*)if\s+(.+?)\s+then\s+(.+?)\s+end\s*$/, '$1if ($2) { $3 }');
    t = t.replace(/^(\s*)else\s+if\s+(.+?)\s+then\s*$/, '$1} else if ($2) {');
    t = t.replace(/^(\s*)else\s+if\s+(.+?)\s+then\s+(.*)$/, '$1} else if ($2) { $3');
    t = t.replace(/^(\s*)if\s+(.+?)\s+then\s*$/, '$1if ($2) {');
    t = t.replace(/^(\s*)if\s+(.+?)\s+then\s+(.*)$/, '$1if ($2) { $3');
    t = t.replace(/^(\s*)else\s*$/, '$1} else {');
    if (/^\s*end\s*$/.test(t)) {
      t = line.replace(/^\s*end\s*$/, `${line.match(/^\s*/)[0]}${BLOCK_END}`);
    }
    out.push(t);
  }
  return out.join('\n');
}

function transformLoops(code) {
  code = code.replace(/^(\s*)for\s+each\s+(\w+)\s+in\s+(.+?)\s*$/gm, '$1for (const $2 of $3) {');
  code = code.replace(/^(\s*)while\s+(.+?)\s*$/gm, '$1while ($2) {');
  return code;
}

function transformTryCatch(code) {
  return code
    .replace(/\btry\s*$/gm, 'try {')
    .replace(/^(\s*)catch\s*\(([^)]*)\)\s*$/gm, '$1} catch ($2) {')
    .replace(/^(\s*)finally\s*$/gm, '$1} finally {');
}

function transformOperators(code) {
  return code
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\s+/g, '!')
    .replace(/\btrue\b/g, 'true')
    .replace(/\bfalse\b/g, 'false')
    .replace(/\bnull\b/g, 'null');
}

function transformSelf(code) {
  return code.replace(/\bself\b/g, 'this');
}

function closeBlocks(code) {
  return code.replace(new RegExp(BLOCK_END, 'g'), '}');
}

function buildExportBlock(exports) {
  if (exports.length === 0) return '';
  return '\n' + exports.map((e) => {
    if (e.kind === 'default') return 'exports.default = __krs_default;';
    return `exports.${e.name} = ${e.name};`;
  }).join('\n') + '\n';
}
