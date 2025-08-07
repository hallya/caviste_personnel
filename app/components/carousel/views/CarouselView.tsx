import { RefObject } from "react";
import { CarouselItem } from "../CarouselItem";
import styles from "../Carousel.module.css";
import type { Collection } from "../types";

interface CarouselViewProps {
  collections: Collection[];
  current: number;
  containerRef: RefObject<HTMLDivElement | null>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  isMobile: boolean;
  onSelect: (i: number) => void;
  onOpen: (c: Collection) => void;
}

export default function CarouselView({
  collections,
  current,
  containerRef,
  handleTouchStart,
  handleTouchEnd,
  isMobile,
  onSelect,
  onOpen,
}: CarouselViewProps) {
  return (
    <nav
      ref={containerRef}
      className="w-[calc(100vw-40px)] max-w-[1000px] mx-auto flex items-center justify-center relative"
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
          {collections.map((c, i) => (
            <CarouselItem
              key={c.handle || `${c.title}-${i}`}
              collection={c}
              index={i}
              current={current}
              onSelect={onSelect}
              onOpen={onOpen}
              isMobile={isMobile}
              totalItems={collections.length}
            />
          ))}
        </div>
      </div>
      
      <div className="sr-only">
        <button
          onClick={() => onSelect(current - 1)}
          aria-label={`Collection précédente${current > 0 ? `: ${collections[current - 1]?.title}` : ''}`}
          disabled={current === 0}
        >
          Précédent
        </button>
        <span aria-live="polite" aria-atomic="true">
          Collection {current + 1} sur {collections.length}: {collections[current]?.title}
        </span>
        <button
          onClick={() => onSelect(current + 1)}
          aria-label={`Collection suivante${current < collections.length - 1 ? `: ${collections[current + 1]?.title}` : ''}`}
          disabled={current === collections.length - 1}
        >
          Suivant
        </button>
      </div>
    </nav>
  );
} 