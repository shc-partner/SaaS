import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSiteType,
  setSiteType,
  type SiteType,
} from '../../features/siteBuilder/siteBuilderSlice';

// Stage 1 은 기업 소개형 1종만 활성. 나머지는 비활성 카드로 노출만.
interface TypeOption {
  id: NonNullable<SiteType> | 'reservation' | 'blog';
  title: string;
  desc: string;
  enabled: boolean;
}

const TYPES: ReadonlyArray<TypeOption> = [
  {
    id: 'company-intro',
    title: '기업 소개형',
    desc: '회사 정보, 서비스, 문의 페이지로 구성된 단일 사이트.',
    enabled: true,
  },
  { id: 'reservation', title: '예약형', desc: '추후 제공 예정.', enabled: false },
  { id: 'blog',        title: '블로그형', desc: '추후 제공 예정.', enabled: false },
];

export default function TypeSelect() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const siteType = useAppSelector(selectSiteType);

  const choose = (id: NonNullable<SiteType>) => {
    dispatch(setSiteType(id));
    navigate('/sites/new/setup/basic');
  };

  return (
    <section className="step step-type">
      <h2>어떤 사이트를 만들까요?</h2>
      <p className="step-desc">유형을 선택하면 다음 단계로 이동합니다.</p>
      <ul className="type-list">
        {TYPES.map((t) => {
          const selected = siteType === t.id;
          const cls = [
            'type-card',
            t.enabled ? 'active' : 'disabled',
            selected ? 'selected' : '',
          ].join(' ').trim();
          return (
            <li key={t.id} className={cls}>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              {t.enabled ? (
                <button className="cta" onClick={() => choose(t.id as NonNullable<SiteType>)}>
                  {selected ? '선택됨 — 다음으로' : '이 유형으로 만들기'}
                </button>
              ) : (
                <span className="badge muted">추후 제공</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
