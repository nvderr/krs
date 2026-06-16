import http from 'node:http';
import https from 'node:https';

export function createServer() {
  const routes = [];
  const app = {
    get: (p, h) => routes.push({ method: 'GET', path: p, handler: h }),
    post: (p, h) => routes.push({ method: 'POST', path: p, handler: h }),
    put: (p, h) => routes.push({ method: 'PUT', path: p, handler: h }),
    delete: (p, h) => routes.push({ method: 'DELETE', path: p, handler: h }),
    use: () => app,
    listen: (port, cb) => {
      const server = http.createServer(async (req, res) => {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', async () => {
          const request = {
            method: req.method,
            path: req.url.split('?')[0],
            query: Object.fromEntries(new URLSearchParams(req.url.split('?')[1] || '')),
            body: body ? tryJson(body) : {},
            params: {},
          };
          const response = {
            status(code) { res.statusCode = code; return response; },
            json(data) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); },
            send(text) { res.end(String(text)); },
          };
          for (const route of routes) {
            if (route.method === request.method && match(route.path, request.path, request)) {
              await route.handler(request, response);
              return;
            }
          }
          response.status(404).json({ error: 'Not found' });
        });
      });
      server.listen(port, cb);
      return app;
    },
  };
  return app;
}

function tryJson(s) {
  try { return JSON.parse(s); } catch { return s; }
}

function match(pattern, url, req) {
  const pp = pattern.split('/');
  const up = url.split('/');
  if (pp.length !== up.length) return false;
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) req.params[pp[i].slice(1)] = up[i];
    else if (pp[i] !== up[i]) return false;
  }
  return true;
}

export async function get(url) {
  return fetch(url, { method: 'GET' });
}

export async function post(url, opts = {}) {
  return fetch(url, { method: 'POST', ...opts });
}

export async function fetch(url, opts = {}) {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(url, { method: opts.method || 'GET', headers: opts.headers || {} }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          json: () => JSON.parse(data),
          text: () => data,
        });
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body));
    req.end();
  });
}
