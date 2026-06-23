import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, "src");
const outputDir = path.join(projectRoot, "dist");
const hashedFiles = new Map();

function fingerprint(filePath) {
  const digest = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").slice(0, 12);
  const extension = path.extname(filePath);
  return `${path.basename(filePath, extension)}.${digest}${extension}`;
}

function assertFileProtocolCompatibility(htmlPath, html) {
  if (/<script\b[^>]*\btype=["']module["']/i.test(html)) {
    throw new Error(`${path.basename(htmlPath)} uses a module script, which is not file:// compatible.`);
  }

  for (const match of html.matchAll(/\b(?:src|href|srcset)=["']([^"']+)\1?/gi)) {
    const value = match[1];
    for (const entry of value.split(/,\s*/)) {
      const resource = entry.trim().split(/\s+/)[0];
      if (resource.startsWith("/") && !resource.startsWith("//")) {
        throw new Error(`${path.basename(htmlPath)} uses a root-relative resource: ${resource}`);
      }
    }
  }
}

function assertClassicRuntime(scriptPath) {
  const script = fs.readFileSync(scriptPath, "utf8");
  const unsupported = [
    [/^\s*(?:import|export)\s/m, "ES module syntax"],
    [/\bimport\s*\(/, "dynamic import"],
    [/\bfetch\s*\(/, "fetch"],
    [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  ];

  for (const [pattern, feature] of unsupported) {
    if (pattern.test(script)) {
      throw new Error(`src/main.js uses ${feature}, which requires an explicit file:// compatibility review.`);
    }
  }
}

function assertRelativeCssResources(stylePath) {
  const style = fs.readFileSync(stylePath, "utf8");

  for (const match of style.matchAll(/url\(["']?(\/[^)"']*)/gi)) {
    if (!match[1].startsWith("//")) {
      throw new Error(`src/styles.css uses a root-relative resource: ${match[1]}`);
    }
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function collectHashedFiles(source, relativeDir = "") {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const relativePath = path.posix.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      collectHashedFiles(sourcePath, relativePath);
      continue;
    }

    if (!entry.isFile()) continue;

    const outputName = fingerprint(sourcePath);
    const outputRelativePath = path.posix.join(relativeDir, outputName);
    const outputPath = path.join(outputDir, ...outputRelativePath.split("/"));
    ensureDir(path.dirname(outputPath));
    fs.copyFileSync(sourcePath, outputPath);
    hashedFiles.set(relativePath, outputRelativePath);
  }
}

function rewriteResource(resource, htmlPath) {
  const queryIndex = resource.indexOf("?");
  const pathname = queryIndex === -1 ? resource : resource.slice(0, queryIndex);
  if (!pathname.startsWith(".") || pathname.startsWith("../")) return resource;

  const htmlDir = path.dirname(path.relative(projectRoot, htmlPath)).split(path.sep).join("/");
  const sourceRelativePath = path.posix.normalize(path.posix.join(htmlDir, pathname));
  const mappedPath = hashedFiles.get(sourceRelativePath);

  if (!mappedPath) {
    throw new Error(`${path.basename(htmlPath)} references a missing or unhashed local resource: ${resource}`);
  }

  const relativeOutputDir = path.posix.dirname(htmlDir);
  let outputResource = path.posix.relative(relativeOutputDir === "." ? "." : relativeOutputDir, mappedPath);
  if (!outputResource.startsWith(".")) outputResource = `./${outputResource}`;
  return outputResource;
}

function rewriteHtml(htmlPath) {
  const original = fs.readFileSync(htmlPath, "utf8");
  let html = original.replace(/\b(src|href|srcset)=(['"])(.*?)\2/gi, (attribute, name, quote, value) => {
    const rewritten = value.split(/(,\s*)/).map((part) => {
      if (part.startsWith(",")) return part;
      const pieces = part.trim().split(/\s+/);
      if (pieces.length === 0) return part;
      pieces[0] = rewriteResource(pieces[0], htmlPath);
      const leadingWhitespace = part.match(/^\s*/)?.[0] ?? "";
      return leadingWhitespace + pieces.join(" ");
    }).join("");
    return `${name}=${quote}${rewritten}${quote}`;
  });

  assertFileProtocolCompatibility(htmlPath, html);
  return html;
}

for (const entry of fs.readdirSync(projectRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  const htmlPath = path.join(projectRoot, entry.name);
  assertFileProtocolCompatibility(htmlPath, fs.readFileSync(htmlPath, "utf8"));
}

assertClassicRuntime(path.join(sourceDir, "main.js"));
assertRelativeCssResources(path.join(sourceDir, "styles.css"));

fs.rmSync(outputDir, { recursive: true, force: true });
ensureDir(outputDir);
collectHashedFiles(sourceDir, "src");

for (const entry of fs.readdirSync(projectRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  const sourcePath = path.join(projectRoot, entry.name);
  const outputPath = path.join(outputDir, entry.name);
  fs.writeFileSync(outputPath, rewriteHtml(sourcePath));
}

const headersPath = path.join(projectRoot, "_headers");
if (fs.existsSync(headersPath)) fs.copyFileSync(headersPath, path.join(outputDir, "_headers"));

console.log(`Built dist/ with ${hashedFiles.size} fingerprinted assets`);
