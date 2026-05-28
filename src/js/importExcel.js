// importExcel.js
// Lee el Excel usando SheetJS y sube colecciones clientes, productos y precios a Firestore

document.getElementById('btnImport').addEventListener('click', async ()=>{
  const f = document.getElementById('excelFile').files[0];
  if(!f) return alert('Selecciona un archivo Excel primero');
  const data = await f.arrayBuffer();
  const wb = XLSX.read(data, {type:'array'});
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet, {header:1});

  // Estructura esperada:
  // fila0: ['', cliente1, cliente2, ...]
  // fila1..n: [producto, precioCliente1, precioCliente2, ...]

  const headers = json[0];
  const clientes = [];
  for(let c=1;c<headers.length;c++){ if(headers[c]) clientes.push({col:c,nombre:headers[c]}); }

  const products = [];
  for(let r=1;r<json.length;r++){
    const row = json[r];
    const nombre = row[0]; if(!nombre) continue;
    products.push({row:r,nombre});
  }

  // Subir a Firebase
  if(!window.db) return alert('Firebase no inicializado');
  
  let batch = db.batch();
  let count = 0;

  const commitBatch = async () => {
    if (count > 0) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  };

  // Map antiguo -> firestore ids: generamos docs con auto-id
  const clienteIds = {};
  for(const c of clientes){
    const ref = db.collection('clientes').doc();
    clienteIds[c.col]=ref.id;
    batch.set(ref, { nombre: c.nombre });
    count++;
    if (count >= 500) await commitBatch();
  }

  const productoIds = {};
  for(const p of products){
    const ref = db.collection('productos').doc();
    productoIds[p.row]=ref.id;
    batch.set(ref, { nombre: p.nombre });
    count++;
    if (count >= 500) await commitBatch();
  }

  // precios
  for(const p of products){
    const row = json[p.row];
    for(const c of clientes){
      const val = row[c.col];
      if(val===undefined||val==='') continue;
      const precio = parseFloat(String(val).replace(',','.'))||0;
      const ref = db.collection('precios').doc();
      const doc = {clienteId:clienteIds[c.col],productoId:productoIds[p.row],precio};
      batch.set(ref, doc);
      count++;
      if (count >= 500) await commitBatch();
    }
  }

  await commitBatch();
  alert('Importación completada');
});
