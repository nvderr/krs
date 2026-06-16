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

async fn fetchData() {
  let res = await http.get(url)
  return res.json()
}
```

## Control flow

```krs
if score >= 50 then
  print("Pass")
else if score >= 30 then
  print("Retry")
else
  print("Fail")
end

for each item in items
  print(item)
end

while running
  tick()
end

unless done then
  work()
end
```

## Classes

```krs
class User {
  fn init(name) {
    self.name = name
  }

  fn hello() return "Hello " + self.name
}
```

## Modules

```krs
use "@stdlib/log.krs"
use "@stdlib/log.krs" as Logger
use "krs:colors"
use "./config.krs"

export fn myFn() { ... }
export let VERSION = "1.0.0"

loadAll "commands/"
```

## Switch & enum

```krs
enum Status { Pending, Active, Done }

switch value
  case 1 then print("one")
  case 2 then print("two")
  default print("other")
end
```

## Error handling

```krs
try {
  risky()
} catch (e) {
  log.error(e.message)
} finally {
  cleanup()
}
```

## Pipeline

```krs
let result = input |> trim |> lower |> capitalize
```

## Types (optional)

```krs
fn find(id: number): User | null { ... }
```
