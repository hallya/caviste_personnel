import { calculateCartTotal } from "../utils";
import { __testHelpers__ } from "@pkg/services-shopify";

const { cartLinesFactory } = __testHelpers__;

describe("calculateCartTotal", () => {
  it("should calculate total correctly for multiple items", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 30 }, { unitPrice: 20 }, { unitPrice: 15 }] }));
    expect(total).toBe("65.00 EUR");
  });

  it("should return 0.00 EUR for empty cart", () => {
    const total = calculateCartTotal([]);
    expect(total).toBe("0.00 EUR");
  });

  it("should handle single item", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 20 }] }));
    expect(total).toBe("20.00 EUR");
  });

  it("should handle items with decimal prices", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 12.5 }] }));
    expect(total).toBe("25.00 EUR");
  });

  it("should handle items with different currencies", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 40, currency: "USD" }] }));
    expect(total).toBe("40.00 USD");
  });

  it("should handle items with zero quantity", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ quantity: 0 }] }));
    expect(total).toBe("0.00 EUR");
  });

  it("should handle items with invalid price format", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: NaN }] }));
    expect(total).toBe("0.00 EUR");
  });
});
