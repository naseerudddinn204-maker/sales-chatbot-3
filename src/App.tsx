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

  // Each public tool has a dedicated URL; /workspace remains the all-tools library.
  if (path === '/email' || path.startsWith('/email/')) return <AiToolsPlatform key="email" initialTool="email" />;
  if (path === '/auto-post-generator' || path.startsWith('/auto-post-generator/')) return <AiToolsPlatform key="social" initialTool="social" />;
  if (path === '/ai-automation' || path.startsWith('/ai-automation/')) return <AiToolsPlatform key="automation" initialTool="automation" />;
  if (path === '/content-writer' || path.startsWith('/content-writer/')) return <AiToolsPlatform key="writer" initialTool="writer" />;
  if (path === '/ai-chatbot' || path.startsWith('/ai-chatbot/')) return <AiToolsPlatform key="chatbot" initialTool="chatbot" />;
  if (path === '/workspace' || path.startsWith('/workspace/')) return <AiToolsPlatform />;
  return <AiToolsLanding />;
}
