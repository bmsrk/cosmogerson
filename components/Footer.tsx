
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 py-12 mt-20 bg-black">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm tracking-wide">
          &copy; {new Date().getFullYear()} COSMO GERSON. PROJETO SSG EXPERIMENTAL.
        </div>
        <div className="flex gap-6 text-xs text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Github</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terminal</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
