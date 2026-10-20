import React from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';
import { AiToolsLanding } from './components/AiToolsLanding';

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

  // The public homepage introduces the broader AI tools and demo offering.
  // The existing interactive workspace remains available at /workspace.
  if (path === '/workspace' || path.startsWith('/workspace/')) return <AiToolsPlatform />;
  return <AiToolsLanding />;
}
