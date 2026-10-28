// Le contenu se modifie dans src/content/moodboard.json (ou via Pages CMS).
// Ce fichier ne fait que le préparer pour les composants.
import data from "../content/moodboard.json";
import folderFiles from "virtual:moodboard-files";
import { slugify } from "../lib/asset.js";

// Ordre des filtres au-dessus de la galerie.
export const CATEGORY_NAMES = ["Outdoor", "Footwear", "Matières", "Performance", "Design", "Artistes", "E-commerce"];

const labelOf = Object.fromEntries(CATEGORY_NAMES.map((name) => [slugify(name), name]));
const clean = (src = "") => src.replace(/^\/+/, "");

// Titre déduit du nom de fichier : "mesh-3d.jpg" → "Mesh 3d" (vide si le nom n'a pas de lettres).
const titleFrom = (file) => {
  const name = file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return /\p{L}/u.test(name) ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

const described = data.filter((item) => item?.src);
const listed = new Set(described.map((item) => clean(item.src)));

// Photos déposées dans un dossier de catégorie mais pas encore décrites.
const dropped = folderFiles
  .map(({ folder, file }) => ({
    src: `images/moodboard/${folder}/${file}`,
    category: labelOf[folder] || folder,
    title: titleFrom(file),
    caption: "",
  }))
  .filter((item) => !listed.has(item.src));

export const inspirations = [...described, ...dropped].map((item) => ({
  ...item,
  category: slugify(item.category || "Outdoor"),
  source: item.sourceLabel || item.sourceUrl ? { label: item.sourceLabel, url: item.sourceUrl } : null,
}));

// N'affiche que les filtres qui ont au moins une image.
export const categories = CATEGORY_NAMES.map((label) => ({ id: slugify(label), label })).filter((c) =>
  inspirations.some((item) => item.category === c.id)
);
