# Diseno de Casos de Prueba

## Casos Manuales

| ID | Nombre | Objetivo | Req. | Precondiciones | Datos | Pasos | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|---|---|---|
| TCM-01 | Navegacion a conceptos | Verificar lista y acceso a iFrames, Multi Window, Links y Table. | RF01, RF05 | Sitio disponible. | N/A | Abrir home, ir a Concepts, seleccionar cada concepto y regresar. | Cada concepto carga titulo, descripcion y pestana Try It Yourself. | Automatizado en TCA-01; evidencias en `evidencias/screenshots`. | Aprobado |
| TCM-02 | Interaccion con iframe | Validar formulario dentro del iframe. | RF02 | Concepto iFrames abierto. | Tarjeta 4111111111111111, 12/28, 123. | Abrir Try It Yourself, llenar Card Number, Expiry y CVV, presionar Pay Now. | Campos aceptan entrada y no hay errores graves de consola. | Automatizado en TCA-02. No se observo mensaje visible de confirmacion. | Aprobado con observacion |
| TCM-03 | Apertura de nueva ventana | Verificar nueva pestana desde Multi Window. | RF02 | Concepto Multi Window abierto. | N/A | Abrir Try It Yourself y seleccionar Learn about Button. | Se abre pestana secundaria y pagina principal queda operativa. | Automatizado en TCA-03. | Aprobado |
| TCM-04 | Verificacion de enlaces | Comprobar enlaces internos/externos del concepto Links. | RF02 | Concepto Links abierto. | N/A | Abrir Try It Yourself, revisar in-page, nueva pestana y enlace roto documentado. | Destinos esperados responden; enlaces rotos se documentan si son parte del escenario. | Se observo enlace intencional "Broken Link"; no se marca como defecto del portal. | Aprobado |
| TCM-05 | Funcionalidad de tabla | Verificar datos de Employee Table. | RF02 | Concepto Table abierto. | Busqueda: "QA". | Abrir Try It Yourself, revisar encabezados/filas y buscar registros. | Tabla con encabezados, datos legibles y filtro funcional si aplica. | Tabla muestra empleados y campo Search. | Aprobado |
| TCM-06 | Navegacion del blog | Validar carga de articulos del blog. | RF04 | Home disponible. | N/A | Abrir Blogs, seleccionar HTML Basics y Locator Strategies. | Articulos cargan en menos de 3 segundos y enlaces accesibles. | Incluido en revision de rutas y rendimiento. | Aprobado |
| TCM-07 | Paginacion - desafio | Verificar Next/Prev en e-commerce pagination. | RF03 | Desafio abierto. | N/A | Capturar productos iniciales, Next, comparar, Prev y comparar. | La lista cambia al avanzar y vuelve al retroceder. | Automatizado en TCA-04. | Aprobado |
| TCM-08 | Filtro - desafio | Comprobar filtro por categoria. | RF03 | Desafio product-filtering abierto. | Categoria Clothing. | Seleccionar categoria, revisar productos, resetear. | Todos los productos listados pertenecen a Clothing y Reset restaura lista. | Automatizado en TCA-05. | Aprobado |
| TCM-09 | Tiempos de carga | Evaluar paginas bajo 3 segundos. | RNF01 | Internet estable. | Rutas criticas. | Medir home, concepts, iframe, table, challenges y blogs. | 95 % de rutas bajo 3 segundos. | Ejecutado con Playwright y k6. | Ver evidencia |
| TCM-10 | Errores JavaScript/HTTP | Identificar errores graves durante navegacion. | RNF03 | Consola/herramienta habilitada. | Rutas principales. | Navegar por secciones y observar consola/respuestas. | Sin 5xx ni TypeError/ReferenceError. | Automatizado en RNF03. | Ver evidencia |

## Casos Automatizados

| ID | Nombre | Objetivo | Req. | Flujo | Evidencia |
|---|---|---|---|---|---|
| TCA-01 | Navegacion y conceptos | Validar que los conceptos cargan. | RF01 | Recorre Concepts y entra a iFrames, Multi Window, Links y Table. | `tests/cnarios.automated.spec.ts`, screenshot conceptos |
| TCA-02 | Interaccion con iframe | Llenar formulario dentro del iframe. | RF02 | Entra a iFrames, abre Try It Yourself, usa `frameLocator` y llena campos. | screenshot iframe |
| TCA-03 | Multi-window | Verificar popup/nueva pestana. | RF02 | Clic en Learn about Button y valida URL `/concepts/button`. | screenshot multiwindow |
| TCA-04 | Paginacion | Validar Next/Prev. | RF03 | Captura productos, avanza, compara, retrocede y valida lista inicial. | screenshot paginacion |
| TCA-05 | Filtrado | Validar categoria Clothing. | RF03 | Selecciona categoria, valida detalles y usa Reset Filters. | screenshot filtros |
