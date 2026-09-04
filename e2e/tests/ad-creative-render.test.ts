// @vitest-environment node

import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { PNG } from 'pngjs';
import { afterEach, describe, expect, test } from 'vitest';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, '../..');
const renderer = path.join(
  repositoryRoot,
  'design-templates/ad-creative-factory/scripts/render-campaign.ts',
);
const source = path.join(
  repositoryRoot,
  'design-templates/ad-creative-factory/example.html',
);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe('ad creative production renderer', () => {
  test('renders exact-size PNG deliverables for all three campaign ratios', async () => {
    const outputDir = await mkdtemp(path.join(tmpdir(), 'open-design-ad-render-'));
    temporaryDirectories.push(outputDir);

    await execFileAsync(
      process.execPath,
      [
        '--experimental-strip-types',
        renderer,
        '--source',
        source,
        '--output-dir',
        outputDir,
        '--png-only',
      ],
      {
        cwd: repositoryRoot,
        env: {
          ...process.env,
          PLAYWRIGHT_CLI: path.join(repositoryRoot, 'e2e/node_modules/.bin/playwright'),
        },
        timeout: 90_000,
      },
    );

    const expected = [
      ['story.png', 1080, 1920],
      ['feed.png', 1080, 1350],
      ['square.png', 1080, 1080],
    ] as const;

    for (const [name, width, height] of expected) {
      const png = PNG.sync.read(await readFile(path.join(outputDir, name)));
      expect({ height: png.height, width: png.width }, name).toEqual({ height, width });
    }

    const manifest = JSON.parse(
      await readFile(path.join(outputDir, 'manifest.json'), 'utf8'),
    ) as { campaign?: unknown; files?: unknown[] };
    expect(manifest.campaign).toBe('example');
    expect(manifest.files).toHaveLength(3);
  }, 120_000);

  test('rejects remote resources in generated HTML before rendering', async () => {
    const workingDir = await mkdtemp(path.join(tmpdir(), 'open-design-ad-reject-'));
    temporaryDirectories.push(workingDir);
    const unsafeSource = path.join(workingDir, 'unsafe.html');
    const outputDir = path.join(workingDir, 'output');
    await writeFile(
      unsafeSource,
      '<!doctype html><html><head></head><body><img src="https://example.com/tracker.png"></body></html>',
      'utf8',
    );

    await expect(
      execFileAsync(
        process.execPath,
        [
          '--experimental-strip-types',
          renderer,
          '--source',
          unsafeSource,
          '--output-dir',
          outputDir,
          '--png-only',
        ],
        { cwd: repositoryRoot, timeout: 30_000 },
      ),
    ).rejects.toMatchObject({
      stderr: expect.stringContaining('Remote and file:// resources are not allowed'),
    });
  });
});
