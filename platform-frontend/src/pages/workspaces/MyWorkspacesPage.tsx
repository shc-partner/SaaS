import { Link } from 'react-router-dom';
import useMyWorkspaces from '../../features/workspaces/useMyWorkspaces';
import { TEMPLATE_OPTIONS, PRESET_OPTIONS } from '../../features/workspaces/constants';
import { type MyWorkspace } from '../../features/workspaces/types';

// /workspaces — 내 워크스페이스 목록.
// 로컬 스토리지에서 읽어 표시 (API 미구현 단계).

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function templateLabel(key: MyWorkspace['templateKey']): string {
  return TEMPLATE_OPTIONS.find((t) => t.id === key)?.label ?? key;
}

function presetLabel(preset: MyWorkspace['preset']): string {
  return PRESET_OPTIONS.find((p) => p.id === preset)?.label ?? preset;
}

function statusBadgeClass(status: MyWorkspace['status']): string {
  switch (status) {
    case 'active':   return 'badge success';
    case 'paused':   return 'badge warning';
    case 'archived': return 'badge';
    default:         return 'badge';
  }
}

function statusLabel(status: MyWorkspace['status']): string {
  switch (status) {
    case 'active':   return '활성';
    case 'paused':   return '일시정지';
    case 'archived': return '보관';
    default:         return status;
  }
}

export default function MyWorkspacesPage() {
  const { workspaces } = useMyWorkspaces();

  return (
    <div className="myworkspaces">
      <header className="myworkspaces-head">
        <div>
          <h1>내 워크스페이스</h1>
          <p className="step-desc">내가 만든 워크스페이스 목록입니다.</p>
        </div>
        <Link to="/workspaces/new" className="btn primary">+ 새 워크스페이스</Link>
      </header>

      {workspaces.length === 0 ? (
        <div className="card" style={{ padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <h3 style={{ margin: 0 }}>아직 만든 워크스페이스가 없어요</h3>
          <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 14 }}>
            새 워크스페이스를 만들어 콘텐츠 제작 흐름을 관리해 보세요.
          </p>
          <Link to="/workspaces/new" className="btn primary">워크스페이스 만들기</Link>
        </div>
      ) : (
        <div className="myworkspaces-grid">
          {workspaces.map((ws) => (
            <article key={ws.id} className="myworkspaces-card card">
              <div className="myworkspaces-card-head">
                <div className="myworkspaces-card-name">{ws.name || '(이름 없음)'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{templateLabel(ws.templateKey)}</div>
              </div>

              <div className="myworkspaces-card-meta">
                {ws.channels.map((ch) => (
                  <span key={ch} className="badge">{ch}</span>
                ))}
                <span className="badge ghost">{presetLabel(ws.preset)}</span>
                <span className={statusBadgeClass(ws.status)}>{statusLabel(ws.status)}</span>
              </div>

              <div className="myworkspaces-card-date">{formatDate(ws.createdAt)} 생성</div>

              <div className="myworkspaces-card-actions">
                <Link to={`/workspaces/${ws.id}`} className="btn primary">열기</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
