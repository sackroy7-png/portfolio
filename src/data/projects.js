/* ==========================================================================
   PROJETS — chaque bloc { … } est un projet, affiché dans l'ordre du tableau.
   --------------------------------------------------------------------------
   Pour AJOUTER un projet : copie un bloc complet (de { à },), colle-le à la
   suite et change son "slug" (identifiant unique, sans espace ni accent).
   L'adresse de la page sera alors : #/projets/ton-slug

   Champs :
   • slug         identifiant unique utilisé dans l'adresse
   • title        titre du projet
   • kicker       type de projet (petite ligne au-dessus du titre)
   • period       période ou année
   • status       "Réalisé", "En cours" ou "À venir"
   • role         ton rôle
   • summary      résumé court (carte de la page d'accueil)
   • categories   étiquettes
   • cover        image de couverture
   • gallery      images de la page détaillée (autant que tu veux)
                  wide: true = image en pleine largeur
   • context, problem       textes
   • approach     étapes de la démarche : { title, text }
   • deliverables liste des livrables
   • outcome      bilan
   • learnings    ce que tu as appris (facultatif)
   • links        liens externes (facultatif) : { label, url }

   Rappel : ne présente que ce que tu as réellement fait.
   ========================================================================== */

export const projects = [
  {
    slug: "marque-de-vetements",
    title: "Création d'une marque de vêtements",
    kicker: "Projet personnel · Entrepreneuriat",
    period: "[À compléter : année]",
    status: "En cours",
    role: "Fondateur — [À compléter : précise tes rôles]",
    summary:
      "Construire une marque de vêtements de A à Z : positionnement, univers visuel, produit et mise en vente.",
    categories: ["Branding", "Produit", "E-commerce"],
    cover: {
      src: "images/projets/marque-cover.jpg",
      alt: "Visuel de couverture de la marque de vêtements",
      placeholder: true,
    },
    gallery: [
      {
        src: "images/projets/marque-01.jpg",
        alt: "Recherche graphique pour l'identité de la marque",
        caption: "[À compléter : légende — ex. recherches de logo]",
        placeholder: true,
      },
      {
        src: "images/projets/marque-02.jpg",
        alt: "Détail textile",
        caption: "[À compléter : légende — ex. choix des matières]",
        placeholder: true,
        wide: true,
      },
      {
        src: "images/projets/marque-03.jpg",
        alt: "Mise en situation du produit",
        caption: "[À compléter : légende — ex. séance photo produit]",
        placeholder: true,
      },
    ],
    context:
      "[À compléter : nom de la marque, date de lancement, d'où vient l'idée, à qui elle s'adresse.]",
    problem:
      "[À compléter : la question à laquelle tu as cherché à répondre — ex. comment créer une marque crédible avec un budget étudiant ?]",
    approach: [
      {
        title: "Positionnement",
        text: "[À compléter : cible, valeurs, ce qui différencie la marque.]",
      },
      {
        title: "Identité visuelle",
        text: "[À compléter : nom, logo, couleurs, outils utilisés.]",
      },
      {
        title: "Produit",
        text: "[À compléter : choix des pièces, des matières, du fournisseur.]",
      },
      {
        title: "Communication et vente",
        text: "[À compléter : réseaux sociaux, boutique en ligne, premiers retours.]",
      },
    ],
    deliverables: [
      "[À compléter : ex. logo et charte graphique]",
      "[À compléter : ex. visuels pour Instagram]",
    ],
    outcome:
      "[À compléter : où en est le projet aujourd'hui. N'indique que des chiffres réels.]",
    learnings: ["[À compléter : ce que ce projet t'a appris]"],
    links: [],
  },

  {
    slug: "decathlon-cycle-fitness",
    title: "Decathlon — rayons cycle et fitness",
    kicker: "Expérience professionnelle · Commerce",
    period: "[À compléter : dates]",
    status: "Réalisé",
    role: "[À compléter : intitulé du poste et type de contrat]",
    summary:
      "Une expérience en magasin dans les rayons cycle et fitness, au contact des produits et des pratiquants.",
    categories: ["Retail", "Produit", "Relation client"],
    cover: {
      src: "images/projets/decathlon-cover.jpg",
      alt: "Visuel de couverture de l'expérience Decathlon",
      placeholder: true,
    },
    gallery: [
      {
        src: "images/projets/decathlon-01.jpg",
        alt: "Illustration de l'implantation en rayon",
        caption: "[À compléter : légende — ex. mise en rayon et implantation]",
        placeholder: true,
        wide: true,
      },
      {
        src: "images/projets/decathlon-02.jpg",
        alt: "Détail produit",
        caption: "[À compléter : légende]",
        placeholder: true,
      },
    ],
    context:
      "Expérience au sein d'un magasin Decathlon, dans les rayons cycle et fitness. [À compléter : magasin, période, organisation de l'équipe.]",
    problem:
      "[À compléter : ce que tu retiens du lien entre conseil en magasin et valorisation du produit — ex. comment aider un client à choisir parmi des produits techniques ?]",
    approach: [
      {
        title: "[À compléter : mission 1]",
        text: "[À compléter : ex. accueil et conseil des clients au rayon cycle.]",
      },
      {
        title: "[À compléter : mission 2]",
        text: "[À compléter : ex. mise en rayon, implantation, balisage.]",
      },
      {
        title: "[À compléter : mission 3]",
        text: "[À compléter : ex. gestion des stocks, encaissement.]",
      },
    ],
    deliverables: ["[À compléter : ce que tu as produit ou pris en charge]"],
    outcome:
      "[À compléter : bilan personnel. Ce que cette expérience t'apporte pour le marketing produit.]",
    learnings: ["[À compléter]"],
    links: [],
  },

  {
    slug: "etude-ecommerce",
    title: "Étude e-commerce d'un produit sportif",
    kicker: "Analyse · Emplacement réservé",
    period: "À venir",
    status: "À venir",
    role: "Analyse et recommandations",
    summary:
      "Emplacement réservé à une future analyse de la présentation et de la vente en ligne d'un produit sportif.",
    categories: ["E-commerce", "Benchmark"],
    cover: {
      src: "images/projets/etude-ecommerce-cover.jpg",
      alt: "Visuel provisoire de l'étude e-commerce",
      placeholder: true,
    },
    gallery: [],
    context:
      "Cette étude n'a pas encore été réalisée. Cette page sera complétée lorsque l'analyse sera terminée.",
    problem:
      "[À compléter : question de l'étude — ex. comment une marque outdoor valorise-t-elle une chaussure de trail sur son site ?]",
    approach: [
      { title: "Choix du produit", text: "Méthode envisagée — sélection d'un produit et de sa marque." },
      { title: "Benchmark", text: "Méthode envisagée — comparaison des fiches produit de plusieurs sites." },
      { title: "Parcours d'achat", text: "Méthode envisagée — analyse du parcours, du mobile au paiement." },
      { title: "Recommandations", text: "Méthode envisagée — pistes d'amélioration argumentées." },
    ],
    deliverables: [],
    outcome: "Étude à venir — aucun résultat pour le moment.",
    learnings: [],
    links: [],
  },
];
