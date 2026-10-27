# Guide de modification du portfolio

## ⚡ Le plus simple : changer une photo depuis GitHub (sans rien installer)

1. Sur ton ordinateur, renomme ta photo avec **exactement le même nom** que celle à remplacer
   (le nom est écrit sur chaque visuel temporaire, ex. `hero.jpg`).
2. Va sur https://github.com/sackroy7-png/portfolio et ouvre le dossier `public` → `images`
   (puis `projets` ou `moodboard` si besoin).
3. Clique sur **Add file → Upload files**, glisse ta photo, puis clique sur **Commit changes**.
4. Attends 2 minutes : le site est republié tout seul avec ta nouvelle photo.

Photos à remplacer en priorité :

| Fichier | Où il apparaît |
|---|---|
| `images/hero.jpg` | grande photo de l'accueil (paysage, format horizontal) |
| `images/portrait.jpg` | ta photo dans « À propos » (format vertical) |
| `images/apropos-detail.jpg` | petite photo à côté du portrait |
| `images/projets/decathlon-cover.jpg` | couverture du projet Decathlon |
| `images/moodboard/…` | les 12 images du moodboard |

Ensuite, dis à Claude que c'est fait : il retirera la mention « visuel temporaire » des fichiers de données.
Pour changer un texte, le plus simple reste de demander à Claude.

---


Ce guide explique comment modifier ton site **sans toucher au code des composants**.
Tout le contenu se trouve dans 3 fichiers et 2 dossiers :

| Ce que tu veux changer | Où |
|---|---|
| Nom, présentation, À propos, formation, stage, compétences, outils, CV, contact | `src/data/profile.js` |
| Projets (ajout, modification, suppression) | `src/data/projects.js` |
| Moodboard (images, légendes, catégories) | `src/data/inspirations.js` |
| Photos et visuels | `public/images/` |
| CV et documents PDF | `public/documents/` |
| Couleurs, polices, espacements | `src/styles/tokens.css` |

> **Règle d'or :** dans les fichiers `.js`, modifie seulement ce qui est entre guillemets `"…"`,
> et garde les virgules en fin de ligne. Si tu dois écrire une apostrophe, aucun souci : les textes
> sont entre guillemets doubles. Si tu dois écrire un guillemet double, écris `\"`.

---

## 1. Voir le site sur ton ordinateur

À faire une seule fois : installer [Node.js](https://nodejs.org) (version LTS), puis dans le dossier du projet :

```bash
npm install
```

Ensuite, à chaque séance de travail :

```bash
npm run dev
```

Ouvre l'adresse affichée (en général http://localhost:5173). **Chaque modification enregistrée
s'affiche instantanément** dans le navigateur. Si un fichier contient une erreur (virgule oubliée,
guillemet manquant), le navigateur l'indique avec le numéro de ligne.

## 2. Modifier un texte

1. Ouvre `src/data/profile.js` (ou `projects.js`).
2. Change le texte entre guillemets.
3. Enregistre.

Les textes qui commencent par `[À compléter` s'affichent **en pointillés vert olive** sur le site :
c'est un rappel visuel. Remplace-les par ton vrai contenu.

Exemple — changer les dates de stage :

```js
dates: "Du 6 avril au 5 juin 2027",
```

Pour ajouter un paragraphe dans « À propos », ajoute une ligne dans `paragraphs` :

```js
paragraphs: [
  "Premier paragraphe.",
  "Deuxième paragraphe.",
  "Nouveau paragraphe.",
],
```

## 3. Remplacer une image

**Méthode la plus simple :** remplace le fichier en gardant **exactement le même nom**.
Par exemple, mets ta photo dans `public/images/hero.jpg` à la place de l'ancienne.

**Autre méthode :** dépose ta nouvelle image dans `public/images/`, puis change son chemin dans
le fichier de données :

