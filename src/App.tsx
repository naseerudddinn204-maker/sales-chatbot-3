import React from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';
import { HomePage } from './components/HomePage';

export default function App() {
  const path = window.location.pathname;
  if (path === '/admin' || path === '/admin/') {
    window.history.replaceState({}, '', '/admin/dashboard');
    return <AdminDashboard />;
  }
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path.startsWith('/embed/')) return <EmbedChat slug={decodeURIComponent(path.split('/embed/')[1] || 'sales-chatbot')} />;
  if (path === '/chatbots' || path === '/chatbots/') return <ChatbotCatalog />;
  if (path === '/' || path === '/index.html') return <HomePage />;
  if (['/email','/email/','/auto-post-generator','/auto-post-generator/','/ai-automation','/ai-automation/','/ai-content-writer','/ai-content-writer/'].includes(path)) return <AiToolsPlatform />;
  return <HomePage />;
}
