# Guía: Migración a Firebase Real

## Estado Actual
✅ App migrada a Firebase Real  
✅ `firebase.js` configurado con credenciales reales  
✅ `index.html` actualizado para cargar Firebase SDK  
✅ Script `populate-firestore.js` creado con 23 clientes, 104 productos y precios

## Próximos Pasos

### Paso 1: Poblar Firestore con datos iniciales

Tienes **dos opciones**:

#### Opción A: Usar Firebase Console (Recomendado - Manual)
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `paola-mks`
3. Ve a **Firestore Database**
4. Crea las colecciones manualmente:
   - `clientes`
   - `productos`
   - `precios`
5. Importa los datos desde `populate-firestore.js` (copia los datos de `clientes`, `productos` y `precios`)

#### Opción B: Usar Node.js con Firebase Admin SDK (Automatizado)
1. Instala Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Descarga tu clave de servicio desde Firebase Console:
   - Ve a **Project Settings** → **Service Accounts**
   - Haz clic en "Generate New Private Key"
   - Guarda el archivo como `serviceAccountKey.json`

3. Crea un archivo `populate.js`:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');
   const { clientes, productos, precios, populateFirestore } = require('./populate-firestore.js');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   const db = admin.firestore();
   populateFirestore(db).then(() => {
     console.log('✓ Datos cargados exitosamente');
     process.exit(0);
   }).catch(err => {
     console.error('✗ Error:', err);
     process.exit(1);
   });
   ```

4. Ejecuta:
   ```bash
   node populate.js
   ```

### Paso 2: Verificar la conexión
1. Recarga la app en `http://localhost:5500`
2. Ve a la vista **Clientes** → Deberías ver los 23 clientes
3. Ve a **Productos** → Deberías ver los 104 productos con imágenes y precios (VVF/PVF)
4. Ve a **Registrar Venta** → Los selectores se rellenarán automáticamente

### Paso 3: Probar el registro de ventas
1. Selecciona un cliente y producto
2. Verifica que el precio se cargue correctamente (debe haber un precio para esa combinación)
3. Completa los campos (lote, cantidad, vencimiento)
4. Guarda la venta
5. Revisa **Historial** para confirmar que la venta se guardó en Firestore

## Información Técnica

### Cambios Realizados:

**firebase.js**
- Reemplazado `MockDB` con Firebase SDK real
- Carga `firebase.initializeApp()` con tu configuración
- Expone `window.db` y `window.storage` para compatibilidad con `app.js`

**index.html**
- Agregados scripts de Firebase SDK desde CDN
- Removido `mockData2.js` (ya no necesario)
- Removido `firebase-local.js` (reemplazado por `firebase.js`)

**app.js**
- Sin cambios necesarios (ya usa `db.collection().add()`)
- Compatibilidad total con Firebase real

**populate-firestore.js**
- Contiene 23 clientes, 104 productos, matriz de precios
- Exporta función `populateFirestore()` para uso automatizado

### Estructura de Datos en Firestore:

```
firestore
├── clientes/
│   ├── patty: { nombre, direccion, teléfono }
│   ├── client-2: { ... }
│   └── ... (23 clientes)
├── productos/
│   ├── p1: { nombre, presentacion, vvf, pvf, imagen }
│   ├── p2: { ... }
│   └── ... (104 productos)
├── precios/
│   ├── patty_p1: { clienteId, productoId, precio }
│   ├── patty_p2: { ... }
│   └── ... (23 × 104 = 2,392 precios)
└── ventas/
    ├── doc1: { clienteId, productoId, cantidad, fechaVenta, ... }
    └── ... (se agregan al registrar ventas)
```

## Troubleshooting

**La app carga pero no muestra datos:**
- ✓ Verifica que Firebase esté autenticado
- ✓ Abre la consola del navegador (F12) para ver errores
- ✓ Revisa que Firestore tenga las colecciones creadas

**Los precios no aparecen:**
- ✓ Asegúrate de que la colección `precios` está poblada
- ✓ Verifica que hay un documento `clienteId_productoId` para cada combinación

**Las imágenes no cargan:**
- ✓ Es normal en ambiente local sin conexión a internet
- ✓ Los placeholders de `via.placeholder.com` se mostrarán

## Próximos Pasos (Futuro)

1. Historial por cliente y frecuencia
2. Alertas inteligentes (clientes inactivos, productos vencidos)
3. Precios por cliente (UI para editar)
4. Mejoras al dashboard
5. Upload de perfil con Firebase Storage
