import React from 'react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  isFramedView?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  isFramedView,
}) => {
  const tabs = [
    { id: 'home' as ScreenTab, label: 'Home', icon: 'home' },
    { id: 'demo' as ScreenTab, label: 'Demo', icon: 'play_circle' },
    { id: 'pricing' as ScreenTab, label: 'Pricing', icon: 'sell' },
    { id: 'contact' as ScreenTab, label: 'Contact', icon: 'support_agent' },
  ];

  return (
    <nav
      className={`${
        isFramedView
          ? 'sticky bottom-0 w-full shrink-0 z-50'
          : 'fixed bottom-0 left-0 right-0 w-full z-50 md:hidden'
      } pb-safe bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transform translate-z-0 will-change-transform select-none`}
      style={{ WebkitTransform: 'translateZ(0)' }}
      aria-label="Mobile navigation bar"
    >
      <div className="max-w-md mx-auto h-16 px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-150 touch-manipulation active:scale-95 ${
                isActive
                  ? 'text-[#d61616] font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center transition-transform duration-150 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {tab.icon}
                </span>
              </div>
              <span className="text-[11px] leading-tight mt-1 font-sans">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d61616] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
