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
    <footer className="sticky bottom-0 bg-primary-50 rounded-b-xl px-8 pt-4 pb-4 border-t border-primary-200 z-modal-footer">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!hasNext || loading}
          aria-controls={gridId}
          className="px-4 py-2 rounded-md border border-primary-600 hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed text-primary-600 transition-colors duration-200"
        >
          {buttonText}
        </button>
      </div>
    </footer>
  );
}