import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetCard, Atmosphere, COLORS, DisplayTitle, Eyebrow, Vignette} from '../components';
import {progress} from '../timeline';

export const RadarToTide: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const reveal = progress(frame, 42, 84);
  const exit = progress(frame, durationInFrames - 4, durationInFrames);
  const angle = interpolate(reveal, [0, 1], [0, 360]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={0.86} />
      <Eyebrow style={{position: 'absolute', left: 70, top: 150}}>From atmosphere to ocean</Eyebrow>
      <DisplayTitle size={122} style={{position: 'absolute', left: 66, top: 232, width: 950}}>
        See it move.<br /><span style={{color: COLORS.cyan}}>Before it hits.</span>
      </DisplayTitle>
      <div style={{
        position: 'absolute', left: 60, top: 560, width: 960, height: 950, borderRadius: 54,
        overflow: 'hidden', background: '#071c31', border: '1px solid rgba(91,224,255,.28)',
        boxShadow: '0 60px 120px rgba(0,0,0,.5)', opacity: 1 - exit,
      }}>
        <AssetCard src="elements/radar.png" width={900} style={{left: 30, top: 80}} />
        <div style={{
          position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #0a5b78, #04101f 72%)',
          maskImage: `conic-gradient(from -90deg at 50% 50%, #000 0deg, #000 ${angle}deg, transparent ${angle + 0.5}deg)`,
          WebkitMaskImage: `conic-gradient(from -90deg at 50% 50%, #000 0deg, #000 ${angle}deg, transparent ${angle + 0.5}deg)`,
        }}><AssetCard src="elements/tide.png" width={900} style={{left: 30, top: 10}} /></div>
        {reveal > 0 && reveal < 1 ? <div style={{
          position: 'absolute', left: 480, top: 475, width: 720, height: 10, transformOrigin: '0 50%',
          transform: `rotate(${angle - 90}deg)`,
          background: 'linear-gradient(90deg, rgba(109,237,255,1), rgba(109,237,255,0))',
          boxShadow: '0 0 26px rgba(74,228,255,.9)',
        }} /> : null}
      </div>
      <div style={{
        position: 'absolute', left: 70, bottom: 260, color: COLORS.muted,
        fontFamily: 'Inter, sans-serif', fontSize: 31, lineHeight: 1.3, letterSpacing: 1.2,
        opacity: progress(frame, 80, 98) * (1 - exit),
      }}>Live radar. Daily tide.<br />One continuous forecast.</div>
      <div style={{
        position: 'absolute', left: 330, top: 522, width: 420, height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 27, border: '1px solid rgba(64,231,255,.5)',
        background: 'rgba(2,18,31,.9)', color: COLORS.white,
        boxShadow: '0 14px 36px rgba(0,0,0,.38)',
        fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 750,
        letterSpacing: 2.4, textTransform: 'uppercase',
      }}>Sample UI locations</div>
      <Vignette />
    </AbsoluteFill>
  );
};
