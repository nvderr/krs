export function round(n, d = 0) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

export function avg(arr) {
  return arr.length ? sum(arr) / arr.length : 0;
}

export function min(...args) {
  return Math.min(...args);
}

export function max(...args) {
  return Math.max(...args);
}

export function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
