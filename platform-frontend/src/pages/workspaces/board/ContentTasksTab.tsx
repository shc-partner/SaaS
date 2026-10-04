import { useState } from 'react';
import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardDispatch, useBoardState } from '../../../features/workspaces/boardStore';
import type {
  ContentItem,
  ContentStatus,
  ContentTaskRequest,
  ContentTaskRequestStatus,
} from '../../../features/workspaces/boardTypes';
import { visibleBoardChannels } from './boardChannels';

const STATUS_META: Record<ContentStatus, {
  label: string;
  nextTask: string;
}> = {
  idea: { label: '아이디어', nextTask: '기획 정리' },
  planning: { label: '작업 중', nextTask: '대본 작성' },
  scripting: { label: '작업 중', nextTask: '촬영 준비' },
  shooting: { label: '작업 중', nextTask: '편집 진행' },
  editing: { label: '작업 중', nextTask: '검수 요청' },
  'edit-review': { label: '작업 중', nextTask: '썸네일 확인' },
  thumbnail: { label: '작업 중', nextTask: '예약 등록' },
  scheduled: { label: '작업 중', nextTask: '게시 확인' },
  published: { label: '작업 완료', nextTask: '성과 확인' },
};

const TASK_REQUEST_STATUSES: { id: ContentTaskRequestStatus; label: string; hint: string }[] = [
  { id: 'requested', label: '작업 요청', hint: '새로 등록된 요청' },
  { id: 'in-progress', label: '진행 중', hint: '작업자가 처리 중' },
  { id: 'review-requested', label: '검수 요청', hint: '검수자 확인 대기' },
  { id: 'review-completed', label: '검수 완료', hint: '검수 완료 후 마감 대기' },
  { id: 'completed', label: '작업 완료', hint: '최종 완료된 작업' },
];

const CONTENT_WORK_STATUS_OPTIONS: { id: ContentStatus; label: string }[] = [
  { id: 'idea', label: '아이디어' },
  { id: 'editing', label: '작업 중' },
  { id: 'published', label: '작업 완료' },
];

interface TaskRequestFormState {
  contentItemId: string;
  taskName: string;
  description: string;
  requester: string;
  worker: string;
  reviewer: string;
}

type TaskRequestFilter = 'all' | ContentTaskRequestStatus;

function isOverdue(item: ContentItem, today: string): boolean {
  return Boolean(item.editDueDate && item.editDueDate < today && item.status !== 'published');
}

function sortByDueDate(a: ContentItem, b: ContentItem): number {
  const aDate = a.editDueDate || '9999-12-31';
  const bDate = b.editDueDate || '9999-12-31';
  return aDate.localeCompare(bDate);
}

function sortTaskRequests(a: ContentTaskRequest, b: ContentTaskRequest): number {
  return b.createdAt.localeCompare(a.createdAt);
}

function buildTaskRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function contentWorkStatus(status: ContentStatus): ContentStatus {
  if (status === 'idea' || status === 'published') {
    return status;
  }
  return 'editing';
}

