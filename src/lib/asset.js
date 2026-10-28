// Transforme un chemin du dossier public/ en adresse utilisable par le site.
// "images/hero.jpg" → "./images/hero.jpg" ; les adresses https://… restent intactes.
export function asset(path) {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  // encodeURI : les noms avec espaces ou caractères spéciaux fonctionnent aussi.
  return import.meta.env.BASE_URL + encodeURI(path.replace(/^\/+/, ""));
}

// Un texte commençant par "[À compléter" est un contenu à remplir.
export const isTodo = (value) => typeof value === "string" && value.trim().startsWith("[À compléter");

// "À venir" → "a-venir" (utilisé pour les classes CSS).
export const slugify = (s = "") =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
