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
| 7 — independent red-team | fresh-context review of all 900 frames | Figma’s AQI copy contradicted its value; mixed demo locations lacked disclosure; first master carried JPEG full-range/BT.470 metadata. | Rebuilt the AQI card with consistent copy, labeled demo locations as sample UI, removed Berlin from campaign copy and standardized the master to limited-range BT.709. |
| 8 — release polish | reviewer timing/safe-zone findings | The final recap dropped to 4–8 frames per state, source UV copy lacked spacing, top/bottom utility copy sat near platform chrome and the visual CTA did not name its platform. | Recut all six recap states to 16–33 frames, replaced UV microcopy with a clean code-native card, moved utility copy inward and changed the CTA to “Get W2 on Android”. |
| 9 — social-safe disclosure | final independent review at frames 490/810 | The required sample-data disclosure was present but could be obscured by right-side controls and bottom captions on paid-social platforms. | Promoted both disclosures into high-contrast centered pills within the primary safe area and rendered a new full master. |

The final deliverable is intentionally not a generated-image ad. Typography,
layout, brand copy, app UI, timing and export are deterministic code; the
product visuals are exact exports from the supplied W2 Figma file.
