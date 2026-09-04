import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, test } from "vitest";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, "../../..");
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

describe("production review sample seeding", () => {
  test("seeds exactly two mobile UI projects and one ad-creative project", async () => {
    const dataDir = await mkdtemp(path.join(tmpdir(), "open-design-production-samples-"));
    temporaryDirectories.push(dataDir);

    const { stdout } = await execFileAsync(
      process.execPath,
      [
        "--experimental-strip-types",
        "scripts/seed-test-projects.ts",
        "--offline",
        "--data-dir",
        dataDir,
        "--decks",
        "0",
        "--webs",
        "0",
        "--default-plugins",
        "0",
        "--community-plugins",
        "0",
        "--production-samples",
        "3",
      ],
      { cwd: repositoryRoot, timeout: 30_000 },
    );

    const projectIds = await readdir(path.join(dataDir, "projects"));
    const artifacts = await Promise.all(
      projectIds.map((projectId) => readFile(path.join(dataDir, "projects", projectId, "index.html"), "utf8")),
    );

    expect(projectIds).toHaveLength(3);
    expect(stdout).toContain("done. Seeded 3 project(s).");
    expect(artifacts.filter((html) => html.includes("data-od-id=\"device\"") || html.includes("data-od-id=\"finpath-onboarding\""))).toHaveLength(2);
    expect(artifacts.filter((html) => html.includes("data-od-id=\"campaign-stage\""))).toHaveLength(1);
  });
});
