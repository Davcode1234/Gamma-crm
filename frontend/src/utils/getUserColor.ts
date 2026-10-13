// const avatarColors = [
//   '#1D4ED8', // Blue
//   '#047857', // Green
//   '#7C3AED', // Purple
//   '#BE123C', // Rose
//   '#0F766E', // Teal
//   '#9A3412', // Orange
//   '#4338CA', // Indigo
//   '#B91C1C', // Red
//   '#0369A1', // Sky blue
//   '#86198F', // Violet
// ];

export const getUserColor = (userId: string): string => {
  const hash = Array.from(userId).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 360,
    0
  );

  return `hsl(${hash}, 65%, 35%)`;
};
