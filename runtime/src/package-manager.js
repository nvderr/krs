import {
  installAll,
  installPackage,
  getInstalledPackages,
  searchPackages,
  loadRegistry,
  getProjectRoot,
} from './registry.js';

export async function runInstall(args) {
  const projectRoot = getProjectRoot();

  if (args.length === 0) {
    const results = installAll(projectRoot);
    if (results.length === 0) {
      console.log('No dependencies in krs.json. Install a package: krs install colors');
      return;
    }
    for (const r of results) {
      console.log(`+ ${r.name}@${r.version}`);
    }
    console.log(`\nInstalled ${results.length} package(s) to krs_modules/`);
    return;
  }

  for (const name of args) {
    const r = installPackage(name, projectRoot);
    console.log(`+ ${r.name}@${r.version} → krs_modules/${r.name}/`);
  }
}

export async function runSearch(query) {
  if (!query) {
    console.log('Usage: krs search <keyword>');
    return;
  }
  const results = searchPackages(query);
  if (results.length === 0) {
    console.log(`No packages found for "${query}"`);
    return;
  }
  console.log(`Found ${results.length} package(s):\n`);
  for (const pkg of results) {
    console.log(`  ${pkg.name}@${pkg.version}`);
    console.log(`    ${pkg.description || ''}`);
    console.log(`    krs install ${pkg.name}\n`);
  }
}

export async function runList() {
  const installed = getInstalledPackages();
  const names = Object.keys(installed);
  if (names.length === 0) {
    console.log('No packages installed. Try: krs install colors');
    return;
  }
  console.log('Installed packages:\n');
  for (const name of names) {
    const meta = installed[name];
    console.log(`  ${name}@${meta.version}`);
  }
}

export async function runRegistryInfo() {
  const reg = loadRegistry();
  const count = Object.keys(reg.packages).length;
  console.log(`Krs Registry — ${reg.registry}`);
  console.log(`${count} packages available. Use: krs search <keyword>`);
}
