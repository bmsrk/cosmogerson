const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Minimal copy of the project's markdown parser (kept in sync manually)
function parseMarkdown(md) {
  let html = md
    .replace(/^# (.*$)/gm, '<h2 class="text-4xl neon-green font-logo mb-12 mt-20 tracking-tighter">$1</h2>')
    .replace(/^## (.*$)/gm, '<h3 class="text-xl neon-green font-mono mt-16 mb-8 uppercase tracking-[0.3em]">$1</h3>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l border-emerald-500/20 pl-10 italic my-14 text-zinc-500 text-[16px] leading-relaxed relative"><span class="absolute -left-1 top-0 text-emerald-500/40 font-serif text-4xl">"</span>$1</blockquote>')
    .replace(/\{g:(.*?)\}/g, '<span class="neon-green">$1</span>')
    .replace(/\{y:(.*?)\}/g, '<span class="neon-yellow font-bold">$1</span>')
    .replace(/\{b:(.*?)\}/g, '<span class="neon-blue font-bold">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="neon-green font-bold">$1</strong>')
    .replace(/_(.*?)_/g, '<em class="italic text-zinc-300">$1</em>');

  html = html.replace(/^[\*-] (.*$)/gm, '<li class="mb-5 text-zinc-400 list-none font-mono text-[16px] flex items-start"><span class="neon-green mr-6 mt-1.5 opacity-50 text-[10px]">●</span> <span>$1</span></li>');

  return html.split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<blockquote')) return trimmed;
      if (!trimmed) return '';
      return `<p class="mb-10 leading-[2.2] text-[16px] text-zinc-400 font-light tracking-normal">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

// Extract numeric prefix for sorting (e.g., "01" from "01-jeitinho.md")
function getChapterNumber(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

async function build() {
  const root = path.join(__dirname, '..');
  const inputDir = path.join(root, 'generated');
  const outDir = path.join(root, 'build');
  await fs.mkdir(outDir, { recursive: true });

  // Compile Tailwind CSS
  console.log('Compiling Tailwind CSS...');
  try {
    execSync('npm run build:css', { cwd: root, stdio: 'inherit' });
    console.log('✓ CSS compiled successfully');
  } catch (err) {
    console.error('Failed to compile CSS:', err.message);
    process.exit(1);
  }

  const files = (await fs.readdir(inputDir))
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => getChapterNumber(a) - getChapterNumber(b));

  // Read all markdown files and concatenate content
  let allContent = '';
  
  for (const file of files) {
    const md = await fs.readFile(path.join(inputDir, file), 'utf8');
    const content = parseMarkdown(md);
    
    // Add spacing between chapters
    allContent += content + '\n\n<div class="my-32 border-t border-zinc-800/30"></div>\n\n';
  }

  // Generate single continuous book page
  const indexHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>COSMOGERSON — Sci-Fi Latino</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Major+Mono+Display&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <meta name="generator" content="scripts/build.cjs">
</head>
<body class="min-h-screen bg-[#050505] relative">
  <!-- Reading Progress Bar -->
  <div id="progress-bar" class="fixed top-0 left-0 h-1 bg-gradient-to-r from-neon-green via-neon-yellow to-neon-blue transition-all duration-150 z-50" style="width: 0%"></div>
  
  <main class="container mx-auto px-6 md:px-8 max-w-3xl py-16 md:py-24">
    ${allContent}
  </main>

  <script>
    // Reading progress bar
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-bar').style.width = scrolled + '%';
    });
  </script>
</body>
</html>`;

  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8');
  console.log('✓ Book page generated');

  console.log('\n✅ Build complete! Files in', outDir);
  console.log(`📚 Generated continuous book with ${files.length} chapter(s)`);
}

build().catch(err => { console.error(err); process.exit(1); });