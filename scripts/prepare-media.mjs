import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const target = new URL("public/projects/magviz/v14/showcase-1080p.mp4", root);
const folder = new URL("media-source/magviz-v14/", root);
const expected = "cc2bfc2065b2a4025d367713c78a26cec43385433158b6f735a2f7ea8599fb3a";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const names = ["showcase.part1", "showcase.part2", "showcase.part3"];

if (process.argv.includes("--pack")) {
  const bytes = await readFile(target);
  if (hash(bytes) !== expected) throw new Error("Unexpected source film; refusing to pack");
  await mkdir(folder, { recursive: true });
  const size = 48 * 1024 * 1024;
  for (let i = 0; i < names.length; i++) {
    await writeFile(new URL(names[i], folder), bytes.subarray(i * size, (i + 1) * size));
  }
}

const bytes = Buffer.concat(await Promise.all(names.map(name => readFile(new URL(name, folder)))));
if (hash(bytes) !== expected) throw new Error("MagViz media checksum mismatch");
await mkdir(new URL("public/projects/magviz/v14/", root), { recursive: true });
await writeFile(target, bytes);
console.log(`Verified original MagViz film: ${bytes.length} bytes -> ${fileURLToPath(target)}`);
