const HOUR_TO_THEME = {
  7: '総合',
  8: '経済',
  9: '国内',
  10: '国際',
  13: 'IT',
  14: '文化',
  15: 'スポーツ',
  16: '科学',
};

/**
 * Detect article theme from publish datetime (JST hour).
 * Returns one of the 8 themes; falls back to '総合' for unmapped hours.
 */
export function detectTheme(date) {
  const jstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const jstHour = new Date(jstMs).getUTCHours();
  return HOUR_TO_THEME[jstHour] ?? '総合';
}
