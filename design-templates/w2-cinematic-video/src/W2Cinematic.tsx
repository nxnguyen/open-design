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
        src={staticFile('audio/house-vibez.mp3')}
        volume={(frame) => {
          const fadeIn = Math.min(1, frame / 20);
          const fadeOut = Math.min(1, (DURATION - frame) / 40);
          return 0.26 * fadeIn * fadeOut;
        }}
      />
    ) : null}
  </AbsoluteFill>
);
