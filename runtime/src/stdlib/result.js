export function Ok(value) {
  return {
    ok: true,
    value,
    isOk: () => true,
    isErr: () => false,
  };
}

export function Err(error) {
  return {
    ok: false,
    error,
    isOk: () => false,
    isErr: () => true,
  };
}

export function unwrap(result) {
  if (result.isErr()) throw new Error(String(result.error));
  return result.value;
}

export function map(result, fn) {
  if (result.isErr()) return result;
  return Ok(fn(result.value));
}
