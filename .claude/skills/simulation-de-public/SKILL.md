---
name: simulation-de-public
description: Simule un public entier (façon MiroFish, sans installation ni clé API) pour prédire comment des gens vont réagir à un message, un produit, une offre, une vidéo, une marque ou une annonce. Construit un petit monde virtuel (groupes de population avec leur taille, personnages détaillés, qui suit qui), fait évoluer les opinions tour par tour (posts, commentaires, partages), accepte des événements « et si… » en cours de route, puis produit un rapport de prédiction en page HTML et permet de discuter avec n'importe quel personnage. À utiliser dès que l'utilisateur veut tester, prédire, simuler ou anticiper une réaction (« comment les gens vont réagir », « est-ce que ça va marcher », « teste ce post », « simule le lancement », « et si on… », « panel », « focus group », « personas », « MiroFish »), même s'il ne dit pas le mot simulation.
---

# Simulation de public

Le but est de donner le même résultat qu'un moteur multi-agents comme MiroFish : un monde virtuel
crédible où des personnages réagissent et s'influencent, un rapport de prédiction, et la possibilité
d'interroger ce monde. Tout se fait ici, avec le script `scripts/world.py` qui garde l'état du monde
dans un fichier JSON (pour pouvoir continuer la simulation ou interroger un personnage plus tard).

La valeur de l'exercice vient du réalisme et du désaccord : un public simulé où tout le monde adore
l'idée ne prédit rien. Chaque personnage doit réagir selon sa vie, ses contraintes et ce qu'il a vu,
pas selon ce que l'utilisateur espère entendre.

## Déroulé

### 1. Cadrer (sans interroger longuement l'utilisateur)

Il faut trois choses : **le matériau** (texte, post, offre, vidéo, site, idée…), **la question de
prédiction** (« les lycéens vont-ils télécharger l'appli ? », « ce post LinkedIn va-t-il attirer des
recruteurs ? ») et **le public visé**. Si un élément manque, choisis une hypothèse raisonnable, écris-la
en une ligne et avance. Par défaut : 4 tours de simulation.

Crée un dossier de travail `simulations/<nom-court>/` à la racine du projet (ou dans le scratchpad si
l'utilisateur ne veut rien garder).

### 2. Construire le monde

Lis `references/personas.md` pour la méthode. Écris `spec.json` puis lance :

```bash
python3 <skill>/scripts/world.py init simulations/<nom>/world.json simulations/<nom>/spec.json
```

- **4 à 6 segments** (groupes) avec une taille estimée (`size`, en nombre de personnes) : c'est ce qui
  permet de passer de quelques personnages à une population. Indique d'où vient l'estimation ou marque-la
  « estimation ».
- **12 à 24 personnages** répartis dans les segments, chacun avec un prénom, un âge, une situation, un
  trait de caractère qui compte pour la question, un avis de départ (`stance` de -1 à 1) et une influence
  (`influence` de 0 à 1 : un délégué de classe ou une créatrice de contenu pèse plus qu'un lurker).
- **Les liens** (`follows`) : qui voit les réactions de qui. Mets quelques personnages très suivis.
- Au moins un tiers des personnages doit partir neutre ou sceptique.

### 3. Simuler, tour par tour

À chaque tour, pour chaque personnage : ce qu'il a déjà en mémoire + ce que publient les comptes qu'il
suit au tour précédent (`world.py feed world.json <id>` l'affiche) → une action réaliste :
`post`, `comment` (avec `target`), `share`, `ignore`. Écris le texte dans sa voix (registre, longueur,
fautes ou emojis s'il en mettrait), et un nouvel avis `stance` qui bouge peu (±0,3 au plus par tour,
sauf choc). `ignore` est une réponse normale et fréquente : la plupart des gens ne réagissent pas.

```bash
python3 <skill>/scripts/world.py round simulations/<nom>/world.json simulations/<nom>/round-1.json
python3 <skill>/scripts/world.py stats simulations/<nom>/world.json
```

Format d'un tour : voir `references/format.md`. Regarde les `stats` entre deux tours : si tout converge
trop vite, c'est souvent que les personnages manquent d'objections concrètes (prix, temps, confiance,
« encore une appli »).

**Événement « et si… »** : si l'utilisateur en propose un (ou si la question l'appelle), ajoute
`"event": "…"` au tour concerné ; tous les personnages qui l'apprennent en tiennent compte.

### 4. Le rapport de prédiction

Lance `stats`, puis écris la partie prédiction dans `world.json` via `world.py predict` (voir
`references/format.md`) et génère la page :

```bash
python3 <skill>/scripts/world.py report simulations/<nom>/world.json simulations/<nom>/rapport.html
```

La prédiction contient : le scénario le plus probable (avec une fourchette, pas un chiffre précis),
deux scénarios alternatifs et ce qui les déclencherait, ce qui fait basculer chaque segment, 3 à 5
citations marquantes des personnages, et des recommandations concrètes et actionnables. Termine par les
limites : c'est une simulation faite par une IA à partir d'hypothèses, utile pour explorer et préparer,
jamais un résultat à présenter comme une donnée réelle (ni dans un portfolio, ni à un client).

Donne à l'utilisateur la page HTML (envoie-la avec l'outil d'envoi de fichiers s'il existe), et un
résumé en 5 lignes dans la conversation.

### 5. Interagir avec le monde

- « Parle à Léa », « demande à Karim pourquoi… » : réponds en tant que ce personnage, avec sa mémoire
  (`world.py agent world.json <id>`), sans sortir du personnage.
- « Et si on changeait le prix / le titre / la vidéo ? » : lance un ou deux tours de plus avec
  l'événement, puis regénère le rapport ; compare avant/après.
- « Pourquoi ce segment est-il contre ? » : réponds en analyste, en t'appuyant sur les actions du fil.

## Garde-fous

- Pas de personnes réelles identifiables comme personnages (ni de vrais noms d'élèves, de clients ou de
  recruteurs) : des profils inventés et représentatifs.
- Pas de stéréotypes gratuits : chaque trait doit servir la question.
- Les tailles de segments et les pourcentages sont des estimations ; dis-le dans le rapport.
