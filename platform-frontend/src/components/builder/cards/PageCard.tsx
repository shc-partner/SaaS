import type { PageOption } from '../../../features/siteBuilder/types';

interface Props {
  opt: PageOption;
  checked: boolean;
  onToggle: () => void;
}

// 페이지 선택 카드. 필수(required) 항목은 체크 고정 + 토글 비활성.
export default function PageCard({ opt, checked, onToggle }: Props) {
  const disabled = Boolean(opt.required);
  return (
    <li>
      <label className={`feature-card ${checked ? 'checked' : ''} ${disabled ? 'locked' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          disabled={disabled}
        />
        <div className="feature-card-text">
          <strong>
            {opt.label}
            {opt.required && <span className="badge brand" style={{ marginLeft: 8, fontSize: 10 }}>기본</span>}
          </strong>
          <small>{opt.desc}</small>
        </div>
      </label>
    </li>
  );
}
