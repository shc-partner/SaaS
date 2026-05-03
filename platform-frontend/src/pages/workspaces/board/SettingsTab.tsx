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
  const template = TEMPLATE_OPTIONS.find((option) => option.id === workspace.templateKey);
  const preset = PRESET_OPTIONS.find((option) => option.id === workspace.preset);
  const purpose = PURPOSE_OPTIONS.find((option) => option.id === workspace.purpose);

  return (
    <div className="ws-settings">
      <div className="ws-tab-section-head">
        <h3 className="ws-tab-title">워크스페이스 설정</h3>
        <button type="button" className="btn ghost">
          설정 변경
        </button>
      </div>

      <div className="ws-settings-group">
        <SettingRow label="이름">{workspace.name}</SettingRow>
        {workspace.description && (
          <SettingRow label="설명">{workspace.description}</SettingRow>
        )}
        <SettingRow label="목적">{purpose?.label ?? workspace.purpose}</SettingRow>
        <SettingRow label="템플릿">{template?.label ?? workspace.templateKey}</SettingRow>
        <SettingRow label="제작 흐름">
          {preset ? `${preset.label} - ${preset.desc}` : workspace.preset}
        </SettingRow>
        <SettingRow label="채널">
          <div className="ws-card-meta" style={{ marginTop: 2 }}>
            {workspace.channels.map((channel) => {
              const found = CHANNEL_OPTIONS.find((option) => option.id === channel);
              if (!found) return null;
              return (
                <span key={channel} className="ws-badge ws-badge--channel">
                  {found.label}
                </span>
              );
            })}
          </div>
        </SettingRow>
        <SettingRow label="관리 항목">
          <div className="ws-card-meta" style={{ marginTop: 2 }}>
            {workspace.items.map((item) => {
              const found = ITEM_OPTIONS.find((option) => option.id === item);
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
