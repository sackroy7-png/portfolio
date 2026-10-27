// Optimise les images de public/images :  npm run images
// • réduit les images plus larges que MAX_WIDTH pixels ;
// • recompresse les JPEG / PNG / WebP trop lourds ;
// • corrige l'orientation des photos de téléphone.
// Les fichiers sont remplacés sur place, en gardant le même nom :
// garde une copie de tes originaux ailleurs.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_WIDTH = 2400;
const MIN_SIZE = 350 * 1024; // en dessous, l'image est laissée telle quelle
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

async function* files(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield path;
  }
}

let saved = 0;
for await (const file of files(dir)) {
  const input = await readFile(file);
  const { width } = await sharp(input).metadata();
  if (input.length < MIN_SIZE && width <= MAX_WIDTH) continue;

  const pipeline = sharp(input).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const ext = extname(file).toLowerCase();
  const output =
    ext === ".png"
      ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
      : ext === ".webp"
        ? await pipeline.webp({ quality: 80 }).toBuffer()
        : await pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();

  if (output.length < input.length) {
    await writeFile(file, output);
    saved += input.length - output.length;
    console.log(`✓ ${file.slice(dir.length + 1)} : ${kb(input.length)} → ${kb(output.length)}`);
  }
}
console.log(saved ? `\nGain total : ${kb(saved)}` : "Aucune image à optimiser.");

function kb(bytes) {
  return `${Math.round(bytes / 1024)} Ko`;
}
