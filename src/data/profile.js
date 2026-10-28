// Le contenu se modifie dans src/content/profile.json (ou via Pages CMS).
// Ce fichier ne fait que le préparer pour les composants.
import data from "../content/profile.json";

// Échelle des niveaux, dans l'ordre (1 → 4).
export const LEVEL_NAMES = ["Découverte", "Bases acquises", "Opérationnel", "Avancé"];

const levelNumber = (name) => Math.max(1, LEVEL_NAMES.indexOf(name) + 1);

export const profile = {
  ...data,
  levels: Object.fromEntries(LEVEL_NAMES.map((name, i) => [i + 1, name])),
  skills: (data.skills ?? []).map((s) => ({ ...s, level: levelNumber(s.level) })),
  tools: (data.tools ?? []).map((t) => ({ ...t, level: levelNumber(t.level) })),
  documents: (data.documents ?? []).map((d) => ({ ...d, file: d.file || null })),
};
