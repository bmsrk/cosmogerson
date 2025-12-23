# Contribuindo com o COSMO GERSON

## Adicionando Novo Conteúdo

O site COSMO GERSON é estruturado como um livro online. Existem duas formas de adicionar novo conteúdo:

### Opção 1: Arquivos Markdown na pasta `generated/`

1. Crie um arquivo `.md` na pasta `generated/` (ex: `02-capitulo-dois.md`)
2. Escreva seu conteúdo usando Markdown
3. Commit e push para `main`
4. O GitHub Actions fará o deploy automaticamente

**Nota:** Atualmente, os arquivos na pasta `generated/` servem como fonte de conteúdo, mas precisam ser manualmente adicionados ao código para aparecer no site. Veja a Opção 2 para isso.

### Opção 2: Adicionando Conteúdo Diretamente ao Código

Para adicionar novo conteúdo à página Inicio:

1. Abra o arquivo `pages/Home.tsx`
2. Adicione uma nova entrada ao array `entries`:

```typescript
{
  title: 'Título do Seu Capítulo',
  content: 'Conteúdo em markdown...'
}
```

3. Commit e push para `main`

### Sintaxe Markdown Customizada

O parser de markdown suporta tags especiais para cores:

- `{g:texto}` - Texto em verde neon
- `{y:texto}` - Texto em amarelo neon
- `{b:texto}` - Texto em azul neon
- `**texto**` - Negrito em verde neon
- `_texto_` - Itálico
- `> citação` - Bloco de citação
- `* item` ou `- item` - Listas

### Exemplo de Conteúdo

```markdown
# Título Principal

**Subtítulo em negrito**

Este é um parágrafo normal. Você pode usar _itálico_ e **negrito**.

O {y:silêncio} tomou conta da rede no {b:Setor 7}.

> "Uma citação importante aqui"

* Item da lista 1
* Item da lista 2
* Item da lista 3

Outro parágrafo de conteúdo.
```

## Desenvolvimento Local

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

## Estrutura do Projeto

```
cosmogerson/
├── pages/          # Páginas React (Inicio, Manifesto, Cenários, Contos, Source)
├── components/     # Componentes reutilizáveis
├── generated/      # Arquivos markdown (fonte de conteúdo)
├── src/styles/     # Estilos globais e Tailwind CSS
└── .github/        # GitHub Actions workflow para deploy
```

## Deploy

O deploy é automático via GitHub Actions quando você faz push para a branch `main`.

O site fica disponível em: https://bmsrk.github.io/cosmogerson/
