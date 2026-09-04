#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const MAX_ASSET_BYTES = 20 * 1024 * 1024;
const MAX_ASSET_COUNT = 64;
const MAX_TOTAL_ASSET_BYTES = 64 * 1024 * 1024;
const MAX_HTML_BYTES = 5 * 1024 * 1024;

const RENDITIONS = [
  { height: 1920, name: 'story', width: 1080 },
  { height: 1350, name: 'feed', width: 1080 },
  { height: 1080, name: 'square', width: 1080 },
] as const;

interface Options {
  campaign: string;
  durationSeconds: number;
  outputDir: string;
  pngOnly: boolean;
  source: string;
}

interface ManifestFile {
  durationSeconds?: number;
  file: string;
  format: 'mp4' | 'png';
  height: number;
  width: number;
}

function parseArgs(argv: string[]): Options {
  let campaign = '';
  let source = '';
  let outputDir = '';
  let pngOnly = false;
  let durationSeconds = 10;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--campaign') campaign = argv[++index] ?? '';
    else if (arg === '--source') source = argv[++index] ?? '';
    else if (arg === '--output-dir') outputDir = argv[++index] ?? '';
    else if (arg === '--duration') durationSeconds = Number(argv[++index]);
    else if (arg === '--png-only') pngOnly = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: render-campaign.ts --source <example.html> --output-dir <dir> [options]

Options:
  --campaign <name>    Campaign name stored in manifest.json
  --duration <seconds>  MP4 duration (default: 10)
  --png-only           Render PNG files without the MP4
  -h, --help           Show this help`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!source) throw new Error('--source is required');
  if (!outputDir) throw new Error('--output-dir is required');
  if (!Number.isFinite(durationSeconds) || durationSeconds < 3 || durationSeconds > 30) {
    throw new Error('--duration must be between 3 and 30 seconds');
  }

  return {
    campaign: campaign || path.basename(source, path.extname(source)),
    durationSeconds,
    outputDir: path.resolve(outputDir),
    pngOnly,
    source: path.resolve(source),
  };
}

async function inlineLocalAssets(sourceHtml: string, templateDir: string): Promise<string> {
  const assetPattern = /\/api\/skills\/ad-creative-factory\/assets\/([A-Za-z0-9._-]+)/gu;
  const assetNames = [...sourceHtml.matchAll(assetPattern)].map((match) => match[1]);
  const uniqueAssetNames = new Set(assetNames);
  if (uniqueAssetNames.size > MAX_ASSET_COUNT) {
    throw new Error(`HTML references more than ${MAX_ASSET_COUNT} local assets`);
  }
  let html = sourceHtml;
  let totalAssetBytes = 0;

  for (const assetName of uniqueAssetNames) {
    const assetPath = path.join(templateDir, 'assets', assetName);
    const bytes = await readFile(assetPath);
    if (bytes.byteLength > MAX_ASSET_BYTES) {
      throw new Error(`Asset exceeds 20 MiB limit: ${assetName}`);
    }
    totalAssetBytes += bytes.byteLength;
    if (totalAssetBytes > MAX_TOTAL_ASSET_BYTES) {
      throw new Error('Local assets exceed 64 MiB combined limit');
    }
    const extension = path.extname(assetName).toLowerCase();
    const mime = extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`;
    html = html.replaceAll(
      `/api/skills/ad-creative-factory/assets/${assetName}`,
      dataUrl,
    );
  }

  return html;
}

