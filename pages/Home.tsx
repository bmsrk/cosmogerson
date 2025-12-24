import React from 'react';
import { parseMarkdown } from '../App';

interface Entry {
  title: string;
  content: string;
}

const FlickeringText: React.FC<{ text: string, offset?: number }> = ({ text, offset = 0 }) => {
  return (
    <>
      {text.split('').map((char, i) => {
        if (char === ' ') return <span key={i}>&nbsp;</span>;
        const totalIndex = i + offset;
        // More chaotic animation mapping
        const flickerIndex = (totalIndex * 17 + 11) % 5 + 1;
        const flickerClass = `flicker-${flickerIndex}`;
        const colors = ['neon-green', 'neon-yellow', 'neon-blue'];
        const colorClass = colors[totalIndex % 3];
        
        return (
          <span key={i} className={`${flickerClass} ${colorClass}`}>
            {char}
          </span>
        );
      })}
    </>
  );
};

const AsciiArtHeader: React.FC = () => (
  <div className="mb-12 opacity-5 select-none pointer-events-none flex flex-col items-center gap-2">
    <pre className="text-[6px] md:text-[8px] leading-[1] font-mono text-zinc-500 flicker-4">
{`   _     _     _     _     _   
  ( )   ( )   ( )   ( )   ( )  
   X     X     X     X     X   
  (_)   (_)   (_)   (_)   (_)  `}
    </pre>
    <pre className="text-[5px] md:text-[6px] leading-[1] font-mono text-zinc-600 flicker-2">
{`<<< SIGNAL_STABLE_42 >>>`}
    </pre>
  </div>
);

const Home: React.FC = () => {
  const entries: Entry[] = [
    { 
      title: 'Capítulo 1 — O Jeito', 
      content: '**USP, Departamento de Física — 2032**\n\nEm um solitário laboratório do departamento de Física da USP, **Gerson** fumava seu cigarro tranquilamente. Não porque ele podia, mas porque ele não se importava. Ninguém se importava muito com a USP em 2032.\n\nOs olhos cansados por trás dos óculos de armação grossa indicavam que Gerson estava há dias sem dormir. As pequenas letras do terminal piscavam e se embaralhavam na sua frente, enquanto ele bebericava um café frio e dava mais um trago.\n\nUm apito no terminal indicou que o cálculo havia terminado. Gerson arqueou as sobrancelhas e olhou espantado. As letrinhas miúdas voltaram ao foco.\n\n**Havia funcionado?**\n\nO resultado de anos de trabalho em um moquifo sustentado por duas corporações que só queriam usar o terreno para instalar seus data centers?  \nEra possível?\n\nUma gota de suor escorreu do rosto de Gerson, agora pálido.\n\n> Eu preciso contar isso pra alguém. Eu dei um jeito, finalmente!\n\nGerson levantou animado. Pegou o telefone e enviou uma mensagem para sua coordenadora de pesquisa. Gerson não sabia, mas essa mensagem mudaria o rumo da humanidade para sempre.'
    },
  ];

  return (
    <div className="space-y-48 pb-40">
      {/* Front Matter */}
      <section className="text-center py-24 relative overflow-visible">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-80 bg-emerald-500/[0.04] blur-[160px] rounded-full pointer-events-none"></div>
        
        <AsciiArtHeader />
        
        <h1 className="relative z-10 text-6xl md:text-9xl font-logo select-none tracking-tighter flex flex-col items-center leading-[0.8]">
          <span className="drop-shadow-[0_0_40px_rgba(0,255,102,0.18)]">
            <FlickeringText text="COSMO" />
          </span>
          <span className="mt-4 drop-shadow-[0_0_40px_rgba(0,153,255,0.18)]">
            <FlickeringText text="GERSON" offset={5} />
          </span>
        </h1>
        
        <div className="mt-16 flex flex-col items-center gap-6 opacity-30">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent"></div>
          <span className="text-[10px] font-mono tracking-[0.8em] uppercase flicker-3">escrito por bmsrk</span>
        </div>
      </section>

      {/* Narrative Entries */}
      <section className="space-y-40">
        {entries.map((entry, idx) => (
          <article 
            key={idx} 
            className="group relative bg-[#0a0a0a] p-12 md:p-24 rounded-sm border border-zinc-900/50 fanzine-pattern transition-all hover:border-zinc-800/80 shadow-2xl overflow-hidden"
          >
            {/* Structural Markers */}
            <div className="absolute top-4 left-4 text-[8px] font-mono text-zinc-800 tracking-widest opacity-40 select-none flicker-4">
              COORD_0{idx + 1} // TRACE_INIT
            </div>
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-zinc-800 tracking-widest opacity-40 select-none flicker-1">
              SYSTEM_ID // 42_NULL
            </div>

            {/* Entry Header */}
            <header className="mb-24">
              <div className="flex items-center gap-6 mb-8 opacity-20">
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] font-bold">FOLIO_0{idx + 1}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-mono font-bold uppercase tracking-[0.1em] neon-green leading-[1.1] max-w-xl group-hover:neon-yellow transition-colors duration-700">
                {entry.title}
              </h2>
            </header>

            {/* Entry Body */}
            <div 
              className="font-mono text-zinc-400 selection:bg-emerald-900/40 relative z-10 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(entry.content) }}
            />
          </article>
        ))}
      </section>
    </div>
  );
};

export default Home;