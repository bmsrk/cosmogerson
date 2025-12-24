const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Markdown parser using markdown-it with breaks enabled (keeps single-line breaks as <br/>)
const MarkdownIt = require('markdown-it');
function parseMarkdown(mdText) {
  const md = new MarkdownIt({ html: false, breaks: true });

  // Paragraphs
  const defaultParagraphOpen = md.renderer.rules.paragraph_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.paragraph_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'mb-5 leading-[1.85] text-[17px] text-zinc-300 font-normal tracking-normal']);
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };  

  // Headings: map original project's levels and apply palette/fonts
  const defaultHeadingOpen = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    const tag = tokens[idx].tag;
    if (tag === 'h1') tokens[idx].attrPush(['class', 'text-4xl neon-green font-logo mb-10 mt-16 tracking-tighter']);
    // h2 uses yellow palette and a display serif for emphasis
    if (tag === 'h2') tokens[idx].attrPush(['class', 'text-2xl neon-yellow font-coustard mt-10 mb-8 uppercase tracking-[0.2em]']);
    // h3 uses blue for a tertiary accent
    if (tag === 'h3') tokens[idx].attrPush(['class', 'text-xl neon-blue font-jersey mt-8 mb-6 uppercase tracking-[0.15em]']);
    return defaultHeadingOpen(tokens, idx, options, env, self);
  };  

  // Strong / Emphasized text classes
  const defaultStrongOpen = md.renderer.rules.strong_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.strong_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'neon-green font-bold']);
    return defaultStrongOpen(tokens, idx, options, env, self);
  };

  const defaultEmOpen = md.renderer.rules.em_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.em_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'italic text-zinc-300']);
    return defaultEmOpen(tokens, idx, options, env, self);
  };

  // Blockquotes
  const defaultBlockquoteOpen = md.renderer.rules.blockquote_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.blockquote_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'border-l border-[rgba(59,95,255,0.18)] pl-10 italic mt-8 mb-8 text-zinc-500 text-[16px] leading-relaxed relative bg-[rgba(0,0,0,0.12)] rounded-md p-4']);
    return defaultBlockquoteOpen(tokens, idx, options, env, self);
  };  

  // Links: styled as neon accents and open in new tab
  const defaultLinkOpen = md.renderer.rules.link_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'md-link']);
    tokens[idx].attrPush(['target', '_blank']);
    tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  // Inline code
  md.renderer.rules.code_inline = function(tokens, idx/*, options, env, self*/) {
    const content = md.utils.escapeHtml(tokens[idx].content);
    return `<code class="md-code-inline">${content}</code>`;
  };

  // Fenced code blocks
  md.renderer.rules.fence = function(tokens, idx/*, options, env, self*/) {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : '';
    const lang = info ? info.split(/\s+/g)[0] : '';
    const langClass = lang ? 'language-' + md.utils.escapeHtml(lang) : '';
    return `<pre class="md-code-block"><code class="${langClass}">` + md.utils.escapeHtml(token.content) + '</code></pre>';
  };

  // List items: add classes (we don't inject custom bullet span here to keep it simple)
  const defaultListItemOpen = md.renderer.rules.list_item_open || function(tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options); };
  md.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'mb-3 text-zinc-400 list-disc pl-5 font-mono text-[16px]']);
    return defaultListItemOpen(tokens, idx, options, env, self);
  };  

  // Render
  let html = md.render(mdText);

  // Custom inline markers {g:...}, {y:...}, {b:...}
  html = html.replace(/\{g:(.*?)\}/g, '<span class="neon-green">$1</span>')
             .replace(/\{y:(.*?)\}/g, '<span class="neon-yellow font-bold">$1</span>')
             .replace(/\{b:(.*?)\}/g, '<span class="neon-blue font-bold">$1</span>');

  // Detect dialog-style blockquotes and inject speaker span + dialog class
  // Pattern: blockquote with a single <p> whose text starts with an uppercase speaker name followed by ':' or ',' or '-'
  html = html.replace(/<blockquote([^>]*)>\s*<p>(.*?)<\/p>\s*<\/blockquote>/gsu, (m, attrs, inner) => {
    // remove tags to test start of text
    const plain = inner.replace(/<[^>]+>/g, '').trim();
    const dialogMatch = plain.match(/^(\p{Lu}[\p{L}0-9 .'’\-]{1,}?[:\-,])\s*(.*)$/u);
    if (!dialogMatch) return m;
    const speaker = dialogMatch[1];
    const rest = dialogMatch[2];

    // ensure class attribute includes 'dialog'
    let newAttrs = attrs || '';
    if (/\bclass=/.test(newAttrs)) {
      newAttrs = newAttrs.replace(/class=(['"])(.*?)\1/, (m2, q, cls) => `class=${q}${cls} dialog${q}`);
    } else {
      newAttrs = newAttrs + ' class="dialog"';
    }

    // Return a structured blockquote with speaker and dialog text
    return `<blockquote${newAttrs}><p><span class="dialog-speaker">${speaker}</span> <span class="dialog-text">${rest}</span></p></blockquote>`;
  });

  return html;
}

// Extract numeric prefix for sorting (e.g., "01" from "01-jeitinho.md")
function getChapterNumber(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

// Generate flickering text HTML (character-by-character animation like Home.tsx)
function generateFlickeringText(text, offset = 0) {
  return text.split('').map((char, i) => {
    if (char === ' ') return '&nbsp;';
    const totalIndex = i + offset;
    const flickerIndex = (totalIndex * 17 + 11) % 5 + 1;
    const colors = ['neon-green', 'neon-yellow', 'neon-blue'];
    const colorClass = colors[totalIndex % 3];
    return `<span class="flicker-${flickerIndex} ${colorClass}">${char}</span>`;
  }).join('');
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
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const md = await fs.readFile(path.join(inputDir, file), 'utf8');
    const content = parseMarkdown(md);
    
    allContent += content;
    
    // Add spacing between chapters (but not after the last one)
    if (i < files.length - 1) {
      allContent += '\n\n<div class="my-14 border-t border-zinc-800/30"></div>\n\n';
    }
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
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Jersey+20&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Coustard:wght@400;700&display=swap" rel="stylesheet">
  <meta name="generator" content="scripts/build.cjs">
</head>
<body class="min-h-screen bg-[#050505] fanzine-pattern">
  <!-- Galaxy background (nebula, clouds, stars) -->
  <div class="galaxy" aria-hidden="true">
    <div class="nebula">
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
      <div class="cloud cloud4"></div>
      <div class="cloud cloud5"></div>
      <div class="cloud cloud6"></div>
      <div class="cloud cloud7"></div>
      <div class="cloud cloud8"></div>
    </div>
  </div>

  <!-- Reading Progress Bar -->
  <div id="progress-bar" class="fixed top-0 left-0 h-1 bg-gradient-to-r from-neon-green via-neon-yellow to-neon-blue transition-all duration-150 z-50" style="width: 0%"></div>
  
  <div class="container mx-auto px-6 md:px-8 max-w-3xl py-20 space-y-8 pb-20">
    
    <!-- Front Matter -->
    <section class="text-center py-6 relative overflow-visible">
      <!-- large blurred glow removed per request -->
      
      <!-- ASCII Art Header -->
      <div class="mb-6 opacity-5 select-none pointer-events-none flex flex-col items-center gap-2">
        <pre class="text-[6px] md:text-[8px] leading-[1] font-mono text-zinc-500 flicker-4">   _     _     _     _     _   
  ( )   ( )   ( )   ( )   ( )  
   X     X     X     X     X   
  (_)   (_)   (_)   (_)   (_)  </pre>
        <pre class="text-[5px] md:text-[6px] leading-[1] font-mono text-zinc-600 flicker-2">&lt;&lt;&lt; SIGNAL_STABLE_42 &gt;&gt;&gt;</pre>
      </div>
      
      <!-- Large Flickering Title (Book Cover) -->
      <div class="book-cover" aria-label="book cover">
      <h1 class="relative z-10 text-6xl md:text-9xl font-logo neon-title select-none tracking-tighter flex flex-col items-center leading-[0.8] mt-6">
        <!-- Soft radial light behind title (responsive) -->
        <div class="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div class="w-[28rem] md:w-[44rem] h-[10rem] md:h-[14rem] rounded-full bg-gradient-to-r from-[rgba(0,148,64,0.18)] via-[rgba(59,95,255,0.12)] to-[rgba(255,203,0,0.12)] blur-[80px] opacity-90"></div>
        </div>
        <span class="drop-shadow-[0_0_56px_rgba(0,163,74,0.36)]">
          ${generateFlickeringText('COSMO')}
        </span>
        <span class="mt-4 drop-shadow-[0_0_56px_rgba(59,95,255,0.36)]">
          ${generateFlickeringText('GERSON', 5)}
        </span>
      </h1>
      </div>
      
      <div class="mt-6 flex flex-col items-center gap-3 opacity-30">
        <div class="h-10 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent"></div>
        <span class="text-[10px] font-mono tracking-[0.8em] uppercase flicker-3">contos livres</span>
      </div>
    </section>

    <!-- Narrative Content -->
    <section>
      <div class="post-panel serif">
        ${allContent}
      </div>
    </section>

  </div>

  <script>
    // Galaxy background JS (optimized)
    (function(){
      // CSS-only starfield: no JS required for stars (improves performance and keeps background static)

      // Scroll effect removed (user preference) - no DOM changes on scroll
    })();

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

  // Create a simple visual style guide to inspect components, classes and markdown usage
  const styleGuideHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Style Guide — COSMOGERSON</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Major+Mono+Display&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Jersey+20&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Coustard:wght@400;700&display=swap" rel="stylesheet">
  <meta name="generator" content="scripts/build.cjs">
</head>
<body class="min-h-screen bg-[#050505] fanzine-pattern">
  <div class="container mx-auto px-6 md:px-8 max-w-4xl py-12 space-y-8 pb-20">
    <h1 class="text-4xl neon-green font-logo">Style Guide — Visual System</h1>

    <section>
      <h2 class="text-2xl neon-yellow">Typography</h2>
      <p class="text-main">Body copy uses readable serif in <code class="md-code-inline">.post-panel</code> for long form.</p>
      <p><strong class="neon-green">Strong text</strong>, <em class="italic text-zinc-300">emphasis</em>, <a class="md-link" href="#">links</a>, and <code class="md-code-inline">inline code</code>.</p>
    </section>

    <section>
      <h2 class="text-2xl neon-yellow">Markdown Cheatsheet</h2>

      <div class="grid gap-6 md:grid-cols-2">

        <!-- Headings -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Headings (source)</h3>
          <pre class="md-code-block"><code># Capítulo\n## Seção\n### Subsection</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <h1 class="text-3xl neon-green font-logo">Capítulo</h1>
          <h2 class="text-2xl neon-yellow">Seção</h2>
          <h3 class="text-xl neon-blue">Subsection</h3>
        </div>

        <!-- Bold / Italic / Link -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Bold / Italic / Link (source)</h3>
          <pre class="md-code-block"><code>**negrito** _itálico_ [exemplo](https://example.com)</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <p><strong class="neon-green">negrito</strong> <em class="italic text-zinc-300">itálico</em> <a href="#" class="md-link">exemplo</a></p>
        </div>

        <!-- Inline / Block code -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Inline / Block code (source)</h3>
          <pre class="md-code-block"><code>&#96;const x = 42;&#96;\n\n&#96;&#96;&#96;js\nconsole.log('hi')\n&#96;&#96;&#96;</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <p>Inline: <code class="md-code-inline">const x = 42;</code></p>
          <pre class="md-code-block"><code>console.log('hi')</code></pre>
        </div>

        <!-- Blockquote / Dialog -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Blockquote / Dialog (source)</h3>
          <pre class="md-code-block"><code>> Uma reflexão\n\n> MARTA: Eu consegui!</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <blockquote class="border-l pl-8">Uma reflexão</blockquote>
          <blockquote class="dialog border-l pl-8"><p><span class="dialog-speaker">MARTA:</span> <span class="dialog-text">Eu consegui!</span></p></blockquote>
        </div>

        <!-- Lists -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Lists (source)</h3>
          <pre class="md-code-block"><code>- Item A\n- Item B\n  - Subitem</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <ul>
            <li>Item A</li>
            <li>Item B
              <ul class="mt-2"><li>Subitem</li></ul>
            </li>
          </ul>
        </div>

        <!-- Custom markers -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Custom markers (source)</h3>
          <pre class="md-code-block"><code>{g:verde} {y:amarelo} {b:azul}</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <p><span class="neon-green">verde</span> <span class="neon-yellow">amarelo</span> <span class="neon-blue">azul</span></p>
        </div>

        <!-- Images -->
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Images (source)</h3>
          <pre class="md-code-block"><code>![Alt text](https://via.placeholder.com/320x120)</code></pre>
        </div>
        <div>
          <h3 class="text-lg text-zinc-300 mb-2">Rendered</h3>
          <img src="https://via.placeholder.com/320x120" alt="placeholder" />
        </div>

      </div>
    </section>

    <section>
      <h2 class="text-2xl neon-yellow">Post Panel</h2>
      <div class="post-panel serif">
        <h1 class="text-2xl neon-green">Post panel title</h1>
        <p class="mb-5">This is a sample paragraph inside the <code class="md-code-inline">.post-panel</code>. It uses <strong class="neon-green">green highlights</strong> and <span class="neon-yellow">yellow accents</span>.</p>

        <blockquote class="border-l pl-8">This is a regular blockquote style for emphasis.</blockquote>

        <blockquote class="dialog border-l pl-8"><p><span class="dialog-speaker">MARTA:</span> <span class="dialog-text">Dialog-style quote with blue speaker label.</span></p></blockquote>

        <ul>
          <li>Unordered item one</li>
          <li>Unordered item two</li>
        </ul>

        <pre class="md-code-block"><code>function hello(){\n  console.log('hello');\n}</code></pre>

      </div>
    </section>

    <section>
      <h2 class="text-2xl neon-yellow">Neon Title Demo</h2>
      <h1 class="text-6xl neon-title"><span class="neon-green">COSMO</span> <span class="neon-yellow">GERSON</span></h1>
      <p class="text-zinc-400">Yellow text uses the pixel font to give a retro look.</p>
    </section>

    <footer class="mt-12 text-sm text-zinc-500">Generated style guide</footer>
  </div>
</body>
</html>`;

  await fs.writeFile(path.join(outDir, 'style-guide.html'), styleGuideHtml, 'utf8');
  console.log('✓ Style guide generated');

  console.log('\n✅ Build complete! Files in', outDir);
  console.log(`📚 Generated continuous book with ${files.length} chapter(s)`);
}

build().catch(err => { console.error(err); process.exit(1); });