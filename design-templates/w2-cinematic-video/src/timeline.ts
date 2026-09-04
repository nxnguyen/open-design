export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 900;

export const SHOTS = {
  opening: {from: 0, duration: 118},
  orbit: {from: 118, duration: 162},
  signals: {from: 280, duration: 133},
  radarTide: {from: 413, duration: 133},
  accelerando: {from: 546, duration: 133},
  launch: {from: 679, duration: 221},
} as const;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const ease = (value: number) => {
  const v = clamp(value);
  return v * v * (3 - 2 * v);
};

export const progress = (frame: number, from: number, to: number) =>
  ease((frame - from) / Math.max(1, to - from));