```js
heroImage: {
  src: "images/ma-photo-montagne.jpg",
  alt: "Randonneur sur une crête au lever du soleil",   // description pour l'accessibilité et le SEO
  caption: "Massif des Écrins, été 2026.",
  placeholder: false,                                    // ce n'est plus un visuel temporaire
},
```

Conseils :
- Formats : `.jpg` pour les photos, `.png` pour les logos, `.webp` accepté.
- Noms de fichiers : sans espace ni accent (`chaussure-trail.jpg`, pas `Chaussure Trail.JPG`).
- Images trop lourdes ? Lance `npm run images` : les photos de plus de 2 400 px sont réduites et
  recompressées automatiquement (les fichiers sont remplacés : garde tes originaux ailleurs).
- Les visuels temporaires portent la mention « VISUEL TEMPORAIRE » et le chemin à remplacer.

Emplacements des images actuelles :

```
public/images/hero.jpg              grande image de l'accueil (paysage, idéalement 2400×1500)
public/images/portrait.jpg          ton portrait (format vertical 4:5)
public/images/apropos-detail.jpg    détail (matière, terrain…) à côté du portrait
public/images/og-image.jpg          image d'aperçu sur LinkedIn / messageries (1200×630)
public/images/projets/…             couvertures et galeries des projets
public/images/moodboard/…           images du moodboard
```

## 4. Modifier le moodboard

Dans `src/data/inspirations.js`, chaque image est un bloc :

```js
{
  src: "images/moodboard/footwear-01.jpg",
  category: "footwear",            // outdoor, footwear, matieres, design, branding, ecommerce
  title: "Semelle crantée",
  caption: "Accroche et relance : le dessin de la semelle raconte l'usage.",
  source: { label: "Nom du photographe ou de la marque", url: "https://…" },   // ou null
  placeholder: false,
},
```

- **Ajouter** une image : copie un bloc, colle-le, change les valeurs.
- **Supprimer** : efface le bloc entier (de `{` à `},`).
- **Ajouter une catégorie** : ajoute `{ id: "running", label: "Running" }` dans `categories`.
- Pour une image trouvée en ligne, indique toujours la source et vérifie que tu as le droit de la montrer.

## 5. Ajouter un projet

