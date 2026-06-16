# Krs

A lightweight, readable programming language (`.krs` files). English syntax, Node.js-style modules, batteries included.

## Features

- Simple syntax: `if … then … end`, `fn`, `for each`, `class`
- Modules: `use`, `export`, `loadAll`
- 18 built-in stdlib modules (`@stdlib/...`)
- Package manager: `krs install`
- VS Code extension with syntax highlighting + IntelliSense

## Requirements

- [Node.js 18+](https://nodejs.org)

## Install

```bat
install.bat
fix-krs.bat
```

Close and reopen your terminal, then:

```bat
krs --version
krs run examples\hello.krs
```

**Without global install:**

```bat
node runtime\bin\krs.js run examples\hello.krs
```

## Quick example

```krs
use "@stdlib/log.krs" as Logger

let log = Logger.create("app")
log.info("Hello, Krs!")
```

## Project structure

```
krs/
├── runtime/          # Interpreter & CLI
├── stdlib/           # Stdlib reference (implementation in runtime/)
├── registry/         # Community packages
├── examples/         # Small demos
└── vscode-krs/       # VS Code extension
```

## Commands

| Command | Description |
|---------|-------------|
| `krs run file.krs` | Run a script |
| `krs install [pkg]` | Install packages |
| `krs search <word>` | Search registry |
| `krs list` | Installed packages |
| `krs list stdlib` | Built-in modules |

## Packages

```bat
krs install colors table
```

```krs
use "krs:colors"
print(colors.success("It works!"))
```

See [registry/README.md](registry/README.md).

## VS Code

```bat
cd vscode-krs
install.bat
```

Reload VS Code — `.krs` files get colors, autocomplete and snippets.

## Documentation

- [Syntax reference](docs/SYNTAX.md)
- [Stdlib modules](stdlib/README.md)
- [Package registry](registry/README.md)

## License

MIT
