import React from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';

export default function App() {
  const path = window.location.pathname;

  // Keep existing administration and embeddable chatbot endpoints intact.
  if (path === '/admin' || path === '/admin/') {
    window.history.replaceState({}, '', '/admin/dashboard');
    return <AdminDashboard />;
  }
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path.startsWith('/embed/')) {
    return <EmbedChat slug={decodeURIComponent(path.split('/embed/')[1] || 'sales-chatbot')} />;
  }

  // Keep the existing public chatbot demo library available as a tool.
  if (path === '/chatbots' || path === '/chatbots/') return <ChatbotCatalog />;

  // Public routes, including old login/signup/pricing URLs, now lead to the tools workspace.
  // Authentication and pricing are not part of the new public product experience.
  return <AiToolsPlatform />;
}
