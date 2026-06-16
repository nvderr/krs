export function test(pattern, text) {
  return new RegExp(pattern).test(text);
}

export function match(pattern, text) {
  return text.match(new RegExp(pattern));
}

export function replace(pattern, text, replacement) {
  return text.replace(new RegExp(pattern), replacement);
}

export function replaceAll(pattern, text, replacement) {
  return text.replace(new RegExp(pattern, 'g'), replacement);
}

export function split(pattern, text) {
  return text.split(new RegExp(pattern));
}

export function findAll(pattern, text) {
  const re = new RegExp(pattern, 'g');
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[0]);
  return out;
}
