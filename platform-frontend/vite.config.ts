import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api/* 요청을 백엔드 컨테이너로 프록시한다.
// docker-compose 안에서는 서비스명 'backend' 가 호스트명, 컨테이너 내부 포트는 80.
// 컨테이너 밖에서 직접 vite 를 띄울 때는 환경변수로 덮어쓸 수 있다.
const apiTarget = process.env.VITE_API_PROXY_TARGET || 'http://backend:80';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 컨테이너 외부(localhost:8080)에서 접근 허용
    port: 8080,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true, // Host 헤더를 타깃에 맞춰 재작성
      },
    },
  },
});
