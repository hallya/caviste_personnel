import { Z_INDEX } from "../../styles/z-index";

interface PopupFooterProps {
  hasNext: boolean;
  loading: boolean;
  onLoadMore: () => void;
  gridId: string;
}

export default function PopupFooter({ 
  hasNext, 
  loading, 
  onLoadMore, 
  gridId 
}: PopupFooterProps) {
  const buttonText = loading ? "Chargement…" : hasNext ? "Charger plus" : "Tout est chargé";
  
  return (
    <footer className={`sticky bottom-0 bg-white rounded-b-xl px-8 pt-4 pb-4 border-t border-gray-100 z-[${Z_INDEX.MODAL_FOOTER}]`}>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!hasNext || loading}
          aria-controls={gridId}
          className="px-4 py-2 rounded-md border border-[#7a2d2d] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#7a2d2d] transition-colors duration-200"
        >
          {buttonText}
        </button>
      </div>
    </footer>
  );
}