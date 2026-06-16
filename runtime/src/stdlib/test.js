let passed = 0;
let failed = 0;

export function test(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r.then(() => { passed++; console.log(`✓ ${name}`); })
        .catch((e) => { failed++; console.log(`✗ ${name}: ${e.message}`); });
    }
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${name}: ${e.message}`);
  }
}

export function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

export function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) throw new Error(`Expected ${expected} got ${value}`);
    },
    toEqual(expected) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error('Not equal');
    },
    toBeTruthy() { if (!value) throw new Error('Expected truthy'); },
    toBeFalsy() { if (value) throw new Error('Expected falsy'); },
    toContain(item) { if (!value.includes(item)) throw new Error(`Missing ${item}`); },
    toThrow() {
      if (typeof value !== 'function') throw new Error('Expected function');
      value();
    },
  };
}

export function summary() {
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

export function beforeEach(fn) { globalThis.__krsBeforeEach = fn; }
export function afterEach(fn) { globalThis.__krsAfterEach = fn; }
