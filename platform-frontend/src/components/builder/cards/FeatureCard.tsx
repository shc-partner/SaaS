import type { FeatureOption } from '../../../features/siteBuilder/types';

interface Props {
  opt: FeatureOption;
  checked: boolean;
  onToggle: () => void;
}

// 기능 토글 카드. label 클릭 = 체크박스 클릭.
export default function FeatureCard({ opt, checked, onToggle }: Props) {
  return (
    <li>
      <label className={`feature-card ${checked ? 'checked' : ''}`}>
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <div className="feature-card-text">
          <strong>{opt.label}</strong>
          <small>{opt.desc}</small>
        </div>
      </label>
    </li>
  );
}
