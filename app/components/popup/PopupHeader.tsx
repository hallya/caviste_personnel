import { Z_INDEX } from "../../styles/z-index";

interface PopupHeaderProps {
  title: string;
  onClose: () => void;
}

export default function PopupHeader({ title, onClose }: PopupHeaderProps) {
  return (
    <header className={`sticky top-0 bg-white rounded-t-xl px-8 pt-4 pb-4 border-b border-gray-100 z-[${Z_INDEX.MODAL_HEADER}]`}>
      <div className="flex justify-between items-start">
        <h2 id="popup-title" className="text-xl font-[Prata] text-[#7a2d2d] flex-1 pr-4">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-2xl text-[#7a2d2d] leading-none hover:text-[#5a1d1d] transition-colors duration-200 flex-shrink-0"
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>
      </div>
    </header>
  );
} 