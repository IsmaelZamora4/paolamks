// ============================================================
// app.js — Panel Paola · Farmacéuticos Markos
// VERSIÓN COMPLETA con gráfico de ventas y top clientes
// ============================================================

function onFirebaseReady(cb) {
  if (window.db && window.storage) { cb(); return; }
  window.addEventListener('firebase-ready', cb);
  const wait = setInterval(() => {
    if (window.db && window.storage) { clearInterval(wait); cb(); }
  }, 200);
}

onFirebaseReady(() => {
  // ─── ESTADO GLOBAL ───────────────────────────────────────
  let clientsCache = [];
  let productsCache = [];
  let ventasCache   = [];
  let priceCache = {};

  const fallbackImg = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="18" fill="#f0f4f8"/><rect x="30" y="50" width="140" height="100" rx="10" fill="#dde3ec"/><circle cx="80" cy="85" r="18" fill="#b0bcc9"/><path d="M40 145 L75 105 L100 130 L125 110 L160 145Z" fill="#c8d2de"/><text x="100" y="175" text-anchor="middle" font-family="system-ui" font-size="13" fill="#8896a5">Sin imagen</text></svg>`);

  const clientLogos = {
    'america': 'https://www.americasalud.com.pe/images/logo/logo.png',
    'barizal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn8ZGSwizxcb2J5Eo8lk9PFr-R0X9QSYYXvQ&s',
    'bethel': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19YJDIjMepYKIMAV2Se2Kt2kJ92nb6jjZiQ&s',
    'boticas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQvXWYOziMkA7u9PGawMnoCDNYXRkrNwHnNA&s',
    'fameza': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq81VtyWLBeVw_Ih6mcDi95qq50iOV5_0n5g&s',
    'hogar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3pZ9YkllsTXUffktpqbqCDkbzZT8JcsEdYw&s',
    'hollygood': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1MSJp8YWqE90j4Kh5xZhSmOOvPqT0oR7v0A&s',
    'lagomedica': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaXKNmbql2NgmX43v2dn7AAyJAaomEfhM4gA&s',
    'lider': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwlW2CDjhzlxjJC8-wVm2Vpw6rLIBlOhFI-A&s',
    'limatambo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlfgD72ojlsdnxWIxo3B95B68N2pCbG09EGw&s',
    'novafarma': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfctOCzfbPSoKux-b2Hi3u1LYezykXkJwIlQ&s',
    'patty': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY0zx-tEM0G4e_cWDX-sTU2qdgc56ksgpHeQ&s',
    'prosalud': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSYxQzr_wpWAl5rXL8WODo3Eo5JUz-KPs9jQ&s',
    'provefarma': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrvKeIoZ1K9FiEJmYbE3_ZFpz7LBC0SIn_MA&s',
    'quimi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxoVwWwtHzVMmGqID9HuEBtqrkDqiItDDCjw&s',
    'san': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbpQ5vP7UucinzXJ64uF1silgZ51ZzcoZNWQ&s',
    'union': 'https://pbs.twimg.com/profile_images/1477359556523139074/vcTsHR0C_400x400.jpg',
    'universal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBdSuLC7f7aDoap7E_B0xze-DL_ef9LZnsnA&s',
    'v&g': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8mJK5FqZjqUnkQU4qjORe-Gxl5-_zBc9B_A&s',
    'visafarma': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH3W5_TQuAD5lUEssIazvt5gzpqytErjHTEg&s'
  };

  function getClientLogo(clientName) {
    if (!clientName) return fallbackImg;
    return clientLogos[clientName.toLowerCase()] || fallbackImg;
  }

  // ─── NAVEGACIÓN ──────────────────────────────────────────
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('pageTitle');

  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const v = b.dataset.view;
    views.forEach(w => w.classList.add('hidden'));
    document.getElementById(v).classList.remove('hidden');
    pageTitle.textContent = b.textContent.trim();
    if (v === 'dashboard') loadDashboard();
    if (v === 'register')  loadFormData();
    if (v === 'import')    initImportView();
    if (v === 'history')   loadHistory();
    if (v === 'products')  loadProducts();
    if (v === 'clients')   loadClients();
  }));

  // ─── CACHÉ GLOBAL (sin precios) ─────────────────────────
  async function refreshCache() {
    const [cs, ps, vs] = await Promise.all([
      db.collection('clientes').get(),
      db.collection('productos').get(),
      db.collection('ventas').get()
    ]);
    clientsCache  = cs.docs.map(d => ({ id: d.id, ...d.data() }));
    productsCache = ps.docs.map(d => ({ id: d.id, ...d.data() }));
    ventasCache   = vs.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getPrice(clienteId, productoId) {
    const key = `${clienteId}_${productoId}`;
    if (priceCache.hasOwnProperty(key)) return priceCache[key];
    try {
      const doc = await db.collection('precios').doc(key).get();
      const precio = doc.exists ? doc.data().precio : null;
      priceCache[key] = precio;
      return precio;
    } catch (err) {
      console.error(`Error al obtener precio ${key}:`, err);
      priceCache[key] = null;
      return null;
    }
  }

  async function getMultiplePrices(ventas) {
    const keys = [...new Set(ventas.map(v => `${v.clienteId}_${v.productoId}`))];
    const missing = keys.filter(k => !priceCache.hasOwnProperty(k));
    if (missing.length) {
      await Promise.all(missing.map(async k => {
        const [clienteId, productoId] = k.split('_');
        const precio = await getPrice(clienteId, productoId);
        priceCache[k] = precio;
      }));
    }
    const result = {};
    keys.forEach(k => { result[k] = priceCache[k]; });
    return result;
  }

  function clientName(id) { return clientsCache.find(c => c.id === id)?.nombre || id; }
  function productName(id) { return productsCache.find(p => p.id === id)?.nombre || id; }

  function toDateObj(val) {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (val.toDate) return val.toDate();
    if (val.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
  }

  function fmtDate(val) {
    const d = toDateObj(val);
    if (!d) return '—';
    return d.toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' });
  }

  function daysDiff(val) {
    const d = toDateObj(val);
    if (!d) return null;
    return Math.round((d - Date.now()) / 86400000);
  }

  // ─── INICIO ───────────────────────────────────────────────
  (async () => {
    await refreshCache();
    loadProfile();
    loadDashboard();
  })();

  // ─── PERFIL (guardado en Firestore como base64) ───────────
  document.getElementById('profileUpload').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Por favor, selecciona una imagen válida'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('La imagen debe ser menor a 2MB'); return; }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        await db.collection('settings').doc('profile').set({ photo: base64Data, updated: Date.now() }, { merge: true });
        loadProfile();
        alert('✓ Foto guardada correctamente');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error al guardar foto:', err);
      alert('Error al guardar la foto: ' + err.message);
    }
  });

  async function loadProfile() {
    try {
      const doc = await db.collection('settings').doc('profile').get();
      const photoData = (doc.exists && doc.data().photo) ? doc.data().photo : fallbackImg;
      document.getElementById('profileImg').src = photoData;
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      document.getElementById('profileImg').src = fallbackImg;
    }
  }

  // ─── RELOJ Y UBICACIÓN ──────────────────────────────────
  let userLocation = 'Detectando...';
  async function detectLocation() {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || 'Tu ubicación';
            const country = data.address?.country || '';
            userLocation = `${city}, ${country}`;
          } catch (e) { userLocation = 'Ubicación local'; }
          updateClockDisplay();
        }, error => { userLocation = 'Ubicación local'; updateClockDisplay(); });
      }
    } catch (err) { userLocation = 'Ubicación local'; }
  }
  function updateClockDisplay() {
    const clockDisplay = document.getElementById('clockDisplay');
    const clockDate = document.getElementById('clockDate');
    const clockLocation = document.getElementById('clockLocation');
    if (!clockDisplay) return;
    const now = new Date();
    clockDisplay.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    clockDate.textContent = now.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    if (clockLocation) clockLocation.textContent = userLocation;
  }
  detectLocation();
  updateClockDisplay();
  setInterval(updateClockDisplay, 1000);

  // ─── DASHBOARD ───────────────────────────────────────────
  async function loadDashboard() {
    const now = new Date();
    const mesKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const mesAntKey = (() => { const d = new Date(now); d.setMonth(d.getMonth()-1); return `${d.getFullYear()}-${d.getMonth()+1}`; })();
    const hoy = now.getTime();
    const hace30 = hoy - 30*86400000, hace60 = hoy - 60*86400000;

    const ventasRelevantes = ventasCache.filter(v => v.mesCompra === mesKey || v.mesCompra === mesAntKey);
    const priceMap = await getMultiplePrices(ventasRelevantes);
    let totalMes = 0, totalMesAnt = 0;
    ventasCache.forEach(v => {
      const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const monto = precio * (v.cantidad || 0);
      if (v.mesCompra === mesKey) totalMes += monto;
      if (v.mesCompra === mesAntKey) totalMesAnt += monto;
    });
    const varPct = totalMesAnt > 0 ? ((totalMes - totalMesAnt) / totalMesAnt * 100) : null;

    const lastBuyMap = {};
    ventasCache.forEach(v => { const ts = toDateObj(v.fechaVenta)?.getTime() || 0; if (!lastBuyMap[v.clienteId] || ts > lastBuyMap[v.clienteId]) lastBuyMap[v.clienteId] = ts; });
    let activos = 0, advertencias = [], urgentes = [];
    clientsCache.forEach(c => {
      const last = lastBuyMap[c.id];
      if (!last) { advertencias.push({ tipo: 'sin-compras', texto: `${c.nombre} nunca ha comprado` }); return; }
      const diasUltima = Math.round((hoy - last) / 86400000);
      if (last >= hace30) activos++;
      else if (last >= hace60) advertencias.push({ tipo: 'inactivo', texto: `${c.nombre} sin comprar hace ${diasUltima} días` });
      else urgentes.push({ tipo: 'muy-inactivo', texto: `${c.nombre} sin comprar hace ${diasUltima} días` });
    });
    ventasCache.forEach(v => {
      if (!v.fechaVencimiento) return;
      const dias = daysDiff(v.fechaVencimiento);
      if (dias === null || dias > 60) return;
      const pnombre = productName(v.productoId), cnombre = clientName(v.clienteId), lote = v.lote ? ` (Lote: ${v.lote})` : '';
      if (dias < 0) urgentes.push({ tipo: 'vencido', texto: `VENCIDO: ${pnombre}${lote} — ${cnombre}` });
      else if (dias <= 15) urgentes.push({ tipo: 'vence-pronto', texto: `Vence en ${dias} días: ${pnombre}${lote} — ${cnombre}` });
      else advertencias.push({ tipo: 'vence-pronto', texto: `Vence en ${dias} días: ${pnombre}${lote} — ${cnombre}` });
    });

    const varHtml = varPct !== null ? `<span class="kpi-delta ${varPct >= 0 ? 'up' : 'down'}">${varPct >= 0 ? '▲' : '▼'} ${Math.abs(varPct).toFixed(1)}%</span>` : '';
    document.getElementById('totalMonth').innerHTML = `S/${totalMes.toFixed(2)}<br>${varHtml}`;
    document.getElementById('activeClients').textContent = activos;
    document.getElementById('alertsCount').textContent = advertencias.length + urgentes.length;
    const wList = document.getElementById('warningList'), dList = document.getElementById('dangerList');
    if (wList) wList.innerHTML = advertencias.length ? advertencias.map(a => `<li class="alert-item">⚠️ ${a.texto}</li>`).join('') : '<li class="alert-item muted">Sin advertencias</li>';
    if (dList) dList.innerHTML = urgentes.length ? urgentes.map(a => `<li class="alert-item">${a.tipo === 'vencido' ? '💀' : '🔴'} ${a.texto}</li>`).join('') : '<li class="alert-item muted">Sin alertas urgentes</li>';

    renderProximasRecompras();
    renderFeaturedProducts();
    renderRecentSales();
    renderSalesChart();
    renderTopClientsChart();   // <-- NUEVO: gráfico de top clientes
  }

  function renderProximasRecompras() {
    const container = document.getElementById('recomprasGrid');
    if (!container) return;
    const clientIntervals = {};
    clientsCache.forEach(c => {
      const buys = ventasCache.filter(v => v.clienteId === c.id && v.fechaVenta).map(v => toDateObj(v.fechaVenta)?.getTime()).filter(Boolean).sort((a,b)=>a-b);
      if (buys.length < 2) return;
      const intervals = [];
      for (let i = 1; i < buys.length; i++) intervals.push(buys[i] - buys[i-1]);
      const avgInterval = intervals.reduce((a,b)=>a+b,0)/intervals.length;
      const lastBuy = buys[buys.length-1];
      const nextBuyEstimate = lastBuy + avgInterval;
      const daysUntil = Math.round((nextBuyEstimate - Date.now())/86400000);
      if (daysUntil <= 14) clientIntervals[c.id] = { nombre: c.nombre, daysUntil, nextDate: new Date(nextBuyEstimate) };
    });
    const sorted = Object.values(clientIntervals).sort((a,b)=>a.daysUntil-b.daysUntil);
    if (!sorted.length) { container.innerHTML = '<p class="muted" style="padding:12px">Se necesitan más ventas registradas para estimar recompras.</p>'; return; }
    container.innerHTML = sorted.map(r => {
      const urgencia = r.daysUntil <= 0 ? 'danger' : r.daysUntil <= 7 ? 'warn' : 'ok';
      const label = r.daysUntil <= 0 ? `Debería haber comprado hace ${Math.abs(r.daysUntil)} días` : r.daysUntil === 0 ? 'Hoy' : `En ${r.daysUntil} días (${fmtDate(r.nextDate)})`;
      return `<div class="recompra-card ${urgencia}"><div class="recompra-nombre">${r.nombre}</div><div class="recompra-fecha">${label}</div></div>`;
    }).join('');
  }

  function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    const prodCount = {};
    ventasCache.forEach(v => { prodCount[v.productoId] = (prodCount[v.productoId] || 0) + (v.cantidad || 0); });
    const top = Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,qty]) => {
      const prod = productsCache.find(p=>p.id===id);
      return { id, nombre: prod?.nombre||id, presentacion: prod?.presentacion||'', imagen: prod?.imagen||fallbackImg, qty };
    });
    if (!top.length) { container.innerHTML = '<p class="muted" style="padding:12px;text-align:center">Sin ventas registradas.</p>'; return; }
    container.innerHTML = top.map(p => `<div class="featured-item"><img src="${p.imagen}" onerror="this.src='${fallbackImg}'"><div class="meta"><div style="font-weight:600">${p.nombre}</div><div class="muted" style="font-size:12px">${p.presentacion}</div><div style="color:var(--accent);font-size:12px">Vendido: ${p.qty} unid.</div></div></div>`).join('');
  }

  async function renderRecentSales() {
    const container = document.getElementById('recentSales');
    if (!container) return;
    const recent = ventasCache.filter(v=>v.fechaVenta).sort((a,b)=>toDateObj(b.fechaVenta)?.getTime() - toDateObj(a.fechaVenta)?.getTime()).slice(0,10);
    if (!recent.length) { container.innerHTML = '<li class="recent-sale" style="padding:12px;text-align:center"><span class="muted">Sin ventas registradas.</span></li>'; return; }
    const priceMap = await getMultiplePrices(recent);
    container.innerHTML = recent.map(v => {
      const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      return `<li class="recent-sale"><div><div style="font-weight:600">${productName(v.productoId)}</div><div class="muted" style="font-size:11px">${clientName(v.clienteId)} • ${fmtDate(v.fechaVenta)}</div></div><div style="color:var(--accent);font-weight:600">S/${(precio * (v.cantidad||0)).toFixed(2)}</div></li>`;
    }).join('');
  }

  // ─── GRÁFICO DE VENTAS POR MES ──────────────────────────
  let salesChartInstance = null;

  function renderSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    const context = ctx.getContext('2d');

    const salesByMonth = {};
    ventasCache.forEach(v => {
      if (!v.fechaVenta) return;
      const date = toDateObj(v.fechaVenta);
      if (!date) return;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}`;
      const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const monto = precio * (v.cantidad || 0);
      salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + monto;
    });
    const sortedMonths = Object.keys(salesByMonth).sort();
    const labels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      return new Date(year, month-1).toLocaleDateString('es-PE', { month:'short', year:'numeric' });
    });
    const data = sortedMonths.map(m => salesByMonth[m]);

    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas (S/)',
          data: data,
          backgroundColor: 'rgba(37, 99, 235, 0.6)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Monto (S/)' } },
          x: { title: { display: true, text: 'Mes' } }
        }
      }
    });
  }

  // ─── GRÁFICO TOP 5 CLIENTES (barras horizontales) ──────
  let topClientsChartInstance = null;

  function renderTopClientsChart() {
    const canvas = document.getElementById('topClientsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Calcular total por cliente
    const clientTotals = {};
    ventasCache.forEach(v => {
      const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const monto = precio * (v.cantidad || 0);
      const nombre = clientName(v.clienteId);
      clientTotals[nombre] = (clientTotals[nombre] || 0) + monto;
    });

    // Convertir a array, ordenar y tomar top 5
    const sorted = Object.entries(clientTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);

    // Destruir gráfico anterior si existe
    if (topClientsChartInstance) {
      topClientsChartInstance.destroy();
    }

    topClientsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas totales (S/)',
          data: data,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        indexAxis: 'y',  // barras horizontales
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } }
        },
        scales: {
          x: { title: { display: true, text: 'Monto (S/)' }, beginAtZero: true },
          y: { title: { display: true, text: 'Cliente' } }
        }
      }
    });
  }

  // ─── FORMULARIO DE VENTA (cargar datos y precio automático) ──
  async function loadFormData() {
    if (!clientsCache.length || !productsCache.length) await refreshCache();
    const clientSelect = document.getElementById('clientSelect');
    const productSelect = document.getElementById('productSelect');
    const priceField = document.getElementById('priceField');
    const autoPriceBtn = document.getElementById('autoPriceBtn');
    const productSaleImg = document.getElementById('productSaleImg');

    clientSelect.innerHTML = clientsCache.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    productSelect.innerHTML = productsCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');

    const updateProductImage = () => {
      const product = productsCache.find(p => p.id === productSelect.value);
      productSaleImg.src = (product && product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg;
    };

    const updatePrice = async (showLoading = false) => {
      if (showLoading) priceField.placeholder = 'Cargando...';
      const precio = await getPrice(clientSelect.value, productSelect.value);
      priceField.value = precio !== null ? precio.toFixed(2) : '0.00';
      priceField.placeholder = '';
    };

    autoPriceBtn?.addEventListener('click', async (e) => { e.preventDefault(); await updatePrice(true); });
    clientSelect.addEventListener('change', () => updatePrice(true));
    productSelect.addEventListener('change', () => { updatePrice(true); updateProductImage(); });
    await updatePrice();
    updateProductImage();
  }

  // ─── HISTORIAL Y ACCIONES (con editar/eliminar) ──────────
  async function loadHistory() {
    if (!ventasCache.length) await refreshCache();
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    const sorted = [...ventasCache].sort((a,b)=> (b.fechaVenta?.seconds||0) - (a.fechaVenta?.seconds||0)).slice(0,300);
    const filterCliente = document.getElementById('filterClient').value.toLowerCase();
    const filterProducto = document.getElementById('filterProduct').value.toLowerCase();
    const rows = sorted.filter(v => clientName(v.clienteId).toLowerCase().includes(filterCliente) && productName(v.productoId).toLowerCase().includes(filterProducto));
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center;padding:20px">Sin ventas registradas</td></tr>'; return; }
    const priceMap = await getMultiplePrices(rows);
    rows.forEach(v => {
      const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const total = (precio * (v.cantidad||0)).toFixed(2);
      const dias = daysDiff(v.fechaVencimiento);
      let vencClass = '', vencText = fmtDate(v.fechaVencimiento);
      if (dias !== null) {
        if (dias < 0) { vencClass = 'text-danger'; vencText += ' ⚠️'; }
        else if (dias <= 15) { vencClass = 'text-warn'; vencText += ` (${dias}d)`; }
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${clientName(v.clienteId)}</td>
        <td>${productName(v.productoId)}</td>
        <td>${fmtDate(v.fechaVenta)}</td>
        <td>${v.cantidad}</td>
        <td>S/${precio.toFixed(2)}</td>
        <td>S/${total}</td>
        <td class="${vencClass}">${vencText}</td>
        <td style="text-align:center;white-space:nowrap">
          <button class="btn-action btn-view" data-sale-id="${v.id}" title="Ver detalles">👁️</button>
          <button class="btn-action btn-edit" data-sale-id="${v.id}" title="Editar">✏️</button>
          <button class="btn-action btn-delete" data-sale-id="${v.id}" title="Eliminar">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const saleId = btn.dataset.saleId;
        const venta = ventasCache.find(v => v.id === saleId);
        if (venta) viewSaleDetail(venta);
      });
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const saleId = btn.dataset.saleId;
        const venta = ventasCache.find(v => v.id === saleId);
        if (venta) editSale(venta);
      });
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const saleId = btn.dataset.saleId;
        if (confirm('¿Estás seguro de eliminar esta venta?')) {
          await db.collection('ventas').doc(saleId).delete();
          ventasCache = ventasCache.filter(v => v.id !== saleId);
          loadHistory();
          loadDashboard();
        }
      });
    });
  }

  document.getElementById('filterClient').addEventListener('input', () => { if (!document.getElementById('history').classList.contains('hidden')) loadHistory(); });
  document.getElementById('filterProduct').addEventListener('input', () => { if (!document.getElementById('history').classList.contains('hidden')) loadHistory(); });

  // ─── VER DETALLES DE VENTA ──────────────────────────────
  function viewSaleDetail(venta) {
    const modal = document.getElementById('saleDetailModal');
    const precio = venta.precioVenta || 0;
    const total = (precio * (venta.cantidad || 0)).toFixed(2);
    document.getElementById('saleDetailCliente').textContent = clientName(venta.clienteId);
    document.getElementById('saleDetailProducto').textContent = productName(venta.productoId);
    document.getElementById('saleDetailCantidad').textContent = venta.cantidad || '—';
    document.getElementById('saleDetailPrecio').textContent = `S/${precio.toFixed(2)}`;
    document.getElementById('saleDetailTotal').textContent = `S/${total}`;
    document.getElementById('saleDetailFecha').textContent = fmtDate(venta.fechaVenta);
    document.getElementById('saleDetailLote').textContent = venta.lote || '—';
    document.getElementById('saleDetailVencimiento').textContent = fmtDate(venta.fechaVencimiento);
    modal.classList.remove('hidden');
  }

  // ─── EDITAR VENTA (modal) ────────────────────────────────
  function editSale(venta) {
    const modal = document.getElementById('editSaleModal');
    const clientSelect = document.getElementById('editClienteId');
    const productSelect = document.getElementById('editProductoId');
    clientSelect.innerHTML = clientsCache.map(c => `<option value="${c.id}" ${c.id === venta.clienteId ? 'selected' : ''}>${c.nombre}</option>`).join('');
    productSelect.innerHTML = productsCache.map(p => `<option value="${p.id}" ${p.id === venta.productoId ? 'selected' : ''}>${p.nombre}</option>`).join('');
    document.getElementById('editSaleId').value = venta.id;
    document.getElementById('editCantidad').value = venta.cantidad || 1;
    document.getElementById('editLote').value = venta.lote || '';
    document.getElementById('editPrecioVenta').value = venta.precioVenta || 0;
    if (venta.fechaVencimiento) {
      const date = toDateObj(venta.fechaVencimiento);
      if (date) document.getElementById('editFechaVencimiento').value = date.toISOString().split('T')[0];
    } else document.getElementById('editFechaVencimiento').value = '';
    const updateEditProductImage = () => {
      const product = productsCache.find(p => p.id === productSelect.value);
      document.getElementById('editProductImg').src = (product && product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg;
    };
    productSelect.removeEventListener('change', updateEditProductImage);
    productSelect.addEventListener('change', updateEditProductImage);
    updateEditProductImage();
    document.getElementById('editSaleMessage').textContent = '';
    modal.classList.remove('hidden');
  }

  // Cerrar modales
  document.getElementById('closeSaleDetailModal')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.getElementById('closeSaleDetailBtn')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.querySelector('#saleDetailModal .modal-overlay')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.getElementById('closeEditSaleModal')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));
  document.getElementById('cancelEditSaleBtn')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));
  document.querySelector('#editSaleModal .modal-overlay')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));

  // Guardar edición de venta
  document.getElementById('saveEditSaleBtn')?.addEventListener('click', async () => {
    const saleId = document.getElementById('editSaleId').value;
    const clienteId = document.getElementById('editClienteId').value;
    const productoId = document.getElementById('editProductoId').value;
    const cantidad = parseFloat(document.getElementById('editCantidad').value);
    const lote = document.getElementById('editLote').value.trim();
    const precioVenta = parseFloat(document.getElementById('editPrecioVenta').value);
    const fechaVencimiento = document.getElementById('editFechaVencimiento').value;
    const msg = document.getElementById('editSaleMessage');
    if (isNaN(cantidad) || cantidad <= 0) { msg.textContent = 'Cantidad positiva requerida'; msg.style.color = 'var(--danger)'; return; }
    if (!lote) { msg.textContent = 'Lote requerido'; msg.style.color = 'var(--danger)'; return; }
    if (!fechaVencimiento) { msg.textContent = 'Fecha de vencimiento requerida'; msg.style.color = 'var(--danger)'; return; }
    if (isNaN(precioVenta) || precioVenta <= 0) { msg.textContent = 'Precio unitario positivo requerido'; msg.style.color = 'var(--danger)'; return; }
    msg.textContent = 'Guardando...'; msg.style.color = 'var(--muted)';
    try {
      const updateData = { clienteId, productoId, cantidad, lote, precioVenta, fechaVencimiento: new Date(fechaVencimiento) };
      await db.collection('ventas').doc(saleId).update(updateData);
      const index = ventasCache.findIndex(v => v.id === saleId);
      if (index !== -1) ventasCache[index] = { ...ventasCache[index], ...updateData };
      msg.textContent = '✓ Venta actualizada'; msg.style.color = 'var(--success)';
      setTimeout(() => { document.getElementById('editSaleModal').classList.add('hidden'); loadHistory(); loadDashboard(); }, 1500);
    } catch (err) { msg.textContent = 'Error: ' + err.message; msg.style.color = 'var(--danger)'; }
  });

  // ─── FORMULARIO DE VENTA (SUBMIT) ──────────────────────────
  const saleForm = document.getElementById('saleForm');
  const saleMessage = document.getElementById('saleMessage');
  saleForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clienteId = document.getElementById('clientSelect').value;
    const productoId = document.getElementById('productSelect').value;
    const cantidadStr = document.getElementById('cantidadField').value;
    const precioStr = document.getElementById('priceField').value;
    const lote = document.getElementById('loteField').value.trim();
    const vencimiento = document.getElementById('vencimientoField').value;

    if (!clienteId) { saleMessage.textContent = 'Selecciona un cliente'; saleMessage.style.color = 'var(--danger)'; return; }
    if (!productoId) { saleMessage.textContent = 'Selecciona un producto'; saleMessage.style.color = 'var(--danger)'; return; }
    if (!cantidadStr) { saleMessage.textContent = 'Ingresa una cantidad'; saleMessage.style.color = 'var(--danger)'; return; }
    const cantidad = parseInt(cantidadStr, 10);
    if (isNaN(cantidad) || cantidad <= 0) { saleMessage.textContent = 'La cantidad debe ser un número entero positivo'; saleMessage.style.color = 'var(--danger)'; return; }
    if (!precioStr || precioStr.trim() === '') { saleMessage.textContent = 'Ingresa el precio (automático o manual)'; saleMessage.style.color = 'var(--danger)'; return; }
    let precio = parseFloat(precioStr);
    if (isNaN(precio) || precio <= 0) { saleMessage.textContent = 'Precio inválido (debe ser positivo)'; saleMessage.style.color = 'var(--danger)'; return; }
    if (!lote) { saleMessage.textContent = 'Ingresa un número de lote'; saleMessage.style.color = 'var(--danger)'; return; }
    if (!vencimiento) { saleMessage.textContent = 'Ingresa la fecha de vencimiento'; saleMessage.style.color = 'var(--danger)'; return; }

    const vencDate = new Date(vencimiento);
    vencDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (vencDate < today) {
      const proceed = confirm('⚠️ Esta fecha de vencimiento ya pasó. ¿Deseas continuar de todas formas?');
      if (!proceed) return;
    }

    const now = new Date();
    const mesCompra = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const ventaData = {
      clienteId, productoId, cantidad, fechaVenta: new Date(), mesCompra,
      precioVenta: precio, lote, fechaVencimiento: new Date(vencimiento)
    };
    saleMessage.textContent = 'Guardando...'; saleMessage.style.color = 'var(--muted)';
    try {
      const ref = await db.collection('ventas').add(ventaData);
      ventasCache.push({ id: ref.id, ...ventaData });
      saleMessage.textContent = '✓ Venta guardada'; saleMessage.style.color = 'var(--success)';
      saleForm.reset();
      document.getElementById('productSaleImg').src = fallbackImg;
      await refreshCache();
      loadDashboard();
      setTimeout(() => saleMessage.textContent = '', 3000);
    } catch (err) { saleMessage.textContent = 'Error: ' + err.message; saleMessage.style.color = 'var(--danger)'; }
  });

  // ─── CLIENTES (lista con tarjetas) ─────────────────────────
  async function loadClients() {
    if (!clientsCache.length) await refreshCache();
    const grid = document.getElementById('clientsGrid');
    grid.innerHTML = '';
    const hoy = Date.now();
    const hace30 = hoy - 30*86400000, hace60 = hoy - 60*86400000;
    const priceMap = await getMultiplePrices(ventasCache);
    clientsCache.forEach(c => {
      const buys = ventasCache.filter(v => v.clienteId === c.id && v.fechaVenta);
      const sorted = buys.sort((a,b)=> (b.fechaVenta?.seconds||0)-(a.fechaVenta?.seconds||0));
      const lastTs = sorted[0] ? toDateObj(sorted[0].fechaVenta)?.getTime() : null;
      const totalCompras = buys.length;
      const totalMonto = buys.reduce((sum,v) => {
        const p = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
        return sum + p * (v.cantidad||0);
      }, 0);
      let estadoLabel = 'Sin compras', estadoClass = 'inactive';
      if (lastTs) {
        if (lastTs >= hace30) { estadoLabel = 'Activo'; estadoClass = 'active'; }
        else if (lastTs >= hace60) { estadoLabel = 'Inactivo'; estadoClass = 'warn'; }
        else { estadoLabel = 'Sin comprar +60d'; estadoClass = 'inactive'; }
      }
      const prodCount = {};
      buys.forEach(v => { prodCount[v.productoId] = (prodCount[v.productoId]||0)+(v.cantidad||0); });
      const topProd = Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,2);
      const topProdHtml = topProd.map(([pid]) => `<span class="tag">${productName(pid)}</span>`).join('');
      const card = document.createElement('div');
      card.className = 'client-card';
      card.innerHTML = `
        <div class="client-header">
          <img src="${c.imagen || getClientLogo(c.nombre)}" alt="${c.nombre}" class="client-logo" onerror="this.src='${fallbackImg}'" />
          <div><div class="client-nombre">${c.nombre}</div><span class="status ${estadoClass}">${estadoLabel}</span></div>
        </div>
        <div class="client-stats">
          <div><span class="stat-label">Última compra</span><span class="stat-val">${lastTs ? fmtDate({ seconds: lastTs/1000 }) : '—'}</span></div>
          <div><span class="stat-label">Total compras</span><span class="stat-val">${totalCompras}</span></div>
          <div><span class="stat-label">Monto total</span><span class="stat-val">S/${totalMonto.toFixed(2)}</span></div>
        </div>
        ${topProdHtml ? `<div class="client-tags"><span class="muted" style="font-size:.8rem">Productos frecuentes:</span><br>${topProdHtml}</div>` : ''}
      `;
      card.addEventListener('dblclick', () => openClientDetail(c));
      card.style.cursor = 'pointer';
      grid.appendChild(card);
    });
  }

  // ─── PRODUCTOS (lista con tarjetas) ────────────────────────
  async function loadProducts() {
    if (!productsCache.length) await refreshCache();
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    const ventasByProd = {};
    ventasCache.forEach(v => { ventasByProd[v.productoId] = (ventasByProd[v.productoId]||0)+(v.cantidad||0); });
    productsCache.forEach(p => {
      const imgSrc = (p.imagen && !p.imagen.includes('via.placeholder')) ? p.imagen : fallbackImg;
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="product-image"><img src="${imgSrc}" onerror="this.src='${fallbackImg}'"></div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-presentation">${p.presentacion || ''}</div>
        <div class="product-prices">
          <div class="price-item"><div class="price-label">VVF</div><div class="price-value">S/${(p.vvf||0).toFixed(2)}</div></div>
          <div class="price-item"><div class="price-label">PVF</div><div class="price-value">S/${(p.pvf||0).toFixed(2)}</div></div>
          <div class="price-item"><div class="price-label">Vendidos</div><div class="price-value">${ventasByProd[p.id]||0}</div></div>
        </div>
      `;
      card.addEventListener('dblclick', () => openProductDetail(p));
      grid.appendChild(card);
    });
  }

  // ─── DETALLES PRODUCTO ──────────────────────────────────
  function openProductDetail(product) {
    const modal = document.getElementById('productDetailModal');
    document.getElementById('productDetailName').value = product.nombre || '';
    document.getElementById('productDetailPresentation').value = product.presentacion || '';
    document.getElementById('productDetailDescription').value = product.descripcion || '';
    document.getElementById('productDetailImageUrl').value = product.imagen || '';
    document.getElementById('productDetailVVF').value = `S/${(product.vvf||0).toFixed(2)}`;
    document.getElementById('productDetailPVF').value = `S/${(product.pvf||0).toFixed(2)}`;
    document.getElementById('detailMessage').textContent = '';
    const imgSrc = (product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg;
    document.getElementById('productDetailImg').src = imgSrc;
    document.getElementById('detailImagePreview').classList.add('hidden');
    modal.dataset.productId = product.id;
    modal.classList.remove('hidden');
  }

  function closeProductDetail() { document.getElementById('productDetailModal').classList.add('hidden'); }
  document.getElementById('closeDetailModal')?.addEventListener('click', closeProductDetail);
  document.getElementById('cancelDetailBtn')?.addEventListener('click', closeProductDetail);
  document.getElementById('productDetailImageUrl')?.addEventListener('change', () => {
    const url = document.getElementById('productDetailImageUrl').value.trim();
    const preview = document.getElementById('detailImagePreview');
    const previewImg = document.getElementById('detailPreviewImg');
    if (!url) { preview.classList.add('hidden'); return; }
    try { new URL(url); } catch { preview.classList.add('hidden'); return; }
    previewImg.src = url;
    previewImg.onload = () => preview.classList.remove('hidden');
    previewImg.onerror = () => preview.classList.add('hidden');
  });
  document.getElementById('saveDetailBtn')?.addEventListener('click', async () => {
    const modal = document.getElementById('productDetailModal');
    const productId = modal.dataset.productId;
    if (!productId) return;
    const nombre = document.getElementById('productDetailName').value.trim();
    const presentacion = document.getElementById('productDetailPresentation').value.trim();
    const descripcion = document.getElementById('productDetailDescription').value.trim();
    const imagen = document.getElementById('productDetailImageUrl').value.trim();
    const message = document.getElementById('detailMessage');
    if (!nombre) { message.textContent = 'El nombre es requerido'; message.style.color = 'var(--danger)'; return; }
    message.textContent = 'Guardando...'; message.style.color = 'var(--muted)';
    document.getElementById('saveDetailBtn').disabled = true;
    try {
      const updateData = { nombre, presentacion: presentacion || '', descripcion: descripcion || '' };
      if (imagen) updateData.imagen = imagen;
      await db.collection('productos').doc(productId).update(updateData);
      const prod = productsCache.find(p => p.id === productId);
      if (prod) { prod.nombre = nombre; prod.presentacion = presentacion || ''; prod.descripcion = descripcion || ''; if (imagen) prod.imagen = imagen; }
      message.textContent = '✓ Guardado'; message.style.color = 'var(--success)';
      setTimeout(() => { closeProductDetail(); loadProducts(); }, 1500);
    } catch (err) { message.textContent = 'Error: ' + err.message; message.style.color = 'var(--danger)'; }
    document.getElementById('saveDetailBtn').disabled = false;
  });
  document.querySelector('#productDetailModal .modal-overlay')?.addEventListener('click', closeProductDetail);

  // ─── DETALLES CLIENTE ───────────────────────────────────
  function openClientDetail(client) {
    const modal = document.getElementById('clientDetailModal');
    document.getElementById('clientDetailName').value = client.nombre || '';
    document.getElementById('clientDetailContact').value = client.contacto || '';
    document.getElementById('clientDetailEmail').value = client.email || '';
    document.getElementById('clientDetailAddress').value = client.direccion || '';
    document.getElementById('clientDetailImageUrl').value = client.imagen || '';
    document.getElementById('clientDetailMessage').textContent = '';
    const imgSrc = (client.imagen && !client.imagen.includes('via.placeholder')) ? client.imagen : getClientLogo(client.nombre);
    document.getElementById('clientDetailImg').src = imgSrc;
    document.getElementById('clientDetailImagePreview').classList.add('hidden');
    modal.dataset.clientId = client.id;
    modal.classList.remove('hidden');
  }

  function closeClientDetail() { document.getElementById('clientDetailModal').classList.add('hidden'); }
  document.getElementById('closeClientDetailModal')?.addEventListener('click', closeClientDetail);
  document.getElementById('cancelClientDetailBtn')?.addEventListener('click', closeClientDetail);
  document.getElementById('clientDetailImageUrl')?.addEventListener('change', () => {
    const url = document.getElementById('clientDetailImageUrl').value.trim();
    const preview = document.getElementById('clientDetailImagePreview');
    const previewImg = document.getElementById('clientDetailPreviewImg');
    if (!url) { preview.classList.add('hidden'); return; }
    try { new URL(url); } catch { preview.classList.add('hidden'); return; }
    previewImg.src = url;
    previewImg.onload = () => preview.classList.remove('hidden');
    previewImg.onerror = () => preview.classList.add('hidden');
  });
  document.getElementById('saveClientDetailBtn')?.addEventListener('click', async () => {
    const modal = document.getElementById('clientDetailModal');
    const clientId = modal.dataset.clientId;
    if (!clientId) return;
    const nombre = document.getElementById('clientDetailName').value.trim();
    const contacto = document.getElementById('clientDetailContact').value.trim();
    const email = document.getElementById('clientDetailEmail').value.trim();
    const direccion = document.getElementById('clientDetailAddress').value.trim();
    const imagen = document.getElementById('clientDetailImageUrl').value.trim();
    const message = document.getElementById('clientDetailMessage');
    if (!nombre) { message.textContent = 'El nombre es requerido'; message.style.color = 'var(--danger)'; return; }
    message.textContent = 'Guardando...'; message.style.color = 'var(--muted)';
    document.getElementById('saveClientDetailBtn').disabled = true;
    try {
      const updateData = { nombre, contacto: contacto || '', email: email || '', direccion: direccion || '' };
      if (imagen) updateData.imagen = imagen;
      await db.collection('clientes').doc(clientId).update(updateData);
      const cliente = clientsCache.find(c => c.id === clientId);
      if (cliente) { cliente.nombre = nombre; cliente.contacto = contacto || ''; cliente.email = email || ''; cliente.direccion = direccion || ''; if (imagen) cliente.imagen = imagen; }
      message.textContent = '✓ Guardado'; message.style.color = 'var(--success)';
      setTimeout(() => { closeClientDetail(); loadClients(); }, 1500);
    } catch (err) { message.textContent = 'Error: ' + err.message; message.style.color = 'var(--danger)'; }
    document.getElementById('saveClientDetailBtn').disabled = false;
  });
  document.querySelector('#clientDetailModal .modal-overlay')?.addEventListener('click', closeClientDetail);

  // ─── IMPORTAR EXCEL ───────────────────────────────────────
  function initImportView() {
    const btn = document.getElementById('importExcelBtn');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', importExcelFile);
    }
  }

  function normalizeText(v) { return String(v || '').trim().replace(/\s+/g, ' '); }
  function slugify(value, fallback) {
    const base = normalizeText(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return base || fallback;
  }
  function toNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = parseFloat(String(value).replace(/\s+/g,'').replace(/%/g,'').replace(/,/g,'.'));
    return Number.isFinite(n) ? n : null;
  }
  function setImportProgress(percent, stage, detail) {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    document.getElementById('importProgressFill').style.width = clamped + '%';
    document.getElementById('importPercent').textContent = clamped + '%';
    document.getElementById('importStage').textContent = stage;
    document.getElementById('importDetail').textContent = detail || '';
    document.getElementById('importMessage').textContent = detail || stage;
  }
  async function writeInBatches(collectionName, docs, batchSize, label, onProgress) {
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = db.batch();
      const slice = docs.slice(i, i + batchSize);
      slice.forEach(doc => batch.set(db.collection(collectionName).doc(doc.id), doc.data));
      await batch.commit();
      if (onProgress) onProgress(Math.min(i + slice.length, docs.length), docs.length, label);
    }
  }
  async function clearCollection(name) {
    const snap = await db.collection(name).get();
    for (const doc of snap.docs) if (doc.ref?.delete) await doc.ref.delete();
  }
  async function importExcelFile() {
    const importMessage = document.getElementById('importMessage');
    const fileInput = document.getElementById('excelFile');
    if (!fileInput?.files?.[0]) { importMessage.textContent = 'Selecciona un archivo Excel primero.'; return; }
    try {
      setImportProgress(5, 'Leyendo archivo', 'Abriendo el libro de Excel…');
      const buffer = await fileInput.files[0].arrayBuffer();
      setImportProgress(10, 'Interpretando hojas', 'Localizando encabezados…');
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      const headerIndex = rows.findIndex(row => row.some(cell => normalizeText(cell).toUpperCase() === 'PRODUCTO'));
      if (headerIndex === -1) { importMessage.textContent = 'No se encontró la fila de encabezados.'; return; }
      const header = rows[headerIndex].map(cell => normalizeText(cell));
      const productCol = header.findIndex(h => h.toUpperCase() === 'PRODUCTO');
      const presentCol = header.findIndex(h => h.toUpperCase() === 'PRESENTACION');
      const vvfCol = header.findIndex(h => h.toUpperCase() === 'VVF');
      const dctoCol = header.findIndex(h => h.toUpperCase().includes('DCTO'));
      const pvfCol = header.findIndex(h => h.toUpperCase() === 'PVF');
      const unidCol = header.findIndex(h => h.toUpperCase().includes('UNID'));
      const firstClientCol = unidCol >= 0 ? unidCol + 1 : 6;
      if (productCol === -1) { importMessage.textContent = 'No se detectó columna PRODUCTO.'; return; }
      const clientNames = header.slice(firstClientCol).filter(n => normalizeText(n));
      if (!clientNames.length) { importMessage.textContent = 'No se detectaron clientes en el encabezado.'; return; }
      const clientDocs = clientNames.map((name, i) => ({ id: slugify(name, `client-${i+1}`), nombre: name }));
      setImportProgress(15, 'Preparando base de datos', `${clientDocs.length} clientes detectados. Limpiando colecciones…`);
      await clearCollection('clientes');
      await clearCollection('productos');
      await clearCollection('precios');
      setImportProgress(20, 'Importando clientes', '…');
      await writeInBatches('clientes', clientDocs.map(c => ({ id: c.id, data: c })), 200, 'Clientes', (done, total) => setImportProgress(20 + done/total*20, 'Importando clientes', `${done}/${total} clientes guardados`));
      const productDocs = [], priceDocs = [];
      let pc = 0;
      for (let r = headerIndex + 1; r < rows.length; r++) {
        const row = rows[r];
        const pName = normalizeText(row[productCol]);
        if (!pName) continue;
        const pid = slugify(pName, `product-${pc+1}`);
        productDocs.push({ id: pid, data: { id: pid, nombre: pName, presentacion: normalizeText(row[presentCol]), vvf: toNumber(row[vvfCol]), dctoBase: toNumber(row[dctoCol]), pvf: toNumber(row[pvfCol]), unidVend: normalizeText(row[unidCol]), imagen: fallbackImg }});
        pc++;
        for (let ci = 0; ci < clientDocs.length; ci++) {
          const pv = toNumber(row[firstClientCol + ci]);
          if (pv === null) continue;
          priceDocs.push({ id: `${clientDocs[ci].id}_${pid}`, data: { clienteId: clientDocs[ci].id, productoId: pid, precio: pv }});
        }
        if (pc % 10 === 0) setImportProgress(40 + Math.min(20, pc/Math.max(1,rows.length-headerIndex-1)*20), 'Extrayendo productos', `${pc} productos leídos…`);
      }
      setImportProgress(60, 'Guardando productos', `${productDocs.length} productos…`);
      await writeInBatches('productos', productDocs, 100, 'Productos', (done, total) => setImportProgress(60 + done/total*20, 'Guardando productos', `${done}/${total} guardados`));
      setImportProgress(82, 'Guardando precios', `${priceDocs.length} precios…`);
      await writeInBatches('precios', priceDocs, 250, 'Precios', (done, total) => setImportProgress(82 + done/total*18, 'Guardando precios', `${done}/${total} guardados`));
      await refreshCache();
      priceCache = {};
      setImportProgress(100, '✓ Importación completa', `${clientDocs.length} clientes, ${productDocs.length} productos, ${priceDocs.length} precios importados.`);
      loadDashboard();
    } catch (err) { setImportProgress(0, 'Error al importar', err.message); }
  }

  // ─── AGREGAR IMAGEN POR URL ──────────────────────────────
  const modal = document.getElementById('uploadModal');
  const uploadBtn = document.getElementById('uploadImagesBtn');
  const closeModalBtn = document.getElementById('closeUploadModal');
  const cancelBtn = document.getElementById('cancelUploadBtn');
  const confirmBtn = document.getElementById('confirmUploadBtn');
  const productSelect = document.getElementById('uploadProductSelect');
  const imageUrlInput = document.getElementById('imageUrlInput');
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const uploadMessage = document.getElementById('uploadMessage');

  function openUploadModal() {
    if (!productsCache.length) { alert('Carga los productos primero importando Excel'); return; }
    productSelect.innerHTML = productsCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    imageUrlInput.value = '';
    preview.classList.add('hidden');
    uploadMessage.textContent = '';
    modal.classList.remove('hidden');
  }
  function closeUploadModal() { modal.classList.add('hidden'); }
  imageUrlInput.addEventListener('change', () => {
    const url = imageUrlInput.value.trim();
    if (!url) { preview.classList.add('hidden'); return; }
    try { new URL(url); } catch { uploadMessage.textContent = 'URL no válida'; uploadMessage.style.color = 'var(--danger)'; preview.classList.add('hidden'); return; }
    previewImg.src = url;
    previewImg.onload = () => { preview.classList.remove('hidden'); uploadMessage.textContent = ''; };
    previewImg.onerror = () => { uploadMessage.textContent = 'No se pudo cargar la imagen'; uploadMessage.style.color = 'var(--danger)'; preview.classList.add('hidden'); };
  });
  confirmBtn.addEventListener('click', async () => {
    const url = imageUrlInput.value.trim();
    if (!url) { uploadMessage.textContent = 'Ingresa una URL de imagen'; uploadMessage.style.color = 'var(--danger)'; return; }
    const productId = productSelect.value;
    if (!productId) { uploadMessage.textContent = 'Selecciona un producto'; uploadMessage.style.color = 'var(--danger)'; return; }
    uploadMessage.textContent = 'Guardando...'; uploadMessage.style.color = 'var(--muted)';
    confirmBtn.disabled = true;
    try {
      await db.collection('productos').doc(productId).update({ imagen: url });
      const prod = productsCache.find(p => p.id === productId);
      if (prod) prod.imagen = url;
      uploadMessage.textContent = '✓ Imagen guardada'; uploadMessage.style.color = 'var(--success)';
      setTimeout(() => { closeUploadModal(); loadProducts(); }, 1500);
    } catch (err) { uploadMessage.textContent = 'Error: ' + err.message; uploadMessage.style.color = 'var(--danger)'; }
    confirmBtn.disabled = false;
  });
  uploadBtn.addEventListener('click', openUploadModal);
  closeModalBtn.addEventListener('click', closeUploadModal);
  cancelBtn.addEventListener('click', closeUploadModal);
  document.querySelector('.modal-overlay')?.addEventListener('click', closeUploadModal);
});