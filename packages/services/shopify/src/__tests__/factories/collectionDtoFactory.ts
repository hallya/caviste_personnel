import { faker } from "@faker-js/faker";
import { videoSourceDtoFactory } from "./videoSourceDtoFactory";
import { CollectionsFragment } from "../../__generated__/graphql";

type CollectionDto = CollectionsFragment["edges"][number]["node"];

type CollectionDtoFactoryParams = Partial<Omit<CollectionDto, "__typename">>;

export function collectionDtoFactory(
  params: CollectionDtoFactoryParams = {}
): CollectionDto {
  const { ...rest } = params;

  const videoSources = videoSourceDtoFactory();

  return {
    __typename: "Collection",
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    handle: faker.lorem.slug(),
    image: {
      __typename: "Image",
      url: faker.image.url(),
    },
    metafield: videoSources
      ? {
          __typename: "Metafield",
          type: "file_reference",
          reference: {
            __typename: "Video",
            sources: [...videoSources],
            previewImage: {
              __typename: "Image",
              url: faker.image.url(),
            },
          },
        }
      : null,
    tagsMetafield: {
      __typename: "Metafield",
      type: "list.single_line_text_field",
      value: JSON.stringify(
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
          faker.commerce.productAdjective()
        )
      ),
    },
    ...rest,
  };
}
