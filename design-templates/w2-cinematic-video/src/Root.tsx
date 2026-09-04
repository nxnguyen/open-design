import React from 'react';
import {Composition} from 'remotion';
import {W2Cinematic} from './W2Cinematic';
import {DURATION, FPS, HEIGHT, WIDTH} from './timeline';

export const Root: React.FC = () => (
  <Composition
    id="W2Cinematic"
    component={W2Cinematic}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={DURATION}
    defaultProps={{bgm: true}}
  />
);
