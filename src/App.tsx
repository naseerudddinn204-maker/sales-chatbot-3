import React, { useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';
import { AIToolsCatalog } from './components/AIToolsCatalog';
import { HomePage } from './components/HomePage';
import { IntegrationsHome } from './components/IntegrationsHome';

export default function App() {
  const path = window.location.pathname;
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [path]);
  if (path === '/admin' || path === '/admin/') {
    window.history.replaceState({}, '', '/admin/dashboard');
    return <AdminDashboard />;
  }
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path.startsWith('/embed/')) return <EmbedChat slug={decodeURIComponent(path.split('/embed/')[1] || 'sales-chatbot')} />;
  if (path === '/chatbots' || path === '/chatbots/') return <ChatbotCatalog />;
  if (path === '/ai-tools' || path === '/ai-tools/') return <AIToolsCatalog />;
  if (path === '/integrations' || path === '/integrations/') return <IntegrationsHome />;
  if (path === '/email' || path === '/email/') return <AiToolsPlatform initialTool="email" />;
  if (path === '/auto-post-generator' || path === '/auto-post-generator/') return <AiToolsPlatform initialTool="social" />;
  if (path === '/ai-automation' || path === '/ai-automation/') return <AiToolsPlatform initialTool="automation" />;
  if (path === '/ai-content-writer' || path === '/ai-content-writer/') return <AiToolsPlatform initialTool="writer" />;
  if (path === '/' || path === '/index.html') return <HomePage />;
  return <HomePage />;
}
