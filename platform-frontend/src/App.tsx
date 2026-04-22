import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import HealthBadge from './components/HealthBadge';

import WizardLayout from './pages/wizard/WizardLayout';
import TypeSelect from './pages/wizard/TypeSelect';
import BasicInfo from './pages/wizard/BasicInfo';
import Features from './pages/wizard/Features';
import Review from './pages/wizard/Review';
import Done from './pages/wizard/Done';

// 앱 전체 셸 — 헤더(브랜드 + API 헬스 배지) + 라우팅된 본문.
// 생성 위저드는 /sites/new/* 아래에서 WizardLayout 으로 묶고,
// 진행 표시(Steps)와 본문(Outlet) 구조를 공유한다.
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">SiteForge</Link>
        <HealthBadge />
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* 위저드: 유형 → setup/기본정보 → setup/기능 → 결과확인 → mock 완료 */}
          <Route path="/sites/new" element={<WizardLayout />}>
            <Route index element={<Navigate to="type" replace />} />
            <Route path="type" element={<TypeSelect />} />
            <Route path="setup">
              <Route index element={<Navigate to="basic" replace />} />
              <Route path="basic" element={<BasicInfo />} />
              <Route path="features" element={<Features />} />
            </Route>
            <Route path="review" element={<Review />} />
            <Route path="done/:id" element={<Done />} />

            {/* 구(舊) flat 경로 호환 — 새 setup/* 경로로 자동 이전. */}
            <Route path="basic" element={<Navigate to="setup/basic" replace />} />
            <Route path="features" element={<Navigate to="setup/features" replace />} />
          </Route>

          {/* /start 는 생성 플로우 진입점의 별칭. 랜딩 CTA 나 외부 딥링크에서 사용. */}
          <Route path="/start" element={<Navigate to="/sites/new/type" replace />} />

          <Route path="*" element={<p>페이지를 찾을 수 없습니다.</p>} />
        </Routes>
      </main>
    </div>
  );
}
