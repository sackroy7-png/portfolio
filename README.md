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
src/content/         ← CONTENU (modifiable avec Pages CMS, voir .pages.yml)
  profile.json         profil, formation, stage, compétences, outils, documents, contact
  projects.json        projets et pages détaillées
  moodboard.json       images du moodboard
public/images/       ← photos et visuels
public/documents/    ← CV et PDF
src/data/            préparation du contenu pour les composants
src/styles/tokens.css  couleurs, typographie, espacements
src/styles/main.css    mise en page
src/sections/        sections de l'accueil
src/pages/           page détaillée d'un projet
src/components/      composants réutilisables (Img, Text, Reveal, Lightbox, Meter…)
scripts/             vérification du contenu, optimisation des images
.github/workflows/   vérification, optimisation et publication sur GitHub Pages
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
- **Pages CMS** édite les fichiers JSON directement dans le dépôt GitHub : pas de base de données, pas de clé API.
- Aucune clé API, aucun secret, aucun traceur.

## Site Saisonia (prototype)

Site à part entière, publié sur `/saisonia/` (ex. https://sackroy7-png.github.io/portfolio/saisonia/)
et affiché dans un cadre de téléphone sur la page projet du portfolio (`?embed=1`).

```
saisonia/
  index.html               entrée du site (deuxième page du build Vite)
  src/App.jsx              navigation : onglets, écrans empilés, retour navigateur
  src/store.js             profil, candidatures, favoris (localStorage du visiteur)
  src/data.js              villes, contrats, distance, règle « cette offre te correspond »
  src/screens/             Onboarding, Accueil, Rechercher, Fiche offre, Candidatures, Profil
  src/components/ui.jsx    icônes, cartes, panneaux, étapes de suivi
  src/styles.css           interface style iOS, effets « Liquid Glass »
src/content/saisonia-offres.json   15 offres fictives (partagées)
```

Parcours : introduction personnalisée (âge, niveau, contrats, ville) → accueil « Pour toi » →
recherche et filtres → fiche avec âge minimum et « Pourquoi cette offre » → candidature en 2 étapes →
écran de confirmation → suivi (envoyée, vue, entretien, réponse) avec simulation de la réponse →
notifications, favoris, profil modifiable. Rien n'est envoyé à un serveur ; distances à vol d'oiseau,
rémunérations indicatives. Hors périmètre : espace entreprise, authentification, paiement, messagerie.
