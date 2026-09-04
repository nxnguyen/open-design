import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AssetCard, Atmosphere, COLORS, Eyebrow, Vignette} from '../components';
import {clamp, progress} from '../timeline';

const pieces = [
  {src: 'elements/today-chart.png', width: 390, x: -180, y: 260, r: -13},
  {src: 'elements/thirty-days-chart.png', width: 400, x: 760, y: 230, r: 11},
  {src: 'elements/precipitation.png', width: 330, x: -130, y: 740, r: -9},
  {src: 'elements/humidity.png', width: 330, x: 845, y: 715, r: 10},
  {src: 'elements/aqi.png', width: 430, x: -250, y: 1120, r: 8},
  {src: 'elements/sun.png', width: 360, x: 800, y: 1080, r: -10},
  {src: 'elements/moon.png', width: 390, x: -170, y: 1480, r: -12},
  {src: 'elements/radar.png', width: 390, x: 800, y: 1440, r: 9},
] as const;

export const W2Launch: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = progress(frame, 18, 48);
  const copy = progress(frame, 58, 78);
  const cta = progress(frame, 90, 108);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={1.05} />
      <div style={{
        position: 'absolute', left: -180, top: 500, width: 1440, height: 920, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31,183,239,.35), transparent 66%)',
        transform: `scale(${0.9 + Math.sin(frame / 28) * 0.04})`,
      }} />
      {pieces.map((piece, index) => {
        const p = clamp((frame - (4 + index * 3)) / 12);
        const eased = Easing.bezier(0.34, 1, 0.44, 1)(p);
        const startX = piece.x < 540 ? piece.x - 420 : piece.x + 420;
        const startY = piece.y + (index % 2 ? 180 : -180);
        return <AssetCard key={piece.src} src={piece.src} width={piece.width} style={{
          left: interpolate(eased, [0, 1], [startX, piece.x]), top: interpolate(eased, [0, 1], [startY, piece.y]),
          opacity: p * 0.82, transform: `rotate(${piece.r + Math.sin(frame / 42 + index) * 1.4}deg)`,
        }} />;
      })}
      {Array.from({length: 20}).map((_, index) => {
        const phase = index * 1.91;
        const radial = 210 + (index % 6) * 54 + frame * (0.3 + (index % 3) * 0.06);
        return <div key={index} style={{
          position: 'absolute', left: 540 + Math.cos(phase) * radial, top: 900 + Math.sin(phase) * radial,
          width: 4 + (index % 3) * 3, height: 4 + (index % 3) * 3, borderRadius: '50%',
          background: index % 4 === 0 ? COLORS.orange : COLORS.cyan,
          opacity: 0.3 + (index % 5) * 0.1, boxShadow: `0 0 20px ${COLORS.cyan}`,
        }} />;
      })}
      <div style={{
        position: 'absolute', left: 0, top: 575, width: '100%', textAlign: 'center',
        fontFamily: 'Inter, sans-serif', color: COLORS.white, fontSize: 360, lineHeight: 0.9,
        fontWeight: 900, letterSpacing: -28, opacity: logo,
        transform: `translateY(${interpolate(logo, [0, 1], [90, 0])}px) scale(${interpolate(logo, [0, 1], [0.78, 1])})`,
        textShadow: '0 30px 90px rgba(0,0,0,.48)',
      }}>W2</div>
      <Eyebrow style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', opacity: copy}}>
        Weather, beautifully clear
      </Eyebrow>
      <div style={{
        position: 'absolute', left: 70, top: 1090, width: 940, textAlign: 'center',
        fontFamily: 'Inter, sans-serif', color: COLORS.white, fontWeight: 850, fontSize: 88,
        lineHeight: 0.98, letterSpacing: -4, opacity: copy,
        transform: `translateY(${interpolate(copy, [0, 1], [40, 0])}px)`,
      }}>Know what’s next.</div>
      <div style={{
        position: 'absolute', left: 300, top: 1325, width: 480, height: 116, borderRadius: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00101c', background: COLORS.white,
        fontFamily: 'Inter, sans-serif', fontSize: 35, fontWeight: 850, letterSpacing: -0.5,
        opacity: cta, transform: `scale(${interpolate(cta, [0, 1], [0.82, 1])})`,
        boxShadow: '0 24px 65px rgba(0,0,0,.38)',
      }}>Get W2 on Android</div>
      <div style={{
        position: 'absolute', left: 340, top: 1490, width: 400, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 26, border: '1px solid rgba(64,231,255,.5)',
        background: 'rgba(2,18,31,.9)', color: COLORS.white,
        boxShadow: '0 14px 36px rgba(0,0,0,.38)',
        fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 750,
        letterSpacing: 2.4, textTransform: 'uppercase', opacity: progress(frame, 110, 132),
      }}>Sample product UI</div>
      <div style={{
        position: 'absolute', left: 0, top: 1585, width: '100%', textAlign: 'center',
        fontFamily: 'Inter, sans-serif', fontSize: 19, color: COLORS.muted, letterSpacing: 3.4,
        textTransform: 'uppercase', opacity: progress(frame, 110, 132),
      }}>Forecast · Radar · Tide · Air quality</div>
      <Vignette />
    </AbsoluteFill>
  );
};
