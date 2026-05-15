import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type HeaderFinding = {
  id: string;
  route: string;
  severity: 'Alta' | 'Media' | 'Baja' | 'Informativa';
  title: string;
  evidence: string;
  recommendation: string;
  owasp: string;
};

const baseUrl = process.env.BASE_URL || 'https://www.cnarios.com';
const routes = [
  '/',
  '/concepts',
  '/concepts/iframe',
  '/concepts/links',
  '/concepts/table',
  '/challenges/product-listing-pagination',
  '/challenges/product-filtering',
  '/blogs'
];

function getHeader(headers: Headers, name: string): string | null {
  return headers.get(name);
}

function finding(route: string, id: string, title: string, evidence: string, recommendation: string, severity: HeaderFinding['severity'] = 'Baja'): HeaderFinding {
  return {
    id,
    route,
    severity,
    title,
    evidence,
    recommendation,
    owasp: 'OWASP Top 10 2021 - A05 Security Misconfiguration'
  };
}

async function scanRoute(route: string): Promise<{ route: string; status: number; durationMs: number; findings: HeaderFinding[] }> {
  const startedAt = Date.now();
  const response = await fetch(new URL(route, baseUrl));
  const html = await response.text();
  const durationMs = Date.now() - startedAt;
  const findings: HeaderFinding[] = [];

  if (!getHeader(response.headers, 'content-security-policy')) {
    findings.push(finding(route, 'SEC-01', 'Content-Security-Policy ausente', 'No se encontro la cabecera Content-Security-Policy.', 'Definir una CSP restrictiva que limite scripts, estilos, imagenes y conexiones a origenes autorizados.', 'Media'));
  }

  if (!getHeader(response.headers, 'x-frame-options') && !/frame-ancestors/i.test(getHeader(response.headers, 'content-security-policy') || '')) {
    findings.push(finding(route, 'SEC-02', 'Proteccion anti-clickjacking no declarada', 'No se encontro X-Frame-Options ni frame-ancestors en CSP.', 'Agregar frame-ancestors en CSP o X-Frame-Options: DENY/SAMEORIGIN segun el uso esperado.', 'Media'));
  }

  if (!getHeader(response.headers, 'x-content-type-options')) {
    findings.push(finding(route, 'SEC-03', 'X-Content-Type-Options ausente', 'No se encontro X-Content-Type-Options: nosniff.', 'Agregar X-Content-Type-Options: nosniff para reducir riesgos de MIME sniffing.'));
  }

  if (!getHeader(response.headers, 'referrer-policy')) {
    findings.push(finding(route, 'SEC-04', 'Referrer-Policy ausente', 'No se encontro Referrer-Policy.', 'Agregar Referrer-Policy: strict-origin-when-cross-origin o una politica equivalente.'));
  }

  if (route === '/') {
    const canonicalCount = (html.match(/rel=["']canonical["']/gi) || []).length;
    if (canonicalCount > 1) {
      findings.push(finding(route, 'SEC-05', 'Multiples enlaces canonical en el HTML inicial', `Se encontraron ${canonicalCount} etiquetas canonical en el documento raiz.`, 'Conservar una unica etiqueta canonical por ruta para evitar ambiguedad de indexacion y mejorar mantenibilidad.', 'Informativa'));
    }

    const thirdPartyScripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)]
      .map((match) => match[1])
      .filter((src) => /^https?:\/\//i.test(src) && !src.includes('cnarios.com'));
    if (thirdPartyScripts.length > 0) {
      findings.push(finding(route, 'SEC-06', 'Scripts de terceros detectados', thirdPartyScripts.join(', '), 'Mantener inventario de terceros, revisar SRI cuando aplique y documentar finalidad de analitica.', 'Informativa'));
    }
  }

  return { route, status: response.status, durationMs, findings };
}

async function main(): Promise<void> {
  const outputDir = path.join(process.cwd(), 'evidencias', 'security');
  await mkdir(outputDir, { recursive: true });

  const results = [];
  for (const route of routes) {
    results.push(await scanRoute(route));
  }

  const allFindings = results.flatMap((result) => result.findings);
  const report = {
    scannedAt: new Date().toISOString(),
    baseUrl,
    scanner: 'passive-security-check.ts',
    note: 'Revision pasiva de cabeceras HTTP y HTML inicial. No ejecuta ataques activos sobre el sitio publico.',
    routes: results,
    summary: {
      routes: results.length,
      findings: allFindings.length,
      high: allFindings.filter((item) => item.severity === 'Alta').length,
      medium: allFindings.filter((item) => item.severity === 'Media').length,
      low: allFindings.filter((item) => item.severity === 'Baja').length,
      informational: allFindings.filter((item) => item.severity === 'Informativa').length
    }
  };

  await writeFile(path.join(outputDir, 'passive-security-report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
