
import React from 'react';

const Cenarios: React.FC = () => {
  const items = [
    { id: '01', name: 'Complexo da Luz', status: 'ON', desc: 'Hub central de transmissões clandestinas.' },
    { id: '02', name: 'Mangue-Byte', status: 'ERR', desc: 'Zona de interferência pesada e hardware oxidado.' },
    { id: '03', name: 'Orbital Sertão', status: 'INIT', desc: 'Lançamento de satélites de baixo custo.' },
  ];

  return (
    <div className="space-y-12 py-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h2 className="mono text-[10px] text-dim uppercase tracking-[0.4em]">REG_CENARIOS // GEODATA</h2>
        <div className="h-px w-full bg-gradient-to-r from-[#1a2e21] via-emerald-900/20 to-transparent"></div>
      </div>

      <div className="grid gap-6">
        {items.map((i) => (
          <div key={i.id} className="group relative border border-[#1a2e21] p-6 hover:bg-[#00ff6605] transition-all hover:border-[#00ff6644] rounded-lg overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-6">
                <span className="mono text-[11px] text-dim font-bold">[{i.id}]</span>
                <span className="text-lg text-main font-light tracking-tight">{i.name}</span>
              </div>
              <span className={`mono text-[10px] px-2 py-0.5 rounded-sm border ${
                i.status === 'ON' ? 'border-[#00ff6644] color-g glow-g' : 
                i.status === 'ERR' ? 'border-red-900/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                'border-[#ffcc0044] color-y shadow-[0_0_10px_rgba(255,204,0,0.1)]'
              }`}>
                {i.status}
              </span>
            </div>
            <p className="text-sm text-zinc-500 font-light leading-relaxed pl-[44px]">
              {i.desc}
            </p>
            {/* Background decoration */}
            <div className="absolute -bottom-4 -right-4 mono text-[60px] opacity-[0.02] pointer-events-none font-black italic">
              ZONA_{i.id}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 border-l-2 border-[#ffcc0044] bg-[#ffcc0003] rounded-r-lg">
        <p className="text-xs text-zinc-600 italic">
          "Mapas não são territórios. Territórios são onde a gente pisa, mapas são onde eles nos vigiam."
        </p>
      </div>
    </div>
  );
};

export default Cenarios;
