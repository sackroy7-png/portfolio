/* ==========================================================================
   PROJETS — chaque bloc { … } est un projet, affiché dans l'ordre du tableau.
   --------------------------------------------------------------------------
   Pour AJOUTER un projet : copie un bloc complet (de { à },), colle-le à la
   suite et change son "slug" (identifiant unique, sans espace ni accent).

   Champs obligatoires : slug, title, status, summary, categories, cover.
   Tous les autres sont facultatifs : laisse "" ou [] et la rubrique
   disparaît du site.

   • kicker       type de projet (petite ligne au-dessus du titre)
   • period       période ou année
   • status       "Réalisé", "En cours" ou "À venir"
   • role         ton rôle
   • summary      une phrase (carte de la page d'accueil)
   • context      courte présentation (page du projet)
   • approach     ce que tu as fait, en étapes : { title, text }
   • gallery      photos de la page du projet
                  wide: true = photo en pleine largeur
                  position: "center 20%" = règle le cadrage
   • links        liens : { label, url }
   ========================================================================== */

export const projects = [
  {
    slug: "whocares",
    title: "WhoCares — ma marque de vêtements",
    kicker: "Projet personnel · Entrepreneuriat",
    period: "",
    status: "En cours",
    role: "Fondateur",
    summary: "Créer une marque de vêtements : un logo, un premier t-shirt, des photos et un compte Instagram.",
    categories: ["Branding", "Produit", "Réseaux sociaux"],
    cover: {
      src: "images/projets/whocares-lookbook.jpg",
      alt: "Deux personnes portant le t-shirt blanc WhoCares au logo rose",
      position: "center 18%",
    },
    context:
      "WhoCares est la marque de vêtements que j'ai créée. Le produit présenté ici est un t-shirt blanc, avec un visage griffonné en rose sur le devant et la signature « Made it simple » au dos.",
    approach: [
      { title: "Identité visuelle", text: "Un logo simple et reconnaissable : un visage dessiné d'un trait continu, en rose." },
      { title: "Produit", text: "Un t-shirt blanc imprimé recto verso." },
      { title: "Photo et contenus", text: "Photos produit, séance photo portée en studio et contenus en extérieur." },
      { title: "Communication", text: "Le compte Instagram @whocares.ms, qui réunit l'univers de la marque." },
    ],
    gallery: [
      { src: "images/projets/whocares-logo.jpg", alt: "Logo WhoCares", caption: "Le logo." },
      { src: "images/projets/whocares-lookbook.jpg", alt: "Séance photo en studio", caption: "Séance photo portée." },
      { src: "images/projets/whocares-tshirt-face.jpg", alt: "T-shirt WhoCares de face", caption: "Le t-shirt, de face." },
      { src: "images/projets/whocares-tshirt-dos.jpg", alt: "T-shirt WhoCares de dos", caption: "Au dos : « Made it simple »." },
      { src: "images/projets/whocares-coulisses.jpg", alt: "Coulisses d'un contenu Instagram", caption: "Coulisses d'un contenu." },
    ],
    links: [{ label: "Instagram @whocares.ms", url: "https://www.instagram.com/whocares.ms/" }],
  },

  {
    slug: "decathlon-cycle-fitness",
    title: "Decathlon — rayons cycle et fitness",
    kicker: "Stage · Commerce",
    period: "",
    status: "Réalisé",
    role: "Stagiaire",
    summary: "Un stage en magasin au contact des clients et des produits techniques.",
    categories: ["Retail", "Produit", "Relation client"],
    cover: {
      src: "images/projets/decathlon-cover.jpg",
      alt: "Visuel du stage chez Decathlon",
      placeholder: true,
    },
    context: "Stage dans un magasin Decathlon, aux rayons cycle et fitness.",
    approach: [
      { title: "Conseil client", text: "Accompagner les clients dans leurs choix, analyser leurs besoins et proposer des solutions adaptées." },
      { title: "Connaissance produit", text: "Découvrir les caractéristiques techniques des produits cycle et fitness." },
      { title: "Merchandising et rayon", text: "Participer à la mise en valeur de l'offre, gérer le rayon et la disponibilité des produits." },
      { title: "Atelier vélo", text: "Assembler et préparer des vélos." },
    ],
    gallery: [],
    links: [],
  },

  {
    slug: "etude-ecommerce",
    title: "Étude e-commerce d'un produit sportif",
    kicker: "Analyse · À venir",
    period: "",
    status: "À venir",
    role: "",
    summary: "Une future analyse de la présentation et de la vente en ligne d'un produit sportif.",
    categories: ["E-commerce", "Benchmark"],
    cover: {
      src: "images/projets/etude-ecommerce-cover.jpg",
      alt: "Visuel provisoire de l'étude e-commerce",
      placeholder: true,
    },
    context: "Cette étude n'a pas encore été réalisée. Cette page sera complétée plus tard.",
    approach: [],
    gallery: [],
    links: [],
  },
];
