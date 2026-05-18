// ============================================================
// app.js — Panel Paola · Farmacéuticos Markos
// VERSIÓN COMPLETA + EXPORTACIÓN + FILTRO EN REGISTRO + AGRUPACIÓN POR CLIENTE
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
  let quotaMeta = 0;
  let quotaChartInstance = null;

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

  // ─── NOTIFICACIONES TOAST ──────────────────────────────
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close">×</button>
    `;
    container.appendChild(toast);
    toast.style.animation = 'slideInRight 0.3s ease forwards';
    const timeout = setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timeout);
      toast.style.animation = 'fadeOut 0.2s ease forwards';
      setTimeout(() => toast.remove(), 200);
    });
  }

  // ─── NAVEGACIÓN ──────────────────────────────────────────
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('pageTitle');
  const exportFilteredBtn = document.getElementById('exportFilteredBtn');

  function updateExportFilteredButton() {
    const activeView = document.querySelector('.view:not(.hidden)')?.id;
    if (activeView === 'history') {
      exportFilteredBtn.style.display = 'inline-flex';
    } else {
      exportFilteredBtn.style.display = 'none';
    }
  }

  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const v = b.dataset.view;
    views.forEach(w => w.classList.add('hidden'));
    document.getElementById(v).classList.remove('hidden');
    pageTitle.textContent = b.textContent.trim();
    if (v === 'dashboard') loadDashboard();
    if (v === 'register')  { loadFormData(); }
    if (v === 'import')    initImportView();
    if (v === 'history')   loadHistory();
    if (v === 'products')  loadProducts();
    if (v === 'clients')   loadClients();
    updateExportFilteredButton();
  }));
  updateExportFilteredButton();

  // ─── NAVEGACIÓN A HISTORIAL DESDE VENTAS RECIENTES ──────
  function navigateToHistory() {
    // Encontrar el botón de historial
    const historyBtn = Array.from(navBtns).find(b => b.dataset.view === 'history');
    if (historyBtn) historyBtn.click();
  }

  // ─── CACHÉ GLOBAL ────────────────────────────────────────
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

  // ─── ESPERAR A CHART.JS ──────────────────────────────────
  function waitForChart(maxWait = 5000) {
    return new Promise((resolve) => {
      if (typeof Chart !== 'undefined') {
        resolve();
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (typeof Chart !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
        if (Date.now() - startTime > maxWait) {
          clearInterval(checkInterval);
          console.warn('⚠️ Chart.js timeout - renderizando sin Chart');
          resolve();
        }
      }, 100);
    });
  }

  // ─── CARGA PROGRESIVA OPTIMIZADA ──────────────────────────
  async function loadDataProgressive() {
    console.log('⚡ Iniciando carga progresiva...');
    
    // Mostrar skeleton screens inmediatamente
    showSkeletons();

    const optimizer = window.PerformanceOptimizer;
    const progressiveLoader = await optimizer.loadDataProgressive(db);

    try {
      // 1️⃣ Cargar datos CRÍTICOS primero (ventas, clientes)
      const { ventas, clientes } = await progressiveLoader.loadCriticalData();
      
      // Si progressiveLoader retorna datos vacíos, usar refreshCache() como fallback
      if (!ventas || ventas.length === 0) {
        console.log('⚠️ progressiveLoader retornó datos vacíos, usando refreshCache()');
        await refreshCache();
      } else {
        ventasCache = ventas;
        clientsCache = clientes;
      }

      console.log('✅ Datos críticos cargados:', { ventas: ventasCache.length, clientes: clientsCache.length });

      // Mostrar dashboard con datos críticos
      await loadQuotaMeta();
      loadProfile();
      
      // Esperar a que Chart.js esté disponible antes de renderizar gráficos
      await waitForChart();
      loadDashboard();

      // Ocultar skeleton screens
      hideSkeletons();

      // 2️⃣ Cargar datos secundarios en BACKGROUND (no bloquea UI)
      setTimeout(async () => {
        console.log('🔄 Cargando datos secundarios en background...');
        const productos = await progressiveLoader.loadSecondaryData();
        if (productos && productos.length > 0) {
          productsCache = productos;
          console.log('✅ Productos cargados en background:', productsCache.length);
        }
      }, 100);

    } catch (err) {
      console.error('Error en carga progresiva:', err);
      hideSkeletons();
      // Intentar cargar del caché como fallback
      await refreshCache();
      await loadQuotaMeta();
      loadProfile();
      loadDashboard();
    }
  }

  // ─── SKELETON SCREENS ────────────────────────────────────
  function showSkeletons() {
    const optimizer = window.PerformanceOptimizer;

    // 1. Skeletons para KPIs (sin perder los elementos con ID)
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
      // Guardar referencia al contenido original si no se ha guardado antes
      if (!card._originalContent) {
        card._originalContent = card.innerHTML;
      }
      // Mostrar skeleton overlay dentro de la tarjeta, pero sin borrar los elementos con ID
      let skeletonOverlay = card.querySelector('.skeleton-overlay');
      if (!skeletonOverlay) {
        skeletonOverlay = document.createElement('div');
        skeletonOverlay.className = 'skeleton-overlay';
        skeletonOverlay.style.position = 'absolute';
        skeletonOverlay.style.top = '0';
        skeletonOverlay.style.left = '0';
        skeletonOverlay.style.width = '100%';
        skeletonOverlay.style.height = '100%';
        skeletonOverlay.style.background = 'rgba(255,255,255,0.8)';
        skeletonOverlay.style.borderRadius = 'var(--radius)';
        skeletonOverlay.style.display = 'flex';
        skeletonOverlay.style.flexDirection = 'column';
        skeletonOverlay.style.gap = '12px';
        skeletonOverlay.style.padding = '20px';
        skeletonOverlay.style.zIndex = '5';
        skeletonOverlay.innerHTML = `
          <div style="background: linear-gradient(90deg, #e2e8f0 25%, #f0f4f8 50%, #e2e8f0 75%); 
                      background-size: 200% 100%; animation: loading 1.5s infinite;
                      height: 12px; border-radius: 4px;"></div>
          <div style="background: linear-gradient(90deg, #dbeafe 25%, #e8f1ff 50%, #dbeafe 75%); 
                      background-size: 200% 100%; animation: loading 1.5s infinite;
                      height: 32px; border-radius: 6px;"></div>
        `;
        card.style.position = 'relative';
        card.appendChild(skeletonOverlay);
      } else {
        skeletonOverlay.style.display = 'flex';
      }
    });

    // 2. Skeleton para el gráfico (ocultar canvas y mostrar un div encima)
    const chartCanvas = document.getElementById('salesChart');
    if (chartCanvas && !chartCanvas._skeletonActive) {
      const parent = chartCanvas.parentElement;
      const skeletonDiv = document.createElement('div');
      skeletonDiv.className = 'skeleton-chart';
      skeletonDiv.style.width = '100%';
      skeletonDiv.style.height = '250px';
      skeletonDiv.style.background = 'linear-gradient(90deg, #f0f4f8 25%, #f8fafc 50%, #f0f4f8 75%)';
      skeletonDiv.style.backgroundSize = '200% 100%';
      skeletonDiv.style.animation = 'loading 1.5s infinite';
      skeletonDiv.style.borderRadius = '12px';
      chartCanvas.style.display = 'none';
      parent.insertBefore(skeletonDiv, chartCanvas);
      chartCanvas._skeletonDiv = skeletonDiv;
      chartCanvas._skeletonActive = true;
    }

    // 3. Skeleton para recompras
    const recomprasGrid = document.getElementById('recomprasGrid');
    if (recomprasGrid) {
      if (!recomprasGrid._originalHTML) {
        recomprasGrid._originalHTML = recomprasGrid.innerHTML;
      }
      recomprasGrid.innerHTML = optimizer.createSkeletonCards(4);
    }
  }

  function hideSkeletons() {
    // 1. Restaurar KPIs: eliminar los overlays skeleton
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
      const skeletonOverlay = card.querySelector('.skeleton-overlay');
      if (skeletonOverlay) {
        skeletonOverlay.style.display = 'none';
      }
      // Opcional: restaurar contenido original si se perdió (no debería)
      if (card._originalContent && !card.querySelector('.kpi-value')) {
        card.innerHTML = card._originalContent;
      }
    });

    // 2. Restaurar gráfico
    const chartCanvas = document.getElementById('salesChart');
    if (chartCanvas && chartCanvas._skeletonActive) {
      const skeletonDiv = chartCanvas._skeletonDiv;
      if (skeletonDiv && skeletonDiv.parentElement) {
        skeletonDiv.parentElement.removeChild(skeletonDiv);
      }
      chartCanvas.style.display = 'block';
      chartCanvas._skeletonActive = false;
      delete chartCanvas._skeletonDiv;
    }

    // 3. Restaurar recompras
    const recomprasGrid = document.getElementById('recomprasGrid');
    if (recomprasGrid && recomprasGrid._originalHTML) {
      recomprasGrid.innerHTML = recomprasGrid._originalHTML;
    }

    console.log('🎯 Skeleton screens removidos, datos reales visibles');
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
    // Usar carga progresiva en lugar de refreshCache
    await loadDataProgressive();
  })();

  // ─── PERFIL ───────────────────────────────────────────────
  document.getElementById('profileUpload').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Por favor, selecciona una imagen válida', 'warning'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('La imagen debe ser menor a 2MB', 'warning'); return; }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        await db.collection('settings').doc('profile').set({ photo: base64Data, updated: Date.now() }, { merge: true });
        loadProfile();
        showToast('✓ Foto guardada correctamente', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error al guardar foto:', err);
      showToast('Error al guardar la foto: ' + err.message, 'error');
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

  // ─── DASHBOARD ─────────────────────────────────
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
    
    // Agregar validaciones para elementos que pueden no existir
    const totalMonthEl = document.getElementById('totalMonth');
    if (totalMonthEl) totalMonthEl.innerHTML = `S/${totalMes.toFixed(2)}<br>${varHtml}`;
    
    const activeClientsEl = document.getElementById('activeClients');
    if (activeClientsEl) activeClientsEl.textContent = activos;
    
    const alertsCountEl = document.getElementById('alertsCount');
    if (alertsCountEl) alertsCountEl.textContent = advertencias.length + urgentes.length;
    
    const wList = document.getElementById('warningList'), dList = document.getElementById('dangerList');
    if (wList) wList.innerHTML = advertencias.length ? advertencias.map(a => `<li class="alert-item">⚠️ ${a.texto}</li>`).join('') : '<li class="alert-item muted">Sin advertencias</li>';
    if (dList) dList.innerHTML = urgentes.length ? urgentes.map(a => `<li class="alert-item">${a.tipo === 'vencido' ? '💀' : '🔴'} ${a.texto}</li>`).join('') : '<li class="alert-item muted">Sin alertas urgentes</li>';

    renderProximasRecompras();
    renderFeaturedProducts();
    renderRecentSales();
    
    // Renderizar gráficos con un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      renderSalesChart();
      renderTopClientsChart();
      renderQuotaChart();
    }, 50);
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
    container.innerHTML = top.map(p => `<div class="featured-item" data-product-id="${p.id}"><img src="${p.imagen}" onerror="this.src='${fallbackImg}'"><div class="meta"><div class="product-title-featured" style="font-weight:600;cursor:pointer">${p.nombre}</div><div class="muted" style="font-size:12px">${p.presentacion}</div><div style="color:var(--accent);font-size:12px">Vendido: ${p.qty} unid.</div></div></div>`).join('');
    // Agregar listeners de click y hover
    document.querySelectorAll('.product-title-featured').forEach(title => {
      title.addEventListener('click', () => {
        const productId = title.closest('.featured-item').dataset.productId;
        const product = productsCache.find(p => p.id === productId);
        if (product) viewFeaturedProductPreview(product);
      });
    });
  }

  async function renderRecentSales() {
    const container = document.getElementById('recentSales');
    if (!container) return;
    const recent = ventasCache.filter(v=>v.fechaVenta).sort((a,b)=>toDateObj(b.fechaVenta)?.getTime() - toDateObj(a.fechaVenta)?.getTime()).slice(0,3);
    if (!recent.length) { container.innerHTML = '<li class="recent-sale" style="padding:12px;text-align:center"><span class="muted">Sin ventas registradas.</span></li>'; return; }
    const priceMap = await getMultiplePrices(recent);
    container.innerHTML = recent.map(v => {
      const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      return `<li class="recent-sale" style="cursor:pointer;" title="Doble click para ver todas"><div><div style="font-weight:600">${productName(v.productoId)}</div><div class="muted" style="font-size:11px">${clientName(v.clienteId)} • ${fmtDate(v.fechaVenta)}</div></div><div style="color:var(--accent);font-weight:600">S/${(precio * (v.cantidad||0)).toFixed(2)}</div></li>`;
    }).join('');
    // Agregar doble click a cada venta para navegar a Historial
    container.querySelectorAll('.recent-sale').forEach(row => {
      row.addEventListener('dblclick', navigateToHistory);
    });
  }

  let salesChartInstance = null;
  let expandedSalesChartInstance = null;
  let chartRenderInProgress = false;
  
  function renderSalesChart() {
    if (chartRenderInProgress) return;
    chartRenderInProgress = true;

    console.log('📈 renderSalesChart() llamado');
    
    if (typeof Chart === 'undefined') {
      console.warn('⚠️ Chart.js no está disponible aún');
      chartRenderInProgress = false;
      return;
    }
    
    const ctx = document.getElementById('salesChart');
    if (!ctx) {
      console.warn('⚠️ Canvas #salesChart no encontrado');
      chartRenderInProgress = false;
      return;
    }

    // 🔧 Asegurar que el canvas tenga dimensiones estables
    ctx.style.display = 'block';
    ctx.style.height = '250px';
    ctx.style.width = '100%';
    
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

    // Generar etiquetas para los últimos 6 meses
    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
      labels.push(label);
      data.push(salesByMonth[monthKey] || 0);
    }

    if (salesChartInstance) {
      // Si ya existe, actualizar datos en lugar de destruir
      salesChartInstance.data.labels = labels;
      salesChartInstance.data.datasets[0].data = data;
      salesChartInstance.update();
    } else {
      // Crear nuevo gráfico
      salesChartInstance = new Chart(context, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Ventas (S/)', data, backgroundColor: 'rgba(37, 99, 235, 0.6)', borderColor: 'rgba(37, 99, 235, 1)', borderWidth: 1, borderRadius: 8 }] },
        options: { 
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } } }, 
          scales: { y: { beginAtZero: true, title: { display: true, text: 'Monto (S/)' } }, x: { title: { display: true, text: 'Mes' } } } 
        }
      });
    }

    if (ctx) {
      ctx.style.cursor = 'pointer';
      ctx.removeEventListener('click', openSalesChartModal);
      ctx.addEventListener('click', openSalesChartModal);
    }
    
    console.log('✅ Gráfico de ventas renderizado/actualizado');
    chartRenderInProgress = false;
  }

  function openSalesChartModal() {
    const modal = document.getElementById('salesChartModal');
    const canvas = document.getElementById('salesChartExpanded');
    if (!canvas || !modal) return;

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

    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
      labels.push(label);
      data.push(salesByMonth[monthKey] || 0);
    }

    const ctx = canvas.getContext('2d');
    if (expandedSalesChartInstance) expandedSalesChartInstance.destroy();

    expandedSalesChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Ventas (S/)', data, backgroundColor: 'rgba(37, 99, 235, 0.6)', borderColor: 'rgba(37, 99, 235, 1)', borderWidth: 1, borderRadius: 8 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Monto (S/)' } }, x: { title: { display: true, text: 'Mes' } } }
      }
    });

    modal.classList.remove('hidden');
  }

  function closeSalesChartModal() {
    const modal = document.getElementById('salesChartModal');
    if (modal) modal.classList.add('hidden');
    if (expandedSalesChartInstance) {
      expandedSalesChartInstance.destroy();
      expandedSalesChartInstance = null;
    }
  }

  let topClientsChartInstance = null;
  let expandedTopClientsChartInstance = null;
  
  function renderTopClientsChart() {
    if (typeof Chart === 'undefined') {
      console.warn('⚠️ Chart.js no está disponible aún');
      return;
    }
    const canvas = document.getElementById('topClientsChart');
    if (!canvas) return;
    
    // 🔧 Asegurar que el canvas tenga dimensiones antes de renderizar
    canvas.style.display = 'block';
    canvas.style.height = '250px';
    canvas.style.width = '100%';
    
    const ctx = canvas.getContext('2d');
    const clientTotals = {};
    ventasCache.forEach(v => {
      const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const monto = precio * (v.cantidad || 0);
      const nombre = clientName(v.clienteId);
      clientTotals[nombre] = (clientTotals[nombre] || 0) + monto;
    });
    const sorted = Object.entries(clientTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);
    
    if (topClientsChartInstance) {
      // Actualizar datos en lugar de destruir
      topClientsChartInstance.data.labels = labels;
      topClientsChartInstance.data.datasets[0].data = data;
      topClientsChartInstance.update();
    } else {
      // Crear nuevo gráfico
      topClientsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Ventas totales (S/)', data, backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1, borderRadius: 6 }] },
        options: { 
          indexAxis: 'y', 
          responsive: true, 
          maintainAspectRatio: true, 
          plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } } }, 
          scales: { x: { title: { display: true, text: 'Monto (S/)' }, beginAtZero: true }, y: { title: { display: true, text: 'Cliente' } } } 
        }
      });
    }
  }

  // ─── ABRIR GRÁFICO EXPANDIDO ────────────────────────────────────────
  function openTopClientsChart() {
    const modal = document.getElementById('topClientsModal');
    const canvas = document.getElementById('topClientsExpandedChart');
    if (!canvas) return;
    
    // Renderizar gráfico en el canvas expandido
    const ctx = canvas.getContext('2d');
    const clientTotals = {};
    ventasCache.forEach(v => {
      const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const monto = precio * (v.cantidad || 0);
      const nombre = clientName(v.clienteId);
      clientTotals[nombre] = (clientTotals[nombre] || 0) + monto;
    });
    const sorted = Object.entries(clientTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);
    
    if (expandedTopClientsChartInstance) expandedTopClientsChartInstance.destroy();
    expandedTopClientsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Ventas totales (S/)', data, backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1, borderRadius: 6 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `S/ ${ctx.raw.toFixed(2)}` } } }, scales: { x: { title: { display: true, text: 'Monto (S/)' }, beginAtZero: true }, y: { title: { display: true, text: 'Cliente' } } } }
    });
    modal.classList.remove('hidden');
  }
  
  function closeTopClientsChart() { document.getElementById('topClientsModal').classList.add('hidden'); }
  document.getElementById('topClientsSection')?.addEventListener('click', openTopClientsChart);
  document.getElementById('closeTopClientsModal')?.addEventListener('click', closeTopClientsChart);
  document.getElementById('closeTopClientsBtn')?.addEventListener('click', closeTopClientsChart);

  // ─── CUOTA DEL MES ────────────────────────────────────────
  async function loadQuotaMeta() {
    try {
      const doc = await db.collection('settings').doc('quotaMeta').get();
      quotaMeta = doc.exists ? (doc.data().meta || 0) : 0;
    } catch (err) {
      console.error('Error cargando cuota:', err);
      quotaMeta = 0;
    }
  }

  async function saveQuotaMeta(newQuota) {
    try {
      await db.collection('settings').doc('quotaMeta').set({ meta: newQuota, updated: Date.now() }, { merge: true });
      quotaMeta = newQuota;
      renderQuotaChart();
      cancelQuotaEdit();
      showToast('✓ Cuota actualizada correctamente', 'success');
    } catch (err) {
      console.error('Error guardando cuota:', err);
      showToast('Error al guardar la cuota: ' + err.message, 'error');
    }
  }

  function editQuotaMeta() {
    document.getElementById('quotaEditForm').style.display = 'block';
    document.getElementById('quotaInput').value = quotaMeta || '';
    document.getElementById('quotaInput').focus();
  }

  function cancelQuotaEdit() {
    document.getElementById('quotaEditForm').style.display = 'none';
    document.getElementById('quotaInput').value = '';
  }

  let expandedQuotaChartInstance = null;

  function formatProgressPercent(progress) {
    const rounded = Math.round(progress * 100) / 100;
    let text = rounded.toFixed(2);
    text = text.replace(/\.?0+$/, '');
    if (!text.includes('.')) text += '.0';
    return text;
  }

  function renderQuotaChart() {
    if (typeof Chart === 'undefined') {
      console.warn('⚠️ Chart.js no está disponible aún');
      return;
    }
    const canvas = document.getElementById('quotaChart');
    if (!canvas) return;

    // Calcular ventas del mes actual
    const now = new Date();
    const mesKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    let totalMes = 0;

    ventasCache.forEach(v => {
      if (v.mesCompra === mesKey) {
        const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
        const monto = precio * (v.cantidad || 0);
        totalMes += monto;
      }
    });

    const progress = quotaMeta > 0 ? (totalMes / quotaMeta) * 100 : 0;
    const progressText = formatProgressPercent(progress);

    document.getElementById('quotaMetaValue').textContent = `S/${quotaMeta.toFixed(2)}`;
    document.getElementById('quotaSalesValue').textContent = `S/${totalMes.toFixed(2)}`;
    document.getElementById('quotaProgressValue').textContent = `${progressText}%`;

    const ctx = canvas.getContext('2d');
    const progressColor = progress >= 100 ? 'rgba(34, 197, 94, 1)' : progress >= 75 ? 'rgba(37, 99, 235, 1)' : progress >= 50 ? 'rgba(217, 119, 6, 1)' : 'rgba(220, 38, 38, 1)';
    const remainingColor = 'rgba(200, 210, 222, 0.3)';

    if (quotaChartInstance) quotaChartInstance.destroy();

    quotaChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cumplido', 'Falta'],
        datasets: [{
          data: [Math.round(Math.min(progress, 100) * 100) / 100, Math.round(Math.max(0, 100 - progress) * 100) / 100],
          backgroundColor: [progressColor, remainingColor],
          borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16, usePointStyle: true } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatProgressPercent(ctx.parsed)}%` } }
        }
      }
    });
  }

  function openQuotaChart() {
    const modal = document.getElementById('quotaModal');
    const canvas = document.getElementById('quotaExpandedChart');
    if (!canvas) return;

    // Calcular ventas del mes actual
    const now = new Date();
    const mesKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    let totalMes = 0;

    ventasCache.forEach(v => {
      if (v.mesCompra === mesKey) {
        const precio = priceCache[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
        const monto = precio * (v.cantidad || 0);
        totalMes += monto;
      }
    });

    const progress = quotaMeta > 0 ? (totalMes / quotaMeta) * 100 : 0;
    const remaining = quotaMeta - totalMes;
    const remaining_safe = Math.max(remaining, 0);
    const progressText = formatProgressPercent(progress);

    document.getElementById('quotaModalMetaValue').textContent = quotaMeta.toFixed(2);
    document.getElementById('quotaModalSalesValue').textContent = totalMes.toFixed(2);
    document.getElementById('quotaModalProgressValue').textContent = `${progressText}%`;
    document.getElementById('quotaModalMissingValue').textContent = remaining_safe.toFixed(2);

    const ctx = canvas.getContext('2d');
    const progressColor = progress >= 100 ? 'rgba(34, 197, 94, 1)' : progress >= 75 ? 'rgba(37, 99, 235, 1)' : progress >= 50 ? 'rgba(217, 119, 6, 1)' : 'rgba(220, 38, 38, 1)';
    const remainingColor = 'rgba(200, 210, 222, 0.3)';

    if (expandedQuotaChartInstance) expandedQuotaChartInstance.destroy();

    expandedQuotaChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cumplido', 'Falta'],
        datasets: [{
          data: [Math.round(Math.min(progress, 100) * 100) / 100, Math.round(Math.max(0, 100 - progress) * 100) / 100],
          backgroundColor: [progressColor, remainingColor],
          borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 14 }, padding: 20, usePointStyle: true } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatProgressPercent(ctx.parsed)}%` } }
        }
      }
    });

    modal.classList.remove('hidden');
  }

  function closeQuotaChart() { document.getElementById('quotaModal').classList.add('hidden'); }

  document.getElementById('quotaChartSection')?.addEventListener('click', openQuotaChart);
  document.getElementById('closeQuotaModal')?.addEventListener('click', closeQuotaChart);
  document.getElementById('closeQuotaBtn')?.addEventListener('click', closeQuotaChart);

  // Event listeners para cuota
  document.getElementById('editQuotaBtn')?.addEventListener('click', editQuotaMeta);
  document.getElementById('saveQuotaBtn')?.addEventListener('click', () => {
    const newQuota = parseFloat(document.getElementById('quotaInput').value) || 0;
    if (newQuota < 0) { showToast('La cuota debe ser un número positivo', 'warning'); return; }
    saveQuotaMeta(newQuota);
  });
  document.getElementById('cancelQuotaBtn')?.addEventListener('click', cancelQuotaEdit);
  document.getElementById('quotaInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const newQuota = parseFloat(document.getElementById('quotaInput').value) || 0;
      if (newQuota < 0) { showToast('La cuota debe ser un número positivo', 'warning'); return; }
      saveQuotaMeta(newQuota);
    }
  });

  // ─── REGISTRO MÚLTIPLE DE VENTAS con filtro ────────────────────────
  async function loadFormData() {
    if (!clientsCache.length || !productsCache.length) await refreshCache();
    const clientSelect = document.getElementById('clientSelect');
    clientSelect.innerHTML = clientsCache.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const newSelect = clientSelect.cloneNode(true);
    clientSelect.parentNode.replaceChild(newSelect, clientSelect);
    newSelect.addEventListener('change', async (e) => {
      const clienteId = e.target.value;
      if (clienteId) {
        await loadProductTableForClient(clienteId);
        const searchInput = document.getElementById('productSearchRegister');
        if (searchInput) searchInput.value = '';
      }
    });
    if (newSelect.value) await loadProductTableForClient(newSelect.value);
    else document.getElementById('batchTableBody').innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center;">Selecciona un cliente para ver sus productos</td</tr>';
    window.clientSelect = newSelect;

    const searchInput = document.getElementById('productSearchRegister');
    if (searchInput) {
      searchInput.removeEventListener('input', filterProductTable);
      searchInput.addEventListener('input', filterProductTable);
    }
  }

  function filterProductTable() {
    const searchTerm = document.getElementById('productSearchRegister')?.value.toLowerCase().trim() || '';
    const rows = document.querySelectorAll('#batchTableBody tr');
    let visibleCount = 0;
    rows.forEach(row => {
      const nombre = row.querySelector('td:nth-child(2)')?.innerText.toLowerCase() || '';
      const presentacion = row.querySelector('td:nth-child(3)')?.innerText.toLowerCase() || '';
      const matches = searchTerm === '' || nombre.includes(searchTerm) || presentacion.includes(searchTerm);
      if (matches) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    const tbody = document.getElementById('batchTableBody');
    const noResultRow = document.getElementById('noSearchResultRow');
    if (visibleCount === 0 && searchTerm !== '') {
      if (!noResultRow) {
        const tr = document.createElement('tr');
        tr.id = 'noSearchResultRow';
        tr.innerHTML = `<td colspan="8" class="muted" style="text-align:center;">No hay productos que coincidan con "${searchTerm}"</td>`;
        tbody.appendChild(tr);
      } else {
        noResultRow.style.display = '';
      }
    } else {
      if (noResultRow) noResultRow.style.display = 'none';
    }
  }

  async function loadProductTableForClient(clienteId) {
    const tbody = document.getElementById('batchTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center;">Cargando productos...</td</tr>';
    
    const preciosSnapshot = await db.collection('precios').where('clienteId', '==', clienteId).get();
    const preciosMap = new Map();
    preciosSnapshot.docs.forEach(doc => {
      const data = doc.data();
      preciosMap.set(data.productoId, { precio: data.precio, docId: doc.id });
    });

    let html = '';
    for (const prod of productsCache) {
      const existing = preciosMap.get(prod.id);
      const precio = existing ? existing.precio : (prod.pvf || 0);
      const priceDocId = existing ? existing.docId : '';
      const imgSrc = (prod.imagen && !prod.imagen.includes('via.placeholder')) ? prod.imagen : fallbackImg;
      html += `<tr data-producto-id="${prod.id}" data-price-doc-id="${priceDocId}">
          <td style="width: 60px;"><img src="${imgSrc}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src='${fallbackImg}'"></td>
          <td>${prod.nombre}</td>
          <td>${prod.presentacion || ''}</td>
          <td class="price-cell">
            <input type="number" step="0.01" class="form-control price-input" value="${precio.toFixed(2)}" style="width:100px; display:inline-block;">
            <button type="button" class="btn-icon update-price-btn" data-product-id="${prod.id}" data-price-doc-id="${priceDocId}" style="margin-left:5px;" title="Actualizar/crear precio base para este cliente">💾</button>
          </td>
          <td><input type="number" class="form-control batch-cantidad" style="width:80px;" min="0" step="1" value="0"></td>
          <td><input type="text" class="form-control batch-lote" style="width:120px;" placeholder="Lote"></td>
          <td><input type="date" class="form-control batch-vencimiento" style="width:130px;"></td>
          <td style="text-align:center;"><button type="button" class="btn-toggle" data-producto-id="${prod.id}">🔘 Inactivo</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;

    document.querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', function() {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          this.textContent = '🔘 Inactivo';
        } else {
          this.classList.add('active');
          this.textContent = '✅ Activo';
        }
      });
    });

    document.querySelectorAll('.batch-cantidad').forEach(input => {
      input.addEventListener('change', function() {
        const row = this.closest('tr');
        const toggleBtn = row.querySelector('.btn-toggle');
        if (parseInt(this.value) > 0 && !toggleBtn.classList.contains('active')) {
          toggleBtn.classList.add('active');
          toggleBtn.textContent = '✅ Activo';
        } else if (parseInt(this.value) === 0 && toggleBtn.classList.contains('active')) {
          toggleBtn.classList.remove('active');
          toggleBtn.textContent = '🔘 Inactivo';
        }
      });
    });

    document.querySelectorAll('.update-price-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const productId = btn.dataset.productId;
        let priceDocId = btn.dataset.priceDocId;
        const row = btn.closest('tr');
        const priceInput = row.querySelector('.price-input');
        const newPrice = parseFloat(priceInput.value);
        if (isNaN(newPrice) || newPrice <= 0) {
          showToast('Ingrese un precio válido', 'error');
          return;
        }
        try {
          if (priceDocId) {
            await db.collection('precios').doc(priceDocId).update({ precio: newPrice });
          } else {
            const newDocRef = db.collection('precios').doc();
            await newDocRef.set({ clienteId, productoId: productId, precio: newPrice });
            priceDocId = newDocRef.id;
            btn.dataset.priceDocId = priceDocId;
            row.dataset.priceDocId = priceDocId;
          }
          const key = `${clienteId}_${productId}`;
          priceCache[key] = newPrice;
          showToast(`Precio base actualizado a S/ ${newPrice.toFixed(2)}`, 'success');
        } catch (err) {
          showToast('Error al actualizar precio: ' + err.message, 'error');
        }
      });
    });

    filterProductTable();
  }

