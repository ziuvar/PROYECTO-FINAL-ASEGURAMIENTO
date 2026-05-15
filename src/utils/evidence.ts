import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';

const screenshotDir = path.join(process.cwd(), 'evidencias', 'screenshots');

export async function saveEvidenceScreenshot(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  await mkdir(screenshotDir, { recursive: true });
  const project = testInfo.project.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const fileName = `${project}-${testInfo.titlePath.slice(-1)[0].replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${name}.png`;
  const filePath = path.join(screenshotDir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  await testInfo.attach(name, { path: filePath, contentType: 'image/png' });
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
