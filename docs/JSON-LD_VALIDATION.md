# JSON-LD Schema Validation

This document contains the JSON-LD schemas implemented in the application for manual validation using Google's Rich Results Test.

## 🎯 Validation Instructions

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Copy one of the schemas below
3. Paste it in the "Code" tab
4. Click "Test Code" to validate
5. Check for any warnings or errors

## 🏢 Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Edouard, Caviste personnel",
  "url": "https://caviste-personnel.vercel.app",
  "logo": {
    "@type": "ImageObject",
    "url": "https://caviste-personnel.vercel.app/favicon.svg",
    "width": 32,
    "height": 32
  },
  "description": "Caviste personnel spécialisé dans les vins de vignerons français. Conseils personnalisés, formations en œnologie et sélection de vins d'exception.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "edouard.dulac@gmail.com",
    "telephone": "+33613516233",
    "availableLanguage": "French"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR",
    "addressLocality": "Paris"
  },
  "sameAs": [
    "https://www.facebook.com/Edouard.Caviste.Personnel",
    "https://www.instagram.com/edouard_cavistepersonnel/"
  ]
}
```

## 🎓 Educational Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Edouard, Caviste personnel - Formations",
  "url": "https://caviste-personnel.vercel.app/formations",
  "description": "Formations personnalisées en œnologie avec Edouard. Découverte des vins, dégustations guidées et conseils d'expert pour développer votre palais.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Formations en Œnologie",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Initiation à la Dégustation",
          "description": "Apprenez les bases de la dégustation : vue, odorat, goût. Développez votre vocabulaire œnologique et identifiez les arômes.",
          "provider": {
            "@type": "Organization",
            "name": "Edouard, Caviste personnel"
          },
          "courseMode": "in-person",
          "educationalLevel": "beginner",
          "timeRequired": "PT2H",
          "audience": {
            "@type": "Audience",
            "audienceType": "Adult learners interested in wine"
          }
        },
        "availability": "https://schema.org/InStock",
        "price": "0",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Découverte des Terroirs",
          "description": "Voyage à travers les régions viticoles françaises. Comprenez l'influence du terroir sur le caractère des vins.",
          "provider": {
            "@type": "Organization",
            "name": "Edouard, Caviste personnel"
          },
          "courseMode": "in-person",
          "educationalLevel": "intermediate",
          "timeRequired": "PT3H",
          "audience": {
            "@type": "Audience",
            "audienceType": "Wine enthusiasts and professionals"
          }
        },
        "availability": "https://schema.org/InStock",
        "price": "0",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "Accords Mets et Vins",
          "description": "Maîtrisez l'art des accords. Apprenez à associer vins et mets pour sublimer vos repas.",
          "provider": {
            "@type": "Organization",
            "name": "Edouard, Caviste personnel"
          },
          "courseMode": "in-person",
          "educationalLevel": "intermediate",
          "timeRequired": "PT2H30M",
          "audience": {
            "@type": "Audience",
            "audienceType": "Food and wine lovers"
          }
        },
        "availability": "https://schema.org/InStock",
        "price": "0",
        "priceCurrency": "EUR"
      }
    ]
  }
}
```

## 🌐 Website Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Edouard, Caviste personnel",
  "url": "https://caviste-personnel.vercel.app",
  "description": "Caviste personnel spécialisé dans les vins de vignerons français. Conseils personnalisés, formations en œnologie et sélection de vins d'exception.",
  "publisher": {
    "@type": "Organization",
    "name": "Edouard, Caviste personnel"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://caviste-personnel.vercel.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## ✅ Expected Validation Results

### Organization Schema
- ✅ Should pass validation
- ✅ May show rich results for organization information
- ✅ Contact information should be properly structured

### Educational Organization Schema
- ✅ Should pass validation
- ✅ May show rich results for educational offerings
- ✅ Course catalog should be properly structured

### Website Schema
- ✅ Should pass validation
- ✅ May show rich results for website search functionality

## 🔍 Common Validation Issues

1. **Missing required fields**: Ensure all `@context` and `@type` fields are present
2. **Invalid URLs**: Verify all URLs are accessible and properly formatted
3. **Invalid email format**: Ensure email addresses follow proper format
4. **Missing descriptions**: All entities should have meaningful descriptions

## 📊 Implementation Status

- ✅ Organization schema implemented in global layout
- ✅ Educational Organization schema implemented in formations page
- ✅ Website schema implemented in global layout
- ✅ All schemas tested and validated
- ✅ No LHCI regression expected

## 🔄 Maintenance Guidelines

### When Formations Change
**IMPORTANT**: If the formations offered by Edouard change, the SEO metadata and JSON-LD schemas must be updated accordingly:

1. **Update Formation Content** (`app/formations/views/FormationsView.tsx`)
2. **Update JSON-LD Schema** (`app/components/seo/schemas.ts`)
   - Modify `EDUCATIONAL_ORGANIZATION_SCHEMA.hasOfferCatalog.itemListElement`
   - Update course names, descriptions, durations, and details
3. **Update Page Metadata** (`app/formations/page.tsx`)
   - Review title, description, and OpenGraph content
4. **Re-run Tests** to ensure schema validation still passes
5. **Re-validate** using Google Rich Results Test

### Contact Information Updates
If contact information changes:
1. **Update Organization Schema** (`app/components/seo/schemas.ts`)
2. **Update Contact Page** (`app/contact/views/ContactView.tsx`)
3. **Update Documentation** (`docs/JSON-LD_VALIDATION.md`)

### Social Media Links
Social media links are centralized in `app/components/home/views/constants.ts` and automatically used in JSON-LD schemas.