export default function ContentTasksTab({ workspace }: { workspace: MyWorkspace }) {
  const { items, taskRequests } = useBoardState();
  const dispatch = useBoardDispatch();
  const today = new Date().toISOString().slice(0, 10);
  const sortedItems = [...items].sort(sortByDueDate);
  const sortedTaskRequests = [...taskRequests].sort(sortTaskRequests);
  const taskRequestCounts = TASK_REQUEST_STATUSES.map((status) => ({
    ...status,
    count: sortedTaskRequests.filter((task) => task.status === status.id).length,
  }));
  const [taskRequestFilter, setTaskRequestFilter] = useState<TaskRequestFilter>('all');
  const [taskRequestModalOpen, setTaskRequestModalOpen] = useState(false);
  const [form, setForm] = useState<TaskRequestFormState>({
    contentItemId: '',
    taskName: '',
    description: '',
    requester: '',
    worker: '',
    reviewer: '',
  });

  const memberNames = (workspace.members ?? [])
    .map((member) => member.name || member.email)
    .filter(Boolean);
  const visibleTaskRequests = taskRequestFilter === 'all'
    ? sortedTaskRequests
    : sortedTaskRequests.filter((task) => task.status === taskRequestFilter);

  function updateForm<K extends keyof TaskRequestFormState>(key: K, value: TaskRequestFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submitTaskRequest() {
    const taskName = form.taskName.trim();
    const description = form.description.trim();
    const requester = form.requester.trim();
    const worker = form.worker.trim();
    const reviewer = form.reviewer.trim();

    if (!taskName || !description || !requester || !worker || !reviewer) {
      window.alert('작업명, 디스크립션, 요청자, 작업자, 검수자를 모두 입력해 주세요.');
      return;
    }

    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_TASK_REQUEST',
      payload: {
        id: buildTaskRequestId(),
        workspaceId: workspace.id,
        contentItemId: form.contentItemId,
        taskName,
        description,
        requester,
        worker,
        reviewer,
        status: 'requested',
        createdAt: now,
        updatedAt: now,
      },
    });
    setForm({
      contentItemId: '',
      taskName: '',
      description: '',
      requester: '',
      worker: '',
      reviewer: '',
    });
    setTaskRequestModalOpen(false);
  }

  function contentTitle(contentItemId: string): string {
    if (!contentItemId) return '미지정';
    return items.find((item) => item.id === contentItemId)?.title ?? '삭제된 컨텐츠';
  }

  return (
    <div className="ws-content-tasks">
      <div className="ws-tab-section-head">
        <div>
          <h3 className="ws-tab-title">작업 관리</h3>
          <p className="ws-config-description">등록된 컨텐츠의 현재 작업 상태, 다음 작업, 마감일자를 확인합니다.</p>
        </div>
      </div>

      <div className="ws-task-summary-grid">
        {TASK_REQUEST_STATUSES.map((status) => (
          <article className={`ws-task-summary-card status-${status.id}`} key={status.id}>
            <span>{status.label}</span>
            <strong>{taskRequestCounts.find((item) => item.id === status.id)?.count ?? 0}</strong>
          </article>
        ))}
      </div>

      <div className="ws-task-table">
        <div className="ws-task-table-head">
          <span>컨텐츠</span>
          <span>상태</span>
          <span>다음 작업</span>
          <span>시작일자</span>
          <span>마감일자</span>
          <span>담당자</span>
        </div>
        {sortedItems.map((item) => {
          const meta = STATUS_META[item.status];
          const overdue = isOverdue(item, today);

          return (
            <div
              key={item.id}
              className={`ws-task-table-row${overdue ? ' overdue' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') dispatch({ type: 'SELECT_ITEM', payload: item.id });
              }}
            >
              <span className="ws-task-title">
                {item.title}
                <small>{visibleBoardChannels(item.channels).join(', ') || '-'}</small>
              </span>
              <span>
                <select
                  className={`ws-task-status-select ws-task-status-select--compact ws-task-work-status-select content-${contentWorkStatus(item.status)}`}
                  value={contentWorkStatus(item.status)}
                  aria-label={`${item.title} 상태 변경`}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    dispatch({
                      type: 'UPDATE_ITEM_STATUS',
                      payload: {
                        id: item.id,
                        status: event.target.value as ContentStatus,
                      },
                    });
                  }}
                >
                  {CONTENT_WORK_STATUS_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </span>
              <span className="ws-task-next-text">{meta.nextTask}</span>
              <span>{item.shootDate || '-'}</span>
              <span>{item.editDueDate || '-'}</span>
              <span>{item.assignee || '-'}</span>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="ws-contents-empty">작업 관리할 컨텐츠가 없습니다.</div>
        )}
      </div>

      <div className="ws-tab-section-head ws-task-request-head">
        <div>
          <h3 className="ws-tab-title">작업 요청</h3>
          <p className="ws-config-description">요청자, 작업자, 검수자를 지정하고 작업 요청을 등록합니다.</p>
        </div>
        <button type="button" className="btn primary" onClick={() => setTaskRequestModalOpen(true)}>
          작업 요청 등록
        </button>
      </div>

      <section className="ws-task-request-panel">
        <div className="ws-task-filter-bar" aria-label="작업 요청 상태 필터">
          <button
            type="button"
            className={`ws-task-filter-chip${taskRequestFilter === 'all' ? ' active' : ''}`}
            aria-pressed={taskRequestFilter === 'all'}
            onClick={() => setTaskRequestFilter('all')}
          >
            전체 <span>{taskRequests.length}</span>
          </button>
          {TASK_REQUEST_STATUSES.map((status) => (
            <button
              type="button"
              key={status.id}
              className={`ws-task-filter-chip status-${status.id}${taskRequestFilter === status.id ? ' active' : ''}`}
              aria-pressed={taskRequestFilter === status.id}
              onClick={() => setTaskRequestFilter(status.id)}
            >
              {status.label} <span>{taskRequestCounts.find((item) => item.id === status.id)?.count ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="ws-task-request-card-grid">
          {visibleTaskRequests.map((task) => {
            const status = TASK_REQUEST_STATUSES.find((item) => item.id === task.status) ?? TASK_REQUEST_STATUSES[0];
            return (
              <article key={task.id} className={`ws-task-request-card status-${task.status}`}>
                <div className="ws-task-request-card-head">
                  <span>{contentTitle(task.contentItemId)}</span>
                  <strong>{status.label}</strong>
                </div>
                <h5>{task.taskName}</h5>
                <p>{task.description}</p>
                <dl>
                  <div>
                    <dt>요청자</dt>
                    <dd>{task.requester}</dd>
                  </div>
                  <div>
                    <dt>작업자</dt>
                    <dd>{task.worker}</dd>
                  </div>
                  <div>
                    <dt>검수자</dt>
                    <dd>{task.reviewer}</dd>
                  </div>
                </dl>
                <label className="ws-task-status-field">
                  <span>진행상태</span>
                  <select
                    className={`ws-task-status-select ws-task-status-select--compact status-${task.status}`}
                    value={task.status}
                    aria-label={`${task.taskName} 진행상태 변경`}
                    onChange={(event) => {
                      dispatch({
                        type: 'UPDATE_TASK_REQUEST_STATUS',
                        payload: {
                          id: task.id,
                          status: event.target.value as ContentTaskRequestStatus,
                        },
                      });
                    }}
                  >
                    {TASK_REQUEST_STATUSES.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </article>
            );
          })}
          {taskRequests.length === 0 && (
            <div className="ws-contents-empty">등록된 작업 요청이 없습니다.</div>
          )}
          {taskRequests.length > 0 && visibleTaskRequests.length === 0 && (
            <div className="ws-contents-empty">선택한 상태의 작업 요청이 없습니다.</div>
          )}
        </div>
      </section>

      {taskRequestModalOpen && (
        <div className="ws-modal-overlay" role="presentation" onClick={() => setTaskRequestModalOpen(false)}>
          <div className="ws-modal ws-task-request-modal" role="dialog" aria-modal="true" aria-labelledby="task-request-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="ws-modal-header">
              <div>
                <h3 id="task-request-modal-title">작업 요청 등록</h3>
                <p>요청자, 작업자, 검수자와 작업 범위를 입력합니다.</p>
              </div>
              <button type="button" className="icon-btn" aria-label="닫기" onClick={() => setTaskRequestModalOpen(false)}>×</button>
            </div>
            <div className="ws-modal-body">
              <datalist id="workspace-member-names">
                {memberNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>

              <div className="ws-task-request-form">
                <label>
                  <span>연결 컨텐츠</span>
                  <select value={form.contentItemId} onChange={(event) => updateForm('contentItemId', event.target.value)}>
                    <option value="">미지정</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>{item.title}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>작업명</span>
                  <input
                    value={form.taskName}
                    onChange={(event) => updateForm('taskName', event.target.value)}
                    placeholder="예: 썸네일 시안 제작"
                  />
                </label>
                <label className="wide">
                  <span>디스크립션</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="작업 범위와 참고 내용을 입력하세요."
                    rows={3}
                  />
                </label>
                <label>
                  <span>요청자</span>
                  <input
                    list="workspace-member-names"
                    value={form.requester}
                    onChange={(event) => updateForm('requester', event.target.value)}
                    placeholder="요청자 이름"
                  />
                </label>
                <label>
                  <span>작업자</span>
                  <input
                    list="workspace-member-names"
                    value={form.worker}
                    onChange={(event) => updateForm('worker', event.target.value)}
                    placeholder="작업자 이름"
                  />
                </label>
                <label>
                  <span>검수자</span>
                  <input
                    list="workspace-member-names"
                    value={form.reviewer}
                    onChange={(event) => updateForm('reviewer', event.target.value)}
                    placeholder="검수자 이름"
                  />
                </label>
              </div>
            </div>
            <div className="ws-modal-footer">
              <button type="button" className="btn ghost" onClick={() => setTaskRequestModalOpen(false)}>취소</button>
              <button type="button" className="btn primary" onClick={submitTaskRequest}>등록</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
