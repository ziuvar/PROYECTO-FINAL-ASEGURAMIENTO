# Gestion de Defectos

Herramienta propuesta: Jira o Trello. Para esta entrega se deja el backlog en formato Markdown verificable dentro del repositorio.

| ID | Descripcion | Severidad | Prioridad | Estado | Evidencia | Recomendacion |
|---|---|---|---|---|---|---|
| DEF-01 | En el footer de varias paginas se observa `mailto:cnaarios.@gmail.com`, direccion aparentemente invalida por punto antes de `@`. | Baja | Media | Nuevo | Capturado por inspeccion DOM en concepto Links/Table. | Corregir a `mailto:cnaarios@gmail.com` y agregar prueba de enlaces mailto. |
| DEF-02 | En el iframe de pago, el boton Pay Now no muestra confirmacion ni mensaje de validacion visible tras diligenciar o enviar el formulario. | Media | Media | Analizado | TCA-02 evidencia que los campos aceptan datos, pero no hay retroalimentacion visible. | Agregar mensajes de exito/error accesibles y validaciones de campos. |
| DEF-03 | El HTML inicial del home contiene multiples etiquetas canonical para rutas diferentes. | Baja | Baja | Analizado | `evidencias/security/passive-security-report.json`, finding SEC-05. | Renderizar una unica canonical por ruta o gestionarla desde el router/SSR. |
| DEF-04 | Configuracion de seguridad defensiva incompleta: CSP, anti-clickjacking, CORS permisivo, SRI ausente y politicas HTTP faltantes. | Media | Alta | Nuevo | Revision pasiva y ZAP baseline. | Definir cabeceras HTTP en CDN/hosting, restringir CORS y validar con ZAP despues del cambio. |

## Ciclo de vida representativo - DEF-04

| Fecha | Estado | Responsable | Accion |
|---|---|---|---|
| 14/may/2026 | Nuevo | Tester seguridad | Se detectan cabeceras faltantes durante revision pasiva. |
| 14/may/2026 | Analizado | QA Lead | Se clasifica como OWASP A05 Security Misconfiguration. |
| 15/may/2026 | Reportado | Equipo QA | Se recomienda CSP, frame-ancestors, nosniff y Referrer-Policy. |
| Pendiente | Resuelto | Desarrollo/Infraestructura | Configurar cabeceras en servidor/CDN. |
| Pendiente | Cerrado | QA | Reejecutar ZAP baseline y confirmar remediacion. |
