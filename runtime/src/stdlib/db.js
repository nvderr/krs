import fs from 'node:fs';
import path from 'node:path';

export function open(filePath) {
  const store = { file: filePath, data: {} };
  if (fs.existsSync(filePath)) {
    store.data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {
    get(key) { return store.data[key]; },
    set(key, value) {
      store.data[key] = value;
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(store.data, null, 2));
    },
    collection(name) {
      if (!store.data[name]) store.data[name] = [];
      const col = store.data[name];
      return {
        all: () => col,
        insert: (item) => { col.push(item); store.set(name, col); return item; },
        find: (fn) => col.find(fn),
        filter: (fn) => col.filter(fn),
      };
    },
  };
}

export function json(filePath) {
  return open(filePath);
}
