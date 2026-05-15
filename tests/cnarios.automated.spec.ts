import { expect, test } from '@playwright/test';
import { CnariosPage } from '../src/pages/CnariosPage';
import { saveEvidenceScreenshot } from '../src/utils/evidence';

test.describe('Cnarios - casos automatizados principales', () => {
  test('TCA-01 navega por conceptos y valida titulos visibles', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    const concepts = [
      { name: 'Iframes', path: '/concepts/iframe', heading: /Iframe/i },
      { name: 'Multi Window', path: '/concepts/multiwindow', heading: /Multiwindow|Multi Window/i },
      { name: 'Links', path: '/concepts/links', heading: /Link/i },
      { name: 'Table', path: '/concepts/table', heading: /Table/i }
    ];

    await cnarios.goto('/concepts');
    await cnarios.expectHeading(/What do you want to explore today/i);

    for (const concept of concepts) {
      await page.locator(`a[href="${concept.path}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${concept.path}$`));
      await cnarios.expectHeading(concept.heading);
      await expect(page.getByRole('tab', { name: /Try It Yourself/i })).toBeVisible();
      await page.goBack({ waitUntil: 'domcontentloaded' });
    }

    await saveEvidenceScreenshot(page, testInfo, 'conceptos');
  });

  test('TCA-02 interactua con el formulario dentro del iframe', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    const errors = await cnarios.getConsoleErrorsWhile(async () => {
      await cnarios.goto('/concepts/iframe');
      await cnarios.openTryItYourself();
      const frame = page.frameLocator('iframe').first();
      await expect(frame.getByText(/Secure Payment/i)).toBeVisible();
      await frame.getByPlaceholder('Card Number').fill('4111111111111111');
      await frame.getByPlaceholder(/Expiry Date/i).fill('12/28');
      await frame.getByPlaceholder('CVV').fill('123');
      await expect(frame.getByPlaceholder('Card Number')).toHaveValue('4111111111111111');
      await expect(frame.getByPlaceholder(/Expiry Date/i)).toHaveValue('12/28');
      await expect(frame.getByPlaceholder('CVV')).toHaveValue('123');
      await frame.getByRole('button', { name: /Pay Now/i }).click();
    });

    expect(errors, 'No deben aparecer errores graves de consola durante la interaccion con iframe').toEqual([]);
    await saveEvidenceScreenshot(page, testInfo, 'iframe');
  });

  test('TCA-03 abre nueva pestana desde Multi Window y conserva la pagina principal operativa', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    await cnarios.goto('/concepts/multiwindow');
    await cnarios.openTryItYourself();

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByText('Learn about Button', { exact: true }).click()
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(/\/concepts\/button$/);
    await expect(page).toHaveURL(/\/concepts\/multiwindow#try-it-yourself$/);
    await expect(page.getByText(/Quick Links Navigation Cnario/i)).toBeVisible();

    await popup.close();
    await saveEvidenceScreenshot(page, testInfo, 'multiwindow');
  });

  test('TCA-04 valida avance y retroceso de paginacion en productos', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    await cnarios.goto('/challenges/product-listing-pagination');

    const firstPageProducts = await cnarios.getPaginationProductNames();
    expect(firstPageProducts.length).toBeGreaterThanOrEqual(10);
    expect(firstPageProducts).toContain('The Pragmatic Programmer');

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Prev', exact: true })).toBeEnabled();
    await expect(page.getByText('The Pragmatic Programmer')).toHaveCount(0);
    const secondPageProducts = await cnarios.getPaginationProductNames();
    expect(secondPageProducts.length).toBeGreaterThanOrEqual(10);
    expect(secondPageProducts).not.toEqual(firstPageProducts);

    await page.getByRole('button', { name: 'Prev', exact: true }).click();
    await expect(page.getByText('The Pragmatic Programmer')).toBeVisible();
    expect(await cnarios.getPaginationProductNames()).toEqual(firstPageProducts);

    await saveEvidenceScreenshot(page, testInfo, 'paginacion');
  });

  test('TCA-05 filtra productos por categoria y restaura la lista', async ({ page }, testInfo) => {
    const cnarios = new CnariosPage(page);
    await cnarios.goto('/challenges/product-filtering');

    const initialProducts = await cnarios.getFilteringProductNames();
    expect(initialProducts.length).toBeGreaterThan(10);

    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Clothing' }).click();

    const filteredProducts = await cnarios.getFilteringProductNames();
    const details = await cnarios.getFilteringProductDetails();
    expect(filteredProducts).toEqual(['Cotton T-Shirt', 'Jeans', 'Jacket', 'Formal Shirt']);
    expect(details.length).toBe(4);
    for (const detail of details) {
      expect(detail).toContain('Clothing');
    }

    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect.poll(() => cnarios.getFilteringProductNames()).toEqual(initialProducts);

    await saveEvidenceScreenshot(page, testInfo, 'filtros');
  });
});
