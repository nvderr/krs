# Krs Standard Library

Built-in modules — no install required. Implementation: `runtime/src/stdlib/`.

```krs
use "@stdlib/log.krs"
```

Run `krs list stdlib` for the full list.

## Core

| Module | Description |
|--------|-------------|
| `log` | Logging |
| `env` | Environment variables |
| `json` | JSON parse/stringify |
| `process` | cwd, argv, exit |
| `path` | Path helpers |

## Web

| Module | Description |
|--------|-------------|
| `http` | HTTP server & client |
| `discord` | Discord bot |

## Data

| Module | Description |
|--------|-------------|
| `fs` | Files |
| `db` | JSON store |
| `crypto` | Hash, UUID |

## Text & math

| Module | Description |
|--------|-------------|
| `string` | String helpers |
| `array` | Array helpers |
| `math` | Math functions |
| `utils` | Time, sleep, validation |
| `colors` | Terminal colors |

## Dev tools

| Module | Description |
|--------|-------------|
| `cli` | CLI args |
| `test` | Unit tests |
| `regex` | Regular expressions |
| `result` | Ok/Err helpers |

## Community packages

```bat
krs install colors
```

```krs
use "krs:colors"
```

See [registry/README.md](../registry/README.md).
