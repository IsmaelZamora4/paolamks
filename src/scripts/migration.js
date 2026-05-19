// js/migration.js - Ejecutar una sola vez para migrar datos existentes
async function migrateLegacyDataToUser(targetEmail) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user || user.email !== targetEmail) {
        console.error("Debes estar logueado con la cuenta de destino para migrar.");
        return;
    }

    const collections = ['clientes', 'productos', 'ventas', 'precios', 'settings'];
    console.log(`Iniciando migración para: ${targetEmail} (UID: ${user.uid})`);

    for (const colName of collections) {
        const snap = await db.collection(colName).get();
        const batch = db.batch();
        let count = 0;

        snap.docs.forEach(doc => {
            const data = doc.data();
            // Solo migrar si no tiene userId
            if (!data.userId) {
                batch.update(doc.ref, { userId: user.uid });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Migrados ${count} documentos en ${colName}`);
        } else {
            console.log(`No hay documentos pendientes en ${colName}`);
        }
    }
    console.log("✅ Migración completada.");
}
// Para usarlo: logueate como tu madre y ejecuta en la consola:
// migrateLegacyDataToUser('paola@ejemplo.com')