# W2 production iterations

The acceptance loop used rendered output, not source inspection alone. Every
round was reviewed from either a complete 30-second preview or full-resolution
stills extracted at representative and boundary frames.

| Round | Evidence | Main defect found | Production change |
|---|---|---|---|
| 1 — visual POC | `v1-preview.mp4`, six-frame contact sheet | Static direction was strong, but the timeline ignored the selected score and signal cards were only approximate. | Established the six-shot 9:16 sequence using genuine Figma screens and components. |
| 2 — beat lock | `v2-preview.mp4`, `beat_data.json` | Source score had a long intro and AAC output was longer than the visual stream. | Trimmed a sample-accurate 30-second WAV; moved five shot boundaries onto the 122.02 BPM grid. |
| 3 — asset fidelity | `v3-preview.mp4`, frame 340 | Wind and UV were represented by nearby components rather than their exact Figma nodes. | Exported node `533:118001` (Wind) and `533:118002` (UV) directly from Figma. |
| 4 — information integrity | `v4-preview.mp4`, frames 340/385, 12-frame contact sheet | Figma’s paired metric groups created duplicated Wind/UV cards after the new exports were added. | Separated visual cards from numeric fact labels; retained one deliberate Wind close-up and replaced the duplicate with AQI. |
| 5 — pace and mastering | `v5-preview.mp4`, 12-frame contact sheet | Twelve-frame pre-cut fades created dead air; the mix measured −22.84 LUFS. | Reduced pre-cut fade to four frames; mastered to −16 LUFS / −1.5 dBTP and forced both streams to exactly 30.000 seconds. |
| 6 — encoded sync | full-resolution master, `output_sync.json` | The first AAC render introduced a measured 42.375 ms audio delay. | Rendered the Remotion mix to lossless WAV and muxed it once; final measured lag is −0.375 ms and every main cut is within 0.413 frame of the beat grid. |

The final deliverable is intentionally not a generated-image ad. Typography,
layout, brand copy, app UI, timing and export are deterministic code; the
product visuals are exact exports from the supplied W2 Figma file.
