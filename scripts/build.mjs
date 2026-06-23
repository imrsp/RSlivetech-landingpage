import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");

function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, target) {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyTree(source, target) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  ensureDir(target);

  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyTree(from, to);
    } else if (entry.isFile()) {
      copyFile(from, to);
    }
  }
}

removeDir(distDir);
ensureDir(distDir);

copyFile(path.join(root, "index.html"), path.join(distDir, "index.html"));
copyFile(path.join(root, "src", "styles.css"), path.join(distDir, "src", "styles.css"));

const assetsDir = path.join(root, "src", "assets");
if (fs.existsSync(assetsDir)) {
  copyTree(assetsDir, path.join(distDir, "src", "assets"));
}

console.log("Built dist/");
