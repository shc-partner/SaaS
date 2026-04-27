// 새 아이디어 생성 모달.
// 폼 제출 시 BoardProvider 상태에 ADD_IDEA 액션을 디스패치한다.

import { useState } from 'react';
import { useBoardDispatch } from '../../../features/workspaces/boardStore';
import type { Idea, Priority } from '../../../features/workspaces/boardTypes';

interface Props {
  workspaceId: string;
}

export default function NewIdeaModal({ workspaceId }: Props) {
  const dispatch = useBoardDispatch();
  const [title,    setTitle]    = useState('');
  const [source,   setSource]   = useState('자체기획');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags,     setTags]     = useState('');
  const [memo,     setMemo]     = useState('');

  const submit = () => {
    if (!title.trim()) return;
    const idea: Idea = {
      id: crypto.randomUUID(),
      workspaceId,
      title: title.trim(),
      source,
      priority,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      memo,
      referenceLinks: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_IDEA', payload: idea });
  };

  return (
    <div
      className="ws-modal-overlay"
      onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
    >
      <div className="ws-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ws-modal-header">
          <h3>새 아이디어</h3>
          <button
            type="button"
            className="ws-detail-close"
            onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
          >
            ✕
          </button>
        </div>

        <div className="ws-modal-body">
          <label className="field">
            <span className="field-label">아이디어 제목 *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아이디어 제목"
              autoFocus
            />
          </label>
          <label className="field">
            <span className="field-label">출처</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option>자체기획</option>
              <option>댓글</option>
              <option>트렌드</option>
              <option>협찬제안</option>
              <option>기타</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">우선순위</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">태그 (쉼표 구분)</span>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#게임, #리뷰"
            />
          </label>
          <label className="field">
            <span className="field-label">메모</span>
            <textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="참고 사항..."
            />
          </label>
        </div>

        <div className="ws-modal-footer">
          <button
            type="button"
            className="btn ghost"
            onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
          >
            취소
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={submit}
            disabled={!title.trim()}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
