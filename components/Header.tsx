import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-10 flex justify-between items-center pointer-events-none mix-blend-difference">
      <div className="text-[9px] font-mono text-zinc-800 tracking-[0.4em] uppercase">
        LOC: -23.55 // -46.63
      </div>
      <div className="text-[9px] font-mono text-zinc-800 tracking-[0.4em] uppercase">
        REF: ARCHIVE_42
      </div>
    </header>
  );
};

export default Header;