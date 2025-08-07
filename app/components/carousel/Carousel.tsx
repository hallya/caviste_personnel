import CarouselContainer from "./containers/CarouselContainer";
import type { Collection } from "./types";

interface CarouselProps {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  onItemClick?: (handle: string, title: string) => void;
}

export default function Carousel({
  collections,
  isLoading,
  error,
  onItemClick,
}: CarouselProps) {
  return (
    <CarouselContainer
      collections={collections}
      isLoading={isLoading}
      error={error}
      onItemClick={onItemClick}
    />
  );
}
