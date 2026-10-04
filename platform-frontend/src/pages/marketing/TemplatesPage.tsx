import type { CSSProperties } from 'react';
import AuthAwareCta from '../../components/auth/AuthAwareCta';

interface WorkspaceSample {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  channels: string[];
  flow: string[];
  fields: string[];
  sampleItems: { title: string; status: string; meta: string }[];
  accent: string;
}

type SampleStyle = CSSProperties & { '--sample-accent': string };

const WORKSPACE_SAMPLES: WorkspaceSample[] = [
  {
    id: 'youtube-operation',
    title: '유튜브 채널 운영',
    subtitle: '기획부터 업로드까지 한 번에 관리',
    description: '롱폼 영상의 기획, 대본, 촬영, 편집, 썸네일, 업로드 일정을 한 워크스페이스에서 정리합니다.',
    channels: ['YouTube', 'Shorts'],
    flow: ['아이디어', '기획중', '대본 작성', '촬영', '작업중', '썸네일', '예약'],
    fields: ['제목 후보', '썸네일 문구', '대본', '편집 메모', '업로드 일정'],
    sampleItems: [
      { title: '신작 게임 업데이트 리뷰', status: '작업중', meta: '유튜브 · 리뷰' },
      { title: '2026 생산성 앱 추천', status: '기획중', meta: '유튜브 · 정보' },
      { title: '구독자 Q&A 영상', status: '아이디어', meta: '유튜브 · 커뮤니티' },
    ],
    accent: '#ff5a5f',
  },
  {
    id: 'streaming-team',
    title: '라이브 스트리밍 팀',
    subtitle: '방송, 클립, 다시보기를 함께 운영',
    description: '방송 주제, 라이브 일정, 클립 후보, 다시보기 편집 상태를 팀원과 함께 관리합니다.',
    channels: ['YouTube', 'Twitch', 'Chzzk'],
    flow: ['방송 아이디어', '준비중', '방송 완료', '클립 편집', '다시보기', '업로드'],
    fields: ['방송 시간', '클립 후보', '시청자 요청', '편집 메모', '다시보기 링크'],
    sampleItems: [
      { title: '주말 랭크 게임 방송', status: '준비중', meta: '치지직 · 라이브' },
      { title: '이번 주 하이라이트 클립', status: '클립 편집', meta: 'YouTube · Shorts' },
      { title: '시청자 참여 미션 방송', status: '아이디어', meta: '라이브 · 이벤트' },
    ],
    accent: '#7c5cff',
  },
  {
    id: 'shortform-studio',
    title: '숏폼 제작 스튜디오',
    subtitle: '짧은 컨텐츠를 빠르게 반복 제작',
    description: '훅, 자막, 촬영 컷, 업로드 채널을 중심으로 숏폼 제작 흐름을 가볍고 빠르게 관리합니다.',
    channels: ['Shorts', 'Reels', 'TikTok'],
    flow: ['아이디어', '훅 작성', '촬영', '편집', '예약', '배포'],
    fields: ['3초 훅', '자막 문구', '트렌드 태그', '반복 포맷', '업로드 채널'],
    sampleItems: [
      { title: '3초 만에 이해하는 생산성 팁', status: '편집', meta: 'Shorts · 정보' },
      { title: '이번 주 밈 활용 숏폼', status: '훅 작성', meta: 'Reels · 트렌드' },
      { title: 'Before / After 편집 영상', status: '아이디어', meta: 'TikTok · 튜토리얼' },
    ],
    accent: '#f97316',
  },
  {
    id: 'brand-content',
    title: '브랜드 컨텐츠 팀',
    subtitle: '캠페인과 검수 흐름 중심 운영',
    description: '브랜드 캠페인, 담당자, 검수 상태, 배포 일정을 기준으로 팀 단위 컨텐츠를 관리합니다.',
    channels: ['YouTube', 'Instagram', 'Blog'],
    flow: ['아이디어', '기획중', '제작중', '검수중', '예약', '배포'],
    fields: ['캠페인명', '담당자', '검수자', '협찬 여부', '피드백 메모'],
    sampleItems: [
      { title: '5월 브랜드 캠페인 영상', status: '제작중', meta: 'YouTube · 캠페인' },
      { title: '인스타그램 릴스 광고 소재', status: '검수중', meta: 'Reels · 광고' },
      { title: '신제품 출시 컨텐츠 패키지', status: '기획중', meta: '멀티채널 · 런칭' },
    ],
    accent: '#2563eb',
  },
];

export default function TemplatesPage() {
  return (
    <>
      <section className="mk-template-samples-hero">
        <div className="mk-template-samples-hero-inner">
          <span className="mk-eyebrow">Workspace Samples</span>
          <h1 className="mk-page-hero-title">운영 방식에 맞는 워크스페이스 샘플을 확인하세요.</h1>
          <p>
            템플릿은 디자인 스킨이 아니라, 컨텐츠 제작팀이 바로 쓸 수 있는 보드 흐름과 관리 항목의 샘플입니다.
            채널 운영 방식에 맞춰 시작 구조를 고를 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mk-section mk-template-samples-section">
        <div className="mk-section-inner">
          <div className="mk-template-samples-grid">
            {WORKSPACE_SAMPLES.map((sample) => (
              <article key={sample.id} className="mk-workspace-sample-card" style={{ '--sample-accent': sample.accent } as SampleStyle}>
                <div className="mk-workspace-sample-head">
                  <div>
                    <span>{sample.subtitle}</span>
                    <h2>{sample.title}</h2>
                  </div>
                  <div className="mk-workspace-sample-dot" aria-hidden="true" />
                </div>
                <p>{sample.description}</p>

                <div className="mk-workspace-sample-tags">
                  {sample.channels.map((channel) => <span key={channel}>{channel}</span>)}
                </div>

                <div className="mk-workspace-sample-board">
                  {sample.flow.map((step) => <span key={step}>{step}</span>)}
                </div>

                <div className="mk-workspace-sample-content">
                  <div>
                    <strong>관리 항목</strong>
                    <ul>
                      {sample.fields.map((field) => <li key={field}>{field}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>샘플 컨텐츠</strong>
                    <div className="mk-workspace-sample-items">
                      {sample.sampleItems.map((item) => (
                        <div key={item.title}>
                          <span>{item.status}</span>
                          <b>{item.title}</b>
                          <small>{item.meta}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>샘플을 기반으로 내 워크스페이스를 만들어보세요</h3>
              <p>워크스페이스 생성 단계에서 목적, 채널, 제작 흐름, 관리 항목을 선택해 내 팀에 맞게 조정할 수 있습니다.</p>
            </div>
            <AuthAwareCta intent="template" className="btn primary">워크스페이스 만들기</AuthAwareCta>
          </div>
        </div>
      </section>
    </>
  );
}
