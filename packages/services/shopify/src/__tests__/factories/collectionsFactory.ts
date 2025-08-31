import { faker } from "@faker-js/faker";
import { type Collection } from "@pkg/domain";

type CollectionsFactoryParams = {
  overrideCollections?: Partial<Collection>[];
  length?: number;
};

export function collectionsFactory(
  params: CollectionsFactoryParams = {}
): Collection[] {
  return Array.from(
    {
      length:
        params.overrideCollections?.length ??
        params.length ??
        faker.number.int({ min: 1, max: 3 }),
    },
    (_, i) => ({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      handle: faker.string.uuid(),
      imageUrl: faker.helpers.arrayElement([faker.image.url(), null]),
      videoUrl: faker.helpers.arrayElement([faker.image.url(), null]),
      collectionTags: faker.helpers.arrayElement([
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
          faker.commerce.productAdjective()
        ),
        null,
      ]),
      ...(params.overrideCollections?.[i] ?? {}),
    })
  );
}
