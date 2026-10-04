import { useEffect, useState } from 'react';
import {
  fetchTrendIdeas,
  fetchTrendIdeasFromVideos,
  type AiTrendIdea,
  type AiUsageQuota,
} from '../../../features/ai/trendIdeas';
import { useBoardDispatch } from '../../../features/workspaces/boardStore';
import type { MyWorkspace } from '../../../features/workspaces/types';
import type { ContentItem, Idea } from '../../../features/workspaces/boardTypes';
import {
  fetchYoutubeTrendCategories,
  fetchTrendVideos,
  restoreDefaultYoutubeTrendCategories,
  saveYoutubeTrendCategories,
  type TrendLimit,
  type TrendMode,
  type TrendPeriod,
  type TrendSort,
  type TrendVideo,
  type YoutubeTrendCategory,
} from '../../../features/youtube/trends';

const REGION_OPTIONS = [
  { value: 'KR', label: 'KR' },
  { value: 'US', label: 'US' },
  { value: 'JP', label: 'JP' },
];

const MODE_OPTIONS: { value: TrendMode; label: string }[] = [
  { value: 'category', label: '카테고리' },
  { value: 'search', label: '검색어' },
];

const PERIOD_OPTIONS: { value: TrendPeriod; label: string }[] = [
  { value: '24h', label: '최근 24시간' },
  { value: '3d', label: '최근 3일' },
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 1개월' },
];

