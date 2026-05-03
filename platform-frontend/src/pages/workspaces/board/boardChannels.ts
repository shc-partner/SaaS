export const BOARD_CHANNEL_OPTIONS = ['유튜브', '치지직', '숲', '트위치', '기타'] as const;

const CHANNEL_LABELS: Record<string, string> = {
  YouTube: '유튜브',
  youtube: '유튜브',
  chzzk: '치지직',
  Chzzk: '치지직',
  SOOP: '숲',
  soop: '숲',
  Twitch: '트위치',
  twitch: '트위치',
  other: '기타',
  Other: '기타',
};

const VISIBLE_CHANNELS = new Set<string>(BOARD_CHANNEL_OPTIONS);

export function normalizeBoardChannel(channel: string): string {
  return CHANNEL_LABELS[channel] ?? channel;
}

export function visibleBoardChannels(channels: string[]): string[] {
  return Array.from(
    new Set(channels.map(normalizeBoardChannel).filter((channel) => VISIBLE_CHANNELS.has(channel))),
  );
}

export function matchesBoardChannel(channels: string[], filterChannel: string): boolean {
  if (!filterChannel) return true;
  return visibleBoardChannels(channels).includes(filterChannel);
}
