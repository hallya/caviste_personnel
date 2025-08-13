import { Metadata } from "next";
import CollectionsContainer from "./containers/CollectionsContainer";
import { CollectionsApi } from "../services";

export const metadata: Metadata = {
  title: "Collections - Edouard, Caviste personnel",
  description: "Découvrez nos collections de vins sélectionnés par Edouard, votre caviste personnel.",
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [collections, resolvedSearchParams] = await Promise.all([
    new CollectionsApi().fetchCollections(),
    searchParams,
  ]);

  return (
    <CollectionsContainer
      initialCollections={collections}
      searchParams={resolvedSearchParams}
    />
  );
}