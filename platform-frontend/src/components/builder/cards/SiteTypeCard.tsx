import type { SiteTypeOption } from '../../../features/siteBuilder/types';

interface Props {
  opt: SiteTypeOption;
  selected: boolean;
  onSelect: () => void;
}

// 사이트 유형 카드 1장. 비활성 카드는 button 자체가 disabled.
export default function SiteTypeCard({ opt, selected, onSelect }: Props) {
  const cls = [
    'site-type-card',
    opt.enabled ? 'enabled' : 'disabled',
    selected ? 'selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <li>
      <button type="button" className={cls} disabled={!opt.enabled} onClick={onSelect}>
        <div className="site-type-card-head">
          <span className="title">{opt.label}</span>
          <span className={`pricing pricing-${opt.pricing}`}>
            {opt.pricing === 'free' ? '무료' : '유료'}
          </span>
        </div>
        <p className="desc">{opt.desc}</p>
        <div className="status">
          {opt.enabled ? (selected ? '✓ 선택됨' : '선택하기') : '준비 중'}
        </div>
      </button>
    </li>
  );
}
