import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// 모노레포 내부 패키지 alias 와 백엔드 API 프록시.
// 프론트는 호스트 8080, 백엔드(web 서비스)는 호스트 8000.
// 프록시 target 은 환경변수로 오버라이드 가능 — 컨테이너 안에서는 docker network 의 service name(http://web:80)을 가리킨다.
//
// HMR — Windows + Docker Desktop(WSL2) 환경에서는 bind mount 의 inotify 이벤트가
// 컨테이너로 전달되지 않으므로 chokidar 가 변경을 감지하지 못한다(파일 내용은 정상 동기화).
// 컨테이너에서 실행 시(VITE_USE_POLLING=1) polling 모드로 전환해 HMR 을 살린다.
const usePolling = process.env.VITE_USE_POLLING === '1' || process.env.VITE_USE_POLLING === 'true';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
    },
  },
  server: {
    host: true,
    port: 8080,
    // 컨테이너 안에서만 polling 활성화 — 호스트 네이티브 실행 시 CPU 를 낭비하지 않도록.
    watch: usePolling ? {
      usePolling: true,
      interval: 200,         // 200ms 간격이면 체감 지연 거의 없음
      binaryInterval: 800,   // 바이너리 자산은 더 길게
    } : undefined,
    // HMR 클라이언트도 host 8080 으로 명시 — 프록시/포워딩 환경에서 ws 연결이 끊기지 않도록.
    hmr: usePolling ? {
      host: 'localhost',
      clientPort: 8080,
    } : undefined,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
