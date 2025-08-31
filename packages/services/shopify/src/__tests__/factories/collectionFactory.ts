import { faker } from "@faker-js/faker";
import { type Collection } from "@pkg/domain";
import { collectionsFactory } from "./collectionsFactory";

export type CollectionFactoryParams = {
  overrideCollection?: Partial<Collection>;
};

export function collectionFactory(
  params: CollectionFactoryParams = {}
): Collection {
  return faker.helpers.arrayElement(
    collectionsFactory({
      overrideCollections: [params.overrideCollection ?? {}],
    })
  );
}