const SORT_OPTIONS: { value: TrendSort; label: string }[] = [
  { value: 'trend', label: '트렌드 점수순' },
  { value: 'views', label: '조회수순' },
  { value: 'latest', label: '최신순' },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function TrendTab({ workspace }: { workspace: MyWorkspace }) {
  const dispatch = useBoardDispatch();
  const [mode, setMode] = useState<TrendMode>('category');
  const [regionCode, setRegionCode] = useState('KR');
  const [categoryId, setCategoryId] = useState('20');
  const [keyword, setKeyword] = useState('버튜버');
  const [submittedKeyword, setSubmittedKeyword] = useState('버튜버');
  const [period, setPeriod] = useState<TrendPeriod>('7d');
  const [sort, setSort] = useState<TrendSort>('trend');
  const [resultLimit, setResultLimit] = useState<TrendLimit>(50);
  const [videos, setVideos] = useState<TrendVideo[]>([]);
  const [categories, setCategories] = useState<YoutubeTrendCategory[]>([]);
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContextTitle, setAiContextTitle] = useState('');
  const [aiReferenceVideos, setAiReferenceVideos] = useState<TrendVideo[]>([]);
  const [aiVideo, setAiVideo] = useState<TrendVideo | null>(null);
  const [aiIdeas, setAiIdeas] = useState<AiTrendIdea[]>([]);
  const [aiUsage, setAiUsage] = useState<AiUsageQuota | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [categorySettingsOpen, setCategorySettingsOpen] = useState(false);
  const [error, setError] = useState('');
  const [trendNotice, setTrendNotice] = useState('');

  function loadVideos(nextLimit: TrendLimit = resultLimit) {
    if (mode === 'search' && submittedKeyword.trim() === '') {
      setVideos([]);
      setTrendNotice('');
      setError('검색어를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setTrendNotice('');
    fetchTrendVideos({ mode, regionCode, categoryId, keyword: submittedKeyword, period, sort, limit: nextLimit })
      .then((result) => {
        setVideos(result.items);
        setTrendNotice(result.meta?.categoryFallback ? result.meta.message ?? '' : '');
      })
      .catch(() => {
        setVideos([]);
        setTrendNotice('');
        setError('트렌드 영상을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setResultLimit(50);
    loadVideos(50);
  }, [mode, regionCode, categoryId, submittedKeyword, period, sort]);

  function submitKeywordSearch() {
    setSubmittedKeyword(keyword.trim());
    setMode('search');
  }

  function loadMoreVideos() {
    setResultLimit(100);
    loadVideos(100);
  }

  useEffect(() => {
    fetchYoutubeTrendCategories(workspace.id, false)
      .then((items) => {
        setCategories(items);
        setEnabledIds(new Set(items.filter((item) => Number(item.is_enabled) === 1).map((item) => item.category_id)));
        const enabled = items.filter((item) => Number(item.is_enabled) === 1);
        if (categoryId && !enabled.some((item) => item.category_id === categoryId)) {
          setCategoryId(enabled.find((item) => item.category_id === '20')?.category_id ?? enabled[0]?.category_id ?? '');
        }
      })
      .catch(() => setCategories([]));
  }, [workspace.id]);

  const enabledCategories = categories.filter((item) => Number(item.is_enabled) === 1);

  function categoryLabel(video: TrendVideo): string {
    return categories.find((option) => option.category_id === video.categoryId)?.category_name ?? 'YouTube';
  }

  function toggleCategory(categoryId: string) {
    setEnabledIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function applyCategories(items: YoutubeTrendCategory[]) {
    setCategories(items);
    const nextEnabled = new Set(items.filter((item) => Number(item.is_enabled) === 1).map((item) => item.category_id));
    setEnabledIds(nextEnabled);
    if (categoryId && !nextEnabled.has(categoryId)) {
      setCategoryId('');
    }
  }

  function selectAllCategories() {
    setEnabledIds(new Set(categories.map((item) => item.category_id)));
  }

  function clearAllCategories() {
    setEnabledIds(new Set());
  }

  function saveCategorySettings() {
    setCategorySaving(true);
    saveYoutubeTrendCategories(workspace.id, Array.from(enabledIds))
      .then((items) => {
        applyCategories(items);
        window.alert('저장되었습니다.');
      })
      .finally(() => setCategorySaving(false));
  }

  function restoreCategoryDefaults() {
    setCategorySaving(true);
    restoreDefaultYoutubeTrendCategories(workspace.id)
      .then((items) => {
        applyCategories(items);
        window.alert('저장되었습니다.');
      })
      .finally(() => setCategorySaving(false));
  }

  function saveAsIdea(video: TrendVideo) {
    const idea: Idea = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      title: video.title,
      source: 'YouTube 트렌드',
      priority: 'medium',
      tags: ['트렌드', categoryLabel(video)],
      memo: `${video.channelTitle} · 조회수 ${formatNumber(video.viewCount)} · 트렌드 점수 ${formatNumber(video.trendScore)}`,
      referenceLinks: [video.youtubeUrl],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_IDEA', payload: idea });
    window.alert('아이디어로 저장되었습니다.');
  }

  function registerAsContent(video: TrendVideo) {
    const now = new Date().toISOString();
    const item: ContentItem = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      title: video.title,
      status: 'idea',
      channels: workspace.channels.length > 0 ? workspace.channels : ['youtube'],
      contentFormat: '트렌드 리서치',
      tags: ['트렌드', categoryLabel(video)],
      assignee: '',
      priority: 'medium',
      script: '',
      titleCandidates: [video.title],
      thumbnailTexts: [],
      editingNotes: `YouTube 트렌드 참고: ${video.youtubeUrl}`,
      referenceLinks: [video.youtubeUrl],
      publishDate: '',
      shootDate: '',
      editDueDate: '',
      isSponsored: false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_ITEM', payload: item });
    window.alert('컨텐츠로 등록되었습니다.');
  }

  function openAiIdeas(video: TrendVideo) {
    setAiModalOpen(true);
    setAiContextTitle(video.title);
    setAiReferenceVideos([video]);
    setAiVideo(video);
    setAiIdeas([]);
    setAiUsage(null);
    setAiError('');
    setAiLoading(true);
    fetchTrendIdeas({ workspaceId: workspace.id, video, count: 5 })
      .then((result) => {
        setAiIdeas(result.ideas);
        setAiUsage(result.usage ?? null);
      })
      .catch((error: Error) => {
        setAiIdeas([]);
        setAiUsage(null);
        setAiError(error.message || 'AI 아이디어 추천을 불러오지 못했습니다.');
      })
      .finally(() => setAiLoading(false));
  }

  function openAiIdeasFromResults() {
    const sourceVideos = videos.slice(0, Math.min(videos.length, 30));
    if (sourceVideos.length === 0) {
      window.alert('AI 추천을 만들 트렌드 영상이 없습니다.');
      return;
    }

    setAiModalOpen(true);
    setAiContextTitle(`현재 탐색 결과 ${videos.length}개 기반`);
    setAiReferenceVideos(sourceVideos);
    setAiVideo(null);
    setAiIdeas([]);
    setAiUsage(null);
    setAiError('');
    setAiLoading(true);
    fetchTrendIdeasFromVideos({ workspaceId: workspace.id, videos: sourceVideos, count: 7 })
      .then((result) => {
        setAiIdeas(result.ideas);
        setAiUsage(result.usage ?? null);
      })
      .catch((error: Error) => {
        setAiIdeas([]);
        setAiUsage(null);
        setAiError(error.message || 'AI 아이디어 추천을 불러오지 못했습니다.');
      })
      .finally(() => setAiLoading(false));
  }

  function closeAiIdeas() {
    setAiModalOpen(false);
    setAiContextTitle('');
    setAiReferenceVideos([]);
    setAiVideo(null);
    setAiIdeas([]);
    setAiUsage(null);
    setAiError('');
    setAiLoading(false);
  }

  function saveAiIdea(idea: AiTrendIdea) {
    const references = aiReferenceVideos.length > 0 ? aiReferenceVideos : (aiVideo ? [aiVideo] : []);
    if (references.length === 0) return;
    const referenceLinks = references.slice(0, 5).map((video) => video.youtubeUrl);
    const referenceLabels = Array.from(new Set(references.map((video) => categoryLabel(video))));
    const memo = [
      idea.angle && `기획 각도: ${idea.angle}`,
      idea.hook && `초반 훅: ${idea.hook}`,
      idea.thumbnailText && `썸네일 문구: ${idea.thumbnailText}`,
      idea.targetAudience && `타깃: ${idea.targetAudience}`,
      idea.productionNotes && `제작 메모: ${idea.productionNotes}`,
    ].filter(Boolean).join('\n');
    const payload: Idea = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      title: idea.title,
      source: 'AI 트렌드 추천',
      priority: idea.difficulty === '어려움' ? 'high' : 'medium',
      tags: Array.from(new Set(['AI 추천', ...referenceLabels, ...idea.tags])),
      memo,
      referenceLinks,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_IDEA', payload });
    window.alert('아이디어로 저장되었습니다.');
  }

  function registerAiContent(idea: AiTrendIdea) {
    const references = aiReferenceVideos.length > 0 ? aiReferenceVideos : (aiVideo ? [aiVideo] : []);
    if (references.length === 0) return;
    const referenceLinks = references.slice(0, 5).map((video) => video.youtubeUrl);
    const referenceLabels = Array.from(new Set(references.map((video) => categoryLabel(video))));
    const now = new Date().toISOString();
    const item: ContentItem = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      title: idea.title,
      status: 'idea',
      channels: workspace.channels.length > 0 ? workspace.channels : ['youtube'],
      contentFormat: idea.format || 'AI 기획',
      tags: Array.from(new Set(['AI 추천', ...referenceLabels, ...idea.tags])),
      assignee: '',
      priority: idea.difficulty === '어려움' ? 'high' : 'medium',
      script: idea.hook,
      titleCandidates: [idea.title],
      thumbnailTexts: idea.thumbnailText ? [idea.thumbnailText] : [],
      editingNotes: [
        idea.angle && `기획 각도: ${idea.angle}`,
        idea.targetAudience && `타깃: ${idea.targetAudience}`,
        idea.productionNotes && `제작 메모: ${idea.productionNotes}`,
        `참고 트렌드: ${referenceLinks.join(', ')}`,
      ].filter(Boolean).join('\n'),
      referenceLinks,
      publishDate: '',
      shootDate: '',
      editDueDate: '',
      isSponsored: false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_ITEM', payload: item });
    window.alert('컨텐츠로 등록되었습니다.');
  }

  return (
    <div className="ws-trend">
      <header className="ws-trend-head">
        <div>
          <h2>트렌드 탐색</h2>
          <p>YouTube에서 카테고리별 최근 인기 영상을 확인하고 컨텐츠 아이디어로 저장하세요.</p>
        </div>
        <div className="ws-trend-head-actions">
          <button type="button" className="btn ghost" onClick={openAiIdeasFromResults} disabled={loading || aiLoading || videos.length === 0}>
            탐색 결과로 AI 추천
          </button>
          <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}>
            + 아이디어
          </button>
          <button type="button" className="btn primary" onClick={() => loadVideos()} disabled={loading}>
            {loading ? '불러오는 중' : '새로고침'}
          </button>
        </div>
      </header>

      <div className="ws-trend-filters">
        <label>
          <span>탐색 방식</span>
          <select value={mode} onChange={(event) => setMode(event.target.value as TrendMode)}>
            {MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        {mode === 'category' ? (
          <label>
            <span>카테고리</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">전체</option>
              {enabledCategories.map((option) => (
                <option key={option.category_id} value={option.category_id}>{option.category_name}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="ws-trend-search-field">
            <span>검색어</span>
            <div>
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitKeywordSearch();
                  }
                }}
                placeholder=""
              />
              <button type="button" className="btn primary" onClick={submitKeywordSearch} disabled={loading}>
                검색
              </button>
            </div>
          </label>
        )}
        <label>
          <span>기간</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value as TrendPeriod)}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>국가</span>
          <select value={regionCode} onChange={(event) => setRegionCode(event.target.value)}>
            {REGION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>정렬</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as TrendSort)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <section className="ws-trend-category-settings">
        <div className="ws-trend-category-settings-head">
          <div>
            <h3>카테고리 노출 설정</h3>
            <p>이 설정은 현재 워크스페이스에만 적용됩니다.</p>
          </div>
          <div className="ws-trend-category-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setCategorySettingsOpen((open) => !open)}
              aria-expanded={categorySettingsOpen}
              aria-controls="youtube-trend-category-list"
            >
              {categorySettingsOpen ? '접기' : '펼치기'}
            </button>
            <button type="button" className="btn ghost" onClick={selectAllCategories} disabled={categorySaving}>전체 선택</button>
            <button type="button" className="btn ghost" onClick={clearAllCategories} disabled={categorySaving}>전체 해제</button>
            <button type="button" className="btn subtle" onClick={restoreCategoryDefaults} disabled={categorySaving}>기본값 복원</button>
            <button type="button" className="btn primary" onClick={saveCategorySettings} disabled={categorySaving}>저장</button>
          </div>
        </div>
        <div
          id="youtube-trend-category-list"
          className={`ws-trend-category-list ${categorySettingsOpen ? 'open' : ''}`}
          aria-hidden={!categorySettingsOpen}
        >
          {categories.map((category) => (
            <div key={category.category_id} className="ws-trend-category-item">
              <label className="ws-trend-category-switch">
                <input
                  type="checkbox"
                  checked={enabledIds.has(category.category_id)}
                  onChange={() => toggleCategory(category.category_id)}
                />
                <span className="ws-trend-category-toggle" aria-hidden="true" />
                <span>{category.category_name}</span>
                <small>{category.api_name}</small>
              </label>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="ws-trend-error" role="alert">
          {error}
        </div>
      )}

      {!error && trendNotice && (
        <div className="ws-trend-notice" role="status">
          {trendNotice}
        </div>
      )}

      {!error && videos.length === 0 ? (
        <div className="ws-tab-placeholder">
          <div className="ws-tab-placeholder-icon">!</div>
          <h3>{loading ? '트렌드 영상을 불러오는 중입니다' : '조건에 맞는 트렌드 영상이 없습니다'}</h3>
          <p>{loading ? '잠시만 기다려주세요.' : '기간, 국가, 카테고리를 바꿔 다시 확인해보세요.'}</p>
        </div>
      ) : (
        <>
          <div className="ws-trend-grid">
            {videos.map((video) => (
              <article key={video.videoId} className="ws-trend-card">
              <a className="ws-trend-thumb" href={video.youtubeUrl} target="_blank" rel="noreferrer">
                {video.thumbnailUrl && <img src={video.thumbnailUrl} alt="" loading="lazy" />}
              </a>
              <div className="ws-trend-card-body">
                <div className="ws-trend-meta">
                  <span>{video.channelTitle}</span>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
                <h3>{video.title}</h3>
                <dl className="ws-trend-stats">
                  <div><dt>조회수</dt><dd>{formatNumber(video.viewCount)}</dd></div>
                  <div><dt>좋아요</dt><dd>{formatNumber(video.likeCount)}</dd></div>
                  <div><dt>댓글</dt><dd>{formatNumber(video.commentCount)}</dd></div>
                  <div>
                    <dt>
                      트렌드 점수
                      <span className="ws-trend-score-help" tabIndex={0} aria-label="최근 조회 속도에 좋아요와 댓글 반응을 더해 계산한 지표입니다.">
                        i
                      </span>
                    </dt>
                    <dd>{formatNumber(video.trendScore)}</dd>
                  </div>
                </dl>
                <div className="ws-trend-actions">
                  <a className="btn ghost" href={video.youtubeUrl} target="_blank" rel="noreferrer">YouTube에서 보기</a>
                  <button type="button" className="btn ghost" onClick={() => openAiIdeas(video)}>AI 아이디어 추천</button>
                  <button type="button" className="btn subtle" onClick={() => saveAsIdea(video)}>아이디어로 저장</button>
                  <button type="button" className="btn primary" onClick={() => registerAsContent(video)}>컨텐츠로 등록</button>
                </div>
              </div>
              </article>
            ))}
          </div>
          {resultLimit === 50 && videos.length >= 50 && (
            <div className="ws-trend-more">
              <button type="button" className="btn ghost" onClick={loadMoreVideos} disabled={loading}>
                {loading ? '불러오는 중...' : '더보기'}
              </button>
            </div>
          )}
        </>
      )}
      {aiModalOpen && (
        <div className="ws-modal-overlay" role="presentation" onClick={closeAiIdeas}>
          <div className="ws-modal ws-ai-ideas-modal" role="dialog" aria-modal="true" aria-labelledby="ai-ideas-title" onClick={(event) => event.stopPropagation()}>
            <div className="ws-modal-header">
              <div>
                <h3 id="ai-ideas-title">AI 아이디어 추천</h3>
                <p>{aiContextTitle}</p>
              </div>
              <button type="button" className="icon-btn" aria-label="닫기" onClick={closeAiIdeas}>×</button>
            </div>
            <div className="ws-modal-body ws-ai-ideas-body">
              {aiUsage && (
                <div className="ws-ai-usage">
                  <span>오늘 AI 추천 {aiUsage.used}/{aiUsage.limit}회 사용</span>
                  <strong>{aiUsage.plan.toUpperCase()}</strong>
                </div>
              )}
              {aiLoading && (
                <div className="ws-tab-placeholder">
                  <div className="ws-ai-loading-mark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <h3>아이디어를 생성하는 중입니다.</h3>
                  <p>트렌드 영상의 제목, 반응 지표, 채널 맥락을 바탕으로 컨텐츠 기획안을 만들고 있습니다.</p>
                </div>
              )}
              {!aiLoading && aiError && (
                <div className="ws-trend-error" role="alert">{aiError}</div>
              )}
              {!aiLoading && !aiError && (
                <div className="ws-ai-idea-list">
                  {aiIdeas.map((idea, index) => (
                    <article key={`${idea.title}-${index}`} className="ws-ai-idea-card">
                      <div className="ws-ai-idea-card-head">
                        <span>추천 {index + 1}</span>
                        {idea.difficulty && <strong>{idea.difficulty}</strong>}
                      </div>
                      <h4>{idea.title}</h4>
                      {idea.angle && <p>{idea.angle}</p>}
                      <dl>
                        {idea.hook && (
                          <div>
                            <dt>초반 훅</dt>
                            <dd>{idea.hook}</dd>
                          </div>
                        )}
                        {idea.thumbnailText && (
                          <div>
                            <dt>썸네일</dt>
                            <dd>{idea.thumbnailText}</dd>
                          </div>
                        )}
                        {idea.format && (
                          <div>
                            <dt>형식</dt>
                            <dd>{idea.format}</dd>
                          </div>
                        )}
                        {idea.targetAudience && (
                          <div>
                            <dt>타깃</dt>
                            <dd>{idea.targetAudience}</dd>
                          </div>
                        )}
                        {idea.productionNotes && (
                          <div>
                            <dt>제작 메모</dt>
                            <dd>{idea.productionNotes}</dd>
                          </div>
                        )}
                      </dl>
                      {idea.tags.length > 0 && (
                        <div className="ws-ai-idea-tags">
                          {idea.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      )}
                      <div className="ws-ai-idea-actions">
                        <button type="button" className="btn subtle" onClick={() => saveAiIdea(idea)}>아이디어로 저장</button>
                        <button type="button" className="btn primary" onClick={() => registerAiContent(idea)}>컨텐츠로 등록</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
