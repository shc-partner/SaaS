import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import { ThemeProvider } from './theme/ThemeProvider'
import App from './App.tsx'

// 글로벌 스타일은 의존순으로 import — 토큰 → base → 공통 컴포넌트 → 셸/빌더/프리뷰.
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/app-shell.css'
import './styles/marketing.css'
import './styles/builder.css'
import './styles/preview.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
