// Le contenu se modifie dans src/content/projects.json (ou via Pages CMS).
// Ce fichier ne fait que le préparer pour les composants.
import data from "../content/projects.json";
import { slugify } from "../lib/asset.js";

export const projects = data.map((p) => ({
  ...p,
  // Sans identifiant, il est déduit du titre (ex. "Mon projet" → "mon-projet").
  slug: p.slug || slugify(p.title).replace(/^-|-$/g, ""),
  status: p.status || "Réalisé",
  categories: p.categories ?? [],
  approach: p.approach ?? [],
  gallery: (p.gallery ?? []).filter((g) => g?.src),
  links: (p.links ?? []).filter((l) => l?.url),
}));
