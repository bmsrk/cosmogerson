# 🌌 COSMOGERSON

**COSMOGERSON** é um e-book digital de contos sci-fi sobre a tomada do espaço pelo Brasil e seus amigos latino-americanos.

Uma publicação de ficção especulativa com estética retro-futurista, explorando tecnologia, autonomia e perspectivas latino-americanas sobre o futuro.

## 🚀 Características

- **E-book interativo** com navegação entre capítulos
- **Mobile-first**: Otimizado para leitura em celular e desktop
- **Navegação intuitiva**: Menu hambúrguer, botões anterior/próximo, gestos de swipe
- **Barra de progresso** de leitura
- **Estética terminal retro-futurista** com cores neon
- **Parser customizado** de Markdown para leitura imersiva
- **Deploy automatizado** via GitHub Actions

## 📁 Estrutura

```
cosmogerson/
├── generated/          # Arquivos .md dos contos (adicione novos capítulos aqui)
├── scripts/
│   └── build.cjs      # Gerador de páginas estáticas
├── src/
│   └── styles/
│       └── globals.css # Estilos Tailwind CSS + customizações
├── build/             # Páginas HTML geradas (git-ignored)
├── .github/
│   ├── copilot-instructions.md  # Documentação do projeto
│   └── workflows/
│       └── deploy.yml  # GitHub Actions
└── ...
```

## 💻 Desenvolvimento Local

**Pré-requisitos:** Node.js 20+

```bash
# Instalar dependências
npm install

# Gerar páginas estáticas
npm run generate-pages

# Visualizar o build localmente
npm run preview-build
# Abre em http://localhost:3000
```

## ✍️ Adicionando Novos Capítulos

1. Crie um arquivo `.md` na pasta `generated/` com prefixo numérico:
   ```
   generated/03-seu-capitulo.md
   ```

2. Escreva seu conto em Markdown com sintaxe especial:
   ```markdown
   # Título do Capítulo
   
   Texto normal aparece em cinza.
   
   **Texto em negrito** aparece em verde neon.
   
   Use marcadores especiais:
   - {g:texto verde} - destaque verde
   - {y:texto amarelo} - destaque amarelo
   - {b:texto azul} - destaque azul
   
   > Citações aparecem com borda esmeralda
   ```

3. Commit e push para `main`:
   ```bash
   git add generated/03-seu-capitulo.md
   git commit -m "Add chapter 3: Seu Capítulo"
   git push
   ```

4. GitHub Actions automaticamente gera e faz deploy!

## 🎨 Design System

- **Cores**: Verde neon (#00ff66), Amarelo (#ffcc00), Azul (#0099ff)
- **Tipografia**: JetBrains Mono, Major Mono Display, Orbitron
- **Tema**: Dark (#050505) com efeitos de flicker sutis

## 🌐 Deploy

O site é automaticamente deployado para GitHub Pages em cada push para `main`.

**URL:** https://bmsrk.github.io/cosmogerson/

## 📖 Documentação Completa

Veja `.github/copilot-instructions.md` para documentação detalhada sobre:
- Como o sistema de build funciona
- Convenções de nomenclatura
- Sintaxe especial do Markdown
- Comandos de desenvolvimento

## 📜 Licença

Este projeto é experimental e educacional.
