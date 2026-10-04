import Logo from './Logo';

// SaaS 플랫폼 공통 하단 푸터.
// 좌: 브랜드 + 설명, 우: 3개 링크 컬럼 (모두 placeholder — 실제 페이지는 추후).
const YEAR = new Date().getFullYear();

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-brand">
          <span className="brand-line">
            <span className="brand-logo" style={{ width: 22, height: 22, display: 'inline-grid', placeItems: 'center', borderRadius: 6, background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
              <Logo size={12} />
            </span>
            CreatorDesk
          </span>
          <p className="brand-desc">
            유튜버, 라이브 스트리밍, 숏폼 크리에이터를 위한 컨텐츠 운영 워크스페이스.
            아이디어부터 업로드까지, 제작 흐름 전체를 한 곳에서 관리하세요.
          </p>
        </div>

        <div className="app-footer-col">
          <h4>제품</h4>
          <ul>
            <li><a href="#">기능 소개</a></li>
            <li><a href="#">워크스페이스</a></li>
            <li><a href="#">가격</a></li>
          </ul>
        </div>

        <div className="app-footer-col">
          <h4>지원</h4>
          <ul>
            <li><a href="#">가이드</a></li>
            <li><a href="#">문서</a></li>
            <li><a href="#">문의하기</a></li>
          </ul>
        </div>

        <div className="app-footer-col">
          <h4>법적 고지</h4>
          <ul>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">사업자 정보</a></li>
          </ul>
        </div>
      </div>

      <div className="app-footer-meta">
        <span>© {YEAR} CreatorDesk. All rights reserved.</span>
        <span>v0.1.0 · MVP</span>
      </div>
    </footer>
  );
}
