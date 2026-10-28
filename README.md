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

## Prototype Saisonia

Prototype cliquable de l'application Saisonia (emploi des jeunes en Auvergne), intégré à la page
projet `#/projets/saisonia` et disponible en plein écran sur `#/prototype/saisonia`.

- Code : `src/components/prototypes/Saisonia.jsx`, styles : `src/styles/saisonia.css`
  (chargés uniquement sur ces pages).
- Données fictives : `src/content/saisonia-offres.json` (15 offres, entreprises inventées, villes d'Auvergne).
- Parcours « jeune » : offres (recherche, filtres contrat / domaine / niveau / période / compétences /
  horaires flexibles / distance, « Pour moi », « Près de toi », offres mises en avant), fiche d'offre
  avec âge minimum, candidature, suivi des statuts, profil modifiable, notifications simulées.
- Le profil et les candidatures sont gardés dans le navigateur du visiteur (`localStorage`),
  bouton « Réinitialiser la démo » dans le profil. Rien n'est envoyé à un serveur.
- Distances à vol d'oiseau depuis la ville choisie ; rémunérations indicatives.
- Hors périmètre : espace entreprise, authentification, paiement, messagerie.
