import React from 'react';
import Home from './pages/Home';
import Header from './components/Header';

/**
 * Digital Fanzine Markdown Parser
 * Focused on immersive reading and atmosphere.
 */
export const parseMarkdown = (md: string): string => {
  let html = md
    .replace(/^# (.*$)/gm, '<h2 class="text-4xl neon-green font-logo mb-12 mt-20 tracking-tighter">$1</h2>')
    .replace(/^## (.*$)/gm, '<h3 class="text-xl neon-green font-mono mt-16 mb-8 uppercase tracking-[0.3em]">$1</h3>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l border-emerald-500/20 pl-10 italic my-14 text-zinc-500 text-[16px] leading-relaxed relative"><span class="absolute -left-1 top-0 text-emerald-500/40 font-serif text-4xl">"</span>$1</blockquote>')
    .replace(/\{g:(.*?)\}/g, '<span class="neon-green">$1</span>')
    .replace(/\{y:(.*?)\}/g, '<span class="neon-yellow font-bold">$1</span>')
    .replace(/\{b:(.*?)\}/g, '<span class="neon-blue font-bold">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="neon-green font-bold">$1</strong>')
    .replace(/_(.*?)_/g, '<em class="italic text-zinc-300">$1</em>');

  // Lists with generous separation
  html = html.replace(/^[\*-] (.*$)/gm, '<li class="mb-5 text-zinc-400 list-none font-mono text-[16px] flex items-start"><span class="neon-green mr-6 mt-1.5 opacity-50 text-[10px]">●</span> <span>$1</span></li>');
  
  return html.split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<blockquote')) return trimmed;
      if (!trimmed) return '';
      // High-readability typography: 16px, 2.2 line-height, comfortable tracking
      return `<p class="mb-10 leading-[2.2] text-[16px] text-zinc-400 font-light tracking-normal">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-emerald-500/30 selection:text-white antialiased">
      <Header />
      <main className="flex-grow container mx-auto px-8 max-w-3xl py-40">
        <Home />
      </main>
      <footer className="py-20 text-center border-t border-zinc-900/20">
        <div className="max-w-xs mx-auto mb-8 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        <p className="text-[10px] text-zinc-800 tracking-[1em] uppercase font-mono">
          DONT_PANIC // EDICAO_42
        </p>
      </footer>
    </div>
  );
};

export default App;