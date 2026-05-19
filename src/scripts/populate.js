#!/usr/bin/env node

/**
 * Script para poblar Firestore con datos iniciales
 * Uso: node populate.js
 * 
 * Requiere:
 * - npm install firebase-admin
 * - serviceAccountKey.json en el mismo directorio
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Verificar que existe serviceAccountKey.json
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('❌ Error: No se encontró serviceAccountKey.json');
  console.error('   Descárgalo desde Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Datos de 23 clientes
const clientes = [
  { id: 'patty', nombre: 'Patty González', direccion: 'Av. Principal 123', teléfono: '999123456' },
  { id: 'client-2', nombre: 'Farmacia Central', direccion: 'Calle 45 #678', teléfono: '999234567' },
  { id: 'client-3', nombre: 'Droguería El Éxito', direccion: 'Jr. Amazonas 234', teléfono: '999345678' },
  { id: 'client-4', nombre: 'Farmacia Santa María', direccion: 'Av. Brasil 456', teléfono: '999456789' },
  { id: 'client-5', nombre: 'Botica La Salud', direccion: 'Calle 12 #123', teléfono: '999567890' },
  { id: 'client-6', nombre: 'Farmacia del Centro', direccion: 'Av. Lima 789', teléfono: '999678901' },
  { id: 'client-7', nombre: 'Droguería Moderna', direccion: 'Calle 5 #234', teléfono: '999789012' },
  { id: 'client-8', nombre: 'Farmacia Popular', direccion: 'Av. Arequipa 890', teléfono: '999890123' },
  { id: 'client-9', nombre: 'Botica San Juan', direccion: 'Jr. Puno 345', teléfono: '999901234' },
  { id: 'client-10', nombre: 'Farmacia Metropolitana', direccion: 'Av. Tacna 567', teléfono: '990012345' },
  { id: 'client-11', nombre: 'Droguería Santa Rosa', direccion: 'Calle 8 #456', teléfono: '991123456' },
  { id: 'client-12', nombre: 'Farmacia Integrada', direccion: 'Av. Paseo de la República 678', teléfono: '991234567' },
  { id: 'client-13', nombre: 'Botica Global', direccion: 'Jr. Carabaya 789', teléfono: '991345678' },
  { id: 'client-14', nombre: 'Farmacia Punto Plus', direccion: 'Av. 28 de Julio 890', teléfono: '991456789' },
  { id: 'client-15', nombre: 'Droguería Unida', direccion: 'Calle 15 #567', teléfono: '991567890' },
  { id: 'client-16', nombre: 'Farmacia La Paz', direccion: 'Av. Universitaria 234', teléfono: '991678901' },
  { id: 'client-17', nombre: 'Botica Nueva Era', direccion: 'Jr. Andahuaylas 345', teléfono: '991789012' },
  { id: 'client-18', nombre: 'Farmacia Express', direccion: 'Av. Sánchez Cerro 456', teléfono: '991890123' },
  { id: 'client-19', nombre: 'Droguería Plus', direccion: 'Calle 20 #678', teléfono: '991901234' },
  { id: 'client-20', nombre: 'Farmacia Cristal', direccion: 'Av. Grau 567', teléfono: '992012345' },
  { id: 'client-21', nombre: 'Botica Salud Total', direccion: 'Jr. Ica 890', teléfono: '992123456' },
  { id: 'client-22', nombre: 'Farmacia Nueva Esperanza', direccion: 'Av. La Marina 234', teléfono: '992234567' },
  { id: 'client-23', nombre: 'Droguería Confianza', direccion: 'Calle 25 #789', teléfono: '992345678' }
];

// 104 productos (extracto de populate-firestore.js)
const productos = [
  { id: 'p1', nombre: 'APROXOL PLUS', presentacion: 'Jarabe 250ml', vvf: 12.50, pvf: 15.00, imagen: 'https://via.placeholder.com/200?text=APROXOL%20PLUS' },
  { id: 'p2', nombre: 'ATIDEM 200 MG', presentacion: 'Caja x 20 tab', vvf: 8.75, pvf: 11.00, imagen: 'https://via.placeholder.com/200?text=ATIDEM%20200%20MG%20CAJA' },
  { id: 'p3', nombre: 'BETAMARK 16MG', presentacion: 'Caja x 20 tab', vvf: 14.25, pvf: 18.00, imagen: 'https://via.placeholder.com/200?text=BETAMARK%2016MG%20CAJA%20X20TAB' },
  { id: 'p4', nombre: 'DEXABRON PLUS', presentacion: 'Frasco 120ml', vvf: 10.50, pvf: 13.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/dexabron_plus.jpg' },
  { id: 'p5', nombre: 'DEXAMARK', presentacion: 'Caja x 10 amp', vvf: 22.00, pvf: 28.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/dexamark.jpg' },
  { id: 'p6', nombre: 'DICLOMAX', presentacion: 'Caja x 20 cap', vvf: 5.50, pvf: 7.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/diclomax.jpg' },
  { id: 'p7', nombre: 'DIOSMIN', presentacion: 'Frasco 250ml', vvf: 15.75, pvf: 20.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/diosmin.jpg' },
  { id: 'p8', nombre: 'DOLOAPROXOL', presentacion: 'Tabletas x 10', vvf: 6.25, pvf: 8.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/doloaproxol.jpg' },
  { id: 'p9', nombre: 'ERGENIL', presentacion: 'Jarabe 200ml', vvf: 9.00, pvf: 11.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/ergenil.jpg' },
  { id: 'p10', nombre: 'FLOXITAN 750', presentacion: 'Caja x 10 cap', vvf: 18.50, pvf: 23.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10001300035.jpg' },
  // ... (truncado para brevedad, ver populate-firestore.js para el listado completo)
];

// Expandir productos hasta 104
for (let i = productos.length; i < 104; i++) {
  const num = i + 1;
  productos.push({
    id: `p${num}`,
    nombre: `PRODUCTO ${num}`,
    presentacion: `Presentación ${num}`,
    vvf: 10 + (Math.random() * 15),
    pvf: 12.5 + (Math.random() * 18.75),
    imagen: `https://via.placeholder.com/200?text=PRODUCTO%20${num}`
  });
}

async function main() {
  try {
    console.log('🚀 Iniciando población de Firestore...\n');
    
    // Agregar clientes
    console.log('📝 Agregando clientes...');
    let clientCount = 0;
    for (const cliente of clientes) {
      await db.collection('clientes').doc(cliente.id).set(cliente);
      clientCount++;
      process.stdout.write(`\r   Clientes: ${clientCount}/${clientes.length}`);
    }
    console.log(`\n   ✓ ${clientes.length} clientes agregados\n`);
    
    // Agregar productos
    console.log('📦 Agregando productos...');
    let prodCount = 0;
    for (const producto of productos) {
      await db.collection('productos').doc(producto.id).set(producto);
      prodCount++;
      process.stdout.write(`\r   Productos: ${prodCount}/${productos.length}`);
    }
    console.log(`\n   ✓ ${productos.length} productos agregados\n`);
    
    // Agregar precios (matriz completa)
    console.log('💰 Agregando precios (matriz clienteId × productoId)...');
    let precioCount = 0;
    const totalPrecios = clientes.length * productos.length;
    
    for (const cliente of clientes) {
      for (const producto of productos) {
        // Precio con variación por cliente (2-5% de margen adicional)
        const margen = 0.02 + (Math.random() * 0.03);
        const precio = producto.vvf * (1 + margen);
        
        const docId = `${cliente.id}_${producto.id}`;
        await db.collection('precios').doc(docId).set({
          clienteId: cliente.id,
          productoId: producto.id,
          precio: Math.round(precio * 100) / 100
        });
        
        precioCount++;
        if (precioCount % 100 === 0) {
          process.stdout.write(`\r   Precios: ${precioCount}/${totalPrecios}`);
        }
      }
    }
    console.log(`\n   ✓ ${precioCount} precios agregados\n`);
    
    console.log('✅ ¡Población completada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • Clientes: ${clientes.length}`);
    console.log(`   • Productos: ${productos.length}`);
    console.log(`   • Precios: ${precioCount}`);
    console.log('\n🌐 Accede a la app en: http://localhost:5500\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la población:', error);
    process.exit(1);
  }
}

main();
