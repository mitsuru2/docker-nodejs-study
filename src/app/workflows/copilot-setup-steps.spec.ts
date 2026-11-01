import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Copilot setup workflow', () => {
  const workflow = readFileSync(resolve('.github/workflows/copilot-setup-steps.yml'), 'utf8');
  const ciWorkflow = readFileSync(resolve('.github/workflows/ci.yml'), 'utf8');

  it('defines a read-only setup job', () => {
    expect(workflow).toMatch(
      /jobs:\s*\n  copilot-setup-steps:\s*\n    runs-on: ubuntu-24\.04\s*\n    timeout-minutes: 30\s*\n    permissions:\s*\n      contents: read/,
    );
  });

  it('builds the development image with Buildx and a read-only GHCR cache', () => {
    expect(workflow).toContain(
      'docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069',
    );
    expect(workflow).toContain('docker/build-push-action@10e90e3645eae34f1e60eeb005ba3a3d33f178e8');
    expect(workflow).toMatch(
      /context: \.\s*\n\s+file: Dockerfile\s*\n\s+tags: app-dev:local\s*\n\s+load: true/,
    );
    expect(workflow).toContain(
      'CACHE_REF: ghcr.io/mitsuru2/docker-nodejs-study-devcontainer:buildcache',
    );
    expect(workflow).toContain('cache-from: type=registry,ref=${{ env.CACHE_REF }}');
    expect(workflow).not.toMatch(/^\s*cache-to:/m);
  });

  it('installs dependencies through scripts/dev', () => {
    const imageBuildIndex = workflow.indexOf('name: Build development image');
    const dependencyInstallIndex = workflow.indexOf('run: scripts/dev npm ci');

    expect(imageBuildIndex).toBeGreaterThanOrEqual(0);
    expect(dependencyInstallIndex).toBeGreaterThan(imageBuildIndex);
  });

  it('supports manual runs and file-specific push and pull request runs', () => {
    expect(workflow).toContain('  workflow_dispatch:');
    expect(workflow).toMatch(
      /  push:\s*\n    paths:\s*\n      - \.github\/workflows\/copilot-setup-steps\.yml/,
    );
    expect(workflow).toMatch(
      /  pull_request:\s*\n    paths:\s*\n      - \.github\/workflows\/copilot-setup-steps\.yml/,
    );
  });

  it('keeps the existing required ci job configured', () => {
    expect(ciWorkflow).toMatch(/^  ci:\s*\n    runs-on:/m);
    expect(ciWorkflow).toContain('permissions:\n  contents: read');
  });
});
