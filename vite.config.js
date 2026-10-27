import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" : le site fonctionne aussi bien à la racine d'un domaine
// que dans un sous-dossier (ex. https://pseudo.github.io/portfolio/).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
