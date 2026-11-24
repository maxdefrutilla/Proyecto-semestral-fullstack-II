/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { crearPluginMocks } from './dev-mocks/index.js'

const proxy = {
  '/api/v1/auth': 'http://localhost:8081',
  '/api/v1/usuarios': 'http://localhost:8081',
  '/api/v1/categorias': 'http://localhost:8082',
  '/api/v1/catalogo': 'http://localhost:8082',
  '/api/v1/ventas': 'http://localhost:8083',
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const usarMocks =
    mode === 'mock' ||
    env.INMAQUI_MOCKS === '1' ||
    process.env.INMAQUI_MOCKS === '1'

  return {
    plugins: [react(), ...(usarMocks ? [crearPluginMocks()] : [])],
    server: { proxy },
  }
})
