export function parse(text) {
  return JSON.parse(text);
}

export function stringify(value, opts = null) {
  if (opts?.pretty) {
    return JSON.stringify(value, null, 2);
  }
  return JSON.stringify(value);
}
