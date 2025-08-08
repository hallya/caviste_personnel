"use client";

import { useCarouselNav } from "../useCarouselNav";
import CarouselView from "../views/CarouselView";
import CarouselLoading from "../views/CarouselLoading";
import CarouselError from "../views/CarouselError";
import CarouselEmpty from "../views/CarouselEmpty";
import type { Collection } from "../types";

interface CarouselContainerProps {
  onItemClick?: (handle: string, title: string, collectionTags?: string[]) => void;
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

  const handleSelect = (i: number) => setCurrent(i);
  const handleOpen = (c: Collection) =>
    onItemClick?.(c.handle, c.title ?? c.handle, c.collectionTags);

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
