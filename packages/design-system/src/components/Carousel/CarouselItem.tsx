import { memo, useMemo, useCallback } from "react";
import Image from "next/image";
import { type Collection } from "@pkg/domain";
import styles from "./Carousel.module.css";
import { VideoBackground } from "./VideoBackground";

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
  const isVisible = Math.abs(index - current) <= 1;

  const style = useMemo(() => {
    const offset = index - current;
    const abs = Math.abs(offset);

    // More pronounced depth effect on mobile
    const z = isMobile ? -(abs * abs) * 400 : -(abs * abs) * 220;

    // Increased spacing on mobile for more spread
    const x = isMobile ? 100 * offset : 200 * offset;

    // More pronounced scale on mobile for depth effect
    const scale = isMobile ? 1 - abs * 0.15 : 1 - abs * 0.05;

    return {
      transform: `translate3d(${x}px,0,0) translateZ(${z}px) scale(${scale})`,
      zIndex: 100 - abs,
      opacity: 1,
    };
  }, [index, current, isMobile]);

  const handleClick = useCallback(() => {
    if (isSelected) {
      onOpen(collection);
    } else {
      onSelect(index);
    }
  }, [isSelected, onOpen, onSelect, collection, index]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const ImageComponent = useMemo(
    () =>
      collection.imageUrl ? (
        <Image
          src={collection.imageUrl}
          alt={`Image de ${collection.title}`}
          width={isMobile ? 70 : 80}
          height={isMobile ? 70 : 80}
          unoptimized={true}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${
            isMobile ? "w-18 h-18" : "w-20 h-20"
          } rounded bg-neutral-100`}
          title={collection.title}
        />
      ),
    [collection.imageUrl, collection.title, isMobile],
  );

  const className = useMemo(
    () => `
      ${styles.item}
      absolute bg-white rounded-xl shadow-lg overflow-hidden
      flex flex-col items-center justify-center text-center cursor-pointer
      ${isMobile ? "w-40 h-64 p-1.5" : "w-52 h-80 p-2"}
      ${isSelected ? styles.selected : ""}
    `,
    [isMobile, isSelected],
  );

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      role="listitem"
      aria-label={`Collection ${index + 1} sur ${totalItems}: ${
        collection.title
      }${isSelected ? " (sélectionnée)" : ""}`}
      aria-current={isSelected ? "true" : "false"}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      {collection.videoUrl && (
        <VideoBackground
          src={collection.videoUrl}
          isVisible={isVisible}
          isSelected={isSelected}
        />
      )}
      <div className="absolute inset-0 bg-white/50 rounded-xl z-content"></div>
      <div
        className={`relative z-card transition-all duration-300 ease-in-out ${
          isSelected
            ? "ring-2 ring-primary-600 ring-offset-2 ring-offset-white/30 rounded-lg p-1"
            : ""
        }`}
      >
        {ImageComponent}
      </div>
      <p
        className={`
            font-prata font-black px-2 relative z-card transition-colors duration-300 ease-in-out
            ${isSelected ? "text-black" : "text-neutral-800"}
            ${isMobile ? "mt-2 text-lg" : "mt-4"}
          `}
      >
        {collection.title}
      </p>
    </div>
  );
});
