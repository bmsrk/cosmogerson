
import React from 'react';

const Manifesto: React.FC = () => {
  return (
    <div className="space-y-12 py-8 mono">
      <h1 className="text-xl accent uppercase tracking-widest">Manifesto_</h1>
      
      <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">
        <section>
          <span className="text-[#3a4d40] block mb-2">// 01</span>
          <p>O futuro é gambiarra. Rejeitamos a perfeição plastificada.</p>
        </section>

        <section>
          <span className="text-[#3a4d40] block mb-2">// 02</span>
          <p>Autonomia radical. Menos abstração, mais controle.</p>
        </section>

        <section>
          <span className="text-[#3a4d40] block mb-2">// 03</span>
          <p>Código local para problemas globais.</p>
        </section>
      </div>
    </div>
  );
};

export default Manifesto;
