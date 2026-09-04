import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetCard, Atmosphere, COLORS, DisplayTitle, Eyebrow, Vignette} from '../components';
import {progress} from '../timeline';

const cards = [
  {src: 'elements/precipitation.png', top: 570, left: 58, width: 460, delay: 14},
  {src: 'elements/wind.png', top: 570, left: 562, width: 220, delay: 23},
  {src: 'code:uv', top: 570, left: 802, width: 220, delay: 28},
  {src: 'elements/wind.png', top: 835, left: 58, width: 460, delay: 32},
  {src: 'elements/aqi.png', top: 835, left: 562, width: 460, delay: 41},
] as const;

const facts = [
  {name: 'RAIN', value: '2.5 mm'},
  {name: 'WIND', value: '8.9 km/h'},
  {name: 'UV', value: '2 · LOW'},
  {name: 'AIR', value: '30 · GOOD'},
] as const;

export const SignalSelfTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const sweep = progress(frame, 16, 96);
  const exit = progress(frame, durationInFrames - 4, durationInFrames);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Atmosphere intensity={0.72} />
      <Eyebrow style={{position: 'absolute', left: 70, top: 150}}>Live weather intelligence</Eyebrow>
      <DisplayTitle size={118} style={{position: 'absolute', left: 67, top: 232, width: 940}}>
        Rain. Wind.<br /><span style={{color: COLORS.cyan}}>UV. Air.</span>
      </DisplayTitle>
      <div style={{
        position: 'absolute', left: 54, top: 533, width: 972, height: 800, borderRadius: 46,
        border: '1px solid rgba(94,218,255,.3)', background: 'rgba(4,18,32,.42)',
        overflow: 'hidden', opacity: 1 - exit,
      }}>
        <div style={{
          position: 'absolute', left: interpolate(sweep, [0, 1], [-90, 1050]), top: 0,
          width: 55, height: '100%', background: 'linear-gradient(90deg, transparent, rgba(64,231,255,.42), transparent)',
          filter: 'blur(7px)', zIndex: 5,
        }} />
        {cards.map((card) => {
          const p = progress(frame, card.delay, card.delay + 18);
          if (card.src === 'code:uv') {
            return <div key={card.src} style={{
              position: 'absolute', left: card.left - 54, top: card.top - 533,
              width: card.width, height: 218, borderRadius: 21, padding: '18px 17px',
              opacity: p, transform: `translateY(${interpolate(p, [0, 1], [54, 0])}px)`,
              background: 'linear-gradient(145deg, #343d59, #252e48)', color: COLORS.white,
              fontFamily: 'Inter, sans-serif', boxShadow: '0 26px 38px rgba(0,0,0,.38)',
            }}>
              <div style={{color: '#c8d4df', fontSize: 16, fontWeight: 750}}>☼ UV INDEX</div>
              <strong style={{display: 'block', fontSize: 48, lineHeight: 1, marginTop: 17}}>2</strong>
              <div style={{fontSize: 22, marginTop: 5}}>Low</div>
              <div style={{height: 8, borderRadius: 9, marginTop: 14, background: 'linear-gradient(90deg, #89c83a, #ffdc31, #ff8137, #802aac)'}} />
              <div style={{fontSize: 13, lineHeight: 1.25, color: '#e1eaf1', marginTop: 12}}>Minimal sun protection needed.</div>
            </div>;
          }
          if (card.src === 'elements/aqi.png') {
            return <div key={card.src} style={{
              position: 'absolute', left: card.left - 54, top: card.top - 533,
              width: card.width, height: 247, borderRadius: 26, padding: '24px 26px',
              opacity: p, transform: `translateY(${interpolate(p, [0, 1], [54, 0])}px)`,
              background: 'linear-gradient(145deg, #343d59, #252e48)',
              color: COLORS.white, fontFamily: 'Inter, sans-serif',
              boxShadow: '0 36px 45px rgba(0,0,0,.45)',
            }}>
              <div style={{color: '#c8d4df', fontSize: 20, fontWeight: 750, letterSpacing: 2}}>◉ AIR QUALITY</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 18}}>
                <strong style={{fontSize: 68, lineHeight: 1}}>30</strong>
                <span style={{fontSize: 25, color: '#bce97b', fontWeight: 850}}>GOOD</span>
              </div>
              <div style={{position: 'relative', height: 10, borderRadius: 10, marginTop: 20, background: 'linear-gradient(90deg, #8cc83b, #ffde32, #ff8734, #d83f51, #6f35b2)'}}>
                <i style={{position: 'absolute', left: '7%', top: -5, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 4px #303952'}} />
              </div>
              <div style={{fontSize: 16, color: '#e5edf4', marginTop: 18}}>Good air quality · Enjoy the outdoors.</div>
            </div>;
          }
          return <AssetCard key={`${card.src}-${card.left}`} src={card.src} width={card.width} style={{
            left: card.left - 54, top: card.top - 533, opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [54, 0])}px)`,
          }} />;
        })}
      </div>
      <div style={{
        position: 'absolute', left: 70, top: 1405, width: 930, display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 34, fontFamily: 'Inter, sans-serif', opacity: 1 - exit,
      }}>
        {facts.map((signal, index) => {
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
