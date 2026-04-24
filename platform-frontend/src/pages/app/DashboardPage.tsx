import { Link } from 'react-router-dom';
import { loadMySites } from '../../features/mySites/storage';

// /dashboard — 가입 후 기본 진입점.
// 실제 통계 API 가 아직 없으므로 지표는 localStorage 의 내 사이트 수에서 derive.
// 핵심 기능: 인사말 + 상단 지표 + 내 사이트 요약 + 최근 작업/안내 + 플랜 teaser.
function currentUser(): { name?: string; email?: string } {
  try {
    const raw = window.localStorage.getItem('siteforge.auth');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function DashboardPage() {
  const user = currentUser();
  const sites = loadMySites();
  const published = sites.filter((s) => s.status === 'published').length;
  const greeting = user.name ? `${user.name} 님, 환영합니다` : '환영합니다';

  return (
    <div className="dashboard">
      <header className="dashboard-head">
        <div>
          <h1>{greeting}</h1>
          <p>오늘도 SiteForge 에서 사이트를 운영해 보세요.</p>
        </div>
        <Link to="/builder" className="btn primary">+ 새 사이트 만들기</Link>
      </header>

      <section className="dashboard-stats">
        <StatCard label="내 사이트" value={String(sites.length)} hint="생성된 사이트 총 개수" />
        <StatCard label="공개 중"   value={String(published)}    hint="임시 URL 로 접근 가능" />
        <StatCard label="관리자"    value={String(sites.filter((s) => s.adminRequired).length)} hint="관리자 페이지 포함 사이트" />
        <StatCard label="플랜"      value="Free" hint="업그레이드 가능" />
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h3>내 사이트 요약</h3>
          {sites.length === 0 ? (
            <div className="dashboard-empty">
              <h4>아직 만든 사이트가 없어요</h4>
              <p>빌더에서 첫 사이트를 만들면 이곳에 자동으로 나타납니다.</p>
              <Link to="/builder" className="btn primary">지금 시작하기</Link>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sites.slice(0, 4).map((s) => (
                <li key={s.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 'var(--radius-md)',
                }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14 }}>{s.name || '(이름 없음)'}</strong>
                    <code style={{ fontSize: 11, color: 'var(--text-3)', background: 'transparent', padding: 0 }}>/sites/{s.slug}</code>
                  </div>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <Link to={`/sites/${s.slug}`} className="btn subtle">열기</Link>
                    {s.adminRequired && <Link to={`/admin/sites/${s.id}`} className="btn subtle">관리자</Link>}
                  </div>
                </li>
              ))}
              <li style={{ textAlign: 'right', marginTop: 4 }}>
                <Link to="/sites" className="link">전체 보기 →</Link>
              </li>
            </ul>
          )}
        </article>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dashboard-card">
            <h3>최근 안내</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
              <li>✓ 빌더 7단계 flow 가 공개되었습니다.</li>
              <li>✓ 페이지별 라우팅이 적용되어 멀티페이지로 생성됩니다.</li>
              <li>• 관리자 편집기는 다음 스테이지에서 연결됩니다.</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>계정 · 플랜</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 10px' }}>
              현재 <strong>Free</strong> 플랜입니다. 사이트를 여러 개 만들거나 커스텀 도메인이 필요하면 Pro 로 업그레이드하세요.
            </p>
            <Link to="/pricing" className="btn ghost btn-block">요금제 보기</Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="stat-card">
      <span className="label">{label}</span>
      <div className="value">{value}</div>
      <div className="hint">{hint}</div>
    </div>
  );
}
