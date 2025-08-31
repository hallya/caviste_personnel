import { Metadata } from "next";
import CollectionsContainer from "./containers/CollectionsContainer";
import { GetCollectionsDocument, mapGetCollectionsQueryDtoToDomain } from "@pkg/services-shopify";
import { shopifyPage } from "../services/client";

export const metadata: Metadata = {
  title: "Collections - Edouard, Caviste personnel",
  description:
    "Découvrez nos collections de vins sélectionnés par Edouard, votre caviste personnel.",
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [response, resolvedSearchParams] = await Promise.all([
    shopifyPage.static(GetCollectionsDocument, { first: 10 }),
    searchParams,
  ]);

  const collections = mapGetCollectionsQueryDtoToDomain(response.data) ?? [];

  return (
    <CollectionsContainer
      initialCollections={collections}
      searchParams={resolvedSearchParams}
    />
  );
}
