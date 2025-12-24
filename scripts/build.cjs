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

  const chapters = [];
  
  for (const file of files) {
    const md = await fs.readFile(path.join(inputDir, file), 'utf8');
    const content = parseMarkdown(md);

    const titleMatch = md.match(/^#\s+(.*)/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.md','');
    const htmlFilename = file.replace('.md', '.html');

    chapters.push({
      filename: htmlFilename,
      title: title,
      mdFile: file
    });
  }

  // Generate chapter pages with navigation
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const md = await fs.readFile(path.join(inputDir, chapter.mdFile), 'utf8');
    const content = parseMarkdown(md);
    
    const prevChapter = i > 0 ? chapters[i - 1] : null;
    const nextChapter = i < chapters.length - 1 ? chapters[i + 1] : null;

    const navigation = `
      <nav class="flex justify-between items-center mt-20 pt-10 border-t border-zinc-800/50">
        <div class="flex-1">
          ${prevChapter ? `
            <a href="${prevChapter.filename}" class="group inline-flex items-center gap-2 text-zinc-500 hover:text-neon-green transition-colors">
              <span class="text-xl">←</span>
              <div class="flex flex-col items-start">
                <span class="text-xs uppercase tracking-wider opacity-60">Anterior</span>
                <span class="text-sm font-mono">${prevChapter.title}</span>
              </div>
            </a>
          ` : '<div></div>'}
        </div>
        <a href="index.html" class="mx-4 text-zinc-600 hover:text-neon-green transition-colors text-sm uppercase tracking-wider">
          Índice
        </a>
        <div class="flex-1 flex justify-end">
          ${nextChapter ? `
            <a href="${nextChapter.filename}" class="group inline-flex items-center gap-2 text-zinc-500 hover:text-neon-green transition-colors">
              <div class="flex flex-col items-end">
                <span class="text-xs uppercase tracking-wider opacity-60">Próximo</span>
                <span class="text-sm font-mono">${nextChapter.title}</span>
              </div>
              <span class="text-xl">→</span>
            </a>
          ` : '<div></div>'}
        </div>
      </nav>
    `;

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${chapter.title} — COSMOGERSON</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Major+Mono+Display&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <meta name="generator" content="scripts/build.cjs">
</head>
<body class="min-h-screen bg-[#050505] relative">
  <!-- Reading Progress Bar -->
  <div id="progress-bar" class="fixed top-0 left-0 h-1 bg-gradient-to-r from-neon-green via-neon-yellow to-neon-blue transition-all duration-150 z-50" style="width: 0%"></div>
  
  <!-- Mobile Menu Button -->
  <button id="menu-toggle" class="fixed top-4 left-4 z-50 lg:hidden p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-neon-green transition-colors rounded">
    <svg class="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </button>

  <!-- Mobile Menu Overlay -->
  <div id="menu-overlay" class="fixed inset-0 bg-black/95 backdrop-blur-sm z-40 hidden">
    <div class="container mx-auto px-6 py-20">
      <button id="menu-close" class="absolute top-4 right-4 p-3 text-zinc-500 hover:text-neon-green transition-colors">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h2 class="text-2xl neon-green font-logo mb-8 uppercase tracking-wider">Capítulos</h2>
      <nav class="space-y-4">
        ${chapters.map((ch, idx) => `
          <a href="${ch.filename}" class="block p-4 border border-zinc-800/50 hover:border-neon-green transition-colors ${ch.filename === chapter.filename ? 'bg-zinc-900/50 border-neon-green' : ''}">
            <span class="text-xs text-zinc-600 uppercase tracking-wider">Cap. ${idx + 1}</span>
            <div class="text-lg font-mono ${ch.filename === chapter.filename ? 'text-neon-green' : 'text-zinc-400'}">${ch.title}</div>
          </a>
        `).join('\n        ')}
      </nav>
    </div>
  </div>

  <main class="container mx-auto px-6 md:px-8 max-w-3xl py-16 md:py-24">
    ${content}
    ${navigation}
  </main>

  <script>
    // Reading progress bar
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-bar').style.width = scrolled + '%';
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    
    menuToggle.addEventListener('click', () => {
      menuOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
    
    menuClose.addEventListener('click', () => {
      menuOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menuOverlay.classList.contains('hidden')) {
        menuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    // Optional: Swipe gestures for navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 100;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next chapter
          ${nextChapter ? `window.location.href = '${nextChapter.filename}';` : ''}
        } else {
          // Swipe right - previous chapter
          ${prevChapter ? `window.location.href = '${prevChapter.filename}';` : ''}
        }
      }
    }
  </script>
</body>
</html>`;

    const outPath = path.join(outDir, chapter.filename);
    await fs.writeFile(outPath, html, 'utf8');
    console.log('✓ Written:', chapter.filename);
  }

  // Generate index page
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
</head>
<body class="min-h-screen bg-[#050505] fanzine-pattern">
  <div class="container mx-auto px-6 md:px-8 max-w-4xl py-12 md:py-20">
    <!-- Header -->
    <header class="text-center mb-16 md:mb-24">
      <h1 class="text-5xl md:text-7xl font-logo neon-green mb-6 tracking-tighter flicker-1">
        COSMOGERSON
      </h1>
      <p class="text-lg md:text-xl text-zinc-500 font-mono uppercase tracking-[0.3em]">
        Sci-Fi Latino Americano
      </p>
      <div class="mt-8 flex items-center justify-center gap-4 text-sm text-zinc-600">
        <span class="inline-block w-12 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
        <span class="uppercase tracking-wider">E-book de Contos</span>
        <span class="inline-block w-12 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
      </div>
    </header>

    <!-- Table of Contents -->
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl md:text-3xl neon-green font-mono mb-10 uppercase tracking-wider text-center">
        <span class="inline-block border-b-2 border-neon-green/30 pb-2">Índice</span>
      </h2>
      
      <nav class="space-y-4">
        ${chapters.map((ch, idx) => `
        <a href="${ch.filename}" class="group block p-6 md:p-8 border border-zinc-800/50 hover:border-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/5">
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-zinc-800 group-hover:border-neon-green transition-colors">
              <span class="text-xl font-mono text-zinc-600 group-hover:text-neon-green transition-colors">${String(idx + 1).padStart(2, '0')}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xl md:text-2xl font-mono text-zinc-400 group-hover:text-neon-green transition-colors mb-2 leading-tight">
                ${ch.title}
              </h3>
              <div class="flex items-center gap-2 text-xs text-zinc-700 uppercase tracking-wider">
                <span>Capítulo ${idx + 1}</span>
                <span class="opacity-50">•</span>
                <span class="group-hover:text-neon-green transition-colors">Ler agora →</span>
              </div>
            </div>
          </div>
        </a>
        `).join('\n        ')}
      </nav>
    </div>

    <!-- Footer -->
    <footer class="mt-20 md:mt-32 text-center text-sm text-zinc-700">
      <div class="inline-block border-t border-zinc-800/50 pt-8 px-12">
        <p class="font-mono uppercase tracking-wider mb-2">COSMOGERSON</p>
        <p class="text-xs text-zinc-800">Uma publicação sci-fi retro-futurista</p>
      </div>
    </footer>
  </div>
</body>
</html>`;

  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8');
  console.log('✓ Index page generated');

  console.log('\n✅ Build complete! Files in', outDir);
  console.log(`📚 Generated ${chapters.length} chapter(s)`);
}

build().catch(err => { console.error(err); process.exit(1); });