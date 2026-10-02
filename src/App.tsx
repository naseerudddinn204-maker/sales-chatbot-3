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

        {/* Main Content Area with padding for fixed header and bottom navigation */}
        <main className="flex-1 w-full pt-16 pb-20 bg-[#f9f9ff]">
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

        {/* Fixed Bottom Navigation */}
        <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
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
