// 새 콘텐츠 생성 모달.
// 폼 제출 시 BoardProvider 상태에 ADD_ITEM 액션을 디스패치한다.

import { useState } from 'react';
import { useBoardDispatch } from '../../../features/workspaces/boardStore';
import type { ContentItem, ContentStatus, Priority } from '../../../features/workspaces/boardTypes';

interface Props {
  workspaceId: string;
}

export default function NewContentModal({ workspaceId }: Props) {
  const dispatch = useBoardDispatch();
  const [title,       setTitle]       = useState('');
  const [channel,     setChannel]     = useState('YouTube');
  const [format,      setFormat]      = useState('');
  const [status,      setStatus]      = useState<ContentStatus>('idea');
  const [publishDate, setPublishDate] = useState('');
  const [tags,        setTags]        = useState('');

  const submit = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const item: ContentItem = {
      id: crypto.randomUUID(),
      workspaceId,
      title: title.trim(),
      status,
      channels: [channel],
      contentFormat: format,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      assignee: '',
      priority: 'medium' as Priority,
      script: '',
      titleCandidates: [],
      thumbnailTexts: [],
      editingNotes: '',
      referenceLinks: [],
      publishDate,
      shootDate: '',
      editDueDate: '',
      isSponsored: false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  return (
    <div
      className="ws-modal-overlay"
      onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
    >
      <div className="ws-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ws-modal-header">
          <h3>새 콘텐츠</h3>
          <button
            type="button"
            className="ws-detail-close"
            onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
          >
            ✕
          </button>
        </div>

        <div className="ws-modal-body">
          <label className="field">
            <span className="field-label">제목 *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="콘텐츠 제목"
              autoFocus
            />
          </label>
          <label className="field">
            <span className="field-label">채널</span>
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option>YouTube</option>
              <option>Twitch</option>
              <option>Instagram</option>
              <option>TikTok</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">콘텐츠 형식</span>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="리뷰, 브이로그, 튜토리얼..."
            />
          </label>
          <label className="field">
            <span className="field-label">상태</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
            >
              <option value="idea">아이디어</option>
              <option value="planning">기획중</option>
              <option value="scripting">대본 작성</option>
              <option value="shooting">촬영중</option>
              <option value="editing">편집중</option>
              <option value="scheduled">예약됨</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">업로드 예정일</span>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
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
        </div>

        <div className="ws-modal-footer">
          <button
            type="button"
            className="btn ghost"
            onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
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
