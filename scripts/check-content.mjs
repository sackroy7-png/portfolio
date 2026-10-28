// Vérifie le contenu :  npm run check   (lancé aussi automatiquement avant chaque publication)
// • vérifie que chaque image et document indiqué existe dans public/ ;
// • signale les textes "[À compléter …]" et les identifiants de projet en double.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(readFileSync(join(root, "src/content", name), "utf8"));

const missing = [];
const todos = [];
const errors = [];

function walk(value, path) {
  if (typeof value === "string") {
    if (value.includes("[À compléter")) todos.push(`${path} → ${value}`);
    return;
  }
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    for (const key of ["src", "file", "video"]) {
      const file = value[key];
      if (typeof file === "string" && file && !/^https?:/.test(file)) {
        if (!existsSync(join(root, "public", file.replace(/^\/+/, "")))) missing.push(`${path}.${key} → public/${file.replace(/^\/+/, "")}`);
      }
    }
    for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
  }
}

let projects = [];
for (const [name, label] of [["profile.json", "profil"], ["projects.json", "projets"], ["moodboard.json", "moodboard"]]) {
  try {
    const data = read(name);
    if (name === "projects.json") projects = data;
    walk(data, label);
  } catch (e) {
    errors.push(`src/content/${name} est illisible : ${e.message}`);
  }
}

const slugs = projects.map((p) => p.slug).filter(Boolean);
slugs.forEach((s, i) => {
  if (slugs.indexOf(s) !== i) errors.push(`L'identifiant de projet "${s}" est utilisé deux fois`);
});

const section = (title, list) => {
  if (!list.length) return;
  console.log(`\n${title} (${list.length})`);
  list.forEach((line) => console.log("  • " + line));
};

section("✗ Erreurs", errors);
section("✗ Fichiers introuvables", missing);
section("! Textes à compléter", todos);

if (errors.length || missing.length) {
  console.log("\nÀ corriger avant de publier.");
  process.exit(1);
}
console.log("\nContenu valide ✓");
