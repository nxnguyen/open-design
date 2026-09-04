export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 900;

export const SHOTS = {
  opening: {from: 0, duration: 120},
  orbit: {from: 120, duration: 165},
  signals: {from: 285, duration: 135},
  radarTide: {from: 420, duration: 135},
  accelerando: {from: 555, duration: 135},
  launch: {from: 690, duration: 210},
} as const;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const ease = (value: number) => {
  const v = clamp(value);
  return v * v * (3 - 2 * v);
};

export const progress = (frame: number, from: number, to: number) =>
  ease((frame - from) / Math.max(1, to - from));
