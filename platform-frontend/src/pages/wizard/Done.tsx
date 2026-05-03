import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetSiteBuilder, selectBasic } from '../../features/siteBuilder/siteBuilderSlice';

// done 화면이 라우트 state 로 받는 부가 정보.
interface DoneLocationState {
  createdAt?: string;
}

// mock 생성 완료 화면.
// 실제 다운로드 토큰/생성 진행 상태는 다음 Phase 에서 연결.
export default function Done() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basic = useAppSelector(selectBasic);

  const state = (location.state ?? null) as DoneLocationState | null;

  const handleNew = () => {
    dispatch(resetSiteBuilder());
    navigate('/sites/new/type');
  };

  return (
    <section className="step step-done">
      <h2>생성 요청을 받았습니다 (mock)</h2>
      <p className="step-desc">
        다음 단계에서 실제 생성 엔진이 연결되면, 이 화면에서 진행 상태와 다운로드 링크가 나타납니다.
      </p>

      <div className="done-card">
        <div><strong>생성 ID</strong> <code>{id}</code></div>
        <div><strong>대상 사이트</strong> {basic.siteName} <code>({basic.slug})</code></div>
        {state?.createdAt && (
          <div><strong>요청 시각</strong> {state.createdAt}</div>
        )}
      </div>

      <div className="form-actions">
        <Link to="/" className="btn-ghost">← 홈으로</Link>
        <button type="button" className="cta" onClick={handleNew}>
          새로운 사이트 만들기
        </button>
      </div>
    </section>
  );
}
