import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ports come from env vars (set by dev.ps1), with defaults for standalone runs.
const frontendPort = Number(process.env.FRONTEND_PORT) || 5173
const backendPort = process.env.BACKEND_PORT || '5122'

// Serve a /health endpoint on both the dev and preview servers so the
// Linx Portal (and load balancers) can probe the frontend's liveness.
function healthCheck() {
  const handler = (req, res, next) => {
    if (req.url === '/health') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: 'healthy' }))
      return
    }
    next()
  }
  return {
    name: 'health-check',
    configureServer: (server) => server.middlewares.use(handler),
    configurePreviewServer: (server) => server.middlewares.use(handler),
  }
}

export default defineConfig({
  plugins: [react(), healthCheck()],
  server: { port: frontendPort },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      `http://localhost:${backendPort}/api/hello`,
    ),
  },
})
