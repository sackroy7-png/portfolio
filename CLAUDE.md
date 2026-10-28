# Portfolio de Sacha Roy — notes pour Claude

Portfolio personnel (React + Vite, site statique) publié sur https://sackroy7-png.github.io/portfolio/
Sacha est débutant : il demande les modifications en français, en langage courant. Réponds simplement,
fais la modification, publie, puis confirme en une ou deux phrases.

## Où se trouve le contenu
- Textes du profil, stage, compétences, outils, CV, contact : `src/content/profile.json`
- Expérience (stage Decathlon) : `experiences` dans `src/content/profile.json`
- Projets (WhoCares) : `src/content/projects.json`
- Moodboard : `src/content/moodboard.json` + images dans `public/images/moodboard/<catégorie>/`
  (une image déposée dans un dossier de catégorie apparaît automatiquement, voir `vite.config.js`)
- Photos : `public/images/` ; PDF : `public/documents/`
- Formulaires Pages CMS : `.pages.yml` (garder synchronisé si un champ change)

## Règles
- Ne jamais inventer d'expérience, de chiffre ou de résultat. Projets courts et simples.
- Sacha dépose parfois des photos directement sur GitHub : toujours `git fetch` et regarder
  les nouveaux fichiers avant de pousser.
- Photos reçues : redimensionner (max 2400 px), JPG, nom simple sans espace ni accent.

## Publier
1. `npm run check && npm run build`
2. `git commit` puis `git push origin main`
3. La publication GitHub Pages se fait automatiquement (~2 min) ; vérifier le statut via
   l'API publique : `https://api.github.com/repos/sackroy7-png/portfolio/actions/runs?per_page=1`
