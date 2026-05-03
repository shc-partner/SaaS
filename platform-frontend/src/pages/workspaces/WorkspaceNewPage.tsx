import { type ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import { upsertMyWorkspace } from '../../features/workspaces/storage';
import {
  BASE_MANAGEMENT_ITEMS,
  CHANNEL_OPTIONS,
  FORMAT_MANAGEMENT_ITEM_GROUPS,
  FORMAT_OPTIONS,
  MANAGEMENT_ITEM_GROUPS,
  PRESET_OPTIONS,
  PRESET_RECOMMENDED_ITEMS,
  PURPOSE_OPTIONS,
  STEP_LABELS,
} from '../../features/workspaces/constants';
import {
  type ContentFormat,
  type ManagementItem,
  type MyWorkspace,
  type ProductionPreset,
  type WorkspaceChannel,
  type WorkspaceCreationState,
  type WorkspacePurpose,
  type WorkspaceStatus,
  type WorkspaceTemplateKey,
} from '../../features/workspaces/types';

const TOTAL_STEPS = 3;

const INITIAL_STATE: WorkspaceCreationState = {
  step: 1,
  name: '',
  description: '',
  purpose: null,
  channels: [],
  format: null,
  preset: null,
  items: BASE_MANAGEMENT_ITEMS,
};

function uniqItems(items: ManagementItem[]): ManagementItem[] {
  return Array.from(new Set(items));
}

function getRecommendedItems(
  preset: ProductionPreset | null,
  format: ContentFormat | null,
): ManagementItem[] {
  const presetItems = preset ? PRESET_RECOMMENDED_ITEMS[preset] : BASE_MANAGEMENT_ITEMS;
  const formatItems = format
    ? FORMAT_MANAGEMENT_ITEM_GROUPS[format]?.items.map((item) => item.id) ?? []
    : [];

  return uniqItems([...presetItems, ...formatItems]);
}

function getTemplateKey(preset: ProductionPreset): WorkspaceTemplateKey {
  if (preset === 'simple') return 'creator-simple';
  if (preset === 'team') return 'creator-team';
  return 'creator-standard';
}

function getWorkspaceName(state: WorkspaceCreationState): string {
  const channel = CHANNEL_OPTIONS.find((option) => option.id === state.channels[0])?.label;
  const format = FORMAT_OPTIONS.find((option) => option.id === state.format)?.label;

  if (channel && format) return `${channel} ${format} 워크스페이스`;
  if (channel) return `${channel} 콘텐츠 워크스페이스`;
  return 'CreatorDesk 워크스페이스';
}

export default function WorkspaceNewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<WorkspaceCreationState>(INITIAL_STATE);

  const recommendedItems = useMemo(
    () => getRecommendedItems(state.preset, state.format),
    [state.preset, state.format],
  );

  function canProceed(): boolean {
    switch (state.step) {
      case 1:
        return state.purpose !== null && state.channels.length > 0 && state.format !== null;
      case 2:
        return state.preset !== null && state.name.trim().length > 0;
      case 3:
        return uniqItems([...BASE_MANAGEMENT_ITEMS, ...state.items]).length > 0;
      default:
        return false;
    }
  }

  function handleNext() {
    if (!canProceed()) return;

    if (state.step === 2) {
      setState((prev) => ({
        ...prev,
        step: 3,
        items: getRecommendedItems(prev.preset, prev.format),
      }));
      return;
    }

    if (state.step < TOTAL_STEPS) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    } else {
      handleSubmit();
    }
  }

  function handlePrev() {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  }

  function handleSubmit() {
    if (!state.purpose || !state.format || !state.preset) return;

    const workspace: MyWorkspace = {
      id: crypto.randomUUID(),
      name: state.name.trim(),
      description: state.description.trim(),
      purpose: state.purpose,
      channels: state.channels,
      format: state.format,
      templateKey: getTemplateKey(state.preset),
      preset: state.preset,
      items: uniqItems([...BASE_MANAGEMENT_ITEMS, ...state.items]),
      createdAt: new Date().toISOString(),
      status: 'active' as WorkspaceStatus,
    };

    upsertMyWorkspace(user?.id ?? null, workspace);
    navigate(`/workspaces/${workspace.id}`);
  }

  return (
    <div className="workspace-new">
      <div className="workspace-new-progress">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const cls =
            stepNum < state.step
              ? 'workspace-new-progress-step done'
              : stepNum === state.step
                ? 'workspace-new-progress-step active'
                : 'workspace-new-progress-step';
          return <div key={label} className={cls} title={label} />;
        })}
      </div>
      <div className="workspace-new-step-text">
        {state.step}단계 / {TOTAL_STEPS}단계 · {STEP_LABELS[state.step - 1]}
      </div>

      {state.step === 1 && (
        <StepTarget
          purpose={state.purpose}
          channels={state.channels}
          format={state.format}
          onPurposeChange={(purpose) => setState((prev) => ({ ...prev, purpose }))}
          onChannelsChange={(channels) => setState((prev) => ({ ...prev, channels }))}
          onFormatChange={(format) => {
            setState((prev) => ({
              ...prev,
              format,
              items: prev.step >= 3 ? getRecommendedItems(prev.preset, format) : prev.items,
            }));
          }}
        />
      )}
      {state.step === 2 && (
        <StepTemplate
          value={state.preset}
          name={state.name}
          description={state.description}
          onChange={(preset) => {
            setState((prev) => ({
              ...prev,
              preset,
              name: prev.name || getWorkspaceName({ ...prev, preset }),
              items: getRecommendedItems(preset, prev.format),
            }));
          }}
          onNameChange={(name) => setState((prev) => ({ ...prev, name }))}
          onDescriptionChange={(description) => setState((prev) => ({ ...prev, description }))}
        />
      )}
      {state.step === 3 && (
        <StepManagementItems
          value={state.items}
          recommendedItems={recommendedItems}
          format={state.format}
          onChange={(items) => setState((prev) => ({ ...prev, items }))}
        />
      )}

      <div className="workspace-new-footer">
        <button
          type="button"
          className="btn ghost"
          onClick={handlePrev}
          disabled={state.step === 1}
        >
          이전
        </button>
        <button
          type="button"
          className={`btn primary${!canProceed() ? ' disabled' : ''}`}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {state.step === TOTAL_STEPS ? '워크스페이스 만들기' : '다음'}
        </button>
      </div>
    </div>
  );
}

