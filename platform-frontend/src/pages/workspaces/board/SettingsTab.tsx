import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addWorkspaceMember,
  deleteWorkspace,
  fetchWorkspaceMembers,
  removeWorkspaceMember,
  updateWorkspace,
  updateWorkspaceMemberRole,
} from '../../../api/workspaces';
import { useAuth } from '../../../features/auth/AuthProvider';
import type {
  ContentFormat,
  ManagementItem,
  MyWorkspace,
  ProductionPreset,
  WorkspaceMember,
  WorkspaceMemberRole,
  WorkspaceChannel,
  WorkspacePurpose,
  WorkspaceTemplateKey,
} from '../../../features/workspaces/types';
import {
  TEMPLATE_OPTIONS,
  PRESET_OPTIONS,
  CHANNEL_OPTIONS,
  FORMAT_OPTIONS,
  ITEM_OPTIONS,
  MANAGEMENT_ITEM_GROUPS,
  FORMAT_MANAGEMENT_ITEM_GROUPS,
  PURPOSE_OPTIONS,
  REQUIRED_MANAGEMENT_ITEMS,
  STREAMING_MANAGEMENT_ITEMS,
} from '../../../features/workspaces/constants';

export default function SettingsTab({
  workspace,
  onWorkspaceUpdated,
}: {
  workspace: MyWorkspace;
  onWorkspaceUpdated?: (workspace: MyWorkspace) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState(workspace);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<WorkspaceMember[]>(workspace.members ?? []);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberSaving, setMemberSaving] = useState(false);
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description ?? '');
  const [purpose, setPurpose] = useState<WorkspacePurpose>(workspace.purpose);
  const [format, setFormat] = useState<ContentFormat>(workspace.format);
  const [templateKey, setTemplateKey] = useState<WorkspaceTemplateKey>(workspace.templateKey);
  const [preset, setPreset] = useState<ProductionPreset>(workspace.preset);
  const [channels, setChannels] = useState<WorkspaceChannel[]>(workspace.channels);
  const [items, setItems] = useState<ManagementItem[]>(workspace.items);

  const currentTemplate = TEMPLATE_OPTIONS.find((option) => option.id === current.templateKey);
  const currentPreset = PRESET_OPTIONS.find((option) => option.id === current.preset);
  const currentPurpose = PURPOSE_OPTIONS.find((option) => option.id === current.purpose);
  const currentFormat = FORMAT_OPTIONS.find((option) => option.id === current.format);
  const currentMember = members.find((member) => member.userId === user?.id);
  const canManageMembers = current.ownerUserId === user?.id || currentMember?.role === 'admin';
  const itemGroups = buildSettingsItemGroups(purpose, format);

  useEffect(() => {
    let alive = true;
    fetchWorkspaceMembers(current.id)
      .then((items) => {
        if (alive) setMembers(items);
      })
      .catch(() => {
        if (alive) setMembers(current.members ?? []);
      });
    return () => {
      alive = false;
    };
  }, [current.id, current.members]);

  function resetForm(next = current) {
    setName(next.name);
    setDescription(next.description ?? '');
    setPurpose(next.purpose);
    setFormat(next.format);
    setTemplateKey(next.templateKey);
    setPreset(next.preset);
    setChannels(next.channels);
    setItems(next.items);
  }

  function cancelEdit() {
    resetForm();
    setEditing(false);
  }

  function toggleChannel(channel: WorkspaceChannel) {
    setChannels((prev) => (
      prev.includes(channel)
        ? prev.filter((item) => item !== channel)
        : [...prev, channel]
    ));
  }

  function toggleItem(item: ManagementItem) {
    if (REQUIRED_MANAGEMENT_ITEMS.includes(item)) return;

    setItems((prev) => (
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item]
    ));
  }

  async function saveSettings() {
    if (!name.trim()) {
      window.alert('워크스페이스 이름을 입력해 주세요.');
      return;
    }
    if (channels.length < 1) {
      window.alert('채널을 하나 이상 선택해 주세요.');
      return;
    }
    const nextItems = Array.from(new Set([...REQUIRED_MANAGEMENT_ITEMS, ...items]));
    if (!REQUIRED_MANAGEMENT_ITEMS.every((item) => nextItems.includes(item))) {
      window.alert('관리 항목을 하나 이상 선택해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateWorkspace(current.id, {
        name: name.trim(),
        description: description.trim(),
        purpose,
        channels,
        format,
        templateKey,
        preset,
        items: nextItems,
      });
      setCurrent(updated);
      onWorkspaceUpdated?.(updated);
      setMembers(updated.members ?? members);
      resetForm(updated);
      setEditing(false);
      window.alert('설정이 저장되었습니다.');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '설정을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteWorkspace() {
    const confirmed = window.confirm(
      `"${current.name}" 워크스페이스를 삭제할까요?\n등록된 컨텐츠, 아이디어, 캘린더 데이터가 함께 삭제됩니다.`,
    );
    if (!confirmed) return;

    await deleteWorkspace(current.id);
    window.alert('워크스페이스가 삭제되었습니다.');
    navigate('/workspaces', { replace: true });
  }

  async function handleAddMember() {
    const email = memberEmail.trim();
    if (!email) {
      window.alert('초대할 팀원의 이메일을 입력해 주세요.');
      return;
    }

    setMemberSaving(true);
    try {
      const nextMembers = await addWorkspaceMember(current.id, email);
      setMembers(nextMembers);
      setMemberEmail('');
      window.alert('팀원이 추가되었습니다.');
    } finally {
      setMemberSaving(false);
    }
  }

  async function handleRoleChange(member: WorkspaceMember, role: WorkspaceMemberRole) {
    if (member.role === role) return;
    setMemberSaving(true);
    try {
      const nextMembers = await updateWorkspaceMemberRole(current.id, member.userId, role);
      setMembers(nextMembers);
    } finally {
      setMemberSaving(false);
    }
  }

  async function handleRemoveMember(member: WorkspaceMember) {
    if (!window.confirm(`${member.name || member.email} 팀원을 제거할까요?`)) return;

    setMemberSaving(true);
    try {
      const nextMembers = await removeWorkspaceMember(current.id, member.userId);
      setMembers(nextMembers);
    } finally {
      setMemberSaving(false);
    }
  }

  return (
    <div className="ws-settings">
      <div className="ws-tab-section-head">
        <h3 className="ws-tab-title">워크스페이스 설정</h3>
        {editing ? (
          <div className="ws-settings-actions">
            <button type="button" className="btn ghost" onClick={cancelEdit} disabled={saving}>
              취소
            </button>
            <button type="button" className="btn primary" onClick={saveSettings} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        ) : (
          <button type="button" className="btn ghost" onClick={() => setEditing(true)}>
            설정 변경
          </button>
        )}
      </div>

      <div className="ws-settings-group">
        {editing ? (
          <>
            <EditField label="이름">
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
            </EditField>
            <EditField label="설명">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                maxLength={180}
              />
            </EditField>
            <EditField label="목적">
              <select value={purpose} onChange={(event) => setPurpose(event.target.value as WorkspacePurpose)}>
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </EditField>
            <EditField label="컨텐츠 형식">
              <select value={format} onChange={(event) => setFormat(event.target.value as ContentFormat)}>
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </EditField>
            <EditField label="템플릿">
              <select value={templateKey} onChange={(event) => setTemplateKey(event.target.value as WorkspaceTemplateKey)}>
                {TEMPLATE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </EditField>
            <EditField label="제작 흐름">
              <select value={preset} onChange={(event) => setPreset(event.target.value as ProductionPreset)}>
                {PRESET_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </EditField>
            <EditField label="채널">
              <div className="ws-settings-choice-grid">
                {CHANNEL_OPTIONS.map((option) => (
                  <label key={option.id} className="ws-settings-check">
                    <input
                      type="checkbox"
                      checked={channels.includes(option.id)}
                      onChange={() => toggleChannel(option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </EditField>
            <EditField label="관리 항목">
              <div className="ws-settings-item-groups">
                {itemGroups.map((group) => (
                  <section key={group.id} className="ws-settings-item-group">
                    <h4>{group.title}</h4>
                    <div className="ws-settings-choice-grid wide">
                      {group.items.map((option) => {
                        const isRequired = REQUIRED_MANAGEMENT_ITEMS.includes(option.id);

                  return (
                    <label key={option.id} className="ws-settings-check">
                      <input
                        type="checkbox"
                        checked={isRequired || items.includes(option.id)}
                        disabled={isRequired}
                        onChange={() => toggleItem(option.id)}
                      />
                      <span>{option.label}</span>
                      {isRequired && <em>필수</em>}
                    </label>
                  );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </EditField>
            <div className="ws-settings-edit-row">
              <div className="ws-settings-edit-field">
                <span></span>
                <div className="ws-settings-delete-content">
                  <button type="button" className="ws-contents-delete-btn" onClick={handleDeleteWorkspace}>
                    워크스페이스 삭제
                  </button>
                  <p>삭제하면 이 워크스페이스의 컨텐츠, 아이디어, 설정이 함께 삭제됩니다.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SettingRow label="이름">{current.name}</SettingRow>
            {current.description && (
              <SettingRow label="설명">{current.description}</SettingRow>
            )}
            <SettingRow label="목적">{currentPurpose?.label ?? current.purpose}</SettingRow>
            <SettingRow label="컨텐츠 형식">{currentFormat?.label ?? current.format}</SettingRow>
            <SettingRow label="템플릿">{currentTemplate?.label ?? current.templateKey}</SettingRow>
            <SettingRow label="제작 흐름">
              {currentPreset ? `${currentPreset.label} - ${currentPreset.desc}` : current.preset}
            </SettingRow>
            <SettingRow label="채널">
              <div className="ws-card-meta" style={{ marginTop: 2 }}>
                {current.channels.map((channel) => {
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
                {current.items.map((item) => {
                  const found = ITEM_OPTIONS.find((option) => option.id === item);
                  return (
                    <span key={item} className="ws-badge">
                      {found?.label ?? item}
                    </span>
                  );
                })}
              </div>
            </SettingRow>
            <SettingRow label="생성일">{current.createdAt.slice(0, 10)}</SettingRow>
          </>
        )}
      </div>

      <TeamMembersSection
        members={members}
        ownerUserId={current.ownerUserId ?? null}
        canManage={canManageMembers}
        memberEmail={memberEmail}
        memberSaving={memberSaving}
        onEmailChange={setMemberEmail}
        onAddMember={handleAddMember}
        onRoleChange={handleRoleChange}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
}

function buildSettingsItemGroups(purpose: WorkspacePurpose, format: ContentFormat) {
  const seen = new Set<ManagementItem>();
  const formatGroup = FORMAT_MANAGEMENT_ITEM_GROUPS[format];
  const groups = [
    ...MANAGEMENT_ITEM_GROUPS,
    ...(formatGroup ? [{ id: `format-${format}`, title: formatGroup.title, items: formatGroup.items }] : []),
    ...(purpose === 'streamer'
      ? [{ id: 'streaming', title: '스트리밍 추천 항목', items: STREAMING_MANAGEMENT_ITEMS }]
      : []),
  ];

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

function roleLabel(role: WorkspaceMemberRole): string {
  return role === 'admin' ? '관리자' : '일반';
}

function TeamMembersSection({
  members,
  ownerUserId,
  canManage,
  memberEmail,
  memberSaving,
  onEmailChange,
  onAddMember,
  onRoleChange,
  onRemoveMember,
}: {
  members: WorkspaceMember[];
  ownerUserId: number | null;
  canManage: boolean;
  memberEmail: string;
  memberSaving: boolean;
  onEmailChange: (value: string) => void;
  onAddMember: () => void;
  onRoleChange: (member: WorkspaceMember, role: WorkspaceMemberRole) => void;
  onRemoveMember: (member: WorkspaceMember) => void;
}) {
  return (
    <div className="ws-settings-group ws-members-settings">
      <div className="ws-settings-member-head">
        <div>
          <h4>팀원 권한 관리</h4>
          <p>워크스페이스 생성자는 관리자로 유지되며, 추가된 팀원은 기본 일반 권한으로 등록됩니다.</p>
        </div>
      </div>

      {canManage && (
        <div className="ws-settings-member-invite">
          <input
            type="email"
            value={memberEmail}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="가입된 팀원 이메일"
            disabled={memberSaving}
          />
          <button type="button" className="btn primary" onClick={onAddMember} disabled={memberSaving}>
            팀원 추가
          </button>
        </div>
      )}

      <div className="ws-settings-member-list">
        {members.map((member) => {
          const isOwner = ownerUserId === member.userId;
          return (
            <div key={member.userId} className="ws-settings-member-row">
              <div>
                <strong>{member.name || member.email}</strong>
                <span>{member.email}</span>
              </div>
              <div className="ws-settings-member-actions">
                {canManage && !isOwner ? (
                  <select
                    value={member.role}
                    onChange={(event) => onRoleChange(member, event.target.value as WorkspaceMemberRole)}
                    disabled={memberSaving}
                  >
                    <option value="member">일반</option>
                    <option value="admin">관리자</option>
                  </select>
                ) : (
                  <span className="ws-badge">{isOwner ? '관리자 · 생성자' : roleLabel(member.role)}</span>
                )}
                {canManage && !isOwner && (
                  <button
                    type="button"
                    className="ws-contents-delete-btn"
                    onClick={() => onRemoveMember(member)}
                    disabled={memberSaving}
                  >
                    제거
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ws-settings-edit-row">
      <div className="ws-settings-edit-field">
        <span>{label}</span>
        {children}
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
