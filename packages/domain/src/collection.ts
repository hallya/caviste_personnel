import type { Product } from "./product";

export interface Collection {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  videoUrl: string | null;
  collectionTags: string[] | null;
}

export interface CollectionProducts {
  id: string;
  title: string;
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
  };
  products: Product[];
}