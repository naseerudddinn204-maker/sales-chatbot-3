import React, { useState } from 'react';
import { ScreenTab, ToastState } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ContactScreen } from './components/ContactScreen';
import { HomeScreen } from './components/HomeScreen';
import { DemoScreen } from './components/DemoScreen';
import { PricingScreen } from './components/PricingScreen';
import { LiveChatModal } from './components/LiveChatModal';
import { BookDemoModal } from './components/BookDemoModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('contact');
  const [isFramedView, setIsFramedView] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({
      show: true,
      title,
      message,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleBookingConfirmed = (details: { date: string; time: string; name: string }) => {
    showToast(
      'Demo Call Scheduled!',
      `Confirmed for ${details.date} at ${details.time} with Staff Architect Taylor Chen.`
    );
  };

  const handleTabChange = (tab: ScreenTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col items-center">
      {/* Toast Notification Container */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Main Container Wrapper */}
      <div
        className={`w-full min-h-screen flex flex-col relative transition-all duration-300 ${
          isFramedView
            ? 'max-w-[430px] my-4 shadow-2xl rounded-3xl border border-gray-300/80 overflow-hidden bg-white ring-12 ring-gray-900/5'
            : 'max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto'
        }`}
      >
        {/* Fixed Top Header */}
        <Header
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isFramedView={isFramedView}
          onToggleFrameView={() => setIsFramedView((prev) => !prev)}
        />

        {/* Main Content Area with responsive padding */}
        <main
          className={`flex-1 w-full pt-16 ${
            isFramedView ? 'pb-20' : 'pb-20 md:pb-8'
          } bg-[#f9f9ff]`}
        >
          {currentTab === 'contact' && (
            <ContactScreen
              onOpenLiveChat={() => setIsLiveChatOpen(true)}
              onOpenBookDemo={() => setIsBookDemoOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'home' && (
            <HomeScreen
              onNavigateToDemo={() => handleTabChange('demo')}
              onNavigateToContact={() => handleTabChange('contact')}
              onOpenLiveChat={() => setIsLiveChatOpen(true)}
            />
          )}

          {currentTab === 'demo' && (
            <DemoScreen
              onNavigateToContact={() => handleTabChange('contact')}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'pricing' && (
            <PricingScreen
              onNavigateToContact={() => handleTabChange('contact')}
              onOpenLiveChat={() => setIsLiveChatOpen(true)}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Clean Desktop/Laptop Footer (Hidden on Mobile) */}
        {!isFramedView && (
          <footer className="hidden md:flex flex-col border-t border-gray-200/80 bg-white/70 py-6 px-6 text-xs text-gray-500">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#d61616] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                </div>
                <span className="font-bold text-gray-900">ChatBot AI Automation</span>
                <span className="text-gray-300">|</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleTabChange('home')}
                  className="hover:text-gray-900 cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => handleTabChange('demo')}
                  className="hover:text-gray-900 cursor-pointer"
                >
                  Interactive Demo
                </button>
                <button
                  onClick={() => handleTabChange('pricing')}
                  className="hover:text-gray-900 cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => handleTabChange('contact')}
                  className="hover:text-gray-900 cursor-pointer"
                >
                  Contact
                </button>
              </div>
            </div>
          </footer>
        )}

        {/* Bottom Navigation (Only visible on Mobile screens, or inside the Mobile Frame mockup) */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isFramedView={isFramedView}
        />
      </div>

      {/* Modals */}
      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        onSuccessToast={showToast}
      />

      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
        onSuccess={handleBookingConfirmed}
      />
    </div>
  );
}
