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
  quantityAvailable?: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  product?: {
    title: string;
    featuredImage?: {
      url: string;
    };
  };
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
    availableForSale: boolean;
    quantityAvailable?: number;
  };
  availableForSale: boolean;
  productType?: string;
  tags: string[];
  vendor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyMetafieldReference {
  __typename: string;
  url?: string;
  mimeType?: string;
  filename?: string;
  image?: {
    url: string;
  };
  sources?: {
    url: string;
    mimeType: string;
    format: string;
  }[];
  previewImage?: {
    url: string;
  };
}

export interface ShopifyMetafield {
  type: string;
  reference?: ShopifyMetafieldReference;
}

export interface ShopifyImageSimple {
  url: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: ShopifyImage;
  videoCollection?: ShopifyMetafield;
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

export interface CollectionProductsVars {
  handle: string;
  first: number;
  after?: string | null;
}

export interface CollectionsVars {
  first: number;
  after?: string | null;
}

export interface SimplifiedProduct {
  id: string;
  title: string;
  image: string | null;
  price: string | null;
  currency: string | null;
  variantId?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
}

export interface SimplifiedCollection {
  title: string | null;
  products: SimplifiedProduct[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant;
}

export interface ShopifyCartQuery {
  cart: ShopifyCart;
}

export interface ShopifyCartQueryVars {
  id: string;
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

export interface CartAddResult {
  cartId: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
}

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

export interface ShopifyCollectionGraphQLNode {
  id: string;
  title: string;
  handle: string;
  image?: ShopifyImageSimple;
  metafield?: ShopifyMetafield;
}

export interface ShopifyCollectionGraphQLEdge {
  node: ShopifyCollectionGraphQLNode;
}

export interface ShopifyCollectionsGraphQLResponse {
  data: {
    collections: {
      edges: ShopifyCollectionGraphQLEdge[];
    };
  };
} 