import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetCard, Atmosphere, COLORS, DisplayTitle, Eyebrow, Vignette} from '../components';
import {progress} from '../timeline';

const signals = [
  {name: 'RAIN', value: '2.5 mm', src: 'elements/precipitation.png', top: 570, left: 58, width: 460, delay: 14},
  {name: 'HUMIDITY', value: '50%', src: 'elements/humidity.png', top: 570, left: 562, width: 460, delay: 23},
  {name: 'UV', value: '2 · LOW', src: 'elements/sun.png', top: 835, left: 58, width: 460, delay: 32},
  {name: 'AIR', value: '30 · GOOD', src: 'elements/aqi.png', top: 835, left: 562, width: 460, delay: 41},
] as const;

export const SignalSelfTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const sweep = progress(frame, 16, 96);
  const exit = progress(frame, durationInFrames - 12, durationInFrames);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={0.72} />
      <Eyebrow style={{position: 'absolute', left: 70, top: 108}}>Live weather intelligence</Eyebrow>
      <DisplayTitle size={118} style={{position: 'absolute', left: 67, top: 190, width: 940}}>
        Rain. Wind.<br /><span style={{color: COLORS.cyan}}>UV. Air.</span>
      </DisplayTitle>
      <div style={{
        position: 'absolute', left: 54, top: 533, width: 972, height: 750, borderRadius: 46,
        border: '1px solid rgba(94,218,255,.3)', background: 'rgba(4,18,32,.42)',
        overflow: 'hidden', opacity: 1 - exit,
      }}>
        <div style={{
          position: 'absolute', left: interpolate(sweep, [0, 1], [-90, 1050]), top: 0,
          width: 55, height: '100%', background: 'linear-gradient(90deg, transparent, rgba(64,231,255,.42), transparent)',
          filter: 'blur(7px)', zIndex: 5,
        }} />
        {signals.map((signal) => {
          const p = progress(frame, signal.delay, signal.delay + 18);
          return <AssetCard key={signal.name} src={signal.src} width={signal.width} style={{
            left: signal.left - 54, top: signal.top - 533, opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [54, 0])}px)`,
          }} />;
        })}
      </div>
      <div style={{
        position: 'absolute', left: 70, top: 1370, width: 930, display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 34, fontFamily: 'Inter, sans-serif', opacity: 1 - exit,
      }}>
        {signals.map((signal, index) => {
          const p = progress(frame, 52 + index * 7, 68 + index * 7);
          return <div key={signal.name} style={{borderTop: '2px solid rgba(75,221,255,.35)', paddingTop: 18, opacity: p}}>
            <div style={{color: COLORS.muted, fontSize: 22, letterSpacing: 5, fontWeight: 700}}>{signal.name}</div>
            <div style={{color: COLORS.white, fontSize: 48, fontWeight: 800, marginTop: 7}}>{signal.value}</div>
          </div>;
        })}
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
