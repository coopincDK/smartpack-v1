const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
};

http.createServer((req, res) => {
  let pathname = decodeURIComponent(url.parse(req.url).pathname);
  let filePath = path.join(ROOT, pathname);

  // Directory listing
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath).sort();
    const rows = files.map(f => {
      const fp = path.join(filePath, f);
      const isDir = fs.statSync(fp).isDirectory();
      const link = path.join(pathname, f).replace(/\\/g, '/');
      return `<li><a href="${link}${isDir ? '/' : ''}">${f}${isDir ? '/' : ''}</a></li>`;
    }).join('\n');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Index of ${pathname}</title>
<style>body{font-family:monospace;padding:20px;background:#111;color:#eee}a{color:#7cf}li{margin:4px 0}</style></head>
<body><h2>Index of ${pathname}</h2><ul>${rows}</ul></body></html>`);
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404); res.end('404 Not Found'); return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, {'Content-Type': mime});
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
