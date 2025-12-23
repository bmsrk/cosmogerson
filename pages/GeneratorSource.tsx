
import React from 'react';
import { PROJECT_STRUCTURE } from '../constants';

const GeneratorSource: React.FC = () => {
  const code = `// build.ts (Runtime: Bun)
async function build() {
  const files = await readdir("./src/pages");
  const layout = await readFile("layout.html", "utf-8");
  
  for (const file of files) {
    const md = await readFile(file, "utf-8");
    const content = parseMarkdown(md);
    const html = layout.replace("{{content}}", content);
    
    await writeFile(\`./build/\${file.replace(".md", ".html")}\`, html);
  }
  
  console.log("-> BUILD_COMPLETE: node_stable");
}`;

  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-[#1a2e21] pb-4">
        <div className="space-y-1">
           <h2 className="mono text-[11px] text-dim uppercase tracking-widest font-bold">Engine_v1.0 // Source</h2>
           <span className="text-[9px] text-zinc-700 mono">REPOSITORY: LOCAL_FS</span>
        </div>
        <span className="mono text-[10px] color-y glow-y px-2 py-1 bg-[#ffcc0008] border border-[#ffcc0022] rounded-sm">LUA_INSPIRED_PARSER</span>
      </div>

      <div className="space-y-4">
        <div className="mono text-[10px] text-zinc-600 mb-2 px-2">STRUCT_TREE:</div>
        <div className="grid gap-2">
          {PROJECT_STRUCTURE.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-[#050c07] border border-[#1a2e21] px-4 py-2 rounded-sm hover:border-[#00ff6633] transition-colors">
              <span className="text-zinc-700 text-[9px] w-4">{idx+1}.</span>
              <span className={`text-[10px] mono ${item.type === 'folder' ? 'color-b' : 'text-zinc-400'}`}>
                {item.type === 'folder' ? 'DIR ' : 'FILE'}
              </span>
              <span className="text-xs text-zinc-300 mono">{item.path}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="mono text-[10px] text-zinc-600 mb-2 px-2">BUILD_SEQUENCE:</div>
        <div className="bg-[#020503] p-8 border border-[#1a2e21] rounded-lg shadow-2xl relative overflow-hidden group">
          <pre className="mono text-[12px] text-[#3a4d40] group-hover:text-emerald-800/80 transition-colors leading-relaxed overflow-x-auto">
            <code>{code}</code>
          </pre>
          <div className="absolute top-2 right-4 text-[8px] text-zinc-800 mono tracking-widest">READ_ONLY_SRC</div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff6622] to-transparent"></div>
        </div>
      </div>
      
      <div className="flex justify-center pt-8">
         <button className="px-12 py-4 border border-[#1a2e21] hover:border-[#00ff66] hover:bg-[#00ff6608] color-g mono text-xs tracking-[0.3em] transition-all rounded-sm uppercase group">
            <span className="group-hover:flicker-1">Run_Build_Script</span>
         </button>
      </div>
    </div>
  );
};

export default GeneratorSource;
