---
name: w2-cinematic-video
description: |
  A production Remotion sample for a 30-second vertical mobile-app promo built
  from real W2 Weather Figma screens. Use it as the reference implementation
  for cinematic app videos, Figma-to-motion work, or paid-social 9:16 exports.
triggers:
  - "cinematic app video"
  - "figma to video"
  - "motion graphic ad"
  - "video quảng cáo app"
  - "W2 video"
od:
  mode: video
  platform: mobile
  scenario: marketing
  preview:
    type: html
    entry: example.html
  design_system:
    requires: false
  craft:
    requires: [typography-hierarchy, accessibility-baseline]
  example_prompt: "Create a cinematic 30-second 9:16 product video from my mobile-app Figma frames, then render, inspect keyframes, and iterate before delivery."
---

# W2 Cinematic Video

This template demonstrates a deterministic Figma-to-Remotion production flow.
It uses real exported W2 screens for product truth, while typography, lighting,
transitions, camera movement, and sound remain code-native and editable.

## Output contract

- 1080×1920, 30fps, exactly 30 seconds.
- H.264 MP4 with AAC audio and `yuv420p` pixel format.
- A matching no-BGM version with all SFX preserved.
- Full-resolution keyframes and a visual-QA contact sheet.
- No live weather data, personal data, remote assets, or runtime API keys.

## Render

Run inside this directory:

```bash
npm ci
npm run typecheck
npm run render
npm run render:nobgm
```

For fast review passes, use `npm run render:preview`.

## Production rules

1. Read `DESIGN-SPEC.md` before changing the timeline.
2. Preserve the source Figma screenshots for every product UI shot.
3. Keep headline text at least 72px at final 1080×1920 resolution.
4. Never add handheld shake. Camera motion must settle to a true static hold.
5. Re-render and inspect the documented keyframes after every visual change.
6. If the timeline moves after sound is added, re-check every SFX cue.
7. Keep rendering deterministic: no `Date.now()`, unseeded randomness, or live data.

