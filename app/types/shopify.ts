// Shopify Storefront API Types
// Based on Shopify's GraphQL schema for Storefront API

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  featuredImage?: ShopifyImage;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  selectedOrFirstAvailableVariant: {
    id: string;
    price: ShopifyMoney;
  };
  availableForSale: boolean;
  productType?: string;
  tags: string[];
  vendor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: ShopifyImage;
  products: {
    edges: {
      cursor: string;
      node: ShopifyProduct;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

// GraphQL Query Types
export interface CollectionProductsQuery {
  collectionByHandle?: {
    title: string;
    products: {
      edges: {
        cursor: string;
        node: ShopifyProduct;
      }[];
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string;
        endCursor?: string;
      };
    };
  };
}

export interface CollectionsQuery {
  collections: {
    edges: {
      node: ShopifyCollection;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

// GraphQL Variables Types
export interface CollectionProductsVars {
  handle: string;
  first: number;
  after?: string | null;
}

export interface CollectionsVars {
  first: number;
  after?: string | null;
}

// Simplified types for your current usage
export interface SimplifiedProduct {
  id: string;
  title: string;
  image: string | null;
  price: string | null;
  currency: string | null;
  variantId?: string; // For cart functionality
}

export interface SimplifiedCollection {
  title: string | null;
  products: SimplifiedProduct[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

// Shopify Cart Types
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

export interface ShopifyUserError {
  field: string[];
  message: string;
}

export interface ShopifyCartCreatePayload {
  cart: ShopifyCart;
  userErrors: ShopifyUserError[];
}

export interface ShopifyCartLinesAddPayload {
  cart: ShopifyCart;
  userErrors: ShopifyUserError[];
}

// Type guards
export function isShopifyProduct(obj: unknown): obj is ShopifyProduct {
  return Boolean(obj && typeof obj === 'object' && obj !== null && 
         'id' in obj && typeof (obj as ShopifyProduct).id === 'string' && 
         'title' in obj && typeof (obj as ShopifyProduct).title === 'string');
}

export function isShopifyCollection(obj: unknown): obj is ShopifyCollection {
  return Boolean(obj && typeof obj === 'object' && obj !== null && 
         'id' in obj && typeof (obj as ShopifyCollection).id === 'string' && 
         'title' in obj && typeof (obj as ShopifyCollection).title === 'string');
} 