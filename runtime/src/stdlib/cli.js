export function parse(argv, config = {}) {
  const result = { _: [], flags: {}, command: null };
  const args = [...argv];
  if (args[0]?.includes('node') || args[0]?.includes('krs')) args.shift();
  if (args[0]?.endsWith('.krs')) args.shift();

  const flags = config.flags || {};
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const def = flags[key] || flags[key.split('=')[0]];
      if (def?.type === 'bool') result.flags[key] = true;
      else { i++; result.flags[key] = args[i]; }
    } else if (arg.startsWith('-')) {
      const alias = arg.slice(1);
      const entry = Object.entries(flags).find(([, v]) => v.alias === alias);
      if (entry) {
        const [key, def] = entry;
        if (def.type === 'bool') result.flags[key] = true;
        else { i++; result.flags[key] = args[i]; }
      }
    } else if (!result.command && config.subcommands?.[arg]) {
      result.command = arg;
    } else {
      result._.push(arg);
    }
    i++;
  }
  return result;
}

export function success(msg) { console.log(`✓ ${msg}`); }
export function error(msg) { console.error(`✗ ${msg}`); }
export function info(msg) { console.log(`ℹ ${msg}`); }
