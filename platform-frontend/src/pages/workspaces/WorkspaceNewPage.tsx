import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import { upsertMyWorkspace } from '../../features/workspaces/storage';
import {
  PURPOSE_OPTIONS,
  CHANNEL_OPTIONS,
  FORMAT_OPTIONS,
  PRESET_OPTIONS,
  ITEM_OPTIONS,
  TEMPLATE_OPTIONS,
  STEP_LABELS,
} from '../../features/workspaces/constants';
import {
  type WorkspaceCreationState,
  type WorkspacePurpose,
  type WorkspaceChannel,
  type ContentFormat,
  type ProductionPreset,
  type ManagementItem,
  type WorkspaceTemplateKey,
  type MyWorkspace,
  type WorkspaceStatus,
} from '../../features/workspaces/types';

// /workspaces/new — 워크스페이스 생성 6단계 마법사.

const TOTAL_STEPS = 6;

const INITIAL_STATE: WorkspaceCreationState = {
  step: 1,
  purpose: null,
  channels: [],
  format: null,
  preset: null,
  items: [],
  templateKey: null,
  name: '',
};

export default function WorkspaceNewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<WorkspaceCreationState>(INITIAL_STATE);

  // 다음 단계로 진행 가능 여부 검사
  function canProceed(): boolean {
    switch (state.step) {
      case 1: return state.purpose !== null;
      case 2: return state.channels.length > 0;
      case 3: return state.format !== null;
      case 4: return state.preset !== null;
      case 5: return true; // 관리항목은 선택 선택 사항
      case 6: return state.templateKey !== null && state.name.trim().length > 0;
      default: return false;
    }
  }

  function handleNext() {
    if (!canProceed()) return;
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
    if (!state.purpose || !state.format || !state.preset || !state.templateKey) return;

    const workspace: MyWorkspace = {
      id: crypto.randomUUID(),
      name: state.name.trim(),
      purpose: state.purpose,
      channels: state.channels,
      format: state.format,
      templateKey: state.templateKey,
      preset: state.preset,
      items: state.items,
      createdAt: new Date().toISOString(),
      status: 'active' as WorkspaceStatus,
    };

    upsertMyWorkspace(user?.id ?? null, workspace);
    navigate(`/workspaces/${workspace.id}`);
  }

  return (
    <div className="workspace-new">
      {/* 진행 상태 바 */}
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
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 24 }}>
        {state.step}단계 / {TOTAL_STEPS}단계 — {STEP_LABELS[state.step - 1]}
      </div>

      {/* 단계별 콘텐츠 */}
      {state.step === 1 && (
        <Step1
          value={state.purpose}
          onChange={(v) => setState((prev) => ({ ...prev, purpose: v }))}
        />
      )}
      {state.step === 2 && (
        <Step2
          value={state.channels}
          onChange={(v) => setState((prev) => ({ ...prev, channels: v }))}
        />
      )}
      {state.step === 3 && (
        <Step3
          value={state.format}
          onChange={(v) => setState((prev) => ({ ...prev, format: v }))}
        />
      )}
      {state.step === 4 && (
        <Step4
          value={state.preset}
          onChange={(v) => setState((prev) => ({ ...prev, preset: v }))}
        />
      )}
      {state.step === 5 && (
        <Step5
          value={state.items}
          onChange={(v) => setState((prev) => ({ ...prev, items: v }))}
        />
      )}
      {state.step === 6 && (
        <Step6
          templateKey={state.templateKey}
          name={state.name}
          onTemplateChange={(v) => setState((prev) => ({ ...prev, templateKey: v }))}
          onNameChange={(v) => setState((prev) => ({ ...prev, name: v }))}
        />
      )}

      {/* 하단 이전/다음 버튼 */}
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

