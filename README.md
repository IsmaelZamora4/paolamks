# Panel para Paola — Farmacéuticos Markos

Archivos incluidos: `index.html`, `style.css`, `app.js`, `firebase.js`, `importExcel.js`.

Pasos rápidos:

1) Crear proyecto en Firebase
- Ve a https://console.firebase.google.com y crea un proyecto.
- Añade una app Web en el proyecto y copia la configuración (apiKey, authDomain, projectId, storageBucket, appId).

2) Configurar `firebase.js`
- Abre `firebase.js` y reemplaza los campos de `firebaseConfig` con los valores de tu app web.

3) Configurar Firestore
- En Firebase Console -> Firestore Database -> Crear base de datos en modo de prueba (para desarrollo).
- Crea colecciones (no es obligatorio crear manualmente; `importExcel.js` las creará): `clientes`, `productos`, `precios`, `ventas`, `settings`.

4) Importar el Excel
- En la UI, usa el selector `Importar Excel` y luego pulsa `Subir a Firebase`.
- El Excel debe tener este formato (hoja 1):
  - Fila 1: primera celda vacía, luego nombres de clientes en columnas (A1 vacío, B1 ClienteA, C1 ClienteB...)
  - Filas siguientes: columna A = nombre del producto; columnas B.. = precios para cada cliente.

5) Ejecutar la web localmente
- Abre `index.html` en un navegador (puedes usar un servidor simple: `npx http-server` o `python -m http.server`).

6) Subir imagen de perfil
- En la parte superior derecha, selecciona imagen; se subirá a Firebase Storage y se guardará la URL en Firestore (`settings/profile`).

7) Registrar ventas
- Ve a "Registrar Venta", elige cliente y producto, completa lote, cantidad y fecha de vencimiento y guarda.

8) Despliegue en Vercel
- Crea cuenta en Vercel y conecta un nuevo proyecto.
- Sube estos archivos o conecta el repositorio Git.
- Configura la carpeta raíz al proyecto y despliega.

Notas y seguridad:
- En producción, ajusta reglas de Firestore y Storage para restringir acceso.
- Este proyecto usa Firebase compat libs para simplicidad; puedes migrar a modular SDK si lo deseas.
