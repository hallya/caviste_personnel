import { type Collection } from "@pkg/domain";
import { type CollectionsFragment as CollectionsDto } from "../../__generated__/graphql";
import { DEFAULT_IMAGE_URL } from "../../constants";

function parseCollectionTags(tagsMetafield: string): string[] | null {
  return JSON.parse(tagsMetafield)
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0) as string[];
}

export function mapCollectionsDtoToDomain(
  collections: CollectionsDto | null
): Collection[] | null {
  if (!collections || collections.edges.length === 0) {
    return null;
  }

  return collections.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    imageUrl: edge.node.image?.url ?? DEFAULT_IMAGE_URL,
    videoUrl:
      edge.node.metafield?.reference?.__typename === "Video"
        ? edge.node.metafield.reference.sources[0].url
        : null,
    collectionTags: edge.node.tagsMetafield?.value
      ? parseCollectionTags(edge.node.tagsMetafield.value)
      : null,
  }));
}
