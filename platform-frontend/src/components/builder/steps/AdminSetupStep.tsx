// 단계 6 — 관리자 페이지 생성 Flow.
// 기획안의 "관리자 페이지 생성 Flow" 박스(문의자 대시보드 구조 / 콘텐츠 관리 화면 /
// 문의 관리 / 공개 상태 관리)를 요약해 보여준다.
// 체크한 경우만 이 단계로 진입하며, 실제 관리자 UI 는 생성 완료 후 /admin/sites/:id 에서 구현된다.
export default function AdminSetupStep() {
  return (
    <section className="step">
      <header className="step-head">
        <h2>관리자 페이지 설정</h2>
        <p className="step-desc">
          사이트 생성과 함께 <strong>관리자 페이지</strong>가 만들어집니다.
          아래 항목이 자동으로 포함됩니다.
        </p>
      </header>

      <div className="admin-setup-grid">
        <div className="admin-setup-card">
          <span className="admin-setup-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
          </span>
          <div>
            <strong>관리자 대시보드</strong>
            <small>사이트 현황, 최근 문의, 주요 지표 요약.</small>
          </div>
        </div>

        <div className="admin-setup-card">
          <span className="admin-setup-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v4H4zM4 12h16v4H4zM4 20h10"/></svg>
          </span>
          <div>
            <strong>콘텐츠 관리</strong>
            <small>페이지별 텍스트·이미지·섹션을 언제든 수정.</small>
          </div>
        </div>

        <div className="admin-setup-card">
          <span className="admin-setup-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </span>
          <div>
            <strong>문의 관리</strong>
            <small>방문자가 남긴 문의를 목록/상태별로 관리.</small>
          </div>
        </div>

        <div className="admin-setup-card">
          <span className="admin-setup-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <div>
            <strong>공개 상태 관리</strong>
            <small>사이트 공개/비공개 전환과 권한 설정.</small>
          </div>
        </div>
      </div>

      <p className="field-hint" style={{ marginTop: 16 }}>
        실제 관리자 편집기는 사이트 생성 완료 후 <code>/admin/sites/:id</code> 에서 열립니다.
        다음 단계에서 결과를 확인하세요.
      </p>
    </section>
  );
}
