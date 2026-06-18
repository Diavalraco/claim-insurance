import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const require = createRequire(import.meta.url)
const { analyzeClaim } = require('../api/analyzeClaim.js')

function apiDevPlugin(env) {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/analyze-claim', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method !== 'POST') {
          return next()
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}')
            const result = await analyzeClaim(parsed.claim_text)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = err.statusCode || 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), apiDevPlugin(env)],
    server: {
      port: 5173,
    },
  }
})
