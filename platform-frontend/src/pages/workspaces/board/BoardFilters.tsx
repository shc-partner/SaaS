import { useBoardDispatch, useBoardState } from '../../../features/workspaces/boardStore';
import { BOARD_CHANNEL_OPTIONS } from './boardChannels';

export default function BoardFilters() {
  const state = useBoardState();
  const dispatch = useBoardDispatch();

  return (
    <div className="ws-board-filters">
      <input
        type="text"
        className="ws-filter-search"
        placeholder="콘텐츠 검색..."
        value={state.searchQuery}
        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
      />
      <select
        className="ws-filter-select"
        value={state.filterChannel}
        onChange={(e) => dispatch({ type: 'SET_FILTER_CHANNEL', payload: e.target.value })}
      >
        <option value="">전체 채널</option>
        {BOARD_CHANNEL_OPTIONS.map((channel) => (
          <option key={channel} value={channel}>
            {channel}
          </option>
        ))}
      </select>
      <select
        className="ws-filter-select"
        value={state.filterFormat}
        onChange={(e) => dispatch({ type: 'SET_FILTER_FORMAT', payload: e.target.value })}
      >
        <option value="">전체 형식</option>
        <option value="리뷰">리뷰</option>
        <option value="언박싱">언박싱</option>
        <option value="브이로그">브이로그</option>
        <option value="튜토리얼">튜토리얼</option>
        <option value="정보전달">정보전달</option>
      </select>
    </div>
  );
}
