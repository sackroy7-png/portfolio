// Vérifie le contenu avant publication :  npm run check
// • liste les textes "[À compléter …]" et les coordonnées d'exemple ;
// • liste les visuels encore marqués "placeholder: true" ;
// • vérifie que chaque image et document référencé existe dans public/.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { profile } from "../src/data/profile.js";
import { projects } from "../src/data/projects.js";
import { inspirations, categories } from "../src/data/inspirations.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const todos = [];
const placeholders = [];
const missing = [];
const errors = [];

function walk(value, path) {
  if (typeof value === "string") {
    if (value.includes("[À compléter")) todos.push(`${path} → ${value}`);
    if (/exemple\.fr|votre-profil/.test(value)) todos.push(`${path} → coordonnée d'exemple : ${value}`);
    return;
  }
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    if (value.placeholder) placeholders.push(`${path} (${value.src || value.file})`);
    for (const key of ["src", "file"]) {
      const file = value[key];
      if (typeof file === "string" && !/^https?:/.test(file) && !existsSync(join(root, "public", file))) {
        missing.push(`${path}.${key} → public/${file}`);
      }
    }
    for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
  }
}

walk(profile, "profile");
walk(projects, "projects");
walk(inspirations, "inspirations");

const slugs = projects.map((p) => p.slug);
slugs.forEach((s, i) => {
  if (slugs.indexOf(s) !== i) errors.push(`Le slug "${s}" est utilisé deux fois dans projects.js`);
  if (!/^[a-z0-9-]+$/.test(s)) errors.push(`Le slug "${s}" doit contenir uniquement a-z, 0-9 et des tirets`);
});
const catIds = new Set(categories.map((c) => c.id));
inspirations.forEach((it, i) => {
  if (!catIds.has(it.category)) errors.push(`inspirations[${i}] : catégorie inconnue "${it.category}"`);
});

const section = (title, list) => {
  console.log(`\n${title} (${list.length})`);
  list.forEach((line) => console.log("  • " + line));
};

section("✗ Erreurs", errors);
section("✗ Fichiers introuvables", missing);
section("! Textes à compléter", todos);
section("! Visuels ou documents temporaires", placeholders);

if (errors.length || missing.length) {
  console.log("\nÀ corriger avant de publier.");
  process.exit(1);
}
console.log(todos.length || placeholders.length ? "\nAucune erreur bloquante, mais du contenu reste à compléter." : "\nTout est prêt ✓");
