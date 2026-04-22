import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <section className="landing">
      <h1>SiteForge</h1>
      <p className="tagline">
        클릭 몇 번으로 기업 소개 사이트를 만들고, 그대로 다운로드해서 어디서든 실행하세요.
      </p>
      {/* 사용자가 진입하면 곧바로 생성 위저드의 첫 단계(유형 선택)로 이동한다.
          /start 는 별칭으로 /sites/new/type 에 리다이렉트된다. 외부 딥링크용. */}
      <button className="cta" onClick={() => navigate('/sites/new/type')}>
        사이트 만들기 시작
      </button>
    </section>
  );
}
