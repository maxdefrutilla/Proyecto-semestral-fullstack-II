/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { crearPluginMocks } from './dev-mocks/index.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const usarMocks = mode === 'mock'

  const destinos = {
    '/api/v1/auth': `http://127.0.0.1:${env.USUARIOS_PORT || 8081}`,
    '/api/v1/usuarios': `http://127.0.0.1:${env.USUARIOS_PORT || 8081}`,
    '/api/v1/catalogo': `http://127.0.0.1:${env.CATALOGO_PORT || 8082}`,
    '/api/v1/ventas': `http://127.0.0.1:${env.VENTAS_PORT || 8083}`,
  }

  return {
    plugins: [
      react(),
      ...(usarMocks ? [crearPluginMocks({
        admin: env.INMAQUI_MOCK_ADMIN_PASSWORD,
        cliente: env.INMAQUI_MOCK_CLIENT_PASSWORD,
      })] : []),
    ],
    server: { proxy: destinos },
  }
})
