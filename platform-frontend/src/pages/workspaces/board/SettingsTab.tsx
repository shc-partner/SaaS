// 설정 탭 — 워크스페이스 설정을 읽기 전용으로 표시.

import type { ReactNode } from 'react';
import type { MyWorkspace } from '../../../features/workspaces/types';
import {
  TEMPLATE_OPTIONS,
  PRESET_OPTIONS,
  CHANNEL_OPTIONS,
  ITEM_OPTIONS,
  PURPOSE_OPTIONS,
} from '../../../features/workspaces/constants';

export default function SettingsTab({ workspace }: { workspace: MyWorkspace }) {
  const template = TEMPLATE_OPTIONS.find((t) => t.id === workspace.templateKey);
  const preset   = PRESET_OPTIONS.find((p)   => p.id === workspace.preset);
  const purpose  = PURPOSE_OPTIONS.find((p)  => p.id === workspace.purpose);

  return (
    <div className="ws-settings">
      <h3>워크스페이스 설정</h3>
      <div className="ws-settings-group">
        <SettingRow label="이름">{workspace.name}</SettingRow>
        <SettingRow label="목적">{purpose?.label ?? workspace.purpose}</SettingRow>
        <SettingRow label="템플릿">{template?.label ?? workspace.templateKey}</SettingRow>
        <SettingRow label="제작 흐름">
          {preset ? `${preset.label} — ${preset.desc}` : workspace.preset}
        </SettingRow>
        <SettingRow label="채널">
          <div className="ws-card-meta" style={{ marginTop: 2 }}>
            {workspace.channels.map((ch) => {
              const found = CHANNEL_OPTIONS.find((c) => c.id === ch);
              return (
                <span key={ch} className="ws-badge ws-badge--channel">
                  {found?.label ?? ch}
                </span>
              );
            })}
          </div>
        </SettingRow>
        <SettingRow label="관리 항목">
          <div className="ws-card-meta" style={{ marginTop: 2 }}>
            {workspace.items.map((item) => {
              const found = ITEM_OPTIONS.find((o) => o.id === item);
              return (
                <span key={item} className="ws-badge">
                  {found?.label ?? item}
                </span>
              );
            })}
          </div>
        </SettingRow>
        <SettingRow label="생성일">{workspace.createdAt.slice(0, 10)}</SettingRow>
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ws-settings-row">
      <span className="ws-settings-label">{label}</span>
      <span className="ws-settings-value">{children}</span>
    </div>
  );
}
