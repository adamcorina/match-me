import { execSync } from "child_process";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");

async function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  for (const file of ["questions.js", "compat.js", "app.js"]) {
    const src = fs.readFileSync(join(__dirname, file), "utf8");
    const result = await minify(src, { mangle: true, compress: true });
    const outName = file.replace(".js", ".min.js");
    fs.writeFileSync(join(DIST, outName), result.code);
    console.log(`Minified ${file} → dist/${outName}`);
  }

  let html = fs.readFileSync(join(__dirname, "index.html"), "utf8");
  html = html
    .replace('src="questions.js"', 'src="questions.min.js"')
    .replace('src="compat.js"',    'src="compat.min.js"')
    .replace('src="app.js"',       'src="app.min.js"');
  fs.writeFileSync(join(DIST, "index.html"), html);
  console.log("Copied and patched index.html");

  fs.copyFileSync(join(__dirname, "style.css"), join(DIST, "style.css"));
  console.log("Copied style.css");

  for (const file of ["favicon.ico", "favicon.png"].filter(f => fs.existsSync(join(__dirname, f)))) {
    fs.copyFileSync(join(__dirname, file), join(DIST, file));
    console.log(`Copied ${file}`);
  }

  fs.mkdirSync(join(DIST, "share"), { recursive: true });
  fs.copyFileSync(join(__dirname, "share/index.html"), join(DIST, "share/index.html"));
  console.log("Copied share/index.html");

  fs.mkdirSync(join(DIST, "complete"), { recursive: true });
  fs.copyFileSync(join(__dirname, "complete/index.html"), join(DIST, "complete/index.html"));
  console.log("Copied complete/index.html");

  fs.writeFileSync(join(DIST, "CNAME"), "match-me.velea.cc");
  console.log("Written CNAME");

  console.log("\nDeploying to gh-pages...");
  execSync(`cd dist && git init && git add . && git commit -m "deploy" && git push --force git@github.com:adamcorina/match-me.git HEAD:gh-pages`, { stdio: "inherit" });
  fs.rmSync(DIST, { recursive: true, force: true });
  console.log("\nDone. gh-pages updated.");
}

build().catch(console.error);
