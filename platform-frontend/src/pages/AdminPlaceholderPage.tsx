import { Link, useParams } from 'react-router-dom';
import { loadMySites } from '../features/mySites/storage';

// /admin/sites/:siteId — 관리자 화면 placeholder.
// 기획안의 "관리자 페이지 생성 Flow" 4영역(대시보드/콘텐츠/문의/공개 상태)을
// 사이드 메뉴 형태로 미리 잡아둔다. 실제 편집기는 다음 스테이지에서 각 영역에 붙을 자리.
const ADMIN_SECTIONS = [
  {
    key: 'dashboard',
    title: '관리자 대시보드',
    desc:  '최근 방문/문의·페이지별 주요 지표를 한 화면에서 파악.',
    svg: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
  },
  {
    key: 'content',
    title: '콘텐츠 관리',
    desc:  '페이지별 텍스트·이미지·섹션 블록 편집.',
    svg: <><path d="M4 4h16v4H4zM4 12h16v4H4zM4 20h10"/></>,
  },
  {
    key: 'inquiries',
    title: '문의 관리',
    desc:  '방문자가 남긴 문의 목록과 상태 관리.',
    svg: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
  },
  {
    key: 'visibility',
    title: '공개 상태 관리',
    desc:  '사이트 공개/비공개 전환과 권한 설정.',
    svg: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  },
];

export default function AdminPlaceholderPage() {
  const { siteId } = useParams<{ siteId?: string }>();
  const site = siteId ? loadMySites().find((s) => s.id === siteId) : undefined;

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="badge brand">관리자</span>
          <h1>{site?.name ?? '사이트 관리자'}</h1>
          {siteId && <p className="placeholder-meta">site id: <code>{siteId}</code> {site?.slug && <> · slug <code>{site.slug}</code></>}</p>}
        </div>
        <div className="admin-page-head-actions">
          {site && <Link to={`/sites/${site.slug}`} className="btn ghost">사이트 확인하기 ↗</Link>}
          <Link to="/app" className="btn subtle">내 사이트 목록</Link>
        </div>
      </header>

      <div className="admin-page-grid">
        {ADMIN_SECTIONS.map((s) => (
          <section key={s.key} className="admin-section-card">
            <span className="admin-section-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {s.svg}
              </svg>
            </span>
            <div className="admin-section-body">
              <strong>{s.title}</strong>
              <small>{s.desc}</small>
              <span className="admin-section-stub">다음 스테이지에서 구현</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