1. Dans `src/data/projects.js`, copie un bloc projet entier (de `{` jusqu'à `},`).
2. Colle-le à l'endroit où tu veux qu'il apparaisse (l'ordre du fichier = l'ordre sur le site).
3. Change le `slug` : un identifiant unique, en minuscules, sans espace ni accent
   (ex. `"etude-chaussure-trail"`). La page sera accessible à l'adresse `#/projets/etude-chaussure-trail`.
4. Crée un dossier d'images, par exemple `public/images/projets/`, et mets les chemins dans `cover`
   et `gallery`.
5. Remplis `context`, `problem`, `approach` (les étapes), `deliverables`, `outcome`.

Quelques précisions :
- `status` : `"Réalisé"`, `"En cours"` ou `"À venir"` (change la couleur de l'étiquette).
- `wide: true` sur une image de galerie l'affiche en pleine largeur.
- Une section vide (`[]`) n'est pas affichée : pas besoin de la supprimer.
- `links` : liens externes, ex. `[{ label: "Voir la boutique", url: "https://…" }]`.

**Supprimer un projet :** efface son bloc. **Le déplacer :** coupe-colle le bloc.

## 6. Remplacer ton CV

1. Exporte ton CV en PDF.
2. Renomme-le `cv-sacha-roy.pdf`.
3. Remplace le fichier dans `public/documents/`.
4. Dans `profile.js`, mets à jour `updated: "Octobre 2026"` et `placeholder: false`.

**Ajouter une lettre de motivation :** dépose `public/documents/lettre-motivation.pdf`, puis dans
`profile.js` remplace `file: null` par `file: "documents/lettre-motivation.pdf"`.
Pour masquer un document, remets `file: null` (le texte de `note` s'affiche à la place).

## 7. Compétences et outils

Dans `profile.js` :
- `level` va de 1 à 4 : **1 Découverte · 2 Bases acquises · 3 Opérationnel · 4 Avancé**.
  Les valeurs actuelles sont des **valeurs de départ** : ajuste-les honnêtement.
- `status: "en apprentissage"` affiche l'outil avec une bordure en pointillés et la mention « En apprentissage ».
- Ajouter un outil : `{ name: "Figma", level: 1, status: "en apprentissage" },`

## 8. Coordonnées

Dans `profile.js`, section `contact` : remplace `prenom.nom@exemple.fr` et l'adresse LinkedIn.
N'ajoute pas de numéro de téléphone ni d'adresse postale : le site est public.

## 9. Vérifier avant de publier

```bash
npm run check
```

Cette commande liste :
- les textes encore marqués `[À compléter` et les coordonnées d'exemple ;
- les visuels et documents encore marqués `placeholder: true` ;
- les images ou PDF introuvables (faute de frappe dans un chemin) — **bloquant** ;
- les slugs de projets en double.

Puis, pour tester la version finale :

```bash
npm run build
npm run preview
```

---

## 10. Publier le site en ligne

### Option A — GitHub Pages (recommandée, gratuite)

1. Crée un compte sur [github.com](https://github.com) et un **nouveau dépôt** (ex. `portfolio`).
2. Envoie le projet dans ce dépôt (avec GitHub Desktop, ou en ligne de commande) :
   ```bash
   git remote add origin https://github.com/TON-PSEUDO/portfolio.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : « GitHub Actions »**.
4. Le fichier `.github/workflows/deploy.yml` construit et publie le site automatiquement.
   Après 1 à 2 minutes, il est en ligne sur `https://TON-PSEUDO.github.io/portfolio/`.
5. **Ensuite, chaque modification envoyée sur GitHub republie le site toute seule.**
   Tu peux même modifier `src/data/*.js` ou déposer une image **directement sur github.com**
   (bouton ✏️ « Edit » ou « Add file → Upload files ») : pas besoin d'ordinateur configuré.

### Option B — Netlify (glisser-déposer)

1. Lance `npm run build` : un dossier `dist/` est créé.
2. Va sur [app.netlify.com/drop](https://app.netlify.com/drop) et glisse le dossier `dist/`.
3. Ou, mieux : connecte ton dépôt GitHub à Netlify (commande de build `npm run build`,
   dossier de publication `dist`) pour une mise à jour automatique.

### Nom de domaine personnel (facultatif)

Un domaine du type `sacharoy.fr` coûte environ 10 € par an (OVH, Gandi…). Il se relie ensuite à
GitHub Pages (Settings → Pages → Custom domain) ou à Netlify.

### Après la publication

Dans `index.html`, remplace `./images/og-image.jpg` par l'adresse complète
(ex. `https://ton-pseudo.github.io/portfolio/images/og-image.jpg`) pour que l'aperçu s'affiche
correctement quand tu partages le lien sur LinkedIn.

---

## 11. Modifier le site visuellement, sans code (étape suivante)

La version actuelle n'a **pas** de panneau d'administration : un vrai panneau doit enregistrer les
modifications quelque part, et un site statique n'a ni serveur ni base de données.
Un faux panneau qui ne sauvegarde rien aurait été trompeur.

La solution la plus simple et gratuite, une fois le site sur GitHub : **[Pages CMS](https://pagescms.org)**.
- Tu te connectes avec ton compte GitHub, sur leur site.
- Tu modifies les textes dans des formulaires, tu déposes ou remplaces les images, tu gères les
  projets et le moodboard.
- Chaque enregistrement crée une modification dans ton dépôt GitHub, ce qui republie le site.
- Pas de base de données, pas de clé API, rien à héberger.

Ce que cela demande : convertir les 3 fichiers de données `.js` en fichiers `.json` (même contenu,
sans les commentaires) et ajouter un fichier de configuration `.pages.yml` décrivant les champs.
C'est une modification d'une heure environ, à faire quand ton dépôt GitHub existe.
