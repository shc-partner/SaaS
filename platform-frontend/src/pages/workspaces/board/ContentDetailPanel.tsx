// 칸반 카드 클릭 시 열리는 우측 상세 패널.
// 선택된 ContentItem 의 모든 필드를 읽기 전용으로 표시한다.

import type { ReactNode } from 'react';
import { useBoardState, useBoardDispatch } from '../../../features/workspaces/boardStore';

export default function ContentDetailPanel() {
  const { items, selectedItemId } = useBoardState();
  const dispatch = useBoardDispatch();
  const item = items.find((i) => i.id === selectedItemId);

  if (!item) return null;

  return (
    <div className="ws-detail-panel">
      <div className="ws-detail-header">
        <h2 className="ws-detail-title">{item.title}</h2>
        <button
          type="button"
          className="ws-detail-close"
          aria-label="닫기"
          onClick={() => dispatch({ type: 'SELECT_ITEM', payload: null })}
        >
          ✕
        </button>
      </div>

      <div className="ws-detail-body">
        <Row label="상태">{item.status}</Row>
        <Row label="채널">{item.channels.join(', ')}</Row>
        <Row label="형식">{item.contentFormat}</Row>
        <Row label="담당자">{item.assignee || '—'}</Row>
        <Row label="업로드 예정일">{item.publishDate || '—'}</Row>
        <Row label="태그">{item.tags.join(' ') || '—'}</Row>
        {item.isSponsored && (
          <Row label="협찬">
            <span className="ws-badge ws-badge--sponsored">협찬</span>
          </Row>
        )}

        {item.script && (
          <Section label="대본 / 구성안">
            <pre className="ws-detail-pre">{item.script}</pre>
          </Section>
        )}
        {item.titleCandidates.length > 0 && (
          <Section label="제목 후보">
            <ul className="ws-detail-list">
              {item.titleCandidates.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>
        )}
        {item.thumbnailTexts.length > 0 && (
          <Section label="썸네일 문구 후보">
            <ul className="ws-detail-list">
              {item.thumbnailTexts.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>
        )}
        {item.editingNotes && (
          <Section label="편집 메모">
            <p className="ws-detail-note">{item.editingNotes}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ws-detail-row">
      <span className="ws-detail-row-label">{label}</span>
      <span className="ws-detail-row-value">{children}</span>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ws-detail-section">
      <h4 className="ws-detail-section-label">{label}</h4>
      {children}
    </div>
  );
}
