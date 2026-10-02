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
  onToggleFrameView,
}) => {
  return (
    <header
      className={`${
        isFramedView
          ? 'sticky top-0 w-full shrink-0 z-40'
          : 'fixed top-0 left-0 right-0 w-full z-40 pt-safe'
      } bg-[#f9f9ff]/95 backdrop-blur-xl border-b border-gray-200/60 select-none transform translate-z-0 will-change-transform`}
      style={{ WebkitTransform: 'translateZ(0)' }}
    >
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Wordmark */}
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

        {/* Center navigation for tablet & desktop (hidden on mobile, and hidden when mobile mockup frame is active) */}
        <nav
          className={`${
            isFramedView ? 'hidden' : 'hidden md:flex'
          } items-center gap-1 bg-gray-100/80 p-1 rounded-xl`}
        >
          <button
            onClick={() => onTabChange('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'demo'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Interactive Demo
          </button>
          <button
            onClick={() => onTabChange('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'pricing'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pricing & ROI
          </button>
          <button
            onClick={() => onTabChange('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'contact'
                ? 'bg-[#d61616] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact Experts
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Frame view toggle on wider screens */}
          <button
            onClick={onToggleFrameView}
            title={isFramedView ? 'Switch to Full Width View' : 'Switch to Mobile Screen Mockup View'}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFramedView ? 'fullscreen' : 'smartphone'}
            </span>
            <span>{isFramedView ? 'Wide View' : 'Mobile Frame'}</span>
          </button>

          {/* Primary "Try Free" button matching screenshot */}
          <button
            onClick={() => onTabChange('demo')}
            className="h-9 px-3.5 rounded-lg bg-[#d61616] hover:bg-[#bd1313] text-white text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">bolt</span>
            <span>Try Free</span>
          </button>
        </div>
      </div>
    </header>
  );
};
