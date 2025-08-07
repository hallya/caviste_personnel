interface ImagePlaceholderProps {
    title: string;
  }
  
  export default function ImagePlaceholder({ title }: ImagePlaceholderProps) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400"
        aria-label={`Aucune image disponible pour ${title}`}
      >
        <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-50" aria-hidden="true">
          <path
            d="M21 19V5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-2 0H5V5h14v14ZM8 13l2.5 3.01L13 13l3 4H8Zm1-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }