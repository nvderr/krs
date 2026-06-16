# Krs

A lightweight, readable programming language (`.krs` files). English syntax, Node.js-style modules, batteries included.

## Features

- Simple syntax: `if … then … end`, `fn`, `for each`, `class`
- Loops: `repeat N times`, `until`, `unless`, `guard`
- Results: built-in `Ok()` / `Err()`
- Modules: `use`, `export`, `loadAll`, `use stdlib.log`
- 20 built-in stdlib modules
- Package manager: `krs install`
- CLI: `krs repl`, `krs init`, `krs test`
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
| `krs repl` | Interactive REPL |
| `krs init [name]` | Create a new project |
| `krs test [dir]` | Run `*_test.krs` files |
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

**On GitHub.com**, `.krs` is not an official language yet. This repo uses [`.gitattributes`](.gitattributes) so GitHub highlights `.krs` files like JavaScript. Full Krs colors work in VS Code/Cursor with the bundled extension.

To register Krs officially on GitHub later: [github/linguist](https://github.com/github/linguist/blob/master/docs/CreatingANewExtension.md).

## Documentation

- [Syntax reference](docs/SYNTAX.md)
- [Stdlib modules](stdlib/README.md)
- [Package registry](registry/README.md)

## License

MIT
