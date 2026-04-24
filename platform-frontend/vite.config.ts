import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// 모노레포 내부 패키지 alias 와 백엔드 API 프록시.
// 프론트는 호스트 8080, 백엔드(web 서비스)는 호스트 8000.
// 프록시 target 은 환경변수로 오버라이드 가능 — 컨테이너 안에서는 docker network 의 service name(http://web:80)을 가리킨다.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app/site-renderer': path.resolve(__dirname, '../packages/site-renderer/src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
    },
  },
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
