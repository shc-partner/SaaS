import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

// 헤더 우측 사용자 메뉴.
// 로그인 상태: 아바타 + 이름 클릭 → 드롭다운(대시보드/내 사이트/로그아웃).
// 비로그인 상태: 부모가 렌더하지 않음.
export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!user) return null;
  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="user-menu" ref={wrapRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar">{initial}</span>
        <span className="user-name">{user.name}</span>
      </button>
      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-meta">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <Link to="/dashboard" className="user-menu-item" onClick={() => setOpen(false)}>대시보드</Link>
          <Link to="/sites"     className="user-menu-item" onClick={() => setOpen(false)}>내 사이트</Link>
          <Link to="/builder"   className="user-menu-item" onClick={() => setOpen(false)}>빌더</Link>
          <div className="user-menu-sep" />
          <button
            type="button"
            className="user-menu-item user-menu-danger"
            onClick={async () => {
              setOpen(false);
              await logout();
              navigate('/');
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
