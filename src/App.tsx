import React from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';
import { PublicLayout, PublicPages } from './components/PublicPages';

export default function App() {
  const rawPath = window.location.pathname;
  const path = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  if (path === '/admin' || path === '/admin/') {
    window.history.replaceState({}, '', '/admin/dashboard');
    return <AdminDashboard />;
  }
  if (path.startsWith('/admin/')) return <AdminDashboard />;
  if (path.startsWith('/embed/')) return <EmbedChat slug={decodeURIComponent(path.split('/embed/')[1] || 'sales-chatbot')} />;
  if (path === '/chatbots') return <ChatbotCatalog />;
  if (path === '/workspace') return <AiToolsPlatform />;

  const routeMap: Record<string, 'home' | 'ai-tools' | 'email' | 'automation' | 'social' | 'writer' | 'demos' | 'contact'> = {
    '/': 'home',
    '/ai-tools': 'ai-tools',
    '/demos': 'demos',
    '/email': 'email',
    '/automation': 'automation',
    '/auto-post': 'social',
    '/content-writer': 'writer',
    '/contact': 'contact',
  };
  const page = routeMap[path] || 'home';
  return <PublicLayout page={page}><PublicPages page={page} /></PublicLayout>;
}
