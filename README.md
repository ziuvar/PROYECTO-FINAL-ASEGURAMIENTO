# Proyecto Final - Aseguramiento de la Calidad sobre Cnarios

Entrega practica con informe, pruebas automatizadas, evidencias, scripts de rendimiento, seguridad y configuracion CI/CD para `https://www.cnarios.com`.

## Requisitos locales

- Node.js 24 o superior.
- Docker Desktop activo para ejecutar k6, OWASP ZAP y SonarScanner/SonarQube.
- Navegadores de Playwright instalados con `npx playwright install`.

## Comandos principales

```powershell
npm ci
npx playwright install chrome firefox
npm run test:compat
npm run evidence:security
npm run report:build
```

## Rendimiento con Docker/k6

```powershell
docker run --rm `
  -e BASE_URL=https://www.cnarios.com `
  -v "${PWD}/scripts/performance:/scripts" `
  -v "${PWD}/evidencias/performance:/out" `
  grafana/k6 run --summary-export /out/k6-summary.json /scripts/cnarios-smoke.js
```

## Seguridad con Docker/OWASP ZAP

Escaneo pasivo recomendado para no ejecutar ataques agresivos sobre un sitio publico:

```powershell
docker run --rm `
  -v "${PWD}/evidencias/security:/zap/wrk/:rw" `
  zaproxy/zap-stable zap-baseline.py `
  -t https://www.cnarios.com `
  -r zap-baseline-report.html `
  -J zap-baseline-report.json `
  -m 2 -a -I
```

## SonarQube con Docker

Si no existe una instancia corporativa, levantar SonarQube local:

```powershell
docker run -d --name sonarqube-cnarios -p 9000:9000 sonarqube:community
```

Luego crear un token en `http://localhost:9000` y ejecutar:

```powershell
docker run --rm `
  -e SONAR_HOST_URL=http://host.docker.internal:9000 `
  -e SONAR_TOKEN=<TOKEN> `
  -v "${PWD}:/usr/src" `
  sonarsource/sonar-scanner-cli
```

## Estructura

- `tests/`: pruebas Playwright automatizadas en Chrome y Firefox.
- `src/pages/`: Page Object Model y utilidades.
- `scripts/performance/`: prueba k6.
- `scripts/security/`: revision pasiva de seguridad.
- `docs/`: informe y matrices.
- `evidencias/`: capturas, reportes, logs y resultados generados.
- `.github/workflows/qa.yml`: propuesta de CI/CD.
- `sonar-project.properties`: configuracion de analisis SonarQube.
