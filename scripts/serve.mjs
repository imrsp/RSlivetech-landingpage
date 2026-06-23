import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.resolve(process.argv[2] ?? "dist");
const port = Number(process.env.PORT ?? "4173");
const host = process.env.HOST ?? "0.0.0.0";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
]);

function contentType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const requestUrl = new url.URL(req.url ?? "/", `http://${req.headers.host ?? host}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      if (fs.existsSync(indexPath)) {
        send(res, 200, fs.readFileSync(indexPath), { "Content-Type": "text/html; charset=utf-8" });
        return;
      }
      send(res, 404, "Not found");
      return;
    }

    send(res, 200, fs.readFileSync(filePath), { "Content-Type": contentType(filePath) });
  } catch {
    const fallback = path.join(root, "index.html");
    if (fs.existsSync(fallback)) {
      send(res, 200, fs.readFileSync(fallback), { "Content-Type": "text/html; charset=utf-8" });
      return;
    }
    send(res, 404, "Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
