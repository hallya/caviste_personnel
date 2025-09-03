import { calculateCartTotal } from "../utils";
import { __testHelpers__ } from "@pkg/services-shopify";

const { cartLinesFactory } = __testHelpers__;

describe("calculateCartTotal", () => {
  it("should calculate total correctly for multiple items", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 30, quantity: 1 }, { unitPrice: 20, quantity: 2 }, { unitPrice: 15, quantity: 1 }] }));
    expect(total).toBe("85.00 EUR");
  });

  it("should return 0.00 EUR for empty cart", () => {
    const total = calculateCartTotal([]);
    expect(total).toBe("0.00 EUR");
  });

  it("should handle single item", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 20, quantity: 1 }] }));
    expect(total).toBe("20.00 EUR");
  });

  it("should handle items with decimal prices", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 12.5, quantity: 2 }] }));
    expect(total).toBe("25.00 EUR");
  });

  it("should handle items with different currencies", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: 40, currency: "USD", quantity: 1 }] }));
    expect(total).toBe("40.00 USD");
  });

  it("should handle items with zero quantity", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ quantity: 0, unitPrice: 10 }] }));
    expect(total).toBe("0.00 EUR");
  });

  it("should handle items with invalid price format", () => {
    const total = calculateCartTotal(cartLinesFactory({ overrideCartLines: [{ unitPrice: NaN, quantity: 1 }] }));
    expect(total).toBe("N/A");
  });
});
