import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSelectedTemplate } from '../../../features/siteBuilder/siteBuilderSlice';
import { selectSelectedTemplateKey } from '../../../features/siteBuilder/selectors';
import { COMPANY_TEMPLATES } from '../../../features/siteBuilder/types';

// templateSelect step — 기업 소개형 템플릿 5종 선택.
// 선택 즉시 Redux에 siteType/selectedPages/pageContents가 시드되어 preview가 갱신된다.
export default function TemplateSelectStep() {
  const dispatch     = useAppDispatch();
  const selectedKey  = useAppSelector(selectSelectedTemplateKey);

  return (
    <section className="step">
      <header className="step-head">
        <h2>템플릿을 선택하세요</h2>
        <p className="step-desc">
          업종과 분위기에 맞는 템플릿을 고르면 기본 페이지와 초안 콘텐츠가 자동으로 채워집니다.
          선택 후 모든 내용을 자유롭게 수정할 수 있습니다.
        </p>
      </header>

      <ul className="tpl-grid">
        {COMPANY_TEMPLATES.map((tpl) => {
          const isSelected = selectedKey === tpl.key;
          return (
            <li key={tpl.key}>
              <button
                type="button"
                className={`tpl-card${isSelected ? ' tpl-card--selected' : ''}`}
                onClick={() => dispatch(setSelectedTemplate(tpl.key))}
                aria-pressed={isSelected}
              >
                {/* 상단 컬러 바 */}
                <span
                  className="tpl-card__bar"
                  style={{ background: tpl.accentColor }}
                  aria-hidden
                />

                {/* 썸네일 플레이스홀더 */}
                <span
                  className="tpl-card__thumb"
                  style={{ '--tpl-accent': tpl.accentColor } as React.CSSProperties}
                  aria-hidden
                >
                  <ThumbnailMock accentColor={tpl.accentColor} templateKey={tpl.key} />
                </span>

                {/* 텍스트 영역 */}
                <span className="tpl-card__body">
                  <span className="tpl-card__name">{tpl.name}</span>
                  <span className="tpl-card__tagline">{tpl.tagline}</span>

                  <span className="tpl-card__tone-row">
                    <span className="tpl-card__tone" style={{ color: tpl.accentColor }}>
                      {tpl.styleTone}
                    </span>
                  </span>

                  <span className="tpl-card__industries">
                    {tpl.recommendedFor.slice(0, 3).map((tag) => (
                      <span key={tag} className="tpl-card__industry-tag">{tag}</span>
                    ))}
                    {tpl.recommendedFor.length > 3 && (
                      <span className="tpl-card__industry-tag tpl-card__industry-more">
                        +{tpl.recommendedFor.length - 3}
                      </span>
                    )}
                  </span>
                </span>

                {/* 선택 indicator */}
                <span className={`tpl-card__indicator${isSelected ? ' tpl-card__indicator--on' : ''}`} aria-hidden>
                  {isSelected ? '✓ 선택됨' : '선택하기'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="field-hint" style={{ marginTop: 16 }}>
        선택 후 다음 단계에서 사이트 이름과 세부 내용을 직접 수정할 수 있습니다.
      </p>
    </section>
  );
}

// 템플릿별 홈 화면 축소판. templateKey로 레이아웃 분기.
function ThumbnailMock({ accentColor: c, templateKey }: { accentColor: string; templateKey: string }) {
  return (
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {templateKey === 'basic-corporate'     && <LayoutBasicCorporate c={c} />}
      {templateKey === 'saas-startup'        && <LayoutSaasStartup c={c} />}
      {templateKey === 'professional-service' && <LayoutProfessional c={c} />}
      {templateKey === 'manufacturing'        && <LayoutManufacturing c={c} />}
      {templateKey === 'local-business'       && <LayoutLocalBusiness c={c} />}
    </svg>
  );
}

// ① 기본 기업형 — 다크 히어로 + 중앙 정렬 + 하단 3-카드
function LayoutBasicCorporate({ c }: { c: string }) {
  return (
    <>
      <rect width="200" height="130" fill="#eef2ff"/>
      {/* Nav */}
      <rect width="200" height="13" fill="white"/>
      <rect x="8"   y="3.5" width="22" height="6" rx="2"   fill={c} opacity="0.82"/>
      <rect x="118" y="5"   width="14" height="3" rx="1"   fill="#c8ccdc"/>
      <rect x="136" y="5"   width="14" height="3" rx="1"   fill="#c8ccdc"/>
      <rect x="154" y="5"   width="14" height="3" rx="1"   fill="#c8ccdc"/>
      <rect x="174" y="3.5" width="18" height="6" rx="3"   fill={c}/>
      {/* Hero — dark, centered */}
      <rect y="13" width="200" height="57" fill="#1a2340"/>
      <rect x="38" y="23" width="124" height="9"  rx="2.5" fill="white" opacity="0.88"/>
      <rect x="52" y="36" width="96"  height="4.5" rx="1.5" fill="white" opacity="0.44"/>
      <rect x="62" y="43" width="76"  height="4"  rx="1.5" fill="white" opacity="0.3"/>
      <rect x="74" y="53" width="52"  height="11" rx="5.5" fill={c}/>
      <rect x="84" y="56" width="32"  height="5"  rx="1.5" fill="white" opacity="0.82"/>
      {/* 3 feature cards */}
      <rect y="70" width="200" height="60" fill="#eef2ff"/>
      <rect x="6"   y="77" width="58" height="46" rx="4" fill="white" stroke="#d8dcf0" strokeWidth="0.7"/>
      <rect x="71"  y="77" width="58" height="46" rx="4" fill="white" stroke="#d8dcf0" strokeWidth="0.7"/>
      <rect x="136" y="77" width="58" height="46" rx="4" fill="white" stroke="#d8dcf0" strokeWidth="0.7"/>
      <rect x="12"  y="84" width="14" height="11" rx="3" fill={c} opacity="0.18"/>
      <rect x="77"  y="84" width="14" height="11" rx="3" fill={c} opacity="0.18"/>
      <rect x="142" y="84" width="14" height="11" rx="3" fill={c} opacity="0.18"/>
      <rect x="12"  y="99"  width="38" height="4"   rx="1.5" fill="#b0b4cc"/>
      <rect x="77"  y="99"  width="38" height="4"   rx="1.5" fill="#b0b4cc"/>
      <rect x="142" y="99"  width="38" height="4"   rx="1.5" fill="#b0b4cc"/>
      <rect x="12"  y="106" width="44" height="3"   rx="1"   fill="#c8ccdc"/>
      <rect x="77"  y="106" width="44" height="3"   rx="1"   fill="#c8ccdc"/>
      <rect x="142" y="106" width="44" height="3"   rx="1"   fill="#c8ccdc"/>
      <rect x="12"  y="111" width="36" height="3"   rx="1"   fill="#c8ccdc"/>
      <rect x="77"  y="111" width="36" height="3"   rx="1"   fill="#c8ccdc"/>
      <rect x="142" y="111" width="36" height="3"   rx="1"   fill="#c8ccdc"/>
    </>
  );
}

// ② SaaS / 스타트업형 — 좌-텍스트 + 우-대시보드 목업 + 하단 지표 스트립
function LayoutSaasStartup({ c }: { c: string }) {
  return (
    <>
      <rect width="200" height="130" fill="#faf7ff"/>
      {/* Nav */}
      <rect width="200" height="13" fill="white" opacity="0.92"/>
      <rect x="8"   y="3.5" width="18" height="6" rx="2"   fill={c} opacity="0.85"/>
      <rect x="108" y="5"   width="14" height="3" rx="1"   fill="#c8b8f0"/>
      <rect x="126" y="5"   width="14" height="3" rx="1"   fill="#c8b8f0"/>
      <rect x="144" y="5"   width="14" height="3" rx="1"   fill="#c8b8f0"/>
      <rect x="162" y="3.5" width="14" height="6" rx="3"   fill={c} opacity="0.18"/>
      <rect x="180" y="3.5" width="12" height="6" rx="3"   fill={c}/>
      {/* Hero bg */}
      <rect y="13" width="200" height="63" fill="#f0eaff"/>
      {/* Left — headline + 2 CTA */}
      <rect x="8" y="21" width="82" height="9"   rx="2"   fill="#2d1060" opacity="0.8"/>
      <rect x="8" y="34" width="68" height="8"   rx="2"   fill="#2d1060" opacity="0.62"/>
      <rect x="8" y="46" width="80" height="4"   rx="1.5" fill="#9880c8" opacity="0.4"/>
      <rect x="8" y="53" width="64" height="4"   rx="1.5" fill="#9880c8" opacity="0.28"/>
      <rect x="8"  y="63" width="36" height="9" rx="4.5" fill={c}/>
      <rect x="48" y="63" width="36" height="9" rx="4.5" fill="transparent" stroke={c} strokeWidth="1"/>
      {/* Right — dashboard card */}
      <rect x="100" y="15" width="94" height="59" rx="5" fill="white" stroke="#e0d0ff" strokeWidth="0.8"/>
      <rect x="100" y="15" width="94" height="10" rx="5" fill={c} opacity="0.1"/>
      <rect x="104" y="18"  width="18" height="4" rx="1" fill={c} opacity="0.5"/>
      <rect x="168" y="18"  width="7"  height="4" rx="1" fill={c} opacity="0.3"/>
      <rect x="178" y="18"  width="7"  height="4" rx="1" fill={c} opacity="0.3"/>
      {/* chart bars */}
      <rect x="106" y="33" width="7" height="24" rx="2" fill={c} opacity="0.24"/>
      <rect x="116" y="27" width="7" height="30" rx="2" fill={c} opacity="0.44"/>
      <rect x="126" y="31" width="7" height="26" rx="2" fill={c} opacity="0.34"/>
      <rect x="136" y="22" width="7" height="35" rx="2" fill={c} opacity="0.65"/>
      <rect x="146" y="28" width="7" height="29" rx="2" fill={c} opacity="0.5"/>
      <rect x="156" y="24" width="7" height="33" rx="2" fill={c} opacity="0.55"/>
      {/* mini KPIs right */}
      <rect x="168" y="30" width="20" height="6" rx="1.5" fill={c} opacity="0.12"/>
      <rect x="168" y="39" width="20" height="6" rx="1.5" fill={c} opacity="0.1"/>
      <rect x="168" y="48" width="20" height="6" rx="1.5" fill={c} opacity="0.1"/>
      {/* Metrics strip */}
      <rect y="76" width="200" height="54" fill="white"/>
      <rect y="76" width="200" height="1"  fill="#e0d0ff"/>
      <rect x="6"   y="84" width="40" height="8" rx="2" fill={c} opacity="0.68"/>
      <rect x="6"   y="95" width="30" height="3.5" rx="1" fill="#bbb" opacity="0.45"/>
      <rect x="6"   y="101" width="36" height="3" rx="1"   fill="#ccc" opacity="0.3"/>
      <rect x="54"  y="84" width="40" height="8" rx="2" fill={c} opacity="0.5"/>
      <rect x="54"  y="95" width="30" height="3.5" rx="1" fill="#bbb" opacity="0.45"/>
      <rect x="54"  y="101" width="36" height="3" rx="1"   fill="#ccc" opacity="0.3"/>
      <rect x="102" y="84" width="40" height="8" rx="2" fill={c} opacity="0.38"/>
      <rect x="102" y="95" width="30" height="3.5" rx="1" fill="#bbb" opacity="0.45"/>
      <rect x="102" y="101" width="36" height="3" rx="1"   fill="#ccc" opacity="0.3"/>
      <rect x="150" y="84" width="40" height="8" rx="2" fill={c} opacity="0.28"/>
      <rect x="150" y="95" width="30" height="3.5" rx="1" fill="#bbb" opacity="0.45"/>
      <rect x="150" y="101" width="36" height="3" rx="1"   fill="#ccc" opacity="0.3"/>
    </>
  );
}

// ③ 전문 서비스형 — 신뢰 헤더 + 좌-소개 우-프로필카드 + 서비스 3-카드
function LayoutProfessional({ c }: { c: string }) {
  return (
    <>
      <rect width="200" height="130" fill="#f4fcf9"/>
      {/* Nav */}
      <rect width="200" height="13" fill="white"/>
      <rect x="8"   y="3.5" width="20" height="6" rx="2" fill={c} opacity="0.8"/>
      <rect x="90"  y="5"   width="14" height="3" rx="1" fill="#a0c0b8"/>
      <rect x="108" y="5"   width="14" height="3" rx="1" fill="#a0c0b8"/>
      <rect x="126" y="5"   width="14" height="3" rx="1" fill="#a0c0b8"/>
      <rect x="144" y="5"   width="14" height="3" rx="1" fill="#a0c0b8"/>
      <rect x="164" y="3.5" width="28" height="6" rx="3" fill={c}/>
      {/* Split hero */}
      <rect y="13" width="200" height="58" fill="white"/>
      {/* Left — intro */}
      <rect x="8" y="21" width="84" height="8"   rx="2"   fill="#0a2e22" opacity="0.74"/>
      <rect x="8" y="33" width="76" height="7"   rx="2"   fill="#0a2e22" opacity="0.58"/>
      <rect x="8" y="44" width="84" height="4"   rx="1.5" fill={c} opacity="0.3"/>
      <rect x="8" y="51" width="70" height="4"   rx="1.5" fill={c} opacity="0.18"/>
      <rect x="8" y="61" width="50" height="8"   rx="4"   fill={c}/>
      {/* Right — consultant card */}
      <rect x="104" y="16" width="88" height="52" rx="5" fill="white" stroke="#c0e8d8" strokeWidth="1"/>
      <circle cx="126" cy="32" r="12" fill={c} opacity="0.13"/>
      <circle cx="126" cy="30" r="7"  fill={c} opacity="0.38"/>
      <ellipse cx="126" cy="42" rx="9" ry="4.5" fill={c} opacity="0.18"/>
      <rect x="143" y="25" width="40" height="5" rx="1.5" fill="#0a2e22" opacity="0.68"/>
      <rect x="143" y="33" width="30" height="3.5" rx="1" fill="#a0c0b8"/>
      {/* stars */}
      <rect x="143" y="42" width="6" height="5" rx="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="151" y="42" width="6" height="5" rx="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="159" y="42" width="6" height="5" rx="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="167" y="42" width="6" height="5" rx="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="175" y="42" width="6" height="5" rx="1" fill="#fbbf24" opacity="0.35"/>
      {/* 3 service cards w/ green top border */}
      <rect y="71" width="200" height="59" fill="#f4fcf9"/>
      <rect x="6"   y="78" width="58" height="44" rx="4" fill="white" stroke="#c0e8d8" strokeWidth="0.8"/>
      <rect x="71"  y="78" width="58" height="44" rx="4" fill="white" stroke="#c0e8d8" strokeWidth="0.8"/>
      <rect x="136" y="78" width="58" height="44" rx="4" fill="white" stroke="#c0e8d8" strokeWidth="0.8"/>
      <rect x="6"   y="78" width="58" height="3"  rx="2" fill={c} opacity="0.7"/>
      <rect x="71"  y="78" width="58" height="3"  rx="2" fill={c} opacity="0.7"/>
      <rect x="136" y="78" width="58" height="3"  rx="2" fill={c} opacity="0.7"/>
      <rect x="12"  y="86" width="36" height="5"   rx="1.5" fill="#0a2e22" opacity="0.58"/>
      <rect x="77"  y="86" width="36" height="5"   rx="1.5" fill="#0a2e22" opacity="0.58"/>
      <rect x="142" y="86" width="36" height="5"   rx="1.5" fill="#0a2e22" opacity="0.58"/>
      <rect x="12"  y="95"  width="44" height="3.5" rx="1"   fill="#b0c8c0"/>
      <rect x="77"  y="95"  width="44" height="3.5" rx="1"   fill="#b0c8c0"/>
      <rect x="142" y="95"  width="44" height="3.5" rx="1"   fill="#b0c8c0"/>
      <rect x="12"  y="101" width="38" height="3"   rx="1"   fill="#c8d8d0"/>
      <rect x="77"  y="101" width="38" height="3"   rx="1"   fill="#c8d8d0"/>
      <rect x="142" y="101" width="38" height="3"   rx="1"   fill="#c8d8d0"/>
      <rect x="12"  y="107" width="28" height="3"   rx="1"   fill="#c8d8d0"/>
      <rect x="77"  y="107" width="28" height="3"   rx="1"   fill="#c8d8d0"/>
      <rect x="142" y="107" width="28" height="3"   rx="1"   fill="#c8d8d0"/>
    </>
  );
}

// ④ 제조 / 산업형 — 다크 헤더 + 산업 이미지 블록 + 3 스펙 블록
function LayoutManufacturing({ c }: { c: string }) {
  return (
    <>
      <rect width="200" height="130" fill="#f5f0ea"/>
      {/* Dark header */}
      <rect width="200" height="16" fill="#1c1612"/>
      <rect x="8"   y="4"  width="20" height="8" rx="1.5" fill="#f5f0e8"/>
      <rect x="110" y="6"  width="14" height="4" rx="1"   fill="#8a7060"/>
      <rect x="128" y="6"  width="14" height="4" rx="1"   fill="#8a7060"/>
      <rect x="146" y="6"  width="14" height="4" rx="1"   fill="#8a7060"/>
      <rect x="167" y="4"  width="26" height="8" rx="2"   fill={c}/>
      {/* Industrial hero block */}
      <rect y="16" width="200" height="57" fill="#2d2218"/>
      {/* hatching / industrial grid feel */}
      <line x1="0"   y1="16" x2="12"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      <line x1="16"  y1="16" x2="28"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      <line x1="32"  y1="16" x2="44"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      <line x1="48"  y1="16" x2="60"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      <line x1="64"  y1="16" x2="76"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      <line x1="80"  y1="16" x2="92"  y2="28" stroke="#3d3228" strokeWidth="0.6"/>
      {/* Bold headline */}
      <rect x="10" y="26" width="112" height="11" rx="2"   fill={c} opacity="0.88"/>
      <rect x="10" y="41" width="88"  height="7"  rx="1.5" fill="white" opacity="0.55"/>
      <rect x="10" y="52" width="68"  height="5"  rx="1.5" fill="white" opacity="0.32"/>
      <rect x="10" y="61" width="46"  height="9"  rx="2"   fill={c}/>
      {/* Right — factory/equipment block */}
      <rect x="130" y="20" width="64" height="50" rx="3"   fill="#3a2a16"/>
      <rect x="134" y="24" width="56" height="42" rx="2"   fill="#241810"/>
      <rect x="136" y="29" width="22" height="30" rx="2"   fill={c} opacity="0.18"/>
      <rect x="162" y="36" width="22" height="22" rx="2"   fill={c} opacity="0.13"/>
      <rect x="140" y="26" width="4"  height="34" rx="1"   fill={c} opacity="0.28"/>
      <rect x="150" y="32" width="4"  height="28" rx="1"   fill={c} opacity="0.22"/>
      <rect x="160" y="28" width="4"  height="32" rx="1"   fill={c} opacity="0.2"/>
      {/* 3 spec/info blocks */}
      <rect y="73" width="200" height="57" fill="#f5f0ea"/>
      <rect x="4"   y="80" width="60" height="42" rx="3" fill="white" stroke="#d4b896" strokeWidth="0.8"/>
      <rect x="70"  y="80" width="60" height="42" rx="3" fill="white" stroke="#d4b896" strokeWidth="0.8"/>
      <rect x="136" y="80" width="60" height="42" rx="3" fill="white" stroke="#d4b896" strokeWidth="0.8"/>
      <rect x="10"  y="87" width="16" height="10" rx="2" fill={c} opacity="0.14"/>
      <rect x="76"  y="87" width="16" height="10" rx="2" fill={c} opacity="0.14"/>
      <rect x="142" y="87" width="16" height="10" rx="2" fill={c} opacity="0.14"/>
      <rect x="10"  y="100" width="44" height="4"   rx="1.5" fill="#b09080"/>
      <rect x="76"  y="100" width="44" height="4"   rx="1.5" fill="#b09080"/>
      <rect x="142" y="100" width="44" height="4"   rx="1.5" fill="#b09080"/>
      <rect x="10"  y="107" width="36" height="3.5" rx="1"   fill="#c8b8a8"/>
      <rect x="76"  y="107" width="36" height="3.5" rx="1"   fill="#c8b8a8"/>
      <rect x="142" y="107" width="36" height="3.5" rx="1"   fill="#c8b8a8"/>
    </>
  );
}

// ⑤ 로컬 비즈니스형 — 친근한 헤더 + 핑크 히어로 + 둥근 3-카드
function LayoutLocalBusiness({ c }: { c: string }) {
  return (
    <>
      <rect width="200" height="130" fill="white"/>
      {/* Header */}
      <rect width="200" height="14" fill="white" stroke="#f8d0e4" strokeWidth="0.5"/>
      <rect x="8"   y="3.5" width="22" height="7" rx="2"   fill={c} opacity="0.85"/>
      <rect x="118" y="5"   width="14" height="4" rx="1"   fill="#e8a0c0"/>
      <rect x="136" y="5"   width="14" height="4" rx="1"   fill="#e8a0c0"/>
      <rect x="156" y="3.5" width="38" height="7" rx="3.5" fill={c}/>
      {/* Hero — warm pink */}
      <rect y="14" width="200" height="57" fill="#fdf2f8"/>
      <ellipse cx="162" cy="42" rx="52" ry="42" fill={c} opacity="0.06"/>
      {/* Centered content */}
      <rect x="36" y="22" width="128" height="9"   rx="3"   fill="#831843" opacity="0.73"/>
      <rect x="50" y="35" width="100" height="4.5" rx="1.5" fill="#b060a0" opacity="0.42"/>
      <rect x="60" y="42" width="80"  height="4"   rx="1.5" fill="#b060a0" opacity="0.28"/>
      {/* 2 friendly CTAs */}
      <rect x="38"  y="53" width="52" height="12" rx="6"   fill={c}/>
      <rect x="94"  y="53" width="68" height="12" rx="6"   fill="white" stroke={c} strokeWidth="1"/>
      {/* 3 rounded cards */}
      <rect y="71" width="200" height="59" fill="#fff5f9"/>
      <rect x="6"   y="78" width="58" height="44" rx="9" fill="white" stroke="#f0c0d8" strokeWidth="0.8"/>
      <rect x="71"  y="78" width="58" height="44" rx="9" fill="white" stroke="#f0c0d8" strokeWidth="0.8"/>
      <rect x="136" y="78" width="58" height="44" rx="9" fill="white" stroke="#f0c0d8" strokeWidth="0.8"/>
      {/* circle icons */}
      <circle cx="22"  cy="92" r="7" fill={c} opacity="0.14"/>
      <circle cx="87"  cy="92" r="7" fill={c} opacity="0.14"/>
      <circle cx="152" cy="92" r="7" fill={c} opacity="0.14"/>
      {/* card labels */}
      <rect x="12"  y="103" width="38" height="4.5" rx="1.5" fill="#c080a0"/>
      <rect x="77"  y="103" width="38" height="4.5" rx="1.5" fill="#c080a0"/>
      <rect x="142" y="103" width="38" height="4.5" rx="1.5" fill="#c080a0"/>
      <rect x="14"  y="110" width="30" height="3.5" rx="1"   fill="#e0b0c8"/>
      <rect x="79"  y="110" width="30" height="3.5" rx="1"   fill="#e0b0c8"/>
      <rect x="144" y="110" width="30" height="3.5" rx="1"   fill="#e0b0c8"/>
      <rect x="16"  y="115" width="22" height="3"   rx="1"   fill="#f0c8dc"/>
      <rect x="81"  y="115" width="22" height="3"   rx="1"   fill="#f0c8dc"/>
      <rect x="146" y="115" width="22" height="3"   rx="1"   fill="#f0c8dc"/>
    </>
  );
}
