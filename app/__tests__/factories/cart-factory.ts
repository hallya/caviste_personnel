// Test-specific types - independent from component implementation
interface TestCartItem {
  id: string;
  title: string;
  price: string;
  unitPrice: number;
  currency: string;
  lineTotal: string;
  quantity: number;
  image?: string;
  availableForSale: boolean;
  quantityAvailable: number;
  variantId?: string;
}

interface TestCart {
  id: string;
  totalQuantity: number;
  totalAmount: string;
  checkoutUrl: string;
  lines: TestCartItem[];
}

export const CartTestFactories = {
  createCartLine: (overrides: Partial<TestCartItem> = {}): TestCartItem => ({
    id: "gid://shopify/CartLine/123",
    title: "Château Margaux 2018",
    price: "150.00 EUR",
    unitPrice: 150.00,
    currency: "EUR",
    lineTotal: "300.00 EUR",
    quantity: 2,
    image: "https://example.com/wine.jpg",
    availableForSale: true,
    quantityAvailable: 10,
    variantId: "gid://shopify/ProductVariant/456",
    ...overrides,
  }),

  createCart: (overrides: Partial<TestCart> = {}): TestCart => ({
    id: "gid://shopify/Cart/789",
    lines: [CartTestFactories.createCartLine()],
    totalQuantity: 2,
    totalAmount: "300.00 EUR",
    checkoutUrl: "https://checkout.shopify.com/cart/789",
    ...overrides,
  }),
};

export const CartTestData = {
  singleItemCart: CartTestFactories.createCart(),
  multipleItemsCart: CartTestFactories.createCart({
    lines: [
      CartTestFactories.createCartLine({ id: "gid://shopify/CartLine/1", title: "Wine 1" }),
      CartTestFactories.createCartLine({ id: "gid://shopify/CartLine/2", title: "Wine 2" }),
    ],
    totalQuantity: 4,
  }),
  emptyCart: CartTestFactories.createCart({
    lines: [],
    totalQuantity: 0,
  }),
};
