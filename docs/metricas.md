# Metricas de Calidad

| Metrica | Formula | Valor esperado | Fuente |
|---|---|---|---|
| Cobertura de requisitos | Requisitos cubiertos / requisitos totales | 10/10 = 100 % | Matriz de trazabilidad |
| Casos manuales disenados | Total documentado | 10 | `docs/casos_prueba.md` |
| Casos automatizados implementados | Total ejecutable | 5 funcionales + 2 no funcionales | `tests/` |
| Tasa de aprobacion | Casos aprobados / casos ejecutados | 14/14 = 100 % en Chrome y Firefox | Playwright |
| Defectos abiertos | Defectos Nuevo/Analizado | 4 | `docs/defectos.md` |
| Densidad de defectos funcionales | Defectos funcionales / modulos probados | 2 / 4 modulos | Backlog |
| Tiempo de ejecucion | Duracion total suite | 19.95 s | Playwright |
| Rendimiento p95 | Percentil 95 HTTP | 95.62 ms | k6 |
| SonarQube - Bugs | Conteo dashboard | 0 | SonarQube sobre repo de pruebas |
| SonarQube - Vulnerabilities | Conteo dashboard | 0 | SonarQube |
| SonarQube - Code Smells | Conteo dashboard | 7 | SonarQube |
| SonarQube - Duplication | Porcentaje | 0.0 % | SonarQube |
| SonarQube - Coverage | Porcentaje | 0.0 %, no aplica al sitio caja negra; pendiente unit tests del framework | SonarQube |
| Maintainability Rating | Rating | A | SonarQube |
| Security Rating | Rating | A | SonarQube |
