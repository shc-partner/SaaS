import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// 컴포넌트 곳곳에서 RootState/AppDispatch 를 다시 import 하지 않도록 묶어둔 hook.
// 사용 규칙: 직접 useDispatch/useSelector 대신 이 두 가지를 쓴다.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
