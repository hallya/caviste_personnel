"use client";

import { useEffect, useState } from "react";
import { useCarouselNav } from "../useCarouselNav";
import CarouselView from "../views/CarouselView";
import CarouselLoading from "../views/CarouselLoading";
import CarouselError from "../views/CarouselError";
import CarouselEmpty from "../views/CarouselEmpty";
import type { Collection, CarouselDataState } from "../types";

interface CarouselContainerProps {
  onItemClick?: (handle: string, title: string) => void;
}

export default function CarouselContainer({ onItemClick }: CarouselContainerProps) {
  const [dataState, setDataState] = useState<CarouselDataState>({
    collections: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    
    const fetchCollections = async () => {
      try {
        setDataState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch("/api/collections", { cache: "no-store" });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const { collections } = await response.json();
        
        if (cancelled) return;
        
        setDataState({
          collections: collections || [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        
        console.error("Erreur lors du chargement des collections:", error);
        setDataState({
          collections: [],
          isLoading: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    };

    fetchCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  const {
    current,
    setCurrent,
    containerRef,
    handleTouchStart,
    handleTouchEnd,
    isMobile,
  } = useCarouselNav(dataState.collections.length, { initial: "center" });

  const handleSelect = (i: number) => setCurrent(i);
  const handleOpen = (c: Collection) => onItemClick?.(c.handle, c.title ?? c.handle);

  if (dataState.isLoading) {
    return <CarouselLoading />;
  }

  if (dataState.error) {
    return <CarouselError error={dataState.error} />;
  }

  if (dataState.collections.length === 0) {
    return <CarouselEmpty />;
  }

  return (
    <CarouselView
      collections={dataState.collections}
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