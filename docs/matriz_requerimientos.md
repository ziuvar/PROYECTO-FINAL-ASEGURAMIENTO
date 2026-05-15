# Matriz de Requerimientos y Trazabilidad

| ID | Tipo | Descripcion | Criterio de aceptacion | Casos asociados |
|---|---|---|---|---|
| RF01 | Funcional | La plataforma debe mostrar conceptos principales y permitir navegar a cada uno. | Al seleccionar iFrames, Multi Window, Links o Table se carga la pagina correcta en menos de 3 segundos. | TCM-01, TCA-01 |
| RF02 | Funcional | Los conceptos deben permitir ejecutar acciones interactivas. | Los formularios y acciones del concepto responden sin errores graves de consola. | TCM-02, TCM-03, TCM-04, TCM-05, TCA-02, TCA-03 |
| RF03 | Funcional | Los desafios deben presentar paginacion y filtrado de productos. | La lista cambia al paginar y los filtros devuelven resultados coherentes. | TCM-07, TCM-08, TCA-04, TCA-05 |
| RF04 | Funcional | El sitio debe proporcionar articulos/blogs de aprendizaje. | Los articulos se cargan y sus enlaces son accesibles. | TCM-06 |
| RF05 | Funcional | La navegacion principal debe funcionar desde cualquier pagina. | Los enlaces principales redirigen sin errores HTTP 5xx. | TCM-01, TCM-10, TCA-01 |
| RNF01 | No funcional | Rendimiento: paginas bajo 3 segundos en condiciones normales. | El 95 % de paginas criticas cumple el umbral. | TCM-09, RNF01 automatizada, k6 |
| RNF02 | No funcional | Usabilidad: interfaz comprensible para usuarios novatos. | Textos, botones y errores son legibles y claros. | TCM-02, TCM-05, TCM-06 |
| RNF03 | No funcional | Fiabilidad: sin errores 5xx ni errores JS graves. | Navegacion continua sin respuestas 5xx ni TypeError/ReferenceError. | TCM-10, RNF03 automatizada |
| RNF04 | No funcional | Seguridad: sin vulnerabilidades criticas obvias. | ZAP y revision pasiva no reportan criticidad alta sin mitigacion. | Seguridad pasiva, ZAP baseline |
| RNF05 | No funcional | Compatibilidad: Chrome, Firefox y Edge/navegadores recientes. | Flujos principales equivalentes en navegadores modernos. | Matriz de compatibilidad, Playwright multi-browser |
