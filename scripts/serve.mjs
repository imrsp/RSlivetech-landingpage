import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const outputDir = path.resolve(process.argv[2] ?? "dist");
const port = Number(process.env.PORT ?? "4173");
const host = process.env.HOST ?? "0.0.0.0";
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
};

const mimeTypesByExtension = new Map([
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
  return mimeTypesByExtension.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { ...securityHeaders, "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function cachePolicy(filePath) {
  if (path.extname(filePath).toLowerCase() === ".html") {
    return "no-cache, max-age=0, must-revalidate";
  }

  if (/\.[a-f0-9]{12}\.[^.]+$/i.test(path.basename(filePath))) {
    return "public, max-age=31536000, immutable";
  }

  return "no-cache, max-age=0, must-revalidate";
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed", { Allow: "GET, HEAD" });
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new url.URL(req.url ?? "/", "http://localhost").pathname);
  } catch {
    send(res, 400, "Bad request");
    return;
  }

  if (pathname === "/") pathname = "/index.html";

  const filePath = path.resolve(outputDir, `.${pathname}`);
  const relativePath = path.relative(outputDir, filePath);
  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    let resolvedPath = fs.realpathSync(filePath);
    const relativeRealPath = path.relative(fs.realpathSync(outputDir), resolvedPath);
    if (relativeRealPath === ".." || relativeRealPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeRealPath)) {
      send(res, 403, "Forbidden");
      return;
    }

    let stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
      stat = fs.statSync(resolvedPath);
    }

    if (!stat.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    const headers = {
      "Content-Type": contentType(resolvedPath),
      "Content-Length": stat.size,
      "Cache-Control": cachePolicy(resolvedPath),
    };
    res.writeHead(200, { ...securityHeaders, ...headers });
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(resolvedPath).pipe(res);
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
      send(res, 404, "Not found");
      return;
    }
    send(res, 400, "Bad request");
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${outputDir} at http://${host}:${port}`);
});
