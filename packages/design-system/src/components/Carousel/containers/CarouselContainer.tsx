"use client";

import { useCallback } from "react";
import type { Collection } from "@pkg/domain";
import { useCarouselNav } from "../useCarouselNav";
import CarouselView from "../views/CarouselView";
import CarouselLoading from "../views/CarouselLoading";
import CarouselError from "../views/CarouselError";
import CarouselEmpty from "../views/CarouselEmpty";
import { ProductCollectionSortKeys } from "@pkg/services-shopify";

interface CarouselContainerProps {
  onItemClick?: (
    handle: string,
    title: string,
    collectionTags: string[] | null,
    sortKey: ProductCollectionSortKeys
  ) => void;
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
}

export default function CarouselContainer({
  onItemClick,
  collections,
  isLoading,
  error,
}: CarouselContainerProps) {
  const {
    current,
    setCurrent,
    containerRef,
    handleTouchStart,
    handleTouchEnd,
    isMobile,
  } = useCarouselNav(collections.length, { initial: "center" });

  const handleSelect = useCallback((i: number) => setCurrent(i), [setCurrent]);

  const handleOpen = useCallback((c: Collection) =>
    onItemClick?.(c.handle, c.title, c.collectionTags, ProductCollectionSortKeys.CollectionDefault),
  [onItemClick]);

  if (isLoading) {
    return <CarouselLoading />;
  }

  if (error) {
    return <CarouselError error={error} />;
  }

  if (collections.length === 0) {
    return <CarouselEmpty />;
  }

  return (
    <CarouselView
      collections={collections}
      current={current}
      containerRef={containerRef}
      handleTouchStart={handleTouchStart}
      handleTouchEnd={handleTouchEnd}
      isMobile={isMobile}
      onSelect={handleSelect}
      onOpen={handleOpen}
    />
  );
}
