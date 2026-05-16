import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { marked } from 'marked';

const docsDir = path.join(process.cwd(), 'docs');
const outDir = path.join(process.cwd(), 'entrega');
const markdownPath = path.join(docsDir, 'Informe_Final_Cnarios.md');
const htmlPath = path.join(outDir, 'Informe_Final_Cnarios.html');
const pdfPath = path.join(outDir, 'Informe_Final_Cnarios.pdf');

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const markdown = await readFile(markdownPath, 'utf8');
  const body = marked.parse(markdown, { async: false });
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Informe Final Cnarios</title>
  <style>
    @page { size: A4; margin: 20mm 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #172033; line-height: 1.42; font-size: 10.5pt; }
    h1 { color: #123c69; font-size: 22pt; margin: 0 0 12px; }
    h2 { color: #0b4f6c; font-size: 15pt; border-bottom: 1px solid #c9d8e6; padding-bottom: 4px; margin-top: 24px; }
    h3 { color: #1b4965; font-size: 12pt; margin-top: 16px; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0 16px; page-break-inside: auto; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 7px; vertical-align: top; }
    th { background: #eaf3f8; color: #123c69; font-weight: 700; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    code { font-family: Consolas, monospace; background: #f2f4f8; padding: 1px 3px; border-radius: 3px; }
    pre { background: #f7f9fc; border: 1px solid #d8e0ea; padding: 9px; white-space: pre-wrap; }
    blockquote { border-left: 4px solid #2a9d8f; margin-left: 0; padding-left: 12px; color: #324a5f; }
    img { max-width: 100%; }
    .cover { display: flex; min-height: 78vh; flex-direction: column; justify-content: center; text-align: center; page-break-after: always; }
    .cover h1 { font-size: 26pt; }
    .cover p { font-size: 12pt; }
  </style>
</head>
<body>${body}</body>
</html>`;

  await writeFile(htmlPath, html, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath.replaceAll('\\', '/')}`, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%; font-size:8px; color:#64748b; text-align:center;">Pagina <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
    margin: { top: '18mm', right: '14mm', bottom: '18mm', left: '14mm' }
  });
  await browser.close();

  console.log(`Generado: ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
