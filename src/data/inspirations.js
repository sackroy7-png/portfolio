// Le contenu se modifie dans src/content/moodboard.json (ou via Pages CMS).
// Ce fichier ne fait que le préparer pour les composants.
import data from "../content/moodboard.json";
import { slugify } from "../lib/asset.js";

// Ordre des filtres au-dessus de la galerie.
export const CATEGORY_NAMES = ["Outdoor", "Footwear", "Matières", "Design", "Branding", "E-commerce"];

export const inspirations = data
  .filter((item) => item?.src)
  .map((item) => ({
    ...item,
    category: slugify(item.category || "Outdoor"),
    source: item.sourceUrl ? { label: item.sourceLabel, url: item.sourceUrl } : null,
  }));

// N'affiche que les filtres qui ont au moins une image.
export const categories = CATEGORY_NAMES.map((label) => ({ id: slugify(label), label })).filter((c) =>
  inspirations.some((item) => item.category === c.id)
);
