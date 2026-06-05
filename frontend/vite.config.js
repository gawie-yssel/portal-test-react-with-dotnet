import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ports come from env vars (set by dev.ps1), with defaults for standalone runs.
const frontendPort = Number(process.env.FRONTEND_PORT) || 5173
const backendPort = process.env.BACKEND_PORT || '5122'

export default defineConfig({
  plugins: [react()],
  server: { port: frontendPort },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      `http://localhost:${backendPort}/api/hello`,
    ),
  },
})