// ── Step 1: 사용 목적 ──────────────────────────────────────────
function Step1({
  value,
  onChange,
}: {
  value: WorkspacePurpose | null;
  onChange: (v: WorkspacePurpose) => void;
}) {
  return (
    <div>
      <div className="workspace-new-header">
        <h2>어떤 목적으로 운영하시나요?</h2>
        <p>운영 유형에 맞는 워크스페이스 구조를 추천해 드립니다.</p>
      </div>
      <div className="ws-card-grid">
        {PURPOSE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-card-option${value === opt.id ? ' selected' : ''}`}
            onClick={() => onChange(opt.id as WorkspacePurpose)}
          >
            <div className="ws-card-option-icon">{opt.icon}</div>
            <span className="ws-card-option-label">{opt.label}</span>
            <span className="ws-card-option-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: 운영 채널 (다중 선택) ─────────────────────────────
function Step2({
  value,
  onChange,
}: {
  value: WorkspaceChannel[];
  onChange: (v: WorkspaceChannel[]) => void;
}) {
  function toggle(id: WorkspaceChannel) {
    if (value.includes(id)) {
      onChange(value.filter((c) => c !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div>
      <div className="workspace-new-header">
        <h2>어떤 채널에서 활동하시나요?</h2>
        <p>복수 선택 가능합니다.</p>
      </div>
      <div className="ws-pill-grid">
        {CHANNEL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-pill-option${value.includes(opt.id as WorkspaceChannel) ? ' selected' : ''}`}
            onClick={() => toggle(opt.id as WorkspaceChannel)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: 콘텐츠 형식 ───────────────────────────────────────
function Step3({
  value,
  onChange,
}: {
  value: ContentFormat | null;
  onChange: (v: ContentFormat) => void;
}) {
  return (
    <div>
      <div className="workspace-new-header">
        <h2>주로 어떤 형식의 콘텐츠를 만드시나요?</h2>
        <p>가장 가까운 형식을 하나 선택해 주세요.</p>
      </div>
      <div className="ws-pill-grid">
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-pill-option${value === opt.id ? ' selected' : ''}`}
            onClick={() => onChange(opt.id as ContentFormat)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 4: 제작 흐름 프리셋 ──────────────────────────────────
function Step4({
  value,
  onChange,
}: {
  value: ProductionPreset | null;
  onChange: (v: ProductionPreset) => void;
}) {
  return (
    <div>
      <div className="workspace-new-header">
        <h2>제작 흐름을 선택해 주세요</h2>
        <p>나중에 변경할 수 있습니다.</p>
      </div>
      <div className="ws-preset-list">
        {PRESET_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-preset-option${value === opt.id ? ' selected' : ''}`}
            onClick={() => onChange(opt.id as ProductionPreset)}
          >
            <span className="ws-preset-option-label">{opt.label}</span>
            <span className="ws-preset-option-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 5: 관리 항목 (다중 선택, 선택 선택 사항) ──────────────────────
function Step5({
  value,
  onChange,
}: {
  value: ManagementItem[];
  onChange: (v: ManagementItem[]) => void;
}) {
  function toggle(id: ManagementItem) {
    if (value.includes(id)) {
      onChange(value.filter((i) => i !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div>
      <div className="workspace-new-header">
        <h2>어떤 항목을 관리할까요?</h2>
        <p>필요한 항목을 선택해 주세요. 나중에 추가하거나 제거할 수 있습니다.</p>
      </div>
      <div className="ws-pill-grid">
        {ITEM_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-pill-option${value.includes(opt.id as ManagementItem) ? ' selected' : ''}`}
            onClick={() => toggle(opt.id as ManagementItem)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 6: 템플릿 선택 + 이름 입력 ──────────────────────────
function Step6({
  templateKey,
  name,
  onTemplateChange,
  onNameChange,
}: {
  templateKey: WorkspaceTemplateKey | null;
  name: string;
  onTemplateChange: (v: WorkspaceTemplateKey) => void;
  onNameChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="workspace-new-header">
        <h2>워크스페이스 템플릿을 선택해 주세요</h2>
        <p>운영 목적에 맞는 기본 구조가 적용됩니다.</p>
      </div>
      <div className="ws-card-grid">
        {TEMPLATE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ws-card-option${templateKey === opt.id ? ' selected' : ''}`}
            onClick={() => onTemplateChange(opt.id as WorkspaceTemplateKey)}
          >
            <div className="ws-card-option-icon">{opt.icon}</div>
            <span className="ws-card-option-label">{opt.label}</span>
            <span className="ws-card-option-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <label
          htmlFor="ws-name"
          style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-1)' }}
        >
          워크스페이스 이름
        </label>
        <input
          id="ws-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="예: 내 유튜브 채널 워크스페이스"
          maxLength={80}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1.5px solid var(--border-1)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            background: 'var(--bg-card)',
            color: 'var(--text-1)',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}
