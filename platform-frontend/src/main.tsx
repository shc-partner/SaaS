<<<<<<< HEAD
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './features/auth/AuthProvider';
import App from './App.tsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/app-shell.css';
import './styles/marketing.css';
import './styles/latency-overlay.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './styles.css';

// React 진입점.
// - StrictMode: 개발 중 잠재적 문제 조기 발견.
// - Provider: 전역 Redux store 주입. 위저드·인증 등 공유 상태의 단일 출처.
// - BrowserRouter: HTML5 history API 기반 라우팅 (vite dev 서버가 SPA fallback 처리).
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found in index.html');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
);
