# Resumen de Ejecucion Real

Fecha/hora de ejecucion: 15/may/2026, ambiente local Windows con Docker Desktop.

## Playwright

| Indicador | Resultado |
|---|---|
| Navegadores ejecutados | Chrome y Firefox |
| Casos ejecutados | 14 |
| Aprobados | 14 |
| Fallidos | 0 |
| Duracion total | 19.95 s |
| Reporte | `evidencias/playwright-report/index.html` |
| Resultados JSON | `evidencias/playwright-results/results.json` |
| Capturas | `evidencias/screenshots/*.png` |

## k6 Docker

| Indicador | Resultado |
|---|---|
| VUs | 2 |
| Duracion | 45 s |
| Requests HTTP | 322 |
| Iteraciones | 46 |
| Checks | 644/644 |
| Tasa de fallos HTTP | 0 % |
| Promedio HTTP | 84.79 ms |
| p95 HTTP | 95.62 ms |
| Umbral p95 < 3000 ms | Cumplido |

## OWASP ZAP Baseline

| Indicador | Resultado |
|---|---|
| URLs revisadas | 55 |
| Fallos nuevos | 0 |
| Advertencias nuevas | 16 |
| Alertas JSON | 20 |
| Riesgo medio | 4 |
| Riesgo bajo | 6 |
| Informativas | 10 |

Alertas principales: CSP no configurada, CORS permisivo, cabecera anti-clickjacking ausente, SRI ausente en recursos de terceros, inclusion de JavaScript cross-domain, Permissions-Policy ausente.

## Revision pasiva propia

| Indicador | Resultado |
|---|---|
| Rutas revisadas | 8 |
| Hallazgos | 34 |
| Severidad alta | 0 |
| Severidad media | 16 |
| Severidad baja | 16 |
| Informativos | 2 |

## SonarQube Docker

| Metrica | Resultado |
|---|---|
| Lineas de codigo | 246 |
| Bugs | 0 |
| Vulnerabilidades | 0 |
| Security Hotspots | 0 |
| Code Smells | 7 |
| Duplicacion | 0.0 % |
| Coverage | 0.0 % |
| Reliability Rating | A |
| Maintainability Rating | A |
| Security Rating | A |
| Dashboard | `evidencias/sonarqube/sonarqube-dashboard.png` |
| Medidas JSON | `evidencias/sonarqube/sonarqube-measures.json` |
