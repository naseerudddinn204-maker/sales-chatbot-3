import React from 'react';
import { ScreenTab } from '../types';

interface HeaderProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  isFramedView: boolean;
  onToggleFrameView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isFramedView,
}) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#f9f9ff]/95 backdrop-blur-xl border-b border-gray-200/60 select-none transform translate-z-0 will-change-transform"
      style={{ WebkitTransform: 'translateZ(0)' }}
    >
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#d61616] flex items-center justify-center shadow-sm text-white transition-transform group-hover:scale-105 shrink-0">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[19px] text-[#111827] tracking-tight font-extrabold leading-none">
              ChatBot
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">
              AI Automation
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
          <button onClick={() => onTabChange('home')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentTab === 'home' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>Home</button>
          <button onClick={() => onTabChange('demo')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentTab === 'demo' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>Free Demo</button>
          <button onClick={() => onTabChange('pricing')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentTab === 'pricing' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>Pricing & ROI</button>
          <button onClick={() => onTabChange('contact')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentTab === 'contact' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>Contact Experts</button>
        </nav>

        <button
          onClick={() => onTabChange('demo')}
          className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] mr-1">bolt</span>
          <span>Try Free</span>
        </button>
      </div>
    </header>
  );
};
