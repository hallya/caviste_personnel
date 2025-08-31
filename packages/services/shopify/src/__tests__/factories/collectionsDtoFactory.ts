import { faker } from "@faker-js/faker";
import { collectionDtoFactory } from "./collectionDtoFactory";
import { CollectionsFragment } from "../../__generated__/graphql";

export type CollectionsDtoFactoryParams = {
  collection?: Partial<
    Omit<CollectionsFragment["edges"][number]["node"], "__typename">
  >;
  length?: number;
};

export function collectionsDtoFactory(
  params: CollectionsDtoFactoryParams = {}
): CollectionsFragment {
  return {
    __typename: "CollectionConnection",
    edges: Array.from(
      {
        length: params.length ?? faker.number.int({ min: 1, max: 10 }),
      },
      () => ({
        __typename: "CollectionEdge",
        node: collectionDtoFactory(params.collection),
      })
    ),
  };
}
