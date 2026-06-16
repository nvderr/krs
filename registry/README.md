# Krs Package Registry

Official registry for community Krs modules.

**Registry URL:** `https://registry.krs.dev` (local: `registry/registry.json`)

## Install a package

```bash
krs install colors
krs install table validator
```

Or add to `krs.json` and run:

```json
{
  "dependencies": {
    "colors": "^1.0.0",
    "table": "^1.0.0"
  }
}
```

```bash
krs install
```

Packages are installed to `krs_modules/`.

## Use in code

```krs
use "krs:colors"
use "krs:table"

print(colors.success("It works!"))
```

## Search packages

```bash
krs search cli
krs search http
krs list
krs list stdlib
```

## Available packages

| Package | Description |
|---------|-------------|
| `colors` | Terminal colors & styling |
| `table` | ASCII tables |
| `validator` | Email, URL, form validation |
| `slug` | URL-friendly slugs |
| `fetch-plus` | HTTP with retries & timeout |
| `cache` | In-memory TTL cache |
| `uuid` | UUID & random IDs |
| `progress` | Progress bars & spinners |
| `csv` | CSV parse/generate |
| `markdown` | Markdown → HTML |

## Publish (local)

1. Create a folder in `registry/packages/my-package/`
2. Add `index.krs` with exports
3. Register in `registry/registry.json`:

```json
"my-package": {
  "version": "1.0.0",
  "description": "My awesome module",
  "local": "my-package"
}
```

4. Users run `krs install my-package`
