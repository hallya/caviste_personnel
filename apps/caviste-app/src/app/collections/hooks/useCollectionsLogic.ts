import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Collection } from "@pkg/domain";
import { ProductCollectionSortKeys } from "@pkg/services-shopify";
import { useCollections } from "../../hooks/useCollections";
import { useDebounce } from "./useDebounce";

interface UseCollectionsLogicProps {
  initialCollections: Collection[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export function useCollectionsLogic({
  initialCollections,
  searchParams,
}: UseCollectionsLogicProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [filteredCollections, setFilteredCollections] =
    useState<Collection[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams.search as string) || "",
  );
  const [sortBy, setSortBy] = useState<"name" | "handle">(
    (searchParams.sort as "name" | "handle") || "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.order as "asc" | "desc") || "asc",
  );

  const {
    popupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    popupProducts,
    popupLoading,
    hasNextPage,
    openCollection,
    loadMore,
    closePopup,
  } = useCollections();

  const updateURL = useCallback(
    (search: string, sort: string, order: string) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort !== "name") params.set("sort", sort);
      if (order !== "asc") params.set("order", order);

      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router],
  );

  const debouncedUpdateURL = useDebounce(updateURL, 250);

  useEffect(() => {
    debouncedUpdateURL(searchQuery, sortBy, sortOrder);
  }, [searchQuery, sortBy, sortOrder, debouncedUpdateURL]);

  useEffect(() => {
    let filtered = [...initialCollections];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (collection) =>
          collection.title.toLowerCase().includes(query) ||
          collection.handle.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      const valueA = sortBy === "name" ? a.title : a.handle;
      const valueB = sortBy === "name" ? b.title : b.handle;

      const comparison = valueA.localeCompare(valueB, "fr", {
        sensitivity: "base",
      });

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredCollections(filtered);
  }, [initialCollections, searchQuery, sortBy, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSortChange = (newSortBy: "name" | "handle") => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newSortOrder: "asc" | "desc") => {
    setSortOrder(newSortOrder);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
  };

  const handleItemClick = async (
    handle: string,
    title: string,
    collectionTags: string[] | null,
  ) => {
    const collection = filteredCollections.find((c) => c.handle === handle);
    const collectionTitle = title || collection?.title || "";
    const tags = collectionTags || collection?.collectionTags || [];

    await openCollection(handle, collectionTitle, tags, ProductCollectionSortKeys.CollectionDefault);
  };

  return {
    collections: filteredCollections,
    searchQuery,
    sortBy,
    sortOrder,
    onSearchChange: handleSearchChange,
    onSortChange: handleSortChange,
    onSortOrderChange: handleSortOrderChange,
    onClearFilters: handleClearFilters,
    popupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    popupProducts,
    popupLoading,
    hasNextPage,
    onItemClick: handleItemClick,
    onLoadMore: loadMore,
    onClosePopup: closePopup,
  };
}
