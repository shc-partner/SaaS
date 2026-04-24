import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadMySites, removeMySite, type MySite } from '../features/mySites/storage';
import { SITE_TYPE_OPTIONS } from '../features/siteBuilder/types';

// /app — 내 사이트 목록.
// 기획안 5번: "내 사이트 목록(/app 또는 /dashboard)" — 생성 결과를 다시 찾는 핵심 진입점.
// MVP 에서는 localStorage 에서 읽어오지만, 추후 백엔드 API 로 교체되어도 같은 컴포넌트 유지.
function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function typeLabel(typeId: string): string {
  return SITE_TYPE_OPTIONS.find((o) => o.id === typeId)?.label ?? typeId;
}

function statusBadgeClass(s: MySite['status']): string {
  switch (s) {
    case 'published': return 'badge success';
    case 'draft':     return 'badge warning';
    case 'wip':       return 'badge';
    default:          return 'badge';
  }
}

function statusLabel(s: MySite['status']): string {
  return s === 'published' ? '생성 완료' : s === 'draft' ? '작성 중' : '대기';
}

export default function MySitesPage() {
  const [sites, setSites] = useState<MySite[]>(() => loadMySites());

  // 다른 탭/창에서 localStorage 가 바뀌면 즉시 반영.
  useEffect(() => {
    const onStorage = () => setSites(loadMySites());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const onRemove = (id: string) => {
    if (!confirm('목록에서 삭제하시겠습니까? (실제 사이트는 삭제되지 않습니다)')) return;
    removeMySite(id);
    setSites(loadMySites());
  };

  return (
    <div className="mysites">
      <header className="mysites-head">
        <div>
          <h1>내 사이트 목록</h1>
          <p className="step-desc">내가 만든 사이트 — 임시 URL 로 바로 확인하거나 관리자 페이지로 이동할 수 있습니다.</p>
        </div>
        <Link to="/builder" className="btn primary">+ 새 사이트 만들기</Link>
      </header>

      {sites.length === 0 ? (
        <div className="mysites-empty card">
          <h3>아직 만든 사이트가 없어요</h3>
          <p>빌더에서 첫 사이트를 만들어 보세요. 생성하면 이 목록에 자동으로 쌓입니다.</p>
          <Link to="/builder" className="btn primary">빌더로 이동</Link>
        </div>
      ) : (
        <div className="mysites-list">
          {sites.map((s) => {
            const firstKey = s.pages?.[0]?.key;
            return (
              <article key={s.id} className="mysites-card card">
                <header className="mysites-card-head">
                  <div className="mysites-card-title">
                    <strong>{s.name || '(이름 없음)'}</strong>
                    <code>/sites/{s.slug}</code>
                  </div>
                  <div className="mysites-card-meta">
                    <span className="badge">{typeLabel(s.type)}</span>
                    <span className={statusBadgeClass(s.status)}>{statusLabel(s.status)}</span>
                    {s.adminRequired && <span className="badge brand">관리자 포함</span>}
                    <span className="mysites-date">{formatDate(s.createdAt)}</span>
                  </div>
                </header>

                {/* 이 사이트를 구성하는 실제 페이지들 — 각각 독립 URL 로 연결. */}
                {s.pages && s.pages.length > 0 && (
                  <div className="mysites-pages">
                    <span className="mysites-pages-label">페이지 {s.pages.length}개</span>
                    <ul>
                      {s.pages.map((p) => {
                        const href = p.key === firstKey ? `/sites/${s.slug}` : `/sites/${s.slug}/${p.key}`;
                        return (
                          <li key={p.key}>
                            <Link to={href} className="mysites-page-pill">
                              <span>{p.label}</span>
                              <code>{href}</code>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <footer className="mysites-card-actions">
                  <Link to={`/sites/${s.slug}`} className="btn primary">사이트 확인하기 ↗</Link>
                  {s.adminRequired && (
                    <Link to={`/admin/sites/${s.id}`} className="btn ghost">관리자</Link>
                  )}
                  <button type="button" className="btn subtle" onClick={() => onRemove(s.id)}>
                    목록에서 삭제
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
