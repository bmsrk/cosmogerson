# COSMOGERSON - Copilot Instructions

## 📖 Project Overview

**COSMOGERSON** is a digital sci-fi e-book featuring Latin American speculative fiction stories. The project generates a static website optimized for comfortable reading on both mobile and desktop devices, with a retro-futuristic terminal aesthetic.

### Key Features
- **E-book format**: Table of contents, chapter navigation, reading progress bar
- **Mobile-first UX**: Responsive design, hamburger menu, swipe gestures
- **Static site generation**: Markdown files automatically converted to styled HTML pages
- **Retro-futuristic design**: Dark background, neon colors, terminal-inspired typography

## 🏗️ Project Structure

```
cosmogerson/
├── generated/              # Markdown story files (*.md) - ADD NEW CHAPTERS HERE
├── scripts/
│   └── build.cjs          # Static site generator
├── src/
│   └── styles/
│       └── globals.css    # Tailwind CSS source + custom styles
├── build/                 # Generated HTML pages (git-ignored)
├── .github/
│   ├── copilot-instructions.md  # This file
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment workflow
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## ✍️ Adding New Chapters

### Step 1: Create a Markdown File

Add a new `.md` file in the `generated/` directory following the naming convention:

```
generated/
├── 01-jeitinho.md
├── 02-a_mensagem.md
├── 03-your-new-chapter.md  ← New file here
```

**Naming Convention:**
- Use numeric prefix for ordering: `01-`, `02-`, `03-`, etc.
- Use kebab-case for the chapter name: `03-new-chapter.md`
- Chapters are automatically sorted by numeric prefix

### Step 2: Write Your Content

Use standard Markdown with special color syntax:

```markdown
# Chapter Title

Regular paragraph text appears in gray/zinc color.

**Bold text** appears in neon green.

_Italic text_ appears in lighter gray.

> Blockquotes are styled with emerald borders

## Section Headers

Section headers appear in uppercase neon green.

### Subsection Headers

Use special color markers:
- {g:green text} - Neon green highlight
- {y:yellow text} - Neon yellow highlight (bold)
- {b:blue text} - Neon blue highlight (bold)

Lists:
- Item one
- Item two
- Item three
```

### Step 3: Build and Preview

```bash
# Generate static pages
npm run generate-pages

# Preview locally
npm run preview-build
# Then open http://localhost:3000
```

### Step 4: Deploy

Simply commit and push to the `main` branch:

```bash
git add generated/03-your-new-chapter.md
git commit -m "Add chapter 3: Your New Chapter"
git push origin main
```

GitHub Actions will automatically build and deploy to GitHub Pages.

## 🎨 Design System

### Colors
- **Background**: `#050505` (near black)
- **Primary (Neon Green)**: `#00ff66` - Used for headings, highlights, interactive elements
- **Secondary (Neon Yellow)**: `#ffcc00` - Used for special emphasis
- **Accent (Neon Blue)**: `#0099ff` - Used for special emphasis
- **Text**: `#a8b9ae` (grayish) - Main body text

### Typography
- **Body text**: JetBrains Mono (monospace)
- **Headings**: Major Mono Display (display monospace)
- **Special elements**: Orbitron (futuristic sans-serif)

### Custom Markdown Syntax
- `{g:text}` - Neon green span
- `{y:text}` - Neon yellow span (bold)
- `{b:text}` - Neon blue span (bold)
- `**bold**` - Neon green bold
- `_italic_` - Light italic
- `> quote` - Styled blockquote with emerald accent

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Compile Tailwind CSS only
npm run build:css

# Generate static pages from markdown
npm run generate-pages

# Preview the generated build
npm run preview-build

# Development server (React/Vite - not used for production)
npm run dev

# Build React app (optional, not used for deployment)
npm run build
```

## 🚀 Deployment

The site is deployed via GitHub Actions to GitHub Pages.

**Workflow:** `.github/workflows/deploy.yml`

On every push to `main`:
1. Install dependencies
2. Run `npm run generate-pages` (which includes CSS compilation)
3. Copy `build/` directory contents to GitHub Pages
4. Site is live at: `https://bmsrk.github.io/cosmogerson/`

### Manual Deployment Trigger

You can manually trigger deployment from the Actions tab on GitHub.

## 📝 Code Style Conventions

### Markdown Files
- Use `#` for main chapter title
- Use `##` for section headers
- Use `###` for subsections (rare)
- Keep paragraphs short for readability
- Use blockquotes for character thoughts or emphasis

### CSS/Tailwind
- Use Tailwind utility classes when possible
- Custom styles go in `src/styles/globals.css`
- Follow existing neon/terminal theme
- Mobile-first responsive design (320px minimum width)

### JavaScript
- Vanilla JS only (no frameworks in generated pages)
- Keep scripts inline for simplicity
- Progressive enhancement approach

## 🎯 E-book Features

### Navigation
- **Index page**: Lists all chapters in order
- **Previous/Next buttons**: At the bottom of each chapter
- **Mobile menu**: Hamburger menu shows all chapters
- **Swipe gestures**: Swipe left/right to navigate chapters (mobile)

### Reading Experience
- **Progress bar**: Shows reading progress at top of page
- **Responsive typography**: Comfortable reading on all devices
- **Dark mode**: Eye-friendly dark theme
- **Minimal distractions**: Focus on content

## 🐛 Troubleshooting

### CSS not applying correctly
```bash
# Rebuild CSS
npm run build:css
npm run generate-pages
```

### New chapter not appearing
- Check numeric prefix in filename
- Ensure file is in `generated/` directory
- Rebuild: `npm run generate-pages`

### Deployment fails
- Check GitHub Actions logs
- Ensure all dependencies are in `package.json`
- Verify `build/` directory exists after local build

## 📚 Additional Resources

- **Repository**: https://github.com/bmsrk/cosmogerson
- **Live Site**: https://bmsrk.github.io/cosmogerson/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Markdown Guide**: https://www.markdownguide.org/

## 🤝 Contributing

When adding new features:
1. Maintain the retro-futuristic aesthetic
2. Ensure mobile responsiveness
3. Test on multiple devices/browsers
4. Keep build process simple and fast
5. Document any new conventions here

---

**Last updated**: December 2024
