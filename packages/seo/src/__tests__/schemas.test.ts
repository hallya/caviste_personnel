import {
  ORGANIZATION_SCHEMA,
  EDUCATIONAL_ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from "../schemas";
import { SOCIAL_LINKS } from "../constants";

describe("JSON-LD Schemas", () => {
  describe("ORGANIZATION_SCHEMA", () => {
    it("has correct structure and required fields", () => {
      expect(ORGANIZATION_SCHEMA["@context"]).toBe("https://schema.org");
      expect(ORGANIZATION_SCHEMA["@type"]).toBe("Organization");
      expect(ORGANIZATION_SCHEMA.name).toBe("Edouard, Caviste personnel");
      expect(ORGANIZATION_SCHEMA.url).toBe(
        "https://caviste-personnel.vercel.app",
      );
      expect(ORGANIZATION_SCHEMA.logo).toBeDefined();
      expect(ORGANIZATION_SCHEMA.contactPoint).toBeDefined();
    });

    it("has valid contact information", () => {
      expect(ORGANIZATION_SCHEMA.contactPoint["@type"]).toBe("ContactPoint");
      expect(ORGANIZATION_SCHEMA.contactPoint.email).toBe(
        "edouard.dulac@gmail.com",
      );
      expect(ORGANIZATION_SCHEMA.contactPoint.telephone).toBe("+33613516233");
    });

    it("has correct social media links matching project constants", () => {
      expect(ORGANIZATION_SCHEMA.sameAs).toContain(SOCIAL_LINKS.FACEBOOK);
      expect(ORGANIZATION_SCHEMA.sameAs).toContain(SOCIAL_LINKS.INSTAGRAM);
    });
  });

  describe("EDUCATIONAL_ORGANIZATION_SCHEMA", () => {
    it("has correct structure and required fields", () => {
      expect(EDUCATIONAL_ORGANIZATION_SCHEMA["@context"]).toBe(
        "https://schema.org",
      );
      expect(EDUCATIONAL_ORGANIZATION_SCHEMA["@type"]).toBe(
        "EducationalOrganization",
      );
      expect(EDUCATIONAL_ORGANIZATION_SCHEMA.hasOfferCatalog).toBeDefined();
      expect(EDUCATIONAL_ORGANIZATION_SCHEMA.hasOfferCatalog["@type"]).toBe(
        "OfferCatalog",
      );
    });

    it("has three course offerings", () => {
      const offerings =
        EDUCATIONAL_ORGANIZATION_SCHEMA.hasOfferCatalog.itemListElement;
      expect(offerings).toHaveLength(3);

      const courseNames = offerings.map((offer) => offer.itemOffered.name);
      expect(courseNames).toContain("Initiation à la Dégustation");
      expect(courseNames).toContain("Découverte des Terroirs");
      expect(courseNames).toContain("Accords Mets et Vins");
    });

    it("has valid course structure", () => {
      const firstCourse =
        EDUCATIONAL_ORGANIZATION_SCHEMA.hasOfferCatalog.itemListElement[0];
      expect(firstCourse["@type"]).toBe("Offer");
      expect(firstCourse.itemOffered["@type"]).toBe("Course");
      expect(firstCourse.itemOffered.provider["@type"]).toBe("Organization");
    });
  });

  describe("WEBSITE_SCHEMA", () => {
    it("has correct structure and required fields", () => {
      expect(WEBSITE_SCHEMA["@context"]).toBe("https://schema.org");
      expect(WEBSITE_SCHEMA["@type"]).toBe("WebSite");
      expect(WEBSITE_SCHEMA.name).toBe("Edouard, Caviste personnel");
      expect(WEBSITE_SCHEMA.url).toBe("https://caviste-personnel.vercel.app");
      expect(WEBSITE_SCHEMA.publisher).toBeDefined();
      expect(WEBSITE_SCHEMA.potentialAction).toBeDefined();
    });

    it("has valid search action", () => {
      expect(WEBSITE_SCHEMA.potentialAction["@type"]).toBe("SearchAction");
      expect(WEBSITE_SCHEMA.potentialAction.target["@type"]).toBe("EntryPoint");
      expect(WEBSITE_SCHEMA.potentialAction["query-input"]).toBe(
        "required name=search_term_string",
      );
    });
  });

  describe("Schema validation", () => {
    it("all schemas are valid JSON", () => {
      expect(() => JSON.stringify(ORGANIZATION_SCHEMA)).not.toThrow();
      expect(() =>
        JSON.stringify(EDUCATIONAL_ORGANIZATION_SCHEMA),
      ).not.toThrow();
      expect(() => JSON.stringify(WEBSITE_SCHEMA)).not.toThrow();
    });

    it("all schemas have required @context and @type", () => {
      const schemas = [
        ORGANIZATION_SCHEMA,
        EDUCATIONAL_ORGANIZATION_SCHEMA,
        WEBSITE_SCHEMA,
      ];

      schemas.forEach((schema) => {
        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBeDefined();
        expect(typeof schema["@type"]).toBe("string");
      });
    });
  });
});
