# video-shotcraft evaluation for OpenDesign

Date: 2026-09-04  
Evaluated revision: `6c116cbd24eeb43c99d396696b509f8d88e58789`

## Decision

Install and evaluate `video-shotcraft` as a local Codex skill, without forking
or vendoring the upstream repository yet. Build the first real integration as
a self-contained W2 Remotion design template that consumes Figma exports.

## Findings

- The upstream project is an agent skill and production methodology rather
  than a hosted video API. Its render path is local Remotion + Chromium +
  FFmpeg, so it needs no generation API key.
- It includes 157 shot recipes, 214 preview styles, a complete 36.2-second
  template, deterministic Remotion demos, SFX/BGM assets, and a structured
  final-review gate.
- Upstream code is Apache-2.0. Redistribution must retain the license and
  notices and mark modified files.
- Remotion has a separate license. Its current terms allow individuals,
  non-profits, and for-profit organizations with up to three employees to use
  it under the free license; other for-profit organizations need a company
  license. This must be checked before commercial deployment.
- The bundled audio has per-file attribution. For production, use only tracks
  with a traceable source URL; avoid `bgm-tech-house.mp3`, whose exact Mixkit
  page cannot be reconstructed.

## Prototype strategy

Use the W2 Figma project as the risky-path test:

1. export real 3× screens and component cards through the Figma REST API;
2. create a 900-frame portrait Remotion composition;
3. adapt exact Shotcraft recipe timings rather than inventing generic motion;
4. render five review iterations at reduced scale, inspecting full-resolution
   stills for text and texture quality;
5. render a full-resolution H.264/AAC master and no-BGM master;
6. upload only the final raw master to the `Claude bot` Shared Drive.

## Red-team alternative

The existing FFmpeg motion-poster renderer remains the better default for a
single static ad: it is fast, dependency-light, and has no additional engine
license. `video-shotcraft` is justified only for multi-scene narrative work
where camera choreography, feature sequencing, motion typography, and sound
design materially improve the result. The OpenDesign UI should therefore keep
both paths instead of replacing the static renderer.

## Primary sources

- Upstream repository: https://github.com/Vincentwei1021/video-shotcraft
- Upstream Apache-2.0 license: https://github.com/Vincentwei1021/video-shotcraft/blob/main/LICENSE
- Remotion license: https://www.remotion.dev/docs/license
- Mixkit item licenses: https://mixkit.co/license/
