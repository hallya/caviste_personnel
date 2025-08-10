export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Edouard, Caviste personnel",
  url: "https://caviste-personnel.vercel.app",
  logo: {
    "@type": "ImageObject",
    url: "https://caviste-personnel.vercel.app/favicon.svg",
    width: 32,
    height: 32,
  },
  description: "Caviste personnel spécialisé dans les vins de vignerons français. Conseils personnalisés, formations en œnologie et sélection de vins d'exception.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "edouard.dulac@gmail.com",
    telephone: "+33613516233",
    availableLanguage: "French",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
    addressLocality: "Paris",
  },
  sameAs: [
    "https://www.facebook.com/Edouard.Caviste.Personnel",
    "https://www.instagram.com/edouard_cavistepersonnel/",
  ],
} as const;

export const EDUCATIONAL_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Edouard, Caviste personnel - Formations",
  url: "https://caviste-personnel.vercel.app/formations",
  description: "Formations personnalisées en œnologie avec Edouard. Découverte des vins, dégustations guidées et conseils d'expert pour développer votre palais.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Formations en Œnologie",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Initiation à la Dégustation",
          description: "Apprenez les bases de la dégustation : vue, odorat, goût. Développez votre vocabulaire œnologique et identifiez les arômes.",
          provider: {
            "@type": "Organization",
            name: "Edouard, Caviste personnel",
          },
          courseMode: "in-person",
          educationalLevel: "beginner",
          timeRequired: "PT2H",
          audience: {
            "@type": "Audience",
            audienceType: "Adult learners interested in wine",
          },
        },
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Découverte des Terroirs",
          description: "Voyage à travers les régions viticoles françaises. Comprenez l'influence du terroir sur le caractère des vins.",
          provider: {
            "@type": "Organization",
            name: "Edouard, Caviste personnel",
          },
          courseMode: "in-person",
          educationalLevel: "intermediate",
          timeRequired: "PT3H",
          audience: {
            "@type": "Audience",
            audienceType: "Wine enthusiasts and professionals",
          },
        },
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Accords Mets et Vins",
          description: "Maîtrisez l'art des accords. Apprenez à associer vins et mets pour sublimer vos repas.",
          provider: {
            "@type": "Organization",
            name: "Edouard, Caviste personnel",
          },
          courseMode: "in-person",
          educationalLevel: "intermediate",
          timeRequired: "PT2H30M",
          audience: {
            "@type": "Audience",
            audienceType: "Food and wine lovers",
          },
        },
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "EUR",
      },
    ],
  },
} as const;

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Edouard, Caviste personnel",
  url: "https://caviste-personnel.vercel.app",
  description: "Caviste personnel spécialisé dans les vins de vignerons français. Conseils personnalisés, formations en œnologie et sélection de vins d'exception.",
  publisher: {
    "@type": "Organization",
    name: "Edouard, Caviste personnel",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://caviste-personnel.vercel.app/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
} as const;
