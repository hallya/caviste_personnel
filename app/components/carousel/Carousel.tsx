"use client";

import { useEffect, useState } from "react";
import styles from "./Carousel.module.css";
import { CarouselItem } from "./CarouselItem";
import { useCarouselNav } from "./useCarouselNav";
import type { Collection, CarouselDataState } from "./types";

export default function Carousel({
  onItemClick,
}: {
  onItemClick?: (handle: string, title: string) => void;
}) {
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

  // Loading and error states
  if (dataState.isLoading) {
    return (
      <div className="w-[calc(100vw-80px)] max-w-[1000px] mx-auto flex items-center justify-center h-80">
        <div className="text-gray-600 text-lg">Chargement des collections...</div>
      </div>
    );
  }

  if (dataState.error) {
    return (
      <div className="w-[calc(100vw-80px)] max-w-[1000px] mx-auto flex items-center justify-center h-80">
        <div className="text-red-600 text-center">
          <div className="text-lg font-semibold mb-2">Erreur de chargement</div>
          <div className="text-sm">{dataState.error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (dataState.collections.length === 0) {
    return (
      <div className="w-[calc(100vw-80px)] max-w-[1000px] mx-auto flex items-center justify-center h-80">
        <div className="text-gray-600 text-lg">Aucune collection disponible</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-[calc(100vw-80px)] max-w-[1000px] mx-auto flex items-center justify-center relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Carousel de collections"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className={`${styles.viewport} w-full flex items-center justify-center`}>
        <div 
          className={`${styles.inner} relative w-full h-80 flex items-center justify-center`}
          role="list"
          aria-label="Liste des collections"
        >
          {dataState.collections.map((c, i) => (
            <CarouselItem
              key={c.handle || `${c.title}-${i}`}
              collection={c}
              index={i}
              current={current}
              onSelect={handleSelect}
              onOpen={handleOpen}
              isMobile={isMobile}
              totalItems={dataState.collections.length}
            />
          ))}
        </div>
      </div>
      
      {/* Navigation accessible */}
      <div className="sr-only">
        <button
          onClick={() => setCurrent(current - 1)}
          aria-label="Collection précédente"
          disabled={current === 0}
        >
          Précédent
        </button>
        <span aria-live="polite">
          Collection {current + 1} sur {dataState.collections.length}
        </span>
        <button
          onClick={() => setCurrent(current + 1)}
          aria-label="Collection suivante"
          disabled={current === dataState.collections.length - 1}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
