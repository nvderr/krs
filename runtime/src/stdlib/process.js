export function cwd() {
  return process.cwd();
}

export function exit(code = 0) {
  process.exit(code);
}

export const argv = process.argv;

export function env() {
  return process.env;
}

export function platform() {
  return process.platform;
}
