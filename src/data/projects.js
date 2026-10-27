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
                  position: "center 30%" = règle le cadrage (facultatif)
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
    slug: "whocares",
    title: "WhoCares — ma marque de vêtements",
    kicker: "Projet personnel · Entrepreneuriat",
    period: "[À compléter : année de lancement]",
    status: "En cours",
    role: "Fondateur",
    summary:
      "Créer une marque de vêtements : un logo, un premier t-shirt, des photos et un compte Instagram.",
    categories: ["Branding", "Produit", "Réseaux sociaux"],
    cover: {
      src: "images/projets/whocares-lookbook.jpg",
      alt: "Deux personnes portant le t-shirt blanc WhoCares au logo rose",
      position: "center 18%",
    },
    gallery: [
      {
        src: "images/projets/whocares-logo.jpg",
        alt: "Logo WhoCares : un visage dessiné d'un trait continu, en rose",
        caption: "Le logo : un visage griffonné d'un trait rose.",
      },
      {
        src: "images/projets/whocares-lookbook.jpg",
        alt: "Séance photo en studio avec deux modèles portant le t-shirt",
        caption: "Séance photo portée en studio.",
      },
      {
        src: "images/projets/whocares-tshirt-face.jpg",
        alt: "T-shirt blanc WhoCares vu de face, logo rose imprimé",
        caption: "T-shirt blanc, logo imprimé sur le devant.",
      },
      {
        src: "images/projets/whocares-tshirt-dos.jpg",
        alt: "T-shirt blanc WhoCares vu de dos, inscription « Made it simple »",
        caption: "Au dos, la signature « Made it simple ».",
      },
      {
        src: "images/projets/whocares-coulisses.jpg",
        alt: "Smartphone affichant une photo de la marque prise en extérieur",
        caption: "Coulisses d'un contenu pour Instagram.",
      },
    ],
    context:
      "WhoCares est la marque de vêtements que j'ai créée. Le produit présenté ici est un t-shirt blanc, avec un visage griffonné en rose sur le devant et la signature « Made it simple » au dos. [À compléter : date de lancement, d'où vient l'idée, à qui s'adresse la marque.]",
    problem:
      "[À compléter : la question à laquelle tu as cherché à répondre — ex. comment donner une identité forte à une marque avec un seul produit et un budget étudiant ?]",
    approach: [
      {
        title: "Identité visuelle",
        text: "Un logo simple et reconnaissable : un visage dessiné d'un trait continu, dans un rose qui se détache sur le blanc. [À compléter : qui l'a dessiné, avec quel outil.]",
      },
      {
        title: "Produit",
        text: "Un t-shirt blanc imprimé recto verso : le logo devant, « Made it simple » au dos. [À compléter : choix de la coupe, de la matière, du fournisseur.]",
      },
      {
        title: "Photo et contenus",
        text: "Des photos produit sur fond blanc, une séance photo portée en studio et des contenus en extérieur.",
      },
      {
        title: "Communication",
        text: "Un compte Instagram, @whocares.ms, qui réunit l'univers visuel de la marque. [À compléter : vente, premiers retours.]",
      },
    ],
    deliverables: [
      "Logo",
      "T-shirt imprimé recto verso",
      "Photos produit sur fond blanc",
      "Séance photo portée",
      "Compte Instagram @whocares.ms",
    ],
    outcome:
      "[À compléter : où en est la marque aujourd'hui. N'indique que des chiffres réels (ventes, abonnés…).]",
    learnings: ["[À compléter : ce que ce projet t'a appris]"],
    links: [{ label: "Instagram @whocares.ms", url: "https://www.instagram.com/whocares.ms/" }],
  },

  {
    slug: "decathlon-cycle-fitness",
    title: "Decathlon — rayons cycle et fitness",
    kicker: "Stage · Commerce",
    period: "[À compléter : dates du stage]",
    status: "Réalisé",
    role: "Stagiaire — rayons cycle et fitness",
    summary:
      "Un stage en magasin au contact des clients et des produits techniques : conseil, rayon, merchandising et préparation des vélos.",
    categories: ["Retail", "Produit", "Relation client"],
    cover: {
      src: "images/projets/decathlon-cover.jpg",
      alt: "Visuel de couverture du stage chez Decathlon",
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
      "Stage dans un magasin Decathlon, aux rayons cycle et fitness. [À compléter : ville du magasin, dates.]",
    problem:
      "Comment aider un client à choisir parmi des produits techniques, et comment le rayon met-il l'offre en valeur ?",
    approach: [
      {
        title: "Conseil client",
        text: "Conseil et accompagnement des clients dans leurs choix ; analyse de leurs besoins et proposition de solutions adaptées.",
      },
      {
        title: "Connaissance produit",
        text: "Découverte des caractéristiques techniques des produits cycle et fitness.",
      },
      {
        title: "Merchandising et rayon",
        text: "Participation au merchandising et à la mise en valeur de l'offre ; gestion du rayon et de la disponibilité des produits.",
      },
      {
        title: "Atelier vélo",
        text: "Assemblage et préparation de vélos.",
      },
    ],
    deliverables: [],
    outcome:
      "[À compléter : bilan personnel. Ce que ce stage t'apporte pour le marketing produit.]",
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
