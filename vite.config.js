import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";

// Liste les photos déposées dans public/images/moodboard/<catégorie>/
// pour qu'elles apparaissent sur le site même sans être décrites dans moodboard.json.
function moodboardFolders() {
  const id = "virtual:moodboard-files";
  const root = "public/images/moodboard";
  return {
    name: "moodboard-folders",
    resolveId: (source) => (source === id ? "\0" + id : null),
    load(resolved) {
      if (resolved !== "\0" + id) return;
      const files = [];
      if (existsSync(root)) {
        for (const dir of readdirSync(root, { withFileTypes: true })) {
          if (!dir.isDirectory()) continue;
          for (const file of readdirSync(`${root}/${dir.name}`).sort()) {
            if (/\.(jpe?g|png|webp)$/i.test(file)) files.push({ folder: dir.name, file });
          }
        }
      }
      return `export default ${JSON.stringify(files)};`;
    },
  };
}

// base "./" : le site fonctionne aussi bien à la racine d'un domaine
// que dans un sous-dossier (ex. https://pseudo.github.io/portfolio/).
export default defineConfig({
  base: "./",
  plugins: [react(), moodboardFolders()],
});
