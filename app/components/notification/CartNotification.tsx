"use client";

import { useEffect, useState } from "react";
import type { NotificationProps } from "./types";
import { NOTIFICATION_DEFAULTS } from "./constants";

export default function CartNotification({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay,
  checkoutUrl,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, NOTIFICATION_DEFAULTS.ANIMATION_DURATION);
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, NOTIFICATION_DEFAULTS.ANIMATION_DURATION);
  };

  const baseClasses = `fixed top-4 right-4 z-[${NOTIFICATION_DEFAULTS.Z_INDEX}] max-w-sm w-full bg-[#f4f1ee] rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-${NOTIFICATION_DEFAULTS.ANIMATION_DURATION}`;
  const typeClasses = type === "success" 
    ? "border-[#7a2d2d]" 
    : "border-[#7a2d2d]";
  const visibilityClasses = isVisible 
    ? "translate-x-0 opacity-100" 
    : "translate-x-full opacity-0";

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`} role="alert">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
            type === "success" ? "bg-[#7a2d2d]/10" : "bg-[#7a2d2d]/10"
          }`}>
            {type === "success" ? (
              <svg 
                className="w-3 h-3 text-[#7a2d2d]" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                data-testid="success-icon"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg 
                className="w-3 h-3 text-[#7a2d2d]" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                data-testid="error-icon"
              >
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-bold ${
              type === "success" ? "text-[#7a2d2d]" : "text-[#7a2d2d]"
            }`}>
              {title}
            </p>
            <p className={`text-sm ${
              type === "success" ? "text-[#3a3a3a]" : "text-[#3a3a3a]"
            }`}>
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {type === "success" && checkoutUrl && (
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={() => window.open(checkoutUrl, '_blank')}
            className="w-full px-3 py-2 bg-[#7a2d2d] text-white text-sm rounded-md hover:bg-[#5a1d1d] transition-colors font-medium"
          >
            Voir le panier et commander
          </button>
          <button
            onClick={handleClose}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      )}
    </div>
  );
} 