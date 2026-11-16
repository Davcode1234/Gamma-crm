export const AVATAR_COLORS = [
  '#1D4ED8', // blue
  '#047857', // green
  '#7C3AED', // purple
  '#B91C1C', // red
  '#0E7490', // cyan
  '#C2410C', // orange
  '#86198F', // magenta
  '#4D7C0F', // olive
  '#A16207', // amber
  '#BE185D', // pink
  '#334155', // slate
  '#1E3A8A', // navy
] as const;

/* eslint-disable no-bitwise */
const hashString = (str: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};
/* eslint-enable no-bitwise */

export const getUserColor = (user: { _id: string; color?: string }): string =>
  user.color ||
  AVATAR_COLORS[hashString(String(user._id)) % AVATAR_COLORS.length];

/** First palette color not used by any of the given users. */
export const getFirstFreeColor = (
  users: { _id: string; color?: string }[]
): string => {
  const taken = new Set(users.map((u) => getUserColor(u).toUpperCase()));
  return AVATAR_COLORS.find((c) => !taken.has(c)) ?? AVATAR_COLORS[0];
};
