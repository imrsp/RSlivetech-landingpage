import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const buildModule = path.join(root, "scripts", "build.mjs");

const build = async () => {
  await import(`${pathToFileURL(buildModule).href}?t=${Date.now()}`);
};

let rebuilding = false;
let pending = false;

const scheduleBuild = () => {
  if (rebuilding) {
    pending = true;
    return;
  }

  rebuilding = true;
  build()
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      rebuilding = false;
      if (pending) {
        pending = false;
        scheduleBuild();
      }
    });
};

await build();

const server = spawn(process.execPath, [path.join(root, "scripts", "serve.mjs"), "dist"], {
  stdio: "inherit",
  env: {
    ...process.env,
    HOST: process.env.HOST ?? "0.0.0.0",
    PORT: process.env.PORT ?? "4173",
  },
});

const watchTargets = [path.join(root, "index.html"), path.join(root, "src")];

for (const target of watchTargets) {
  if (!fs.existsSync(target)) {
    continue;
  }

  fs.watch(target, { recursive: fs.statSync(target).isDirectory() }, () => {
    scheduleBuild();
  });
}

process.on("SIGINT", () => {
  server.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.kill("SIGTERM");
  process.exit(0);
});