function StepTarget({
  purpose,
  channels,
  format,
  onPurposeChange,
  onChannelsChange,
  onFormatChange,
}: {
  purpose: WorkspacePurpose | null;
  channels: WorkspaceChannel[];
  format: ContentFormat | null;
  onPurposeChange: (value: WorkspacePurpose) => void;
  onChannelsChange: (value: WorkspaceChannel[]) => void;
  onFormatChange: (value: ContentFormat) => void;
}) {
  function toggleChannel(id: WorkspaceChannel) {
    if (channels.includes(id)) {
      onChannelsChange(channels.filter((channel) => channel !== id));
    } else {
      onChannelsChange([...channels, id]);
    }
  }

  return (
    <div className="workspace-new-flow">
      <WizardQuestion title="어떤 목적으로 운영하시나요?">
        <div className="ws-card-grid compact">
          {PURPOSE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`ws-card-option${purpose === option.id ? ' selected' : ''}`}
              onClick={() => onPurposeChange(option.id)}
            >
              <span className="ws-card-option-label">{option.label}</span>
              <span className="ws-card-option-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </WizardQuestion>

      <WizardQuestion title="어떤 채널에서 활동하시나요?">
        <div className="ws-pill-grid">
          {CHANNEL_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`ws-pill-option${channels.includes(option.id) ? ' selected' : ''}`}
              onClick={() => toggleChannel(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </WizardQuestion>

      <WizardQuestion title="주로 어떤 형식의 콘텐츠를 만드시나요?">
        <div className="ws-pill-grid">
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`ws-pill-option${format === option.id ? ' selected' : ''}`}
              onClick={() => onFormatChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </WizardQuestion>
    </div>
  );
}

function StepTemplate({
  value,
  name,
  description,
  onChange,
  onNameChange,
  onDescriptionChange,
}: {
  value: ProductionPreset | null;
  name: string;
  description: string;
  onChange: (value: ProductionPreset) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}) {
  return (
    <div className="workspace-new-step">
      <div className="workspace-new-header">
        <h2>템플릿 형식을 선택해 주세요.</h2>
        <p>나중에 추가하거나 제거할 수 있습니다.</p>
      </div>
      <div className="ws-workspace-form">
        <label className="ws-workspace-field">
          <span>워크스페이스 이름 *</span>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="예: 유튜브 게임방송 워크스페이스"
            maxLength={80}
          />
        </label>
        <label className="ws-workspace-field">
          <span>디스크립션</span>
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="이 워크스페이스에서 관리할 콘텐츠 방향을 간단히 적어주세요."
            maxLength={180}
            rows={3}
          />
        </label>
      </div>
      <div className="ws-preset-list">
        {PRESET_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`ws-preset-option${value === option.id ? ' selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <span className="ws-preset-option-label">{option.label}</span>
            <span className="ws-preset-option-desc">{option.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepManagementItems({
  value,
  recommendedItems,
  format,
  onChange,
}: {
  value: ManagementItem[];
  recommendedItems: ManagementItem[];
  format: ContentFormat | null;
  onChange: (value: ManagementItem[]) => void;
}) {
  const formatGroup = format ? FORMAT_MANAGEMENT_ITEM_GROUPS[format] : null;
  const [openGroups, setOpenGroups] = useState<string[]>([
    'base',
    'production',
    'collaboration',
    'revenue',
    formatGroup ? 'format' : '',
  ].filter(Boolean));
  const groups = formatGroup
    ? [...MANAGEMENT_ITEM_GROUPS, { id: 'format', title: formatGroup.title, items: formatGroup.items }]
    : MANAGEMENT_ITEM_GROUPS;

  function toggleGroup(groupId: string) {
    setOpenGroups((prev) => (
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    ));
  }

  function toggleItem(id: ManagementItem) {
    if (BASE_MANAGEMENT_ITEMS.includes(id)) return;

    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange(uniqItems([...value, id]));
    }
  }

  return (
    <div>
      <div className="workspace-new-header">
        <h2>어떤 항목을 관리할까요?</h2>
        <p>
          콘텐츠 카드에 표시하고 싶은 관리 항목을 선택해 주세요.
          선택한 항목은 나중에 추가하거나 제거할 수 있습니다.
        </p>
      </div>

      <div className="ws-checkbox-groups">
        {groups.map((group) => {
          const isOpen = openGroups.includes(group.id);

          return (
            <section key={group.id} className="ws-item-group">
              <button
                type="button"
                className="ws-item-group-head"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={isOpen}
              >
                <span>{group.title}</span>
                <span className="ws-item-group-toggle">{isOpen ? '접기' : '펼치기'}</span>
              </button>

              {isOpen && (
                <div className="ws-item-check-grid">
                  {group.items.map((item) => {
                    const isBase = BASE_MANAGEMENT_ITEMS.includes(item.id);
                    const checked = isBase || value.includes(item.id);
                    const recommended = recommendedItems.includes(item.id);

                    return (
                      <label
                        key={item.id}
                        className={`ws-check-option${checked ? ' selected' : ''}${isBase ? ' locked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isBase}
                          onChange={() => toggleItem(item.id)}
                        />
                        <span>{item.label}</span>
                        {recommended && <em>추천</em>}
                      </label>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function WizardQuestion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="ws-wizard-question">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