function assertSelfContained(sourceHtml: string): void {
  if (Buffer.byteLength(sourceHtml, 'utf8') > MAX_HTML_BYTES) {
    throw new Error('HTML exceeds 5 MiB limit');
  }
  if (!sourceHtml.includes('</head>') || !sourceHtml.includes('</body>')) {
    throw new Error('HTML must contain closing </head> and </body> tags');
  }

  const remoteElement = /<(?:audio|base|iframe|img|link|script|source|video)\b[^>]*\b(?:href|poster|src)\s*=\s*["']\s*(?:file:|https?:|\/\/)/iu;
  const remoteCss = /(?:@import\s+|url\(\s*)["']?\s*(?:file:|https?:|\/\/)/iu;
  if (remoteElement.test(sourceHtml) || remoteCss.test(sourceHtml)) {
    throw new Error('Remote and file:// resources are not allowed in ad exports');
  }
}

function exportDocument(
  sourceHtml: string,
  rendition: (typeof RENDITIONS)[number],
): string {
  const exportStyles = `<style data-ad-export>
html,body{background:#000!important;height:${rendition.height}px!important;margin:0!important;min-width:0!important;overflow:hidden!important;width:${rendition.width}px!important}
body>.creative{box-shadow:none!important;height:${rendition.height}px!important;max-height:none!important;max-width:none!important;width:${rendition.width}px!important}
</style>`;
  const exportScript = `<script data-ad-export>
(() => {
  const creative = document.querySelector('.creative[data-ratio="${rendition.name}"]');
  if (!creative) throw new Error('Missing ${rendition.name} creative');
  document.body.replaceChildren(creative);
  const images = Array.from(document.images);
  Promise.all(images.map((image) => image.complete ? Promise.resolve() : image.decode()))
    .catch(() => undefined)
    .finally(() => { document.body.dataset.exportReady = 'true'; });
})();
</script>`;

  return sourceHtml
    .replace('</head>', `${exportStyles}</head>`)
    .replace('</body>', `${exportScript}</body>`);
}

async function renderPngs(options: Options, sourceHtml: string): Promise<ManifestFile[]> {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(scriptDirectory, '../../..');
  const playwrightCli = process.env.PLAYWRIGHT_CLI?.trim()
    || path.join(repositoryRoot, 'e2e/node_modules/.bin/playwright');
  const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL?.trim() || 'chrome';
  const offlineProxy = process.env.PLAYWRIGHT_OFFLINE_PROXY?.trim() || 'http://127.0.0.1:9';
  const temporaryDir = await mkdtemp(path.join(os.tmpdir(), 'open-design-ad-export-'));
  const files: ManifestFile[] = [];

  try {
    for (const rendition of RENDITIONS) {
      const htmlPath = path.join(temporaryDir, `${rendition.name}.html`);
      const outputPath = path.join(options.outputDir, `${rendition.name}.png`);
      await writeFile(htmlPath, exportDocument(sourceHtml, rendition), 'utf8');
      await execFileAsync(
        playwrightCli,
        [
          'screenshot',
          '--browser',
          'chromium',
          '--channel',
          browserChannel,
          '--proxy-server',
          offlineProxy,
          '--viewport-size',
          `${rendition.width},${rendition.height}`,
          '--wait-for-selector',
          '[data-export-ready="true"]',
          '--timeout',
          '30000',
          pathToFileURL(htmlPath).href,
          outputPath,
        ],
        { maxBuffer: 4 * 1024 * 1024, timeout: 60_000 },
      );
      files.push({
        file: path.basename(outputPath),
        format: 'png',
        height: rendition.height,
        width: rendition.width,
      });
    }
  } finally {
    await rm(temporaryDir, { force: true, recursive: true });
  }

  return files;
}

async function renderStoryVideo(options: Options): Promise<ManifestFile> {
  const ffmpegPath = process.env.FFMPEG_PATH?.trim() || 'ffmpeg';
  const storyPath = path.join(options.outputDir, 'story.png');
  const outputPath = path.join(options.outputDir, 'story.mp4');
  const fadeOutStart = Math.max(0, options.durationSeconds - 0.55).toFixed(2);
  const filter = [
    'scale=1166:2074:flags=lanczos',
    `crop=1080:1920:x='(iw-ow)/2+10*sin(t*0.7)':y='(ih-oh)/2-18*t/${options.durationSeconds}'`,
    'fade=t=in:st=0:d=0.35',
    `fade=t=out:st=${fadeOutStart}:d=0.55`,
    'format=yuv420p',
  ].join(',');

  await execFileAsync(
    ffmpegPath,
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-loop',
      '1',
      '-framerate',
      '30',
      '-i',
      storyPath,
      '-t',
      String(options.durationSeconds),
      '-vf',
      filter,
      '-r',
      '30',
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '18',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { maxBuffer: 8 * 1024 * 1024, timeout: 120_000 },
  );

  return {
    durationSeconds: options.durationSeconds,
    file: path.basename(outputPath),
    format: 'mp4',
    height: 1920,
    width: 1080,
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  await mkdir(options.outputDir, { recursive: true });
  const templateDir = path.dirname(options.source);
  const sourceDocument = await readFile(options.source, 'utf8');
  assertSelfContained(sourceDocument);
  const sourceHtml = await inlineLocalAssets(sourceDocument, templateDir);
  const files = await renderPngs(options, sourceHtml);
  if (!options.pngOnly) files.push(await renderStoryVideo(options));

  const manifest = {
    campaign: options.campaign,
    createdAt: new Date().toISOString(),
    files,
  };
  await writeFile(
    path.join(options.outputDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(manifest));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
