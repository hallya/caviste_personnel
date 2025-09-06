import { productMatchesTags, productMatchesSearch } from "../utils";
import { __testHelpers__ } from "@pkg/services-shopify";
const { productFactory } = __testHelpers__;

const mockProduct1 = productFactory({
  overrideProduct: {
    variantId: "1",
    title: "Vin Rouge de Bordeaux",
    price: "25.00 EUR",
    tags: ["vin-rouge", "bordeaux", "premium"],
  },
});

describe("Filter Logic", () => {
  describe("productMatchesTags", () => {
    it("should match product with all selected tags (AND logic)", () => {
      const result = productMatchesTags(mockProduct1, [
        "vin-rouge",
        "bordeaux",
      ]);
      expect(result).toBe(true);
    });

    it("should not match product missing one tag", () => {
      const result = productMatchesTags(mockProduct1, [
        "vin-rouge",
        "champagne",
      ]);
      expect(result).toBe(false);
    });

    it("should match when no tags selected", () => {
      const result = productMatchesTags(mockProduct1, []);
      expect(result).toBe(true);
    });

    it("should be case insensitive", () => {
      const result = productMatchesTags(mockProduct1, [
        "VIN-ROUGE",
        "BORDEAUX",
      ]);
      expect(result).toBe(true);
    });
  });

  describe("productMatchesSearch", () => {
    it("should match product title", () => {
      const result = productMatchesSearch(mockProduct1, "bordeaux");
      expect(result).toBe(true);
    });

    it("should match product tags", () => {
      const result = productMatchesSearch(mockProduct1, "premium");
      expect(result).toBe(true);
    });

    it("should be case insensitive", () => {
      const result = productMatchesSearch(mockProduct1, "BORDEAUX");
      expect(result).toBe(true);
    });

    it("should not match unrelated search", () => {
      const result = productMatchesSearch(mockProduct1, "champagne");
      expect(result).toBe(false);
    });

    it("should match partial words", () => {
      const result = productMatchesSearch(mockProduct1, "bord");
      expect(result).toBe(true);
    });

    it("should return true for empty search", () => {
      const result = productMatchesSearch(mockProduct1, "");
      expect(result).toBe(true);
    });
  });
});