async function registerBatchSales() {
  const clienteId = window.clientSelect ? window.clientSelect.value : document.getElementById('clientSelect').value;
  if (!clienteId) { showToast('Selecciona un cliente primero', 'warning'); return; }
  const rows = document.querySelectorAll('#batchTableBody tr');
  const ventasParaGuardar = [];
  
  // Primero recopilamos los datos para validar todo antes de iniciar el batch
  for (const row of rows) {
    const productoId = row.dataset.productoId;
    const toggleBtn = row.querySelector('.btn-toggle');
    if (!toggleBtn || !toggleBtn.classList.contains('active')) continue;
    
    const cantidadInput = row.querySelector('.batch-cantidad');
    const cantidad = parseInt(cantidadInput.value);
    if (isNaN(cantidad) || cantidad <= 0) { showToast(`La cantidad para ${productoId} debe ser un número positivo`, 'error'); return; }
    
    const lote = row.querySelector('.batch-lote').value.trim();
    if (!lote) { showToast(`El lote es obligatorio para ${productoId}`, 'error'); return; }
    
    const vencimiento = row.querySelector('.batch-vencimiento').value;
    if (!vencimiento) { showToast(`La fecha de vencimiento es obligatoria para ${productoId}`, 'error'); return; }
    
    const precioInput = row.querySelector('.price-input');
    const precio = parseFloat(precioInput.value);
    if (isNaN(precio) || precio <= 0) { showToast(`Precio inválido para ${productoId}`, 'error'); return; }
    
    const now = new Date();
    const mesCompra = `${now.getFullYear()}-${now.getMonth() + 1}`;
    ventasParaGuardar.push({
      clienteId, productoId, cantidad, lote,
      fechaVencimiento: new Date(vencimiento),
      fechaVenta: now,
      mesCompra,
      precioVenta: precio
    });
  }
  
  if (ventasParaGuardar.length === 0) { showToast('Activa al menos un producto con cantidad > 0', 'warning'); return; }
  
  // Crear un solo batch para todas las operaciones
  const batch = db.batch();
  
  for (const venta of ventasParaGuardar) {
    // 1. Preparar referencia del documento de precio (usando el ID compuesto o uno nuevo)
    let priceDocId = null;
    // Buscar la fila correspondiente para obtener el priceDocId actual (si existe)
    for (const row of rows) {
      if (row.dataset.productoId === venta.productoId) {
        priceDocId = row.dataset.priceDocId;
        break;
      }
    }
    if (!priceDocId) {
      // Si no existe, crear nuevo ID (Firestore lo generará automáticamente)
      const newPriceRef = db.collection('precios').doc();
      priceDocId = newPriceRef.id;
      // Actualizar el atributo data-price-doc-id en la fila para futuras referencias (opcional)
      const targetRow = Array.from(rows).find(r => r.dataset.productoId === venta.productoId);
      if (targetRow) targetRow.dataset.priceDocId = priceDocId;
    }
    const priceRef = db.collection('precios').doc(priceDocId);
    batch.set(priceRef, {
      clienteId: venta.clienteId,
      productoId: venta.productoId,
      precio: venta.precioVenta
    });
    
    // 2. Registrar la venta (Firestore asigna ID automáticamente)
    const ventaRef = db.collection('ventas').doc();
    batch.set(ventaRef, {
      clienteId: venta.clienteId,
      productoId: venta.productoId,
      cantidad: venta.cantidad,
      lote: venta.lote,
      fechaVencimiento: venta.fechaVencimiento,
      fechaVenta: venta.fechaVenta,
      mesCompra: venta.mesCompra,
      precioVenta: venta.precioVenta
    });
  }
  
  const btn = document.getElementById('registerBatchBtn');
  btn.disabled = true;
  
  try {
    await batch.commit();
    
    // Actualizar cachés locales
    for (const venta of ventasParaGuardar) {
      ventasCache.push({ id: Date.now() + Math.random(), ...venta });
      const key = `${venta.clienteId}_${venta.productoId}`;
      priceCache[key] = venta.precioVenta;
    }
    
    showToast(`✓ ${ventasParaGuardar.length} ventas registradas y precios actualizados`, 'success');
    
    // Limpiar formulario
    document.querySelectorAll('.batch-cantidad').forEach(inp => inp.value = '0');
    document.querySelectorAll('.btn-toggle').forEach(btn => { btn.classList.remove('active'); btn.textContent = '🔘 Inactivo'; });
    document.querySelectorAll('.batch-lote').forEach(inp => inp.value = '');
    document.querySelectorAll('.batch-vencimiento').forEach(inp => inp.value = '');
    
    await refreshCache();
    await loadProductTableForClient(clienteId);
    loadDashboard();
  } catch (err) {
    console.error(err);
    showToast('Error al registrar ventas: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

  // ─── HISTORIAL CON FILTROS AVANZADOS Y AGRUPACIÓN POR CLIENTE ──
  let currentFilters = {
    fechaDesde: null,
    fechaHasta: null,
    cliente: '',
    producto: '',
    lote: '',
    venceDesde: null,
    venceHasta: null
  };

  function applyFilters() {
    currentFilters = {
      fechaDesde: document.getElementById('filterFechaDesde').value,
      fechaHasta: document.getElementById('filterFechaHasta').value,
      cliente: document.getElementById('filterCliente').value.toLowerCase(),
      producto: document.getElementById('filterProducto').value.toLowerCase(),
      lote: document.getElementById('filterLote').value.toLowerCase(),
      venceDesde: document.getElementById('filterVenceDesde').value,
      venceHasta: document.getElementById('filterVenceHasta').value
    };
    loadHistory();
  }

  function clearFilters() {
    document.getElementById('filterFechaDesde').value = '';
    document.getElementById('filterFechaHasta').value = '';
    document.getElementById('filterCliente').value = '';
    document.getElementById('filterProducto').value = '';
    document.getElementById('filterLote').value = '';
    document.getElementById('filterVenceDesde').value = '';
    document.getElementById('filterVenceHasta').value = '';
    applyFilters();
  }

  async function loadHistory() {
    if (!ventasCache.length) await refreshCache();
    const container = document.querySelector('#historyTable tbody');
    container.innerHTML = '';

    // Aplicar filtros
    let filtered = [...ventasCache];
    if (currentFilters.fechaDesde) {
      const desde = new Date(currentFilters.fechaDesde);
      desde.setHours(0,0,0,0);
      filtered = filtered.filter(v => toDateObj(v.fechaVenta) >= desde);
    }
    if (currentFilters.fechaHasta) {
      const hasta = new Date(currentFilters.fechaHasta);
      hasta.setHours(23,59,59,999);
      filtered = filtered.filter(v => toDateObj(v.fechaVenta) <= hasta);
    }
    if (currentFilters.cliente) {
      filtered = filtered.filter(v => clientName(v.clienteId).toLowerCase().includes(currentFilters.cliente));
    }
    if (currentFilters.producto) {
      filtered = filtered.filter(v => productName(v.productoId).toLowerCase().includes(currentFilters.producto));
    }
    if (currentFilters.lote) {
      filtered = filtered.filter(v => (v.lote || '').toLowerCase().includes(currentFilters.lote));
    }
    if (currentFilters.venceDesde) {
      const desdeVence = new Date(currentFilters.venceDesde);
      desdeVence.setHours(0,0,0,0);
      filtered = filtered.filter(v => toDateObj(v.fechaVencimiento) >= desdeVence);
    }
    if (currentFilters.venceHasta) {
      const hastaVence = new Date(currentFilters.venceHasta);
      hastaVence.setHours(23,59,59,999);
      filtered = filtered.filter(v => toDateObj(v.fechaVencimiento) <= hastaVence);
    }

    // Ordenar por fecha más reciente
    filtered.sort((a,b)=> (b.fechaVenta?.seconds||0) - (a.fechaVenta?.seconds||0));

    if (!filtered.length) {
      container.innerHTML = '<tr><td colspan="9" class="muted" style="text-align:center;padding:20px">Sin ventas que coincidan con los filtros</td</tr>';
      return;
    }

    // Agrupar por cliente
    const grouped = new Map(); // clienteId -> array de ventas
    for (const venta of filtered) {
      const cid = venta.clienteId;
      if (!grouped.has(cid)) grouped.set(cid, []);
      grouped.get(cid).push(venta);
    }

    const priceMap = await getMultiplePrices(filtered);

    // Construir tabla agrupada
    for (const [clienteId, ventasCliente] of grouped.entries()) {
      const clienteNombre = clientName(clienteId);
      const grupoId = `grupo-${clienteId.replace(/[^a-zA-Z0-9]/g, '-')}`;
      
      // Fila cabecera del cliente
      const headerRow = document.createElement('tr');
      headerRow.className = 'group-header';
      headerRow.setAttribute('data-group', grupoId);
      headerRow.style.cursor = 'pointer';
      headerRow.style.backgroundColor = '#f1f5f9';
      headerRow.innerHTML = `
        <td colspan="9">
          <span class="toggle-icon">▶</span> <strong>${clienteNombre}</strong> (${ventasCliente.length} pedidos)
        </td>
      `;
      headerRow.querySelector('td').addEventListener('click', (e) => {
        const icon = headerRow.querySelector('.toggle-icon');
        const groupRows = document.querySelectorAll(`.group-row-${grupoId}`);
        const isCollapsed = icon.textContent === '▶';
        if (isCollapsed) {
          icon.textContent = '▼';
          groupRows.forEach(row => row.style.display = '');
        } else {
          icon.textContent = '▶';
          groupRows.forEach(row => row.style.display = 'none');
        }
      });
      container.appendChild(headerRow);

      // Filas de ventas de este cliente
      for (const v of ventasCliente) {
        const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
        const total = (precio * (v.cantidad||0)).toFixed(2);
        const dias = daysDiff(v.fechaVencimiento);
        let vencClass = '', vencText = fmtDate(v.fechaVencimiento);
        if (dias !== null) {
          if (dias < 0) { vencClass = 'text-danger'; vencText += ' ⚠️'; }
          else if (dias <= 15) { vencClass = 'text-warn'; vencText += ` (${dias}d)`; }
        }
        const tr = document.createElement('tr');
        tr.className = `group-row-${grupoId}`;
        tr.style.display = 'none'; // <--- Cambiado a 'none' para que inicie cerrado
        tr.innerHTML = `
          <td>${clienteNombre}</td>
          <td>${productName(v.productoId)}</td>
          <td>${fmtDate(v.fechaVenta)}</td>
          <td>${v.cantidad}</td>
          <td>S/${precio.toFixed(2)}</td>
          <td>S/${total}</td>
          <td>${v.lote || '—'}</td>
          <td class="${vencClass}">${vencText}</td>
          <td style="text-align:center;white-space:nowrap">
            <button class="btn-action btn-view" data-sale-id="${v.id}" title="Ver detalles">👁️</button>
            <button class="btn-action btn-edit" data-sale-id="${v.id}" title="Editar">✏️</button>
            <button class="btn-action btn-delete" data-sale-id="${v.id}" title="Eliminar">🗑️</button>
          </td>
        `;
        container.appendChild(tr);
      }
    }

    // Reasignar eventos de botones
    document.querySelectorAll('.btn-view').forEach(btn => btn.addEventListener('click', () => {
      const saleId = btn.dataset.saleId;
      const venta = ventasCache.find(v => v.id === saleId);
      if (venta) viewSaleDetail(venta);
    }));
    document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', () => {
      const saleId = btn.dataset.saleId;
      const venta = ventasCache.find(v => v.id === saleId);
      if (venta) editSale(venta);
    }));
    document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de eliminar esta venta?')) {
        try {
          await db.collection('ventas').doc(btn.dataset.saleId).delete();
          ventasCache = ventasCache.filter(v => v.id !== btn.dataset.saleId);
          showToast('Venta eliminada correctamente', 'success');
          loadHistory();
          loadDashboard();
        } catch (err) {
          showToast('Error al eliminar venta: ' + err.message, 'error');
        }
      }
    }));
  }

  document.getElementById('toggleFiltersBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('advancedFilters');
    panel.classList.toggle('hidden');
  });
  document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
  document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);

  // ─── EXPORTAR A EXCEL (exporta las ventas filtradas, no las agrupadas) ──
  async function exportAllData() {
    showToast('Preparando exportación completa...', 'info');
    try {
      const preciosSnapshot = await db.collection('precios').get();
      const allPrices = preciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const clientesSheet = clientsCache.map(c => ({
        ID: c.id,
        Nombre: c.nombre,
        RUC: c.ruc || '',
        Contacto: c.contacto || '',
        Email: c.email || '',
        Dirección: c.direccion || '',
        Logo_URL: c.imagen || ''
      }));

      const productosSheet = productsCache.map(p => ({
        ID: p.id,
        Nombre: p.nombre,
        Presentación: p.presentacion || '',
        Descripción: p.descripcion || '',
        VVF: p.vvf || 0,
        'Dcto Base %': ((p.dctoBase || 0) * 100).toFixed(2),
        PVF: p.pvf || 0,
        Imagen_URL: p.imagen || ''
      }));

      const preciosSheet = allPrices.map(pr => {
        const cliente = clientsCache.find(c => c.id === pr.clienteId);
        const producto = productsCache.find(p => p.id === pr.productoId);
        return {
          Cliente_ID: pr.clienteId,
          Cliente_Nombre: cliente ? cliente.nombre : '?',
          Producto_ID: pr.productoId,
          Producto_Nombre: producto ? producto.nombre : '?',
          Precio_SOLES: pr.precio
        };
      });

      const ventasSheet = ventasCache.map(v => ({
        ID: v.id,
        Cliente: clientName(v.clienteId),
        Producto: productName(v.productoId),
        Cantidad: v.cantidad || 0,
        'Precio Unitario': v.precioVenta || 0,
        Total: ((v.precioVenta || 0) * (v.cantidad || 0)).toFixed(2),
        Lote: v.lote || '',
        'Fecha Venta': fmtDate(v.fechaVenta),
        'Fecha Vencimiento': fmtDate(v.fechaVencimiento),
        MesCompra: v.mesCompra || ''
      }));

      const now = new Date();
      const mesKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
      let totalMes = 0;
      for (const v of ventasCache) {
        if (v.mesCompra === mesKey) {
          const precio = v.precioVenta || 0;
          totalMes += precio * (v.cantidad || 0);
        }
      }
      const dashboardSheet = [{
        'Reporte generado': now.toLocaleString('es-PE'),
        'Ventas del mes (S/)': totalMes.toFixed(2),
        'Clientes activos (30d)': document.getElementById('activeClients')?.innerText || '0',
        'Alertas activas': document.getElementById('alertsCount')?.innerText || '0',
        'Total clientes': clientsCache.length,
        'Total productos': productsCache.length,
        'Total ventas registradas': ventasCache.length,
        'Total precios (combinaciones)': allPrices.length
      }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientesSheet), 'Clientes');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productosSheet), 'Productos');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(preciosSheet), 'Precios');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventasSheet), 'Ventas');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dashboardSheet), 'Dashboard');

      XLSX.writeFile(wb, `markos_export_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`);
      showToast('Exportación completa exitosa', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al exportar: ' + err.message, 'error');
    }
  }

  // Exportar ventas filtradas (según los filtros actuales, sin agrupar)
  function exportFilteredSales() {
    // Obtener ventas filtradas actualmente (misma lógica que loadHistory)
    let filtered = [...ventasCache];
    if (currentFilters.fechaDesde) {
      const desde = new Date(currentFilters.fechaDesde);
      desde.setHours(0,0,0,0);
      filtered = filtered.filter(v => toDateObj(v.fechaVenta) >= desde);
    }
    if (currentFilters.fechaHasta) {
      const hasta = new Date(currentFilters.fechaHasta);
      hasta.setHours(23,59,59,999);
      filtered = filtered.filter(v => toDateObj(v.fechaVenta) <= hasta);
    }
    if (currentFilters.cliente) {
      filtered = filtered.filter(v => clientName(v.clienteId).toLowerCase().includes(currentFilters.cliente));
    }
    if (currentFilters.producto) {
      filtered = filtered.filter(v => productName(v.productoId).toLowerCase().includes(currentFilters.producto));
    }
    if (currentFilters.lote) {
      filtered = filtered.filter(v => (v.lote || '').toLowerCase().includes(currentFilters.lote));
    }
    if (currentFilters.venceDesde) {
      const desdeVence = new Date(currentFilters.venceDesde);
      desdeVence.setHours(0,0,0,0);
      filtered = filtered.filter(v => toDateObj(v.fechaVencimiento) >= desdeVence);
    }
    if (currentFilters.venceHasta) {
      const hastaVence = new Date(currentFilters.venceHasta);
      hastaVence.setHours(23,59,59,999);
      filtered = filtered.filter(v => toDateObj(v.fechaVencimiento) <= hastaVence);
    }

    if (!filtered.length) {
      showToast('No hay ventas para exportar con los filtros actuales', 'warning');
      return;
    }

    const salesData = filtered.map(v => ({
      Cliente: clientName(v.clienteId),
      Producto: productName(v.productoId),
      'Fecha venta': fmtDate(v.fechaVenta),
      Cantidad: v.cantidad || 0,
      'Precio unit.': v.precioVenta || 0,
      Total: ((v.precioVenta || 0) * (v.cantidad || 0)).toFixed(2),
      Lote: v.lote || '',
      Vencimiento: fmtDate(v.fechaVencimiento)
    }));

    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas_Filtradas');
    XLSX.writeFile(wb, `ventas_filtradas_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`);
    showToast(`Exportadas ${filtered.length} ventas filtradas`, 'success');
  }

  document.getElementById('exportAllBtn')?.addEventListener('click', exportAllData);
  document.getElementById('exportFilteredBtn')?.addEventListener('click', exportFilteredSales);

  // ─── VISTA DETALLE/EDITAR VENTA ──
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
    if (venta.fechaVencimiento) { const date = toDateObj(venta.fechaVencimiento); if (date) document.getElementById('editFechaVencimiento').value = date.toISOString().split('T')[0]; }
    else document.getElementById('editFechaVencimiento').value = '';
    const updateEditProductImage = () => { const product = productsCache.find(p => p.id === productSelect.value); document.getElementById('editProductImg').src = (product && product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg; };
    productSelect.removeEventListener('change', updateEditProductImage);
    productSelect.addEventListener('change', updateEditProductImage);
    updateEditProductImage();
    document.getElementById('editSaleMessage').textContent = '';
    modal.classList.remove('hidden');
  }

  document.getElementById('closeSaleDetailModal')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.getElementById('closeSaleDetailBtn')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.querySelector('#saleDetailModal .modal-overlay')?.addEventListener('click', () => document.getElementById('saleDetailModal').classList.add('hidden'));
  document.getElementById('closeEditSaleModal')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));
  document.getElementById('cancelEditSaleBtn')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));
  document.querySelector('#editSaleModal .modal-overlay')?.addEventListener('click', () => document.getElementById('editSaleModal').classList.add('hidden'));

  document.getElementById('saveEditSaleBtn')?.addEventListener('click', async () => {
    const saleId = document.getElementById('editSaleId').value;
    const clienteId = document.getElementById('editClienteId').value;
    const productoId = document.getElementById('editProductoId').value;
    const cantidad = parseFloat(document.getElementById('editCantidad').value);
    const lote = document.getElementById('editLote').value.trim();
    const precioVenta = parseFloat(document.getElementById('editPrecioVenta').value);
    const fechaVencimiento = document.getElementById('editFechaVencimiento').value;
    const msg = document.getElementById('editSaleMessage');
    if (isNaN(cantidad) || cantidad <= 0) { showToast('Cantidad positiva requerida', 'error'); msg.textContent = 'Cantidad positiva requerida'; msg.style.color = 'var(--danger)'; return; }
    if (!lote) { showToast('Lote requerido', 'error'); msg.textContent = 'Lote requerido'; msg.style.color = 'var(--danger)'; return; }
    if (!fechaVencimiento) { showToast('Fecha de vencimiento requerida', 'error'); msg.textContent = 'Fecha de vencimiento requerida'; msg.style.color = 'var(--danger)'; return; }
    if (isNaN(precioVenta) || precioVenta <= 0) { showToast('Precio unitario positivo requerido', 'error'); msg.textContent = 'Precio unitario positivo requerido'; msg.style.color = 'var(--danger)'; return; }
    msg.textContent = 'Guardando...'; msg.style.color = 'var(--muted)';
    try {
      const updateData = { clienteId, productoId, cantidad, lote, precioVenta, fechaVencimiento: new Date(fechaVencimiento) };
      await db.collection('ventas').doc(saleId).update(updateData);
      const index = ventasCache.findIndex(v => v.id === saleId);
      if (index !== -1) ventasCache[index] = { ...ventasCache[index], ...updateData };
      msg.textContent = '✓ Venta actualizada'; msg.style.color = 'var(--success)';
      showToast('Venta actualizada correctamente', 'success');
      setTimeout(() => { document.getElementById('editSaleModal').classList.add('hidden'); loadHistory(); loadDashboard(); }, 1500);
    } catch (err) { msg.textContent = 'Error: ' + err.message; msg.style.color = 'var(--danger)'; showToast('Error al actualizar venta: ' + err.message, 'error'); }
  });

  // ─── CLIENTES con RUC y eliminación ──────────────────────
  async function loadClients() {
    if (!clientsCache.length) await refreshCache();
    const grid = document.getElementById('clientsGrid');
    grid.innerHTML = '';
    const hoy = Date.now();
    const hace30 = hoy - 30*86400000, hace60 = hoy - 60*86400000;
    const priceMap = await getMultiplePrices(ventasCache);
    for (const c of clientsCache) {
      const buys = ventasCache.filter(v => v.clienteId === c.id && v.fechaVenta);
      const sorted = buys.sort((a,b)=> (b.fechaVenta?.seconds||0)-(a.fechaVenta?.seconds||0));
      const lastTs = sorted[0] ? toDateObj(sorted[0].fechaVenta)?.getTime() : null;
      const totalCompras = buys.length;
      const totalMonto = buys.reduce((sum,v) => { const p = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0; return sum + p * (v.cantidad||0); }, 0);
      let estadoLabel = 'Sin compras', estadoClass = 'inactive';
      if (lastTs) { if (lastTs >= hace30) { estadoLabel = 'Activo'; estadoClass = 'active'; } else if (lastTs >= hace60) { estadoLabel = 'Inactivo'; estadoClass = 'warn'; } else { estadoLabel = 'Sin comprar +60d'; estadoClass = 'inactive'; } }
      const prodCount = {};
      buys.forEach(v => { prodCount[v.productoId] = (prodCount[v.productoId]||0)+(v.cantidad||0); });
      const topProd = Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,2);
      const topProdHtml = topProd.map(([pid]) => `<span class="tag">${productName(pid)}</span>`).join('');
      const card = document.createElement('div');
      card.className = 'client-card';
      card.innerHTML = `
        <button class="card-delete-btn" data-client-id="${c.id}" title="Eliminar cliente">🗑️</button>
        <div class="client-header">
          <img src="${c.imagen || getClientLogo(c.nombre)}" alt="${c.nombre}" class="client-logo" onerror="this.src='${fallbackImg}'" />
          <div>
            <div class="client-nombre">${c.nombre}</div>
            ${c.ruc ? `<div class="client-ruc">RUC: ${c.ruc}</div>` : ''}
            <span class="status ${estadoClass}">${estadoLabel}</span>
          </div>
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
    }
    document.querySelectorAll('.card-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => { e.stopPropagation(); await deleteClient(btn.dataset.clientId); });
    });
  }

  async function deleteClient(clientId) {
    if (!confirm('¿Eliminar este cliente? Se borrarán TODOS sus precios y ventas asociadas.')) return;
    try {
      const client = clientsCache.find(c => c.id === clientId);
      if (!client) throw new Error('Cliente no encontrado');
      const preciosSnapshot = await db.collection('precios').where('clienteId', '==', clientId).get();
      const ventasSnapshot = await db.collection('ventas').where('clienteId', '==', clientId).get();
      const batch = db.batch();
      preciosSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      ventasSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      batch.delete(db.collection('clientes').doc(clientId));
      await batch.commit();
      await refreshCache();
      priceCache = {};
      loadClients();
      loadDashboard();
      loadHistory();
      showToast(`Cliente "${client.nombre}" eliminado correctamente`, 'success');
    } catch (err) { showToast('Error al eliminar cliente: ' + err.message, 'error'); }
  }

  // ─── PRODUCTOS con búsqueda y porcentaje ──
  async function loadProducts() {
    if (!productsCache.length) await refreshCache();
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    const ventasByProd = {};
    ventasCache.forEach(v => { ventasByProd[v.productoId] = (ventasByProd[v.productoId]||0)+(v.cantidad||0); });
    const searchTerm = document.getElementById('productSearchInput')?.value.toLowerCase() || '';
    let filtered = [...productsCache];
    if (searchTerm) {
      filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm) || (p.presentacion && p.presentacion.toLowerCase().includes(searchTerm)));
    }
    for (const p of filtered) {
      const imgSrc = (p.imagen && !p.imagen.includes('via.placeholder')) ? p.imagen : fallbackImg;
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.cursor = 'pointer';
      const porcentaje = ((p.dctoBase || 0) * 100).toFixed(2);
      card.innerHTML = `
        <button class="card-delete-btn" data-product-id="${p.id}" title="Eliminar producto">🗑️</button>
        <div class="product-image"><img src="${imgSrc}" onerror="this.src='${fallbackImg}'"></div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-presentation">${p.presentacion || ''}</div>
        <div class="product-prices">
          <div class="price-item"><div class="price-label">VVF</div><div class="price-value">S/${(p.vvf||0).toFixed(2)}</div></div>
          <div class="price-item"><div class="price-label">Dcto. Base</div><div class="price-value">${porcentaje}%</div></div>
          <div class="price-item"><div class="price-label">PVF</div><div class="price-value">S/${(p.pvf||0).toFixed(2)}</div></div>
          <div class="price-item"><div class="price-label">Vendidos</div><div class="price-value">${ventasByProd[p.id]||0}</div></div>
        </div>
      `;
      card.addEventListener('dblclick', () => openProductDetail(p));
      grid.appendChild(card);
    }
    document.querySelectorAll('.card-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => { e.stopPropagation(); await deleteProduct(btn.dataset.productId); });
    });
  }

  async function deleteProduct(productId) {
    if (!confirm('¿Eliminar este producto? Se borrarán TODOS sus precios y ventas asociadas.')) return;
    try {
      const product = productsCache.find(p => p.id === productId);
      if (!product) throw new Error('Producto no encontrado');
      const preciosSnapshot = await db.collection('precios').where('productoId', '==', productId).get();
      const ventasSnapshot = await db.collection('ventas').where('productoId', '==', productId).get();
      const batch = db.batch();
      preciosSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      ventasSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      batch.delete(db.collection('productos').doc(productId));
      await batch.commit();
      await refreshCache();
      priceCache = {};
      loadProducts();
      loadDashboard();
      loadHistory();
      showToast(`Producto "${product.nombre}" eliminado correctamente`, 'success');
    } catch (err) { showToast('Error al eliminar producto: ' + err.message, 'error'); }
  }

  // ─── AGREGAR CLIENTE con RUC ──────────────────────────
  function openAddClientModal() {
    document.getElementById('newClientName').value = '';
    document.getElementById('newClientRuc').value = '';
    document.getElementById('newClientContact').value = '';
    document.getElementById('newClientEmail').value = '';
    document.getElementById('newClientAddress').value = '';
    document.getElementById('newClientImageUrl').value = '';
    document.getElementById('newClientImagePreview').classList.add('hidden');
    document.getElementById('addClientMessage').textContent = '';
    document.getElementById('addClientModal').classList.remove('hidden');
  }
  async function addNewClient() {
    const nombre = document.getElementById('newClientName').value.trim();
    if (!nombre) { showToast('El nombre es obligatorio', 'error'); document.getElementById('addClientMessage').textContent = 'El nombre es obligatorio'; return; }
    const ruc = document.getElementById('newClientRuc').value.trim();
    const contacto = document.getElementById('newClientContact').value.trim();
    const email = document.getElementById('newClientEmail').value.trim();
    const direccion = document.getElementById('newClientAddress').value.trim();
    const imagen = document.getElementById('newClientImageUrl').value.trim();
    const msgSpan = document.getElementById('addClientMessage');
    msgSpan.textContent = 'Creando cliente y precios base...';
    msgSpan.style.color = 'var(--muted)';
    const btn = document.getElementById('confirmAddClientBtn');
    btn.disabled = true;
    try {
      const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      await db.collection('clientes').doc(clientId).set({ nombre, ruc: ruc || '', contacto: contacto || '', email: email || '', direccion: direccion || '', imagen: imagen || '' });
      const batch = db.batch();
      for (const prod of productsCache) {
        const precioBase = prod.pvf || 0;
        const priceId = `${clientId}_${prod.id}`;
        batch.set(db.collection('precios').doc(priceId), { clienteId: clientId, productoId: prod.id, precio: precioBase });
      }
      await batch.commit();
      await refreshCache();
      priceCache = {};
      loadClients();
      loadFormData();
      showToast(`Cliente "${nombre}" creado con precios base (PVF)`, 'success');
      document.getElementById('addClientModal').classList.add('hidden');
    } catch (err) { showToast('Error al crear cliente: ' + err.message, 'error'); msgSpan.textContent = 'Error: ' + err.message; msgSpan.style.color = 'var(--danger)'; }
    finally { btn.disabled = false; }
  }

  // ─── AGREGAR PRODUCTO con cálculo automático de PVF ───
  function openAddProductModal() {
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPresentation').value = '';
    document.getElementById('newProductDescription').value = '';
    document.getElementById('newProductVVF').value = '';
    document.getElementById('newProductDctoBase').value = '';
    document.getElementById('newProductPVF').value = '';
    document.getElementById('newProductImageUrl').value = '';
    document.getElementById('newProductImagePreview').classList.add('hidden');
    document.getElementById('addProductMessage').textContent = '';
    document.getElementById('addProductModal').classList.remove('hidden');

    const vvfInput = document.getElementById('newProductVVF');
    const dctoInput = document.getElementById('newProductDctoBase');
    const pvfInput = document.getElementById('newProductPVF');
    const updatePVF = () => {
      const vvf = parseFloat(vvfInput.value) || 0;
      const dcto = (parseFloat(dctoInput.value) || 0) / 100;
      const pvf = vvf * (1 - dcto) * 1.18;
      pvfInput.value = pvf.toFixed(2);
    };
    vvfInput.removeEventListener('input', updatePVF);
    dctoInput.removeEventListener('input', updatePVF);
    vvfInput.addEventListener('input', updatePVF);
    dctoInput.addEventListener('input', updatePVF);
  }
  async function addNewProduct() {
    const nombre = document.getElementById('newProductName').value.trim();
    if (!nombre) { showToast('El nombre es obligatorio', 'error'); document.getElementById('addProductMessage').textContent = 'El nombre es obligatorio'; return; }
    const presentacion = document.getElementById('newProductPresentation').value.trim();
    const descripcion = document.getElementById('newProductDescription').value.trim();
    const vvf = parseFloat(document.getElementById('newProductVVF').value) || 0;
    const dctoBase = (parseFloat(document.getElementById('newProductDctoBase').value) || 0) / 100;
    const pvf = parseFloat(document.getElementById('newProductPVF').value) || 0;
    const imagen = document.getElementById('newProductImageUrl').value.trim();
    const msgSpan = document.getElementById('addProductMessage');
    msgSpan.textContent = 'Creando producto y precios para todos los clientes...';
    msgSpan.style.color = 'var(--muted)';
    const btn = document.getElementById('confirmAddProductBtn');
    btn.disabled = true;
    try {
      const productId = 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      await db.collection('productos').doc(productId).set({ nombre, presentacion: presentacion || '', descripcion: descripcion || '', vvf, dctoBase, pvf, imagen: imagen || '' });
      const batch = db.batch();
      for (const client of clientsCache) {
        const priceId = `${client.id}_${productId}`;
        batch.set(db.collection('precios').doc(priceId), { clienteId: client.id, productoId: productId, precio: pvf });
      }
      await batch.commit();
      await refreshCache();
      priceCache = {};
      loadProducts();
      loadFormData();
      showToast(`Producto "${nombre}" creado con precios base (PVF) para todos los clientes`, 'success');
      document.getElementById('addProductModal').classList.add('hidden');
    } catch (err) { showToast('Error al crear producto: ' + err.message, 'error'); msgSpan.textContent = 'Error: ' + err.message; msgSpan.style.color = 'var(--danger)'; }
    finally { btn.disabled = false; }
  }

  // ─── DETALLES PRODUCTO ──
  function openProductDetail(product) {
    const modal = document.getElementById('productDetailModal');
    document.getElementById('productDetailName').value = product.nombre || '';
    document.getElementById('productDetailPresentation').value = product.presentacion || '';
    document.getElementById('productDetailDescription').value = product.descripcion || '';
    document.getElementById('productDetailImageUrl').value = product.imagen || '';
    document.getElementById('productDetailVVF').value = (product.vvf || 0).toFixed(2);
    document.getElementById('productDetailDctoBase').value = ((product.dctoBase || 0) * 100).toFixed(2);
    document.getElementById('productDetailPVF').value = (product.pvf || 0).toFixed(2);
    document.getElementById('detailMessage').textContent = '';
    const imgSrc = (product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg;
    document.getElementById('productDetailImg').src = imgSrc;
    document.getElementById('detailImagePreview').classList.add('hidden');
    modal.dataset.productId = product.id;
    modal.classList.remove('hidden');

    const vvfInput = document.getElementById('productDetailVVF');
    const dctoInput = document.getElementById('productDetailDctoBase');
    const pvfInput = document.getElementById('productDetailPVF');
    const updatePVF = () => {
      const vvf = parseFloat(vvfInput.value) || 0;
      const dcto = (parseFloat(dctoInput.value) || 0) / 100;
      const pvf = vvf * (1 - dcto) * 1.18;
      pvfInput.value = pvf.toFixed(2);
    };
    vvfInput.removeEventListener('input', updatePVF);
    dctoInput.removeEventListener('input', updatePVF);
    vvfInput.addEventListener('input', updatePVF);
    dctoInput.addEventListener('input', updatePVF);
  }
  function closeProductDetail() { document.getElementById('productDetailModal').classList.add('hidden'); }
  document.getElementById('closeDetailModal')?.addEventListener('click', closeProductDetail);
  document.getElementById('cancelDetailBtn')?.addEventListener('click', closeProductDetail);
  
  // ─── VISTA PREVIA PRODUCTO DESTACADO ───
  function viewFeaturedProductPreview(product) {
    const modal = document.getElementById('featuredProductPreviewModal');
    const imgSrc = (product.imagen && !product.imagen.includes('via.placeholder')) ? product.imagen : fallbackImg;
    document.getElementById('featuredPreviewImg').src = imgSrc;
    document.getElementById('featuredPrevName').textContent = product.nombre || '–';
    document.getElementById('featuredPrevPresentation').textContent = product.presentacion || '–';
    document.getElementById('featuredPrevVVF').textContent = 'S/ ' + (product.vvf || 0).toFixed(2);
    document.getElementById('featuredPrevDcto').textContent = ((product.dctoBase || 0) * 100).toFixed(2) + '%';
    document.getElementById('featuredPrevPVF').textContent = 'S/ ' + (product.pvf || 0).toFixed(2);
    modal.classList.remove('hidden');
  }
  function closeFeaturedProductPreview() { document.getElementById('featuredProductPreviewModal').classList.add('hidden'); }
  document.getElementById('closeFeaturedPreviewModal')?.addEventListener('click', closeFeaturedProductPreview);
  document.getElementById('closeFeaturedPreviewBtn')?.addEventListener('click', closeFeaturedProductPreview);
  
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
    const vvf = parseFloat(document.getElementById('productDetailVVF').value);
    const dctoBase = (parseFloat(document.getElementById('productDetailDctoBase').value) || 0) / 100;
    const pvf = parseFloat(document.getElementById('productDetailPVF').value);
    const message = document.getElementById('detailMessage');
    if (!nombre) { showToast('El nombre es requerido', 'error'); message.textContent = 'El nombre es requerido'; message.style.color = 'var(--danger)'; return; }
    if (isNaN(vvf) || isNaN(dctoBase) || isNaN(pvf)) { showToast('VVF, Dcto. Base y PVF deben ser números válidos', 'error'); message.textContent = 'VVF, Dcto. Base y PVF deben ser números válidos'; message.style.color = 'var(--danger)'; return; }
    message.textContent = 'Guardando...'; message.style.color = 'var(--muted)';
    document.getElementById('saveDetailBtn').disabled = true;
    try {
      const updateData = { nombre, presentacion: presentacion || '', descripcion: descripcion || '', vvf, dctoBase, pvf };
      if (imagen) updateData.imagen = imagen;
      await db.collection('productos').doc(productId).update(updateData);
      const prod = productsCache.find(p => p.id === productId);
      if (prod) { prod.nombre = nombre; prod.presentacion = presentacion || ''; prod.descripcion = descripcion || ''; prod.vvf = vvf; prod.dctoBase = dctoBase; prod.pvf = pvf; if (imagen) prod.imagen = imagen; }
      message.textContent = '✓ Guardado'; message.style.color = 'var(--success)';
      showToast('Producto actualizado correctamente', 'success');
      setTimeout(() => { closeProductDetail(); loadProducts(); }, 1500);
    } catch (err) { message.textContent = 'Error: ' + err.message; message.style.color = 'var(--danger)'; showToast('Error al guardar producto: ' + err.message, 'error'); }
    document.getElementById('saveDetailBtn').disabled = false;
  });
  document.querySelector('#productDetailModal .modal-overlay')?.addEventListener('click', closeProductDetail);

  // ─── DETALLES CLIENTE con RUC y edición ──────────────
  function openClientDetail(client) {
    const modal = document.getElementById('clientDetailModal');
    document.getElementById('clientDetailName').value = client.nombre || '';
    document.getElementById('clientDetailRuc').value = client.ruc || '';
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
    const ruc = document.getElementById('clientDetailRuc').value.trim();
    const contacto = document.getElementById('clientDetailContact').value.trim();
    const email = document.getElementById('clientDetailEmail').value.trim();
    const direccion = document.getElementById('clientDetailAddress').value.trim();
    const imagen = document.getElementById('clientDetailImageUrl').value.trim();
    const message = document.getElementById('clientDetailMessage');
    if (!nombre) { showToast('El nombre es requerido', 'error'); message.textContent = 'El nombre es requerido'; message.style.color = 'var(--danger)'; return; }
    message.textContent = 'Guardando...'; message.style.color = 'var(--muted)';
    document.getElementById('saveClientDetailBtn').disabled = true;
    try {
      const updateData = { nombre, ruc: ruc || '', contacto: contacto || '', email: email || '', direccion: direccion || '' };
      if (imagen) updateData.imagen = imagen;
      await db.collection('clientes').doc(clientId).update(updateData);
      const cliente = clientsCache.find(c => c.id === clientId);
      if (cliente) { cliente.nombre = nombre; cliente.ruc = ruc || ''; cliente.contacto = contacto || ''; cliente.email = email || ''; cliente.direccion = direccion || ''; if (imagen) cliente.imagen = imagen; }
      message.textContent = '✓ Guardado'; message.style.color = 'var(--success)';
      showToast('Cliente actualizado correctamente', 'success');
      setTimeout(() => { closeClientDetail(); loadClients(); }, 1500);
    } catch (err) { message.textContent = 'Error: ' + err.message; message.style.color = 'var(--danger)'; showToast('Error al guardar cliente: ' + err.message, 'error'); }
    document.getElementById('saveClientDetailBtn').disabled = false;
  });
  document.querySelector('#clientDetailModal .modal-overlay')?.addEventListener('click', closeClientDetail);

  // ─── IMPORTAR EXCEL ────────────────────────────────────
  function initImportView() { 
    const btn = document.getElementById('importExcelBtn'); 
    if (btn && !btn.dataset.bound) { 
      btn.dataset.bound = '1'; 
      btn.addEventListener('click', importExcelFile); 
    } 
  }
  function normalizeText(v) { return String(v || '').trim().replace(/\s+/g, ' '); }
  function slugify(value, fallback) { const base = normalizeText(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); return base || fallback; }
  function toNumber(value) { if (value === null || value === undefined || value === '') return null; const n = parseFloat(String(value).replace(/\s+/g,'').replace(/%/g,'').replace(/,/g,'.')); return Number.isFinite(n) ? n : null; }
  function setImportProgress(percent, stage, detail) { const clamped = Math.max(0, Math.min(100, Math.round(percent))); document.getElementById('importProgressFill').style.width = clamped + '%'; document.getElementById('importPercent').textContent = clamped + '%'; document.getElementById('importStage').textContent = stage; document.getElementById('importDetail').textContent = detail || ''; document.getElementById('importMessage').textContent = detail || stage; }
  async function writeInBatches(collectionName, docs, batchSize, label, onProgress) { for (let i = 0; i < docs.length; i += batchSize) { const batch = db.batch(); const slice = docs.slice(i, i + batchSize); slice.forEach(doc => batch.set(db.collection(collectionName).doc(doc.id), doc.data)); await batch.commit(); if (onProgress) onProgress(Math.min(i + slice.length, docs.length), docs.length, label); } }
  async function clearCollection(name) { const snap = await db.collection(name).get(); for (const doc of snap.docs) if (doc.ref?.delete) await doc.ref.delete(); }
  async function importExcelFile() {
    const importMessage = document.getElementById('importMessage');
    const fileInput = document.getElementById('excelFile');
    if (!fileInput?.files?.[0]) { showToast('Selecciona un archivo Excel primero', 'warning'); importMessage.textContent = 'Selecciona un archivo Excel primero.'; return; }
    try {
      setImportProgress(5, 'Leyendo archivo', 'Abriendo el libro de Excel…');
      const buffer = await fileInput.files[0].arrayBuffer();
      setImportProgress(10, 'Interpretando hojas', 'Localizando encabezados…');
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      const headerIndex = rows.findIndex(row => row.some(cell => normalizeText(cell).toUpperCase() === 'PRODUCTO'));
      if (headerIndex === -1) { showToast('No se encontró la fila de encabezados', 'error'); importMessage.textContent = 'No se encontró la fila de encabezados.'; return; }
      const header = rows[headerIndex].map(cell => normalizeText(cell));
      const productCol = header.findIndex(h => h.toUpperCase() === 'PRODUCTO');
      const presentCol = header.findIndex(h => h.toUpperCase() === 'PRESENTACION');
      const vvfCol = header.findIndex(h => h.toUpperCase() === 'VVF');
      const dctoCol = header.findIndex(h => h.toUpperCase().includes('DCTO'));
      const pvfCol = header.findIndex(h => h.toUpperCase() === 'PVF');
      const unidCol = header.findIndex(h => h.toUpperCase().includes('UNID'));
      const firstClientCol = unidCol >= 0 ? unidCol + 1 : 6;
      if (productCol === -1) { showToast('No se detectó columna PRODUCTO', 'error'); importMessage.textContent = 'No se detectó columna PRODUCTO.'; return; }
      const clientNames = header.slice(firstClientCol).filter(n => normalizeText(n));
      if (!clientNames.length) { showToast('No se detectaron clientes en el encabezado', 'error'); importMessage.textContent = 'No se detectaron clientes en el encabezado.'; return; }
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
      showToast(`Importación exitosa: ${clientDocs.length} clientes, ${productDocs.length} productos`, 'success');
      loadDashboard();
    } catch (err) { setImportProgress(0, 'Error al importar', err.message); showToast('Error al importar: ' + err.message, 'error'); }
  }

  // ─── AGREGAR IMAGEN POR URL con toast ─────────────────
  const modalUpload = document.getElementById('uploadModal');
  const uploadBtn = document.getElementById('uploadImagesBtn');
  const closeModalBtn = document.getElementById('closeUploadModal');
  const cancelBtnUpload = document.getElementById('cancelUploadBtn');
  const confirmBtnUpload = document.getElementById('confirmUploadBtn');
  const productSelectUpload = document.getElementById('uploadProductSelect');
  const imageUrlInputUpload = document.getElementById('imageUrlInput');
  const previewUpload = document.getElementById('imagePreview');
  const previewImgUpload = document.getElementById('previewImg');
  const uploadMessage = document.getElementById('uploadMessage');
  function openUploadModal() {
    if (!productsCache.length) { showToast('Carga los productos primero importando Excel', 'warning'); return; }
    productSelectUpload.innerHTML = productsCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    imageUrlInputUpload.value = '';
    previewUpload.classList.add('hidden');
    uploadMessage.textContent = '';
    modalUpload.classList.remove('hidden');
  }
  function closeUploadModal() { modalUpload.classList.add('hidden'); }
  imageUrlInputUpload.addEventListener('change', () => {
    const url = imageUrlInputUpload.value.trim();
    if (!url) { previewUpload.classList.add('hidden'); return; }
    try { new URL(url); } catch { showToast('URL no válida', 'error'); uploadMessage.textContent = 'URL no válida'; uploadMessage.style.color = 'var(--danger)'; previewUpload.classList.add('hidden'); return; }
    previewImgUpload.src = url;
    previewImgUpload.onload = () => { previewUpload.classList.remove('hidden'); uploadMessage.textContent = ''; };
    previewImgUpload.onerror = () => { showToast('No se pudo cargar la imagen', 'error'); uploadMessage.textContent = 'No se pudo cargar la imagen'; uploadMessage.style.color = 'var(--danger)'; previewUpload.classList.add('hidden'); };
  });
  confirmBtnUpload.addEventListener('click', async () => {
    const url = imageUrlInputUpload.value.trim();
    if (!url) { showToast('Ingresa una URL de imagen', 'warning'); uploadMessage.textContent = 'Ingresa una URL de imagen'; uploadMessage.style.color = 'var(--danger)'; return; }
    const productId = productSelectUpload.value;
    if (!productId) { showToast('Selecciona un producto', 'warning'); uploadMessage.textContent = 'Selecciona un producto'; uploadMessage.style.color = 'var(--danger)'; return; }
    uploadMessage.textContent = 'Guardando...'; uploadMessage.style.color = 'var(--muted)';
    confirmBtnUpload.disabled = true;
    try {
      await db.collection('productos').doc(productId).update({ imagen: url });
      const prod = productsCache.find(p => p.id === productId);
      if (prod) prod.imagen = url;
      uploadMessage.textContent = '✓ Imagen guardada'; uploadMessage.style.color = 'var(--success)';
      showToast('Imagen guardada correctamente', 'success');
      setTimeout(() => { closeUploadModal(); loadProducts(); }, 1500);
    } catch (err) { uploadMessage.textContent = 'Error: ' + err.message; uploadMessage.style.color = 'var(--danger)'; showToast('Error al guardar imagen: ' + err.message, 'error'); }
    confirmBtnUpload.disabled = false;
  });
  uploadBtn?.addEventListener('click', openUploadModal);
  closeModalBtn.addEventListener('click', closeUploadModal);
  cancelBtnUpload.addEventListener('click', closeUploadModal);
  document.querySelector('#uploadModal .modal-overlay')?.addEventListener('click', closeUploadModal);

  // ─── DETALLES DE VENTAS DEL MES, CLIENTES ACTIVOS, ALERTAS ───────
  async function showVentasDetalle() {
    const now = new Date();
    const mesKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    document.getElementById('ventasMesLabel').textContent = new Date().toLocaleDateString('es-PE', { month:'long', year:'numeric' });
    const ventasMes = ventasCache.filter(v => v.mesCompra === mesKey);
    if (ventasMes.length === 0) {
      document.getElementById('ventasDetalleTable').innerHTML = '<tr><td colspan="6" class="muted" style="text-align:center;">No hay ventas en el mes actual</td</table>';
      document.getElementById('ventasTotalGeneral').textContent = 'S/0.00';
      document.getElementById('ventasCount').textContent = '0';
      document.getElementById('detailVentasModal').classList.remove('hidden');
      return;
    }
    const priceMap = await getMultiplePrices(ventasMes);
    let totalGeneral = 0;
    let html = '';
    for (const v of ventasMes) {
      const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0;
      const total = precio * (v.cantidad || 0);
      totalGeneral += total;
      html += `<tr><td>${clientName(v.clienteId)}</td><td>${productName(v.productoId)}</td><td>${v.cantidad}</td><td>S/${precio.toFixed(2)}</td><td>S/${total.toFixed(2)}</td><td>${fmtDate(v.fechaVenta)}</td></tr>`;
    }
    document.getElementById('ventasDetalleTable').innerHTML = html;
    document.getElementById('ventasTotalGeneral').textContent = `S/${totalGeneral.toFixed(2)}`;
    document.getElementById('ventasCount').textContent = ventasMes.length;
    document.getElementById('detailVentasModal').classList.remove('hidden');
  }
  async function showClientesActivosDetalle() {
    const hoy = Date.now();
    const hace30 = hoy - 30 * 86400000;
    const clientesActivos = [];
    const priceMap = await getMultiplePrices(ventasCache);
    for (const c of clientsCache) {
      const comprasCliente = ventasCache.filter(v => v.clienteId === c.id && v.fechaVenta);
      if (comprasCliente.length === 0) continue;
      const ultimaFecha = Math.max(...comprasCliente.map(v => toDateObj(v.fechaVenta)?.getTime() || 0));
      if (ultimaFecha >= hace30) {
        const compras30d = comprasCliente.filter(v => (toDateObj(v.fechaVenta)?.getTime() || 0) >= hace30);
        const totalCompras = compras30d.length;
        const totalMonto = compras30d.reduce((sum, v) => { const precio = priceMap[`${v.clienteId}_${v.productoId}`] ?? v.precioVenta ?? 0; return sum + precio * (v.cantidad || 0); }, 0);
        clientesActivos.push({ nombre: c.nombre, ultima: new Date(ultimaFecha), totalCompras, totalMonto });
      }
    }
    clientesActivos.sort((a,b) => b.ultima - a.ultima);
    const tbody = document.getElementById('clientesActivosTable');
    if (clientesActivos.length === 0) tbody.innerHTML = '<td><td colspan="4" class="muted" style="text-align:center;">No hay clientes activos en los últimos 30 días</td</tr>';
    else tbody.innerHTML = clientesActivos.map(c => `<tr><td>${c.nombre}</td><td>${fmtDate(c.ultima)}</td><td>${c.totalCompras}</td><td>S/${c.totalMonto.toFixed(2)}</td></tr>`).join('');
    document.getElementById('detailClientesActivosModal').classList.remove('hidden');
  }
  function showAlertasDetalle() {
    const now = new Date();
    const hoy = now.getTime();
    const hace30 = hoy - 30*86400000, hace60 = hoy - 60*86400000;
    const lastBuyMap = {};
    ventasCache.forEach(v => { const ts = toDateObj(v.fechaVenta)?.getTime() || 0; if (!lastBuyMap[v.clienteId] || ts > lastBuyMap[v.clienteId]) lastBuyMap[v.clienteId] = ts; });
    const advertencias = [], urgentes = [];
    clientsCache.forEach(c => {
      const last = lastBuyMap[c.id];
      if (!last) { advertencias.push(`${c.nombre} nunca ha comprado`); return; }
      const diasUltima = Math.round((hoy - last) / 86400000);
      if (last >= hace30) { /* activo */ }
      else if (last >= hace60) advertencias.push(`${c.nombre} sin comprar hace ${diasUltima} días`);
      else urgentes.push(`${c.nombre} sin comprar hace ${diasUltima} días`);
    });
    ventasCache.forEach(v => {
      if (!v.fechaVencimiento) return;
      const dias = daysDiff(v.fechaVencimiento);
      if (dias === null || dias > 60) return;
      const pnombre = productName(v.productoId), cnombre = clientName(v.clienteId), lote = v.lote ? ` (Lote: ${v.lote})` : '';
      if (dias < 0) urgentes.push(`VENCIDO: ${pnombre}${lote} — ${cnombre}`);
      else if (dias <= 15) urgentes.push(`Vence en ${dias} días: ${pnombre}${lote} — ${cnombre}`);
      else advertencias.push(`Vence en ${dias} días: ${pnombre}${lote} — ${cnombre}`);
    });
    document.getElementById('modalWarningList').innerHTML = advertencias.length ? advertencias.map(a => `<li class="alert-item">⚠️ ${a}</li>`).join('') : '<li class="alert-item muted">Sin advertencias</li>';
    document.getElementById('modalDangerList').innerHTML = urgentes.length ? urgentes.map(a => `<li class="alert-item">🔴 ${a}</li>`).join('') : '<li class="alert-item muted">Sin alertas urgentes</li>';
    document.getElementById('detailAlertasModal').classList.remove('hidden');
  }

  document.getElementById('viewVentasDetail')?.addEventListener('click', showVentasDetalle);
  document.getElementById('viewClientesActivosDetail')?.addEventListener('click', showClientesActivosDetalle);
  document.getElementById('viewAlertasDetail')?.addEventListener('click', showAlertasDetalle);
  document.getElementById('closeVentasModal')?.addEventListener('click', () => document.getElementById('detailVentasModal').classList.add('hidden'));
  document.getElementById('closeVentasModalBtn')?.addEventListener('click', () => document.getElementById('detailVentasModal').classList.add('hidden'));
  document.querySelector('#detailVentasModal .modal-overlay')?.addEventListener('click', () => document.getElementById('detailVentasModal').classList.add('hidden'));
  document.getElementById('closeClientesActivosModal')?.addEventListener('click', () => document.getElementById('detailClientesActivosModal').classList.add('hidden'));
  document.getElementById('closeClientesActivosModalBtn')?.addEventListener('click', () => document.getElementById('detailClientesActivosModal').classList.add('hidden'));
  document.querySelector('#detailClientesActivosModal .modal-overlay')?.addEventListener('click', () => document.getElementById('detailClientesActivosModal').classList.add('hidden'));
  document.getElementById('closeAlertasModal')?.addEventListener('click', () => document.getElementById('detailAlertasModal').classList.add('hidden'));
  document.getElementById('closeAlertasModalBtn')?.addEventListener('click', () => document.getElementById('detailAlertasModal').classList.add('hidden'));
  document.querySelector('#detailAlertasModal .modal-overlay')?.addEventListener('click', () => document.getElementById('detailAlertasModal').classList.add('hidden'));

  // ─── BOTONES DE AGREGAR (eventos) ─────────────────────
  document.getElementById('addClientBtn')?.addEventListener('click', openAddClientModal);
  document.getElementById('closeAddClientModal')?.addEventListener('click', () => document.getElementById('addClientModal').classList.add('hidden'));
  document.getElementById('cancelAddClientBtn')?.addEventListener('click', () => document.getElementById('addClientModal').classList.add('hidden'));
  document.getElementById('confirmAddClientBtn')?.addEventListener('click', addNewClient);
  document.getElementById('addProductBtn')?.addEventListener('click', openAddProductModal);
  document.getElementById('closeAddProductModal')?.addEventListener('click', () => document.getElementById('addProductModal').classList.add('hidden'));
  document.getElementById('cancelAddProductBtn')?.addEventListener('click', () => document.getElementById('addProductModal').classList.add('hidden'));
  document.getElementById('confirmAddProductBtn')?.addEventListener('click', addNewProduct);

  // Previsualización de imagen en modales de agregar
  document.getElementById('newClientImageUrl')?.addEventListener('change', () => {
    const url = document.getElementById('newClientImageUrl').value.trim();
    const preview = document.getElementById('newClientImagePreview');
    const img = document.getElementById('newClientPreviewImg');
    if (!url) { preview.classList.add('hidden'); return; }
    try { new URL(url); } catch { preview.classList.add('hidden'); return; }
    img.src = url;
    img.onload = () => preview.classList.remove('hidden');
    img.onerror = () => preview.classList.add('hidden');
  });
  document.getElementById('newProductImageUrl')?.addEventListener('change', () => {
    const url = document.getElementById('newProductImageUrl').value.trim();
    const preview = document.getElementById('newProductImagePreview');
    const img = document.getElementById('newProductPreviewImg');
    if (!url) { preview.classList.add('hidden'); return; }
    try { new URL(url); } catch { preview.classList.add('hidden'); return; }
    img.src = url;
    img.onload = () => preview.classList.remove('hidden');
    img.onerror = () => preview.classList.add('hidden');
  });

  // Evento para búsqueda en productos
  document.getElementById('productSearchInput')?.addEventListener('input', () => loadProducts());
});