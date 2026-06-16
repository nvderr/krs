const vscode = require('vscode');

const KEYWORDS = [
  'let', 'const', 'fn', 'if', 'then', 'else', 'end', 'while', 'for', 'each', 'in',
  'return', 'class', 'extends', 'export', 'default', 'use', 'loadAll', 'async', 'await',
  'try', 'catch', 'finally', 'throw', 'break', 'continue', 'enum', 'switch', 'case',
  'unless', 'and', 'or', 'not', 'true', 'false', 'null', 'self',
  'repeat', 'times', 'until', 'guard', 'else',
];

const STDLIB = [
  'log', 'env', 'discord', 'http', 'fs', 'db', 'cli', 'utils', 'json',
  'path', 'crypto', 'math', 'string', 'array', 'colors', 'process', 'test',
  'regex', 'result',
];

const SNIPPETS = {
  fn: 'fn ${1:name}(${2:args}) {\n\t$0\n}',
  'fn return': 'fn ${1:name}(${2:args}) return ${3:expr}',
  if: 'if ${1:cond} then\n\t$0\nend',
  'for each': 'for each ${1:item} in ${2:list}\n\t$0\nend',
  'repeat times': 'repeat ${1:5} times\n\t$0\nend',
  'until': 'until ${1:done}\n\t$0\nend',
  'guard': 'guard ${1:condition} else return ${2:Err("error")} end',
  'use stdlib': 'use stdlib.${1:log}',
  class: 'class ${1:Name} {\n\tfn init(${2:args}) {\n\t\t$0\n\t}\n}',
  use: 'use "@stdlib/${1:log}.krs"',
  'use krs': 'use "krs:${1:colors}"',
  export: 'export fn ${1:name}(${2:args}) {\n\t$0\n}',
};

const HOVER = {
  use: 'Import a module: `use "path/file.krs"` or `use "krs:package"`',
  loadAll: 'Load all .krs files in a directory and merge exports',
  export: 'Export a symbol from the current module',
  end: 'Closes a block (if, while, for, class, switch)',
  fn: 'Define a function',
  unless: 'Unless condition — runs if condition is false',
};

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('krs', {
      provideCompletionItems(doc, pos) {
        const line = doc.lineAt(pos).text.slice(0, pos.character);
        const items = [];

        if (line.match(/use\s+"?$/)) {
          for (const mod of STDLIB) {
            const item = new vscode.CompletionItem(`@stdlib/${mod}.krs`, vscode.CompletionItemKind.Module);
            item.insertText = `@stdlib/${mod}.krs"`;
            item.detail = 'stdlib module';
            items.push(item);
          }
          for (const pkg of ['colors', 'table', 'validator', 'slug', 'fetch-plus', 'cache', 'uuid']) {
            const item = new vscode.CompletionItem(`krs:${pkg}`, vscode.CompletionItemKind.Module);
            item.insertText = `krs:${pkg}"`;
            item.detail = 'registry package (krs install first)';
            items.push(item);
          }
          return items;
        }

        for (const kw of KEYWORDS) {
          const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
          if (SNIPPETS[kw]) {
            item.insertText = new vscode.SnippetString(SNIPPETS[kw]);
            item.kind = vscode.CompletionItemKind.Snippet;
          }
          items.push(item);
        }

        for (const [label, body] of Object.entries(SNIPPETS)) {
          if (KEYWORDS.includes(label)) continue;
          const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
          item.insertText = new vscode.SnippetString(body);
          items.push(item);
        }

        return items;
      },
    }, '"', '.'),

    vscode.languages.registerHoverProvider('krs', {
      provideHover(doc, pos) {
        const range = doc.getWordRangeAtPosition(pos, /[a-zA-Z_]+/);
        if (!range) return null;
        const word = doc.getText(range);
        if (HOVER[word]) {
          return new vscode.Hover(`**${word}**\n\n${HOVER[word]}`);
        }
        if (STDLIB.includes(word)) {
          return new vscode.Hover(`**stdlib.${word}**\n\nBuilt-in module:\n\`\`\`krs\nuse "@stdlib/${word}.krs"\n\`\`\``);
        }
        return null;
      },
    }),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
