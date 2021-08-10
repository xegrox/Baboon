import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths({ loose: true })],
  server: {
    proxy: {
      '^/sftp_client$': 'http://localhost:8000'
    }
  },
  resolve: {
    alias: {
      'demo_1.mp4': './public/demo_1.mp4',
      'demo_2.mp4': './public/demo_2.mp4'
    }
  }
})
