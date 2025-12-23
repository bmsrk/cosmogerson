
import React, { useState } from 'react';
import { parseMarkdown } from '../App';

interface Post {
  title: string;
  date: string;
  content: string;
}

const Contos: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const posts: Post[] = [
    { 
      title: 'A_Ultima_Transmissao.md', 
      date: '22.04.98',
      content: '# A Última Transmissão\n\n**O silêncio** tomou conta da rede no Grajaú. \n\n* Conexão: Down\n* Localização: [Setor 7](https://example.com/map)'
    },
    { 
      title: 'Vendedor_de_Solsticios.md', 
      date: '15.01.99',
      content: '# O Vendedor de Solstícios\n\nTião vendia _momentos_ pirateados de **1984** em favelas verticais.'
    },
    { 
      title: 'O_Silencio_Digital.md', 
      date: '03.02.99',
      content: '# O Silêncio Digital\n\nSer ninguém é o maior ato de resistência.\n\n* Sem rastros\n* Sem volta'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mono text-[10px] text-dim border-b border-[#1a2e21] pb-2 flex justify-between">
        <span>ROOT://ARCHIVE/SCRIPTS/</span>
        <span className="color-y">READ_ONLY</span>
      </div>

      <div className="space-y-1">
        {posts.map((post, idx) => (
          <div key={idx} className="group">
            <button 
              className="w-full flex items-center justify-between py-2.5 cursor-pointer hover:bg-[#00ff6608] px-2 -mx-2 transition-all rounded-sm text-left"
              onClick={() => setSelectedId(selectedId === idx ? null : idx)}
            >
              <div className="flex gap-4 items-baseline flex-1 min-w-0">
                <span className="mono text-[9px] text-dim w-6 tabular-nums">0{idx + 1}.</span>
                <span className={`text-sm truncate transition-colors ${selectedId === idx ? 'color-g font-medium' : 'text-zinc-400 group-hover:text-white'}`}>
                  {post.title}
                </span>
              </div>
              
              <div className="mono text-[9px] flex items-center gap-6 shrink-0 ml-4">
                {selectedId === idx && (
                  <span className="color-y hidden sm:inline animate-pulse">
                    [ OPENED ]
                  </span>
                )}
                <span className={`${selectedId === idx ? 'color-b' : 'text-dim group-hover:text-zinc-500'} tabular-nums`}>
                  {post.date}
                </span>
              </div>
            </button>

            {selectedId === idx && (
              <div 
                className="my-4 py-8 px-6 text-sm text-zinc-400 font-light terminal-block animate-in slide-in-from-top-2 duration-300"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contos;
