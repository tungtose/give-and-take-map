import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // @ts-ignore
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react()],
    server: {
      port: 8088,
    }
  }
})

