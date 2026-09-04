import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetCard, Atmosphere, Device, Eyebrow, KineticWord, Ring, Vignette} from '../components';
import {clamp, progress} from '../timeline';

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const entrance = progress(frame, 0, 28);
  const drift = Math.sin(frame / 27) * 8;
  const exit = progress(frame, durationInFrames - 14, durationInFrames);
  const spotlight = interpolate(frame, [0, 110], [-620, 760], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad),
  });
  const card = progress(frame, 36, 56);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={1.25} />
      {[0, 1, 2].map((index) => (
        <Ring key={index} size={560 + index * 200} x={-110 - index * 100} y={480 - index * 100} delay={index * 7} />
      ))}
      <div style={{
        position: 'absolute', width: 380, height: 2200, left: spotlight, top: -120,
        transform: 'rotate(14deg)', filter: 'blur(34px)', opacity: 0.36,
        background: 'linear-gradient(90deg, transparent, rgba(152,234,255,.88), transparent)',
      }} />
      <Eyebrow style={{position: 'absolute', left: 74, top: 112}}>W2 Weather · Berlin</Eyebrow>
      <Device src="screens/today.png" width={610} style={{
        left: 362, top: 255, opacity: 1 - exit,
        transform: `translateY(${interpolate(entrance, [0, 1], [142, 0]) + drift}px) rotate(${interpolate(entrance, [0, 1], [9, -4])}deg) scale(${1 - exit * 0.05})`,
      }} />
      <AssetCard src="elements/today-chart.png" width={575} style={{
        left: 72, top: 520, opacity: card * (1 - exit),
        transform: `translateY(${interpolate(card, [0, 1], [85, 0])}px) rotate(-1.2deg)`,
        outline: `2px solid rgba(70,228,255,${clamp((frame - 46) / 18) * 0.55})`, borderRadius: 30,
      }} />
      <KineticWord from={52} y={1245} size={135}>See the<br />day ahead.</KineticWord>
      <Vignette />
    </AbsoluteFill>
  );
};
