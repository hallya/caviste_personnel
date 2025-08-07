import CarouselContainer from "./containers/CarouselContainer";

interface CarouselProps {
  onItemClick?: (handle: string, title: string) => void;
}

export default function Carousel({ onItemClick }: CarouselProps) {
  return <CarouselContainer onItemClick={onItemClick} />;
}
