import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, progress} from './timeline';

export const COLORS = {
  ink: '#020913',
  navy: '#061d31',
  sky: '#1cb9f4',
  cyan: '#40e7ff',
  white: '#f6fbff',
  muted: '#a9c7d9',
  orange: '#ffb92e',
  lime: '#a6e93b',
} as const;

export const baseFont: React.CSSProperties = {
  fontFamily:
    'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  color: COLORS.white,
};

export const Atmosphere: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame / 75) * 7;
  return (
    <div
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'linear-gradient(170deg, #020813 0%, #061a2d 45%, #093451 100%)',
      }}
    >
      <div style={{
        position: 'absolute', width: 980, height: 980, top: -250 + shift, right: -420,
        borderRadius: '50%', opacity: 0.42 * intensity, filter: 'blur(42px)',
        background: 'radial-gradient(circle, rgba(33,190,248,.9) 0%, rgba(20,121,183,.42) 40%, transparent 72%)',
      }} />
      <div style={{
        position: 'absolute', width: 1200, height: 720, left: -520, bottom: 120 + shift * 2,
        opacity: 0.26 * intensity, filter: 'blur(55px)',
        background: 'radial-gradient(ellipse, rgba(22,172,226,.92), rgba(3,32,55,.1) 72%)',
        transform: 'rotate(-18deg)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.24,
        backgroundImage: 'linear-gradient(rgba(89,215,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(89,215,255,.05) 1px, transparent 1px)',
        backgroundSize: '96px 96px', transform: `translateY(${frame % 96}px)`,
        maskImage: 'linear-gradient(to bottom, transparent, #000 25%, #000 80%, transparent)',
      }} />
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 240px rgba(0,0,0,.62)'}} />
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{
    ...baseFont, color: COLORS.cyan, fontSize: 28, lineHeight: 1, fontWeight: 800,
    letterSpacing: 7, textTransform: 'uppercase', ...style,
  }}>{children}</div>
);

export const DisplayTitle: React.FC<{
  children: React.ReactNode; size?: number; style?: React.CSSProperties;
}> = ({children, size = 118, style}) => (
  <div style={{
    ...baseFont, fontSize: size, lineHeight: 0.9, fontWeight: 860,
    letterSpacing: -6, textTransform: 'uppercase', textWrap: 'balance', ...style,
  }}>{children}</div>
);

export const Device: React.FC<{
  src: string; width?: number; imageOffset?: number; style?: React.CSSProperties;
}> = ({src, width = 570, imageOffset = 0, style}) => {
  const height = width * (2436 / 1125);
  return (
    <div style={{
      position: 'absolute', width, height, borderRadius: width * 0.087, overflow: 'hidden',
      background: '#06101d', border: '3px solid rgba(209,242,255,.38)',
      boxShadow: '0 70px 140px rgba(0,0,0,.58), 0 0 80px rgba(49,196,255,.15), inset 0 0 0 3px rgba(0,0,0,.4)',
      ...style,
    }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${50 + imageOffset}%`,
      }} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 0 5px rgba(0,0,0,.26)'}} />
    </div>
  );
};

export const AssetCard: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => (
  <Img src={staticFile(src)} style={{
    position: 'absolute', width, height: 'auto', filter: 'drop-shadow(0 36px 45px rgba(0,0,0,.45))', ...style,
  }} />
);

export const KineticWord: React.FC<{
  children: React.ReactNode; from: number; x?: number; y?: number; size?: number;
  align?: 'left' | 'center' | 'right';
}> = ({children, from, x = 74, y = 120, size = 116, align = 'left'}) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, from, from + 16);
  const opacity = progress(frame, from, from + 6);
  return (
    <DisplayTitle size={size} style={{
      position: 'absolute', left: align === 'left' ? x : undefined,
      right: align === 'right' ? x : undefined, width: align === 'center' ? '100%' : undefined,
      top: y, textAlign: align, opacity,
      transform: `translateY(${interpolate(enter, [0, 1], [78, 0])}px)`,
      clipPath: `inset(${interpolate(enter, [0, 1], [100, 0])}% 0 0 0)`,
    }}>{children}</DisplayTitle>
  );
};

export const Vignette: React.FC = () => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'linear-gradient(to bottom, rgba(0,0,0,.32), transparent 16%, transparent 78%, rgba(0,0,0,.55))',
    boxShadow: 'inset 0 0 210px rgba(0,0,0,.3)',
  }} />
);

export const Ring: React.FC<{size: number; x: number; y: number; delay?: number}> = ({size, x, y, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = clamp((frame - delay) / 36);
  return <div style={{
    position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
    border: '2px solid rgba(76,220,255,.33)', opacity: (1 - p) * 0.8,
    transform: `scale(${0.75 + p * 0.5})`,
  }} />;
};
