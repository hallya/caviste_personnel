interface CarouselErrorProps {
  error: string;
}

export default function CarouselError({ error }: CarouselErrorProps) {
  return (
    <div className="w-[calc(100vw-40px)] max-w-[1000px] mx-auto flex items-center justify-center h-80">
      <div className="text-primary-700 text-center">
        <div className="text-lg font-semibold mb-2">Erreur de chargement</div>
        <div className="text-sm">{error}</div>
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