import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Serve /content/*.md from the parent directory
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

export default defineConfig({
  plugins: [react(), contentPlugin()],
  server: { port: 5174 },
})
