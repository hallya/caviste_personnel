import { ImageIcon } from "../design-system/icons";

interface ImagePlaceholderProps {
    title: string;
  }
  
  export default function ImagePlaceholder({ title }: ImagePlaceholderProps) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400"
        aria-label={`Aucune image disponible pour ${title}`}
      >
        <ImageIcon className="w-10 h-10 opacity-50" />
      </div>
    );
  }