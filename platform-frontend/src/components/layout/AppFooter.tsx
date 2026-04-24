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
            SiteForge
          </span>
          <p className="brand-desc">
            클릭 몇 번으로 사이트를 만들고 운영하세요. 디자인부터 콘텐츠까지,
            전문 지식 없이도 비즈니스에 필요한 웹사이트를 빠르게 시작할 수 있습니다.
          </p>
        </div>

        <div className="app-footer-col">
          <h4>제품</h4>
          <ul>
            <li><a href="#">사이트 빌더</a></li>
            <li><a href="#">템플릿</a></li>
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
        <span>© {YEAR} SiteForge. All rights reserved.</span>
        <span>v0.1.0 · MVP</span>
      </div>
    </footer>
  );
}
