import type { ReactNode } from 'react';
import { useBoardState } from '../../../features/workspaces/boardStore';
import { visibleBoardChannels } from './boardChannels';

export default function ContentDetailPanel() {
  const { items, selectedItemId } = useBoardState();
  const item = items.find((i) => i.id === selectedItemId);

  if (!item) return null;

  const channels = visibleBoardChannels(item.channels);

  return (
    <div className="ws-detail-panel">
      <div className="ws-detail-header">
        <h2 className="ws-detail-title">{item.title}</h2>
      </div>

      <div className="ws-detail-body">
        <Row label="상태">{item.status}</Row>
        <Row label="채널">{channels.join(', ') || '-'}</Row>
        <Row label="형식">{item.contentFormat}</Row>
        <Row label="담당자">{item.assignee || '-'}</Row>
        <Row label="시작일자">{item.shootDate || '-'}</Row>
        <Row label="마감일자">{item.editDueDate || '-'}</Row>
        <Row label="태그">{item.tags.join(' ') || '-'}</Row>
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
              {item.titleCandidates.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </Section>
        )}
        {item.thumbnailTexts.length > 0 && (
          <Section label="썸네일 문구 후보">
            <ul className="ws-detail-list">
              {item.thumbnailTexts.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
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
      <span className="ws-detail-label">{label}</span>
      <span className="ws-detail-value">{children}</span>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="ws-detail-section">
      <h3>{label}</h3>
      {children}
    </section>
  );
}
