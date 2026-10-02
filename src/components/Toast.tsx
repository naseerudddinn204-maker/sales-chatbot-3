import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-18 right-4 left-4 sm:left-auto sm:w-96 z-50 transition-all duration-300 transform flex items-center justify-between gap-3 bg-white px-4 py-3.5 rounded-xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{message}</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
