import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetCard, Atmosphere, COLORS, Device, DisplayTitle, Eyebrow, Vignette} from '../components';
import {progress} from '../timeline';

const chips = [
  {src: 'elements/precipitation.png', width: 386, angle: -42, radius: 440, delay: 20},
  {src: 'elements/humidity.png', width: 386, angle: 28, radius: 435, delay: 28},
  {src: 'elements/sun.png', width: 390, angle: 118, radius: 410, delay: 36},
  {src: 'elements/aqi.png', width: 430, angle: 194, radius: 400, delay: 44},
] as const;

export const ForecastOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const enter = progress(frame, 0, 24);
  const exit = progress(frame, durationInFrames - 4, durationInFrames);
  const spin = frame * 0.16;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={0.9} />
      {[560, 760, 980, 1200].map((size, index) => (
        <div key={size} style={{
          position: 'absolute', width: size, height: size, left: 540 - size / 2, top: 820 - size / 2,
          borderRadius: '50%', border: `2px solid rgba(72,218,255,${0.22 - index * 0.035})`,
          transform: `scale(${1 + Math.sin(frame / 36 + index * 1.7) * 0.05})`,
        }} />
      ))}
      <Eyebrow style={{position: 'absolute', left: 74, top: 150}}>One glance · every signal</Eyebrow>
      <DisplayTitle size={108} style={{position: 'absolute', left: 70, top: 232, width: 900}}>
        Your forecast.<br />In focus.
      </DisplayTitle>
      <Device src="screens/thirty-days.png" width={510} imageOffset={interpolate(frame, [0, durationInFrames], [-2, 2])} style={{
        left: 285, top: 490, opacity: enter * (1 - exit),
        transform: `translateY(${interpolate(enter, [0, 1], [95, 0])}px) rotate(${Math.sin(frame / 48) * 2.2}deg)`,
      }} />
      {chips.map((chip, index) => {
        const p = progress(frame, chip.delay, chip.delay + 20);
        const a = ((chip.angle + spin) * Math.PI) / 180;
        return <AssetCard key={chip.src} src={chip.src} width={chip.width} style={{
          left: 540 + Math.cos(a) * chip.radius - chip.width / 2,
          top: 840 + Math.sin(a) * chip.radius - 110,
          opacity: p * (1 - exit) * 0.96,
          transform: `scale(${interpolate(p, [0, 1], [0.72, 1])}) rotate(${index % 2 ? 2 : -2}deg)`,
        }} />;
      })}
      <div style={{
        position: 'absolute', left: 74, bottom: 100, width: 920, display: 'flex', justifyContent: 'space-between',
        fontFamily: 'Inter, sans-serif', fontSize: 25, fontWeight: 700, letterSpacing: 4,
        color: COLORS.muted, textTransform: 'uppercase',
      }}><span>Hourly</span><span>30 days</span><span>Radar</span><span>Tide</span></div>
      <Vignette />
    </AbsoluteFill>
  );
};
