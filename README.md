# 🌌 COSMO GERSON

**cosmogerson** é um zine digital sobre a tomada do espaço pelo Brasil e seus amigos latinoamericanos.

Uma publicação sci-fi com estética retro-futurista, explorando tecnologia, autonomia e perspectivas latino-americanas sobre o futuro.

## 🚀 Características

- Site estático gerado com React + TypeScript + Vite
- Estética terminal retro-futurista
- Parser customizado de Markdown para leitura imersiva
- Deploy automatizado via GitHub Actions

## 📁 Estrutura

```
cosmogerson/
├── components/     # Componentes React reutilizáveis
├── pages/          # Páginas da aplicação
├── generated/      # Adicione seus arquivos .md aqui
└── ...
```

## 💻 Desenvolvimento Local

**Pré-requisitos:** Node.js 20+

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## ✍️ Adicionando Conteúdo

1. Adicione arquivos `.md` na pasta `generated/`
2. Commit e push para `main`
3. GitHub Actions automaticamente faz deploy para GitHub Pages

## 🌐 Deploy

O site é automaticamente deployado para GitHub Pages em cada push para `main`.

URL: https://bmsrk.github.io/cosmogerson/

## 📜 Licença

Este projeto é experimental e educacional.
