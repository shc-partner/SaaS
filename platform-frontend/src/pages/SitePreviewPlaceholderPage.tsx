import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CompanySiteRenderer, type SiteData } from '@app/site-renderer';
import { fetchSiteBySlug } from '../api/sites';

// 공개 런타임 — 생성된 사이트를 실제 멀티페이지로 서빙.
//   /sites/:slug           → 홈
//   /sites/:slug/:pageKey  → about / services / contact 등 개별 페이지
//
// 선택되지 않은 페이지 키가 URL 에 들어오면 해당 사이트 안에서 404 페이지를 보여준다.
// 헤더의 nav 는 CompanySiteRenderer 가 <a href> 로 렌더하므로 새 탭/중버튼/북마크가 정상 동작한다.
// 좌클릭은 onNavigate 가 가로채 SPA 전환.
export default function SitePreviewPlaceholderPage() {
  const { slug, pageKey } = useParams<{ slug: string; pageKey?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    fetchSiteBySlug(slug)
      .then((d) => { if (alive) setData(d); })
      .catch((e: Error) => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, [slug]);

  if (error) {
    return (
      <div className="placeholder-page">
        <span className="badge danger" style={{ marginBottom: 12 }}>오류</span>
        <h1>사이트를 불러올 수 없습니다</h1>
        <p className="placeholder-meta">slug: <code>{slug}</code></p>
        <p className="placeholder-desc">{error}</p>
        <Link to="/builder" className="btn ghost">빌더로 돌아가기</Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="placeholder-page">
        <p className="placeholder-desc">불러오는 중…</p>
      </div>
    );
  }

  const firstKey = data.pages[0]?.key ?? 'home';
  const activeKey = pageKey ?? firstKey;
  const exists = data.pages.some((p) => p.key === activeKey);

  const pageToHref = (key: string): string =>
    key === firstKey ? `/sites/${slug}` : `/sites/${slug}/${key}`;

  // 사이트 안 404 — 선택되지 않은 페이지로 들어온 경우.
  if (!exists) {
    return (
      <div className="public-runtime">
        <CompanySiteRenderer
          data={data}
          currentPageKey={firstKey}
          onNavigate={(k) => navigate(pageToHref(k))}
          getPageHref={pageToHref}
        />
        <div className="placeholder-page" style={{ marginTop: 0 }}>
          <span className="badge warning" style={{ marginBottom: 12 }}>페이지 없음</span>
          <h1>요청하신 페이지가 없습니다</h1>
          <p className="placeholder-meta">/{slug}/<code>{activeKey}</code> 는 이 사이트에 포함되어 있지 않습니다.</p>
          <Link to={pageToHref(firstKey)} className="btn primary">홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-runtime">
      <CompanySiteRenderer
        data={data}
        currentPageKey={activeKey}
        onNavigate={(k) => {
          navigate(pageToHref(k));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        getPageHref={pageToHref}
      />
    </div>
  );
}
