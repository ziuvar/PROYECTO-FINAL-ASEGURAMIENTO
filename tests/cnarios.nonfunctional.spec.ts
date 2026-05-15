import { expect, test } from '@playwright/test';
import { CnariosPage } from '../src/pages/CnariosPage';
import { saveEvidenceScreenshot } from '../src/utils/evidence';

test.describe('Cnarios - pruebas no funcionales basicas', () => {
  test('RNF01 paginas criticas cargan bajo umbral de 3 segundos', async ({ page }, testInfo) => {
    const routes = [
      '/',
      '/concepts',
      '/concepts/iframe',
      '/concepts/table',
      '/challenges/product-listing-pagination',
      '/challenges/product-filtering',
      '/blogs'
    ];

    const measurements: Array<{ route: string; durationMs: number }> = [];
    for (const route of routes) {
      const startedAt = Date.now();
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 12_000 }).catch(() => undefined);
      measurements.push({ route, durationMs: Date.now() - startedAt });
    }

    await testInfo.attach('tiempos-carga-json', {
      body: JSON.stringify(measurements, null, 2),
      contentType: 'application/json'
    });

    const passing = measurements.filter((item) => item.durationMs <= 3000).length;
    expect(passing / measurements.length).toBeGreaterThanOrEqual(0.95);
    await saveEvidenceScreenshot(page, testInfo, 'tiempos-carga');
  });

  test('RNF03 navegacion principal no muestra errores HTTP 5xx ni errores JS graves', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    const serverErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('response', (response) => {
      if (response.status() >= 500) {
        serverErrors.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    for (const route of ['/', '/concepts', '/blogs', '/challenges', '/concepts/links', '/concepts/table']) {
      await cnarios.goto(route);
      await expect(page.locator('body')).toContainText(/Cnarios|Concepts|Challenges|Blogs|Table|Link/i);
    }

    expect(serverErrors, 'No deben observarse respuestas 5xx durante navegacion').toEqual([]);
    expect(consoleErrors, 'No deben observarse errores JS graves durante navegacion').toEqual([]);
    await saveEvidenceScreenshot(page, testInfo, 'estabilidad');
  });
});
