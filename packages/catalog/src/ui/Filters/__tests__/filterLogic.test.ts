import {
  productMatchesTags,
  productMatchesSearch,
  sortProducts,
} from "../utils";
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

const mockProduct2 = productFactory({
  overrideProduct: {
    variantId: "2",
    title: "Vin Blanc de Loire",
    price: "18.00 EUR",
    totalInventory: 5,
    tags: ["vin-blanc", "loire", "bio"],
  },
});

const mockProduct3 = productFactory({
  overrideProduct: {
    variantId: "3",
    title: "Champagne Brut",
    price: "45.00 EUR",
    availableForSale: false,
    totalInventory: 0,
    tags: ["champagne", "brut", "celebration"],
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

  describe("sortProducts", () => {
    const products = [mockProduct1, mockProduct2, mockProduct3];

    it("should sort by name ascending", () => {
      const sorted = sortProducts(products, "name", "asc");

      expect(sorted[0].title).toBe("Champagne Brut");
      expect(sorted[1].title).toBe("Vin Blanc de Loire");
      expect(sorted[2].title).toBe("Vin Rouge de Bordeaux");
    });

    it("should sort by name descending", () => {
      const sorted = sortProducts(products, "name", "desc");

      expect(sorted[0].title).toBe("Vin Rouge de Bordeaux");
      expect(sorted[1].title).toBe("Vin Blanc de Loire");
      expect(sorted[2].title).toBe("Champagne Brut");
    });

    it("should sort by price ascending", () => {
      const sorted = sortProducts(products, "price", "asc");

      expect(sorted[0].price).toBe("18.00 EUR");
      expect(sorted[1].price).toBe("25.00 EUR");
      expect(sorted[2].price).toBe("45.00 EUR");
    });

    it("should sort by price descending", () => {
      const sorted = sortProducts(products, "price", "desc");

      expect(sorted[0].price).toBe("45.00 EUR");
      expect(sorted[1].price).toBe("25.00 EUR");
      expect(sorted[2].price).toBe("18.00 EUR");
    });

    it("should handle products without price", () => {
      const productsWithoutPrice = [
        { ...mockProduct1, price: null },
        mockProduct2,
        mockProduct3,
      ];

      const sorted = sortProducts(productsWithoutPrice, "price", "asc");

      expect(sorted[0].price).toBe(null);
      expect(sorted[1].price).toBe("25.00 EUR");
      expect(sorted[2].price).toBe("45.00 EUR");
    });
  });
});
