interface PopupHeaderProps {
  title: string;
  onClose: () => void;
}

export default function PopupHeader({ title, onClose }: PopupHeaderProps) {
  return (
    <header className="sticky top-0 bg-primary-50 rounded-t-xl px-8 pt-4 pb-4 border-b border-primary-200 z-modal-header">
      <div className="flex justify-between items-start">
        <h2
          id="popup-title"
          className="text-xl font-prata text-primary-600 flex-1 pr-4"
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-2xl text-primary-600 leading-none hover:text-primary-700 transition-colors duration-200 flex-shrink-0"
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>
      </div>
    </header>
  );
}
