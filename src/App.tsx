import React, { useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { EmbedChat } from './components/EmbedChat';
import { ChatbotCatalog } from './components/ChatbotCatalog';
import { AiToolsPlatform } from './components/AiToolsPlatform';
import { PublicLayout, PublicPages } from './components/PublicPages';

export default function App() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/embed/')) return;

    document.body.classList.add('public-motion-active');
    const cards = document.querySelectorAll<HTMLElement>(
      'main article, main [class*="grid"] > [class*="rounded-2xl"], main [class*="grid"] > [class*="rounded-3xl"]'
    );

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('scroll-reveal-visible'));
      return () => document.body.classList.remove('public-motion-active');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    cards.forEach((card, index) => {
      card.classList.add('scroll-reveal-card');
      card.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove('public-motion-active');
    };
  }, []);

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
