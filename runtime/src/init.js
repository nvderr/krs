import fs from 'node:fs';
import path from 'node:path';

const TEMPLATE = `use "@stdlib/log.krs" as Logger

let log = Logger.create("app")

fn main() {
  log.info("Hello from Krs!")
}

main()
`;

export function initProject(name = 'my-app') {
  const dir = path.resolve(process.cwd(), name);

  if (fs.existsSync(dir)) {
    throw new Error(`Folder already exists: ${dir}`);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'main.krs'), TEMPLATE);
  fs.writeFileSync(path.join(dir, 'krs.json'), JSON.stringify({
    name,
    version: '1.0.0',
    entry: 'main.krs',
    dependencies: {},
  }, null, 2) + '\n');

  console.log(`Created ${name}/`);
  console.log(`  main.krs`);
  console.log(`  krs.json`);
  console.log(`\nRun: cd ${name} && krs run main.krs`);
}
