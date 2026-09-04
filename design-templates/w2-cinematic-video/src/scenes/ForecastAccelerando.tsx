import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Atmosphere, COLORS, DisplayTitle, Eyebrow, Vignette} from '../components';
import {progress} from '../timeline';

const cuts = [0, 33, 60, 82, 100, 116];
const screens = [
  'screens/today.png', 'screens/thirty-days.png', 'screens/metrics.png',
  'screens/sun-moon.png', 'screens/radar-tide.png', 'screens/moon-tide.png',
] as const;
const labels = ['NOW', '30 DAYS', 'RAIN', 'SUN', 'RADAR', 'TIDE'];

export const ForecastAccelerando: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  let index = 0;
  for (let i = 0; i < cuts.length; i += 1) if (frame >= cuts[i]) index = i;
  const active = screens[index % screens.length];
  const previousCut = cuts[Math.min(index, cuts.length - 1)];
  const impact = progress(frame, previousCut, previousCut + 4);
  const exit = progress(frame, durationInFrames - 4, durationInFrames);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: COLORS.ink}}>
      <Atmosphere intensity={0.6} />
      <Img src={staticFile(active)} style={{
        position: 'absolute', width: 1180, height: 'auto', left: -50,
        top: interpolate(impact, [0, 1], [-420, -340]), filter: 'saturate(1.12) contrast(1.04)',
        transform: `scale(${interpolate(impact, [0, 1], [1.07, 1])})`, opacity: 1 - exit,
      }} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(1,7,13,.05) 28%, rgba(1,7,13,.88) 75%, #01070d 100%)'}} />
      <Eyebrow style={{position: 'absolute', left: 70, top: 150}}>The whole weather story</Eyebrow>
      <DisplayTitle size={158} style={{position: 'absolute', left: 66, top: 1170, width: 960}}>
        {labels[index % labels.length]}<span style={{color: COLORS.cyan}}>.</span>
      </DisplayTitle>
      <div style={{position: 'absolute', left: 70, top: 1395, width: 940, display: 'flex', gap: 18}}>
        {labels.map((label, chipIndex) => <div key={label} style={{
          flex: 1, height: 7, borderRadius: 9,
          background: chipIndex === index % labels.length ? COLORS.cyan : 'rgba(188,225,241,.24)',
          boxShadow: chipIndex === index % labels.length ? '0 0 22px rgba(64,231,255,.7)' : 'none',
        }} />)}
      </div>
      <div style={{
        position: 'absolute', left: 70, top: 1490, color: COLORS.white, fontFamily: 'Inter, sans-serif',
        fontSize: 41, fontWeight: 700, lineHeight: 1.15, opacity: progress(frame, 96, 108) * (1 - exit),
      }}>One app. Every horizon.</div>
      <Vignette />
    </AbsoluteFill>
  );
};
