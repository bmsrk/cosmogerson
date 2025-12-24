const fs = require('fs').promises;
const path = require('path');

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

async function build() {
  const root = path.join(__dirname, '..');
  const inputDir = path.join(root, 'generated');
  const outDir = path.join(root, 'build');
  await fs.mkdir(outDir, { recursive: true });

  const files = await fs.readdir(inputDir);

  // Copy project CSS into the build output (if present)
  const cssSrc = path.join(root, 'src', 'styles', 'globals.css');
  const cssOut = path.join(outDir, 'styles.css');
  try {
    await fs.copyFile(cssSrc, cssOut);
    console.log('Copied CSS to', cssOut);
  } catch (err) {
    console.warn('No globals.css found at', cssSrc, ', proceeding without it.');
  }

  const generatedPages = [];
  for (const file of files.filter(f => f.endsWith('.md'))) {
    const md = await fs.readFile(path.join(inputDir, file), 'utf8');
    const content = parseMarkdown(md);

    const titleMatch = md.match(/^#\s+(.*)/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.md','');

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
  <meta name="generator" content="scripts/build.cjs">
</head>
<body class="min-h-screen bg-[#050505]">
  <main class="container mx-auto px-8 max-w-3xl py-16">
    <nav class="mb-8 text-sm"><a href="index.html" class="text-zinc-400">← Back to index</a></nav>
    ${content}
  </main>
</body>
</html>`;

    const outPath = path.join(outDir, file.replace('.md', '.html'));
    await fs.writeFile(outPath, html, 'utf8');
    generatedPages.push(path.basename(outPath));
    console.log('Written:', outPath);
  }

  // Generate a simple index.html
  const indexHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Index</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="min-h-screen bg-[#050505]">
  <main class="container mx-auto px-8 max-w-3xl py-16">
    <h1 class="text-3xl neon-green mb-8">Pages</h1>
    <ul>
      ${generatedPages.map(f => `<li class="mb-2"><a class="text-zinc-300" href="${f}">${f}</a></li>`).join('\n      ')}
    </ul>
  </main>
</body>
</html>`;

  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8');

  console.log('Build complete — files in', outDir);
}

build().catch(err => { console.error(err); process.exit(1); });