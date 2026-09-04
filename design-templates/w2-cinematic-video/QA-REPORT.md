# Final QA report

## Delivery contract

- Composition: `W2Cinematic`
- Format: vertical paid-social MP4 (H.264 + AAC)
- Resolution: 1080 × 1920 (9:16)
- Frame rate: 30 fps constant
- Frames: 900
- Video duration: 30.000 seconds
- Audio duration: 30.000 seconds
- Audio sample rate: 48 kHz
- Delivery bitrate: approximately 4.28 Mb/s
- Color: YUV 4:2:0 limited range, BT.709 primaries/transfer/matrix
- File: `out/w2-cinematic-30s-raw.mp4`

## Automated checks

- TypeScript: `npm run typecheck` — pass
- Remotion full render: pass
- Video dimensions/frame count/duration (`ffprobe`) — pass
- Audio duration/sample rate (`ffprobe`) — pass
- Mastered loudness: −15.56 LUFS integrated, −1.50 dB true peak — pass
- Source-to-output audio lag: −0.375 ms — pass
- Maximum shot-boundary error against selected beat grid: 0.413 frame — pass
- Styleframe preview at desktop and 390 px mobile: zero browser console errors — pass

## Visual review

- Six representative full-resolution keyframes checked at 2.333, 6.333,
  11.333, 16.333, 20.666 and 27.000 seconds.
- Boundary frames checked around 117/118, 279/280, 412/413, 545/546 and
  678/679.
- Headlines remain inside the 70 px horizontal safe margin.
- No placeholder UI or generated product screenshot is present.
- The final CTA holds for more than three seconds and the W2 wordmark holds for
  more than five seconds.
- Every state in the accelerated product recap now holds for at least 16 frames.
- The in-video CTA identifies Android; the paid-social campaign supplies the
  actual destination through its native CTA configuration.
- Mixed demo geographies are explicitly labeled as sample UI; the marketing
  copy does not present any sample location as the viewer’s live forecast.
- Product claims shown are limited to capabilities visible in the supplied
  Figma design: forecast, radar, tide, UV, wind and air quality.

## Known content constraint

The Figma design contains frozen demonstration data and locations (including
Berlin and Hon Dau). The ad therefore presents product capabilities, not a live
weather report. Before a real paid campaign, the owner should confirm the final
store CTA destination and any required legal copy.

## Review artifacts

- `assets/poster.jpg`
- `assets/final-contact-sheet.jpg`
- `analysis/beat_data.json`
- `analysis/output_sync.json`
- `ITERATIONS.md`
- `AUDIO-CREDITS.md`
