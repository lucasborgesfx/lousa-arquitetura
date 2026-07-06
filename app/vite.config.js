import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Serve /content/*.md from the parent directory (legado do protótipo P1;
// content/ foi movido para legacy/notes/ na R3 — mantido inofensivo)
const contentPlugin = () => ({
  name: 'serve-content',
  configureServer(server) {
    server.middlewares.use('/content', (req, res, next) => {
      const filePath = resolve(__dirname, '..', 'content', req.url.replace(/^\//, ''))
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(fs.readFileSync(filePath, 'utf-8'))
      } else {
        next()
      }
    })
  },
})

// Serve dados de fora do src/ (lessons/<slug>/lesson.json, script.md, ...).
// Só arquivos de texto puro (json/md) — o .mjs compilado do diagrama passa
// pelo /@fs/ nativo do Vite (ver lessonLoader.js), não por aqui, porque ele
// tem imports "bare" (react, likec4/react) que precisam do transform do Vite.
const lessonsDataPlugin = () => ({
  name: 'serve-lesson-data',
  configureServer(server) {
    server.middlewares.use('/lessons', (req, res, next) => {
      const filePath = resolve(__dirname, '..', 'lessons', req.url.replace(/^\//, '').split('?')[0])
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next()
      const ext = filePath.split('.').pop()
      const contentType = { json: 'application/json', md: 'text/markdown' }[ext]
      if (!contentType) return next()
      res.setHeader('Content-Type', `${contentType}; charset=utf-8`)
      res.end(fs.readFileSync(filePath, 'utf-8'))
    })
  },
})

const lessonsRootAbs = resolve(__dirname, '..', 'lessons')

export default defineConfig({
  plugins: [react(), contentPlugin(), lessonsDataPlugin()],
  server: {
    port: 5174,
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
  resolve: {
    // O .mjs compilado do diagrama vive fora do src/ (lessons/<slug>/generated/likec4/),
    // servido via /@fs/. A resolução Node padrão de imports "bare" (react, likec4/react,
    // @likec4/core/model) sobe a árvore de diretórios a partir do arquivo importador —
    // e lessons/ não tem node_modules como ancestral. Aliases explícitos apontam para os
    // mesmos arquivos físicos que o resto do app já usa (mesma identidade de módulo,
    // sem duplicar a instância do React).
    // Regex com `$` final: match exato, nunca prefixo — 'react/jsx-dev-runtime'
    // e 'react/compiler-runtime' (usados internamente por outras deps) não podem
    // ser capturados por engano pelo alias de 'react'.
    alias: [
      { find: /^react\/jsx-runtime$/, replacement: resolve(__dirname, 'node_modules/react/jsx-runtime.js') },
      { find: /^react$/, replacement: resolve(__dirname, 'node_modules/react/index.js') },
      { find: /^likec4\/react$/, replacement: resolve(__dirname, 'node_modules/likec4/react/index.mjs') },
      { find: /^@likec4\/core\/model$/, replacement: resolve(__dirname, 'node_modules/@likec4/core/dist/model/index.mjs') },
    ],
  },
  define: {
    __LESSONS_ROOT_ABS__: JSON.stringify(lessonsRootAbs),
  },
})
