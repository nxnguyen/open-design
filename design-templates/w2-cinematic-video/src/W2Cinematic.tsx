import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {ForecastAccelerando} from './scenes/ForecastAccelerando';
import {ForecastOrbit} from './scenes/ForecastOrbit';
import {Opening} from './scenes/Opening';
import {RadarToTide} from './scenes/RadarToTide';
import {SignalSelfTest} from './scenes/SignalSelfTest';
import {W2Launch} from './scenes/W2Launch';
import {DURATION, SHOTS} from './timeline';

export type W2CinematicProps = {bgm: boolean};

const Sfx: React.FC<{from: number; duration: number; src: string; volume: number}> = ({
  from, duration, src, volume,
}) => (
  <Sequence from={from} durationInFrames={duration} premountFor={10}>
    <Audio src={staticFile(`audio/${src}`)} volume={volume} />
  </Sequence>
);

export const W2Cinematic: React.FC<W2CinematicProps> = ({bgm}) => (
  <AbsoluteFill style={{backgroundColor: '#020913'}}>
    <Sequence from={SHOTS.opening.from} durationInFrames={SHOTS.opening.duration} premountFor={30}>
      <Opening />
    </Sequence>
    <Sequence from={SHOTS.orbit.from} durationInFrames={SHOTS.orbit.duration} premountFor={30}>
      <ForecastOrbit />
    </Sequence>
    <Sequence from={SHOTS.signals.from} durationInFrames={SHOTS.signals.duration} premountFor={30}>
      <SignalSelfTest />
    </Sequence>
    <Sequence from={SHOTS.radarTide.from} durationInFrames={SHOTS.radarTide.duration} premountFor={30}>
      <RadarToTide />
    </Sequence>
    <Sequence from={SHOTS.accelerando.from} durationInFrames={SHOTS.accelerando.duration} premountFor={30}>
      <ForecastAccelerando />
    </Sequence>
    <Sequence from={SHOTS.launch.from} durationInFrames={SHOTS.launch.duration} premountFor={30}>
      <W2Launch />
    </Sequence>
    {bgm ? (
      <Audio
        src={staticFile('audio/w2-score.wav')}
        volume={(frame) => {
          const fadeIn = Math.min(1, frame / 20);
          const fadeOut = Math.min(1, (DURATION - frame) / 40);
          return 0.24 * fadeIn * fadeOut;
        }}
      />
    ) : null}
    {bgm ? <>
      <Sfx from={0} duration={75} src="impact-deep-whoosh.mp3" volume={0.42} />
      <Sfx from={SHOTS.orbit.from} duration={50} src="sweep-scifi-fast.mp3" volume={0.24} />
      <Sfx from={SHOTS.signals.from + 15} duration={95} src="data-scan.mp3" volume={0.18} />
      <Sfx from={SHOTS.radarTide.from + 30} duration={70} src="wind-swoosh-short.mp3" volume={0.25} />
      <Sfx from={SHOTS.accelerando.from} duration={55} src="sweep-scifi-fast.mp3" volume={0.2} />
      <Sfx from={SHOTS.launch.from} duration={95} src="impact-movie-epic.mp3" volume={0.28} />
      <Sfx from={SHOTS.launch.from + 46} duration={110} src="shimmer-sparkle-sweep.mp3" volume={0.18} />
    </> : null}
  </AbsoluteFill>
);
