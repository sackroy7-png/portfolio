# Portfolio — Sacha Roy

Portfolio personnel : marketing digital, e-commerce, outdoor.
React 19 + Vite, site statique sans serveur ni base de données.

```bash
npm install       # une seule fois
npm run dev       # site en local avec rechargement instantané
npm run check     # contenu à compléter, fichiers manquants
npm run images    # réduit et recompresse les images trop lourdes
npm run build     # version finale dans dist/
npm run preview   # tester la version finale
```

**Pour modifier le contenu, lis [`GUIDE.md`](GUIDE.md).**

## Structure

```
src/data/            ← CONTENU (seuls fichiers à modifier au quotidien)
  profile.js           profil, formation, stage, compétences, outils, documents, contact
  projects.js          projets et pages détaillées
  inspirations.js      moodboard et catégories
public/images/       ← photos et visuels
public/documents/    ← CV et PDF
src/styles/tokens.css  couleurs, typographie, espacements
src/styles/main.css    mise en page
src/sections/        sections de l'accueil (Hero, About, Projects, Moodboard, Skills, Documents, Contact)
src/pages/           page détaillée d'un projet
src/components/      composants réutilisables (Img, Text, Reveal, Lightbox, Meter…)
src/lib/             navigation et utilitaires
scripts/             vérification du contenu, optimisation des images
.github/workflows/   publication automatique sur GitHub Pages
```

## Choix techniques

- **Navigation par ancre** (`#/projets/slug`) : fonctionne sur GitHub Pages, Netlify ou n'importe
  quel hébergement statique, sans configuration serveur.
- **`base: "./"`** dans `vite.config.js` : le site fonctionne à la racine d'un domaine comme dans
  un sous-dossier.
- **Polices auto-hébergées** (Archivo variable, IBM Plex Mono via Fontsource) : aucun appel à un
  service externe.
- **Accessibilité** : lien d'évitement, focus visible, textes alternatifs, visionneuse au clavier,
  contrastes AA, animations désactivées si `prefers-reduced-motion`.
- Aucune clé API, aucun secret, aucun traceur.
