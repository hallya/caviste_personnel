export interface CarouselOptions {
  initial?: "center" | number;
}

export interface CarouselState {
  current: number;
  isMobile: boolean;
}

export interface CarouselHandlers {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  goStep: (direction: 1 | -1) => void;
  setCurrent: (index: number) => void;
}

export interface CarouselReturn extends CarouselState, CarouselHandlers {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Nouveaux types pour la gestion d'erreurs
export interface CarouselDataState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
}

export interface Collection {
  title: string;
  handle: string;
  image: string | null;
} 