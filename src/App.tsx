import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';

export default function App() {
  const path = window.location.pathname;
  if (path === '/admin' || path === '/admin/') {
    window.history.replaceState({}, '', '/admin/chatbots');
    return <AdminDashboard />;
  }
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path.startsWith('/embed/')) return <EmbedChat slug={decodeURIComponent(path.split('/embed/')[1] || 'sales-chatbot')} />;
  if (path === '/chatbots' || path === '/chatbots/') return <ChatbotCatalog />;
  const initialParams = new URLSearchParams(window.location.search);
  const [currentTab, setCurrentTab] = useState<ScreenTab>(initialParams.get('tab') === 'contact' ? 'contact' : 'home');
  const [selectedChatbotName, setSelectedChatbotName] = useState(initialParams.get('chatbot') || '');
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
    window.scrollTo({ top: 0, behavior: 'auto' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col items-center justify-center">
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div
        className={`w-full transition-all duration-300 ${
          isFramedView
            ? 'max-w-[420px] h-[840px] max-h-[92vh] my-4 shadow-2xl rounded-[2.5rem] border-[9px] border-gray-900 bg-[#f9f9ff] flex flex-col relative ring-1 ring-gray-900/10 overflow-hidden'
            : 'min-h-screen max-w-7xl mx-auto flex flex-col relative'
        }`}
      >
        <Header
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isFramedView={isFramedView}
          onToggleFrameView={() => setIsFramedView((prev) => !prev)}
        />

        <main
          className={`flex-1 w-full bg-[#f9f9ff] ${
            isFramedView
              ? 'overflow-y-auto pb-4 pt-1'
              : 'pt-16 pb-20 md:pb-8'
          }`}
        >
          {currentTab === 'contact' && (
            <ContactScreen
              selectedChatbotName={selectedChatbotName}
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
              onNavigateToContact={(chatbotName) => { setSelectedChatbotName(chatbotName || ''); handleTabChange('contact'); }}
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

        {!isFramedView && (
          <footer className="hidden md:flex flex-col border-t border-white/15 bg-[#1e3a5f] py-6 px-6 text-xs text-white/70">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://www.orken.us/favicon.ico"
                    alt="Orken AI"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="font-bold text-white">Orken AI</span>
                <span className="text-white/40">|</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>

              <div className="flex items-center gap-5">
                <button onClick={() => handleTabChange('home')} className="hover:text-white cursor-pointer">Home</button>
                <button onClick={() => handleTabChange('demo')} className="hover:text-white cursor-pointer">Free Demo</button>
                <button onClick={() => handleTabChange('pricing')} className="hover:text-white cursor-pointer">Pricing</button>
                <button onClick={() => handleTabChange('contact')} className="hover:text-white cursor-pointer">Contact</button>
              </div>
            </div>
          </footer>
        )}

        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isFramedView={isFramedView}
        />
      </div>

      {!isFramedView && (
        <button
          type="button"
          onClick={() => setIsLiveChatOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0266ff] text-white shadow-xl ring-4 ring-white/80 transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          aria-label="Open AI chatbot"
          title="Chat with our AI assistant"
        >
          {isLiveChatOpen ? <X size={24} /> : <MessageCircle size={25} />}
        </button>
      )}

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
