
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 py-12 mt-20 bg-black">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm tracking-wide">
          &copy; {new Date().getFullYear()} COSMOGERSON. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
