import { memo, useMemo, useCallback } from "react";
import styles from "./Carousel.module.css";
import { Collection } from "./types";
import Image from "next/image";

function computeItemStyle(index: number, current: number, isMobile: boolean) {
    const offset = index - current;
    const abs = Math.abs(offset);
    
    // Effet de profondeur plus marqué sur mobile
    const z = isMobile ? -(abs * abs) * 400 : -(abs * abs) * 220;
    
    // Espacement augmenté sur mobile pour plus de spread
    const x = isMobile ? 100 * offset : 200 * offset;
    
    // Scale plus marqué sur mobile pour l'effet de profondeur
    const scale = isMobile ? 1 - abs * 0.15 : 1 - abs * 0.05;
    
    return {
      transform: `translate3d(${x}px,0,0) translateZ(${z}px) scale(${scale})`,
      zIndex: 100 - abs,
      opacity: 1,
    } as const;
  }

export const CarouselItem = memo(function CarouselItem({
    collection,
    index,
    current,
    onSelect,
    onOpen,
    isMobile,
    totalItems,
  }: {
    collection: Collection;
    index: number;
    current: number;
    onSelect: (i: number) => void;
    onOpen: (c: Collection) => void;
    isMobile: boolean;
    totalItems: number;
  }) {
    const isSelected = index === current;
    
    // Optimisation avec useMemo pour éviter les recalculs
    const style = useMemo(() => 
      computeItemStyle(index, current, isMobile), 
      [index, current, isMobile]
    );

    // Optimisation des handlers avec useCallback
    const handleClick = useCallback(() => {
      if (isSelected) {
        onOpen(collection);
      } else {
        onSelect(index);
      }
    }, [isSelected, onOpen, onSelect, collection, index]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    }, [handleClick]);

    return (
      <div
        className={`
          ${styles.item}
          absolute bg-white rounded-xl shadow-lg
          flex flex-col items-center justify-center text-center cursor-pointer
          ${isMobile ? 'w-36 h-56 p-1.5' : 'w-52 h-80 p-2'}
          ${isSelected ? styles.selected : ''}
        `}
        style={style}
        onClick={handleClick}
        role="listitem"
        aria-label={`Collection ${index + 1} sur ${totalItems}: ${collection.title}`}
        aria-current={isSelected ? "true" : "false"}
        tabIndex={isSelected ? 0 : -1}
        onKeyDown={handleKeyDown}
      >
        {collection.image ? (
          <Image
            src={collection.image}
            alt={`Image de ${collection.title}`}
            width={isMobile ? 60 : 80}
            height={isMobile ? 60 : 80}
            unoptimized
          />
        ) : (
          <div
            aria-hidden="true"
            className={`${isMobile ? "w-16 h-16" : "w-20 h-20"} rounded bg-gray-100`}
            title={collection.title}
          />
        )}
        <p className={`
          text-gray-800 font-semibold px-2
          ${isMobile ? 'mt-2 text-sm' : 'mt-4'}
        `}>
          {collection.title}
        </p>
      </div>
    );
  });
