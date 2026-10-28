# Modifier mon portfolio

Site en ligne : https://sackroy7-png.github.io/portfolio/

## La méthode simple : Pages CMS

Pages CMS est un site qui affiche ton portfolio sous forme de formulaires.
Tu changes un texte ou une photo, tu cliques sur **Save**, et le site est republié tout seul en 2 minutes.

### Première connexion (une seule fois)

1. Va sur **https://app.pagescms.org**.
2. Clique sur **Sign in with GitHub** et connecte-toi avec ton compte `sackroy7-png`.
3. Si on te le demande, installe l'application **Pages CMS** sur GitHub et choisis le dépôt **portfolio**
   (*Only select repositories* → `portfolio` → *Install*).
4. Ouvre le dépôt **portfolio**, branche **main**.

### Ensuite, à chaque fois

À gauche, tu as 4 rubriques :

| Rubrique | Ce que tu peux y changer |
|---|---|
| **Profil, stage et contact** | présentation, photo d'accueil, portrait, À propos, formation, dates de stage, compétences, outils, CV, e-mail, LinkedIn |
| **Projets** | ajouter, modifier, supprimer ou réordonner un projet et ses photos |
| **Moodboard** | ajouter, remplacer ou supprimer une image, sa catégorie et sa légende |
| **Images / Documents PDF** | voir et déposer tes fichiers |

**Changer une photo :** clique sur la photo dans le formulaire → **Upload** → choisis ta photo → **Save**.
Les photos de téléphone sont réduites automatiquement à la publication.
Formats acceptés : JPG, PNG, WebP (sur iPhone, si la photo est en HEIC, exporte-la d'abord en JPG).

**Ajouter un projet :** rubrique **Projets** → bouton **+ Add** en bas de la liste → remplis le titre,
le résumé, la photo de couverture → **Save**. Laisse vide ce qui ne te sert pas : la rubrique n'apparaît pas sur le site.

**Ajouter ton CV :** rubrique **Profil, stage et contact** → **CV et documents** → champ *Fichier PDF* →
dépose ton PDF → **Save**. Les boutons « Consulter » et « Télécharger » apparaissent.

**Recadrer une photo :** dans le champ *Cadrage*, écris par exemple `center 20%` pour remonter le cadre,
`center 80%` pour le descendre. Laisse vide pour un cadrage centré.

### Vérifier que c'est en ligne

Après **Save**, attends 2 minutes puis recharge ton site.
Si rien ne change, va sur https://github.com/sackroy7-png/portfolio/actions :
- ✅ vert : c'est publié, recharge la page (ou vide le cache) ;
- ❌ rouge : clique dessus, l'étape **npm run check** indique ce qui ne va pas
  (le plus souvent une photo supprimée mais encore utilisée). L'ancienne version du site reste en ligne en attendant.

## Autres possibilités

- **Demander à Claude** : « change ma présentation par… », « ajoute cette photo au projet WhoCares ».
- **Directement sur GitHub** : les textes sont dans `src/content/` (fichiers `.json`), les photos dans
  `public/images/`, les PDF dans `public/documents/`. Bouton ✏️ pour modifier, *Add file → Upload files* pour déposer.

## Pour aller plus loin (facultatif)

- Couleurs, polices, espacements : `src/styles/tokens.css`.
- Travailler sur ton ordinateur : installer [Node.js](https://nodejs.org), puis `npm install` et `npm run dev`.
