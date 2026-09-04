---
name: ad-creative-factory
description: |
  A production ad-creative workflow that turns one campaign direction into
  coordinated 9:16, 4:5, and 1:1 variants. Generated imagery stays visual-only;
  copy, logo, product UI, and CTA remain editable HTML/CSS. Use for app-install
  ads, paid-social campaigns, creative variants, and ratio-safe ad graphics.
triggers:
  - "ad creative"
  - "app install ad"
  - "paid social"
  - "creative variants"
  - "9:16 ad"
  - "4:5 ad"
  - "quảng cáo app"
  - "ảnh quảng cáo"
od:
  mode: prototype
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: index.html
  design_system:
    requires: true
    sections: [color, typography, layout, components, voice, brand]
  craft:
    requires: [accessibility-baseline, typography-hierarchy, state-coverage]
  example_prompt: "Create a production app-install campaign for a travel translator. Compose one direction at 9:16, 4:5, and 1:1; keep all copy, logo, app screenshot, and CTA as HTML/CSS."
---

# Ad Creative Factory

Create one coherent campaign direction in three production ratios: Story/Reels 9:16, Feed 4:5, and Square 1:1.

## Division of responsibility

- Image generation creates only the visual/background/subject. Prompts must request no text, logos, watermarks, or fake UI and must reserve intentional negative space.
- HTML/CSS composes the final artifact: headline, supporting copy, wordmark, app screenshot, badge, and CTA.
- Every ratio uses the same campaign idea but is recomposed rather than mechanically cropped.

## Workflow

1. Read the active `DESIGN.md` and identify the brand voice, one primary color, one accent, and the typography hierarchy.
2. Turn the brief into three possible directions: direct benefit, product proof, and emotional scenario. Choose one and state why before rendering.
3. If a raster visual adds value, generate a visual-only asset with useful crop zones. Do not ask the image model to draw words, logos, or app UI.
4. Compose three `.creative` frames in a self-contained `index.html`:
   - `data-ratio="story"`, aspect ratio 9/16
   - `data-ratio="feed"`, aspect ratio 4/5
   - `data-ratio="square"`, aspect ratio 1/1
5. Keep the product visible in every ratio. The CTA must be readable, but it is a visual CTA rather than a misleading live purchase button.
6. Use `object-position` independently for each ratio. Add a contrast scrim where copy crosses photography.
7. Validate at 1440px, 768px, and 320px. Frames may stack on narrow viewports; no frame may overflow horizontally.
8. Self-critique in this order: composition, message clarity, product visibility, crop safety, typography, branding, micro-detail.
9. When the user asks for files that can be uploaded to an ad platform, render the approved HTML into three exact-size PNGs and one Story MP4. Keep the editable HTML as the source of truth.

## Hard rules

- No text or logo baked into generated imagery.
- No external fonts, scripts, trackers, or remote image URLs in the delivered HTML.
- One headline, one product proof, and one CTA per ratio.
- Respect title/action safe zones: 8% inset for Story, 6% for Feed and Square.
- Product screenshot text remains legible at the rendered preview size.
- Include `data-od-id` on the stage, each ratio, headline, product mockup, and CTA.

## Output contract

Emit one complete HTML document inside an artifact block:

```text
<artifact identifier="campaign-slug" type="text/html" title="Campaign — Name">
<!doctype html>
<html>...</html>
</artifact>
```

One sentence before the artifact and nothing after it.

## Production export

For a ready-to-run campaign, save the artifact HTML and run the bundled renderer from the repository root:

```bash
node --experimental-strip-types \
  design-templates/ad-creative-factory/scripts/render-campaign.ts \
  --campaign "Campaign name" \
  --source design-templates/ad-creative-factory/example.html \
  --output-dir design-templates/ad-creative-factory/exports/campaign-slug \
  --duration 10
```

The export is complete only when `manifest.json` lists all of these deliverables:

- `story.png` — 1080×1920
- `feed.png` — 1080×1350
- `square.png` — 1080×1080
- `story.mp4` — H.264, 1080×1920, 30fps, 3–30 seconds

Use `--png-only` when the brief explicitly excludes motion. The MP4 is a subtle motion-poster rendition; create a multi-scene edit when the campaign brief requires voice-over, captions, or a product demo sequence.
