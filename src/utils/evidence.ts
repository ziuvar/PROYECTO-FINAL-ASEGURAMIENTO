import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';

const screenshotDir = path.join(process.cwd(), 'evidencias', 'screenshots');

function sanitizeFileSegment(value: string): string {
  return value.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase();
}

export async function saveEvidenceScreenshot(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  await mkdir(screenshotDir, { recursive: true });
  const project = sanitizeFileSegment(testInfo.project.name);
  const testTitle = sanitizeFileSegment(testInfo.titlePath.at(-1) ?? testInfo.title);
  const fileName = `${project}-${testTitle}-${sanitizeFileSegment(name)}.png`;
  const filePath = path.join(screenshotDir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  await testInfo.attach(name, { path: filePath, contentType: 'image/png' });
}

export function normalizeText(value: string): string {
  return value.replaceAll(/\s+/g, ' ').trim();
}
