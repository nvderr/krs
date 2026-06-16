# Krs Syntax Reference

## Variables

```krs
let name = "Alice"
let age: number = 30
const MAX = 100
```

## Functions

```krs
fn greet(name) return "Hi " + name

fn process(data) {
  return data.trim()
}
```

## Control flow

```krs
if score >= 50 then
  print("Pass")
else
  print("Fail")
end

for each item in items
  print(item)
end

while running
  tick()
end

until done
  work()
end

repeat 5 times
  print("tick")
end

repeat count times
  process()
end

unless ready then
  wait()
end
```

## Guard (early return)

```krs
fn findUser(id) {
  guard id > 0 else return Err("invalid id")
  return Ok(loadUser(id))
}
```

## Result types

Built-in `Ok()` and `Err()`:

```krs
fn divide(a, b) {
  guard b != 0 else return Err("division by zero")
  return Ok(a / b)
}

let r = divide(10, 2)
if r.isOk() then
  print(r.value)
else
  print(r.error)
end
```

Or use `@stdlib/result.krs` for `unwrap()` and `map()`.

## Modules

```krs
use stdlib.log
use "@stdlib/log.krs" as Logger
use "krs:colors"
use "./config.krs"

export fn myFn() { ... }
loadAll "commands/"
```

## Switch & enum

```krs
enum Status { Pending, Active, Done }

switch value
  case 1 then print("one")
  default print("other")
end
```

## Pipeline

```krs
let result = input |> trim |> lower
```

## CLI

```bat
krs run main.krs
krs repl
krs init my-app
krs test
```
