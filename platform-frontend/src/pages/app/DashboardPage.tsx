import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import useMyWorkspaces from '../../features/workspaces/useMyWorkspaces';
import { TEMPLATE_OPTIONS } from '../../features/workspaces/constants';
import { type MyWorkspace } from '../../features/workspaces/types';

// /dashboard — 가입 후 기본 진입점.
// 워크스페이스 목록은 localStorage 에서 읽어오므로 본인 것만 보인다.
export default function DashboardPage() {
  const { user } = useAuth();
  const { workspaces } = useMyWorkspaces();

  const activeCount = workspaces.filter((w) => w.status === 'active').length;
  const contentCount = workspaces.reduce((acc, w) => acc + w.items.length, 0);
  const greeting = user?.name ? `${user.name} 님, 환영합니다` : '환영합니다';

  return (
    <div className="dashboard">
      <header className="dashboard-head">
        <div>
          <h1>{greeting}</h1>
          <p>오늘도 크리에이터 워크스페이스를 운영해 보세요.</p>
        </div>
        <Link to="/workspaces/new" className="btn primary">+ 새 워크스페이스 만들기</Link>
      </header>

      <section className="dashboard-stats">
        <StatCard label="내 워크스페이스" value={String(workspaces.length)} hint="생성된 워크스페이스 총 개수" />
        <StatCard label="활성"            value={String(activeCount)}        hint="현재 활성 상태인 워크스페이스" />
        <StatCard label="관리 항목"       value={String(contentCount)}       hint="설정된 관리 항목 수" />
        <StatCard label="플랜"            value="Free"                       hint="업그레이드 가능" />
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h3>최근 워크스페이스</h3>
          {workspaces.length === 0 ? (
            <div className="dashboard-empty">
              <h4>아직 만든 워크스페이스가 없어요</h4>
              <p>워크스페이스를 만들면 이곳에 자동으로 나타납니다.</p>
              <Link to="/workspaces/new" className="btn primary">지금 시작하기</Link>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workspaces.slice(0, 4).map((ws) => (
                <WorkspaceRow key={ws.id} workspace={ws} />
              ))}
              <li style={{ textAlign: 'right', marginTop: 4 }}>
                <Link to="/workspaces" className="link">전체 보기 →</Link>
              </li>
            </ul>
          )}
        </article>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dashboard-card">
            <h3>최근 안내</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
              <li>✓ 워크스페이스 생성 마법사(6단계)가 준비되었습니다.</li>
              <li>✓ 유튜버·라이브 스트리밍·숏폼 등 목적별 템플릿이 적용됩니다.</li>
              <li>• 보드·캘린더·컨텐츠 기능이 다음 스테이지에서 연결됩니다.</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>계정 · 플랜</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 10px' }}>
              현재 <strong>Free</strong> 플랜입니다. 워크스페이스를 여러 개 운영하거나 팀 협업이 필요하면 Pro 로 업그레이드하세요.
            </p>
            <Link to="/pricing" className="btn ghost btn-block">요금제 보기</Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

// 워크스페이스 행 컴포넌트
function WorkspaceRow({ workspace }: { workspace: MyWorkspace }) {
  const tmpl = TEMPLATE_OPTIONS.find((t) => t.id === workspace.templateKey);

  return (
    <li style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', border: '1px solid var(--border-1)', borderRadius: 'var(--radius-md)',
    }}>
      <div>
        <strong style={{ display: 'block', fontSize: 14 }}>{workspace.name || '(이름 없음)'}</strong>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{tmpl?.label ?? workspace.templateKey}</span>
      </div>
      <Link to={`/workspaces/${workspace.id}`} className="btn subtle">열기</Link>
    </li>
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
