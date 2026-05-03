import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// 컴포넌트가 매번 RootState/AppDispatch 를 import 하지 않도록 묶어둔 타입 hook.
// 사용 규칙: useDispatch/useSelector 대신 이 두 개를 쓴다.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
