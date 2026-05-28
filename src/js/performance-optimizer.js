// ============================================================
// performance-optimizer.js — Optimización de Rendimiento
// Carga Progresiva, Caché Local, Skeleton Screens
// ============================================================

(function() {
  'use strict';

  // ─── INDEXEDDB CACHE ────────────────────────────────────
  const DB_NAME = 'PaolaPanelDB';
  const DB_VERSION = 1;
  const STORES = {
    clientes: 'clientes',
    productos: 'productos',
    ventas: 'ventas',
    precios: 'precios',
    metadata: 'metadata'
  };

  let dbInstance = null;

  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // Crear object stores si no existen
        ['clientes', 'productos', 'ventas', 'precios'].forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });

        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  };

  const saveToCache = async (storeName, data) => {
    if (!dbInstance) await initDB();
    
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      
      // Limpiar store anterior
      store.clear();
      
      // Agregar nuevos datos
      data.forEach(item => store.add(item));
      
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();
    });
  };

  const getFromCache = async (storeName) => {
    if (!dbInstance) await initDB();
    
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  };

  const updateCacheTimestamp = async (key) => {
    if (!dbInstance) await initDB();
    
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(['metadata'], 'readwrite');
      const store = tx.objectStore('metadata');
      store.put({ key, timestamp: Date.now() });
      
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();
    });
  };

  const getCacheTimestamp = async (key) => {
    if (!dbInstance) await initDB();
    
    return new Promise((resolve) => {
      const tx = dbInstance.transaction(['metadata'], 'readonly');
      const store = tx.objectStore('metadata');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.timestamp : 0);
      };
    });
  };

  // ─── SKELETON SCREENS ───────────────────────────────────
  const createSkeletonKPI = () => {
    return `
      <div class="kpi-card skeleton-container" style="position: relative; overflow: hidden;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <div class="skeleton-shimmer" style="width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;"></div>
          <div class="skeleton-shimmer" style="height: 12px; width: 60%; border-radius: 4px;"></div>
        </div>
        <div class="skeleton-shimmer" style="height: 36px; width: 80%; border-radius: 6px;"></div>
        <div class="skeleton-shimmer" style="height: 10px; width: 40%; border-radius: 4px; margin-top: 10px;"></div>
      </div>
    `;
  };

  const createSkeletonChart = () => {
    return `
      <div class="skeleton-shimmer" style="width: 100%; height: 250px; border-radius: 12px; position: relative;">
        <div style="position: absolute; bottom: 20px; left: 5%; right: 5%; display: flex; align-items: flex-end; gap: 8%; height: 70%;">
          ${Array(8).fill(0).map((_, i) => `<div class="skeleton-shimmer" style="flex: 1; height: ${20 + Math.random() * 80}%; border-radius: 4px 4px 0 0; opacity: 0.5; animation-delay: ${i * 0.1}s"></div>`).join('')}
        </div>
      </div>
    `;
  };

  const createSkeletonCards = (count = 3) => {
    return Array(count).fill(0).map((_, i) => `
      <div class="recompra-card skeleton-container" style="height: 80px; border-radius: 8px; display: flex; align-items: center; gap: 15px; padding: 15px; animation-delay: ${i * 0.1}s">
        <div class="skeleton-shimmer" style="width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;"></div>
        <div style="flex: 1;">
          <div class="skeleton-shimmer" style="height: 14px; width: 70%; border-radius: 4px; margin-bottom: 8px;"></div>
          <div class="skeleton-shimmer" style="height: 10px; width: 40%; border-radius: 4px;"></div>
        </div>
      </div>
    `).join('');
  };

  // ─── OPTIMIZADOR DE CACHÉ ───────────────────────────────
  const shouldRefreshCache = async (key, maxAgeMs = 5 * 60 * 1000) => {
    const timestamp = await getCacheTimestamp(key);
    const now = Date.now();
    return now - timestamp > maxAgeMs;
  };

  // ─── CARGA PROGRESIVA ───────────────────────────────────
  const loadDataProgressive = async (firebaseDB) => {
    // Inicializar IndexedDB
    await initDB();

    return {
      // Cargar datos críticos primero (KPIs)
      loadCriticalData: async () => {
        console.log('📊 Cargando datos críticos...');
        
        // Intentar cargar del caché primero
        const cachedVentas = await getFromCache('ventas');
        const cachedClientes = await getFromCache('clientes');
        
        if (cachedVentas.length > 0 && cachedClientes.length > 0) {
          console.log('✅ Datos críticos del caché');
          return { ventas: cachedVentas, clientes: cachedClientes };
        }

        // Si no hay caché, cargar del Firebase (en paralelo pero ligero)
        console.log('🔄 Cargando datos críticos desde Firebase...');
        try {
          const user = window.currentUser || firebase.auth().currentUser;
          const uid = user ? user.uid : null;
          
          if (!uid) {
            console.warn('⚠️ No hay usuario logueado, usando caché');
            return { ventas: cachedVentas, clientes: cachedClientes };
          }

          const [ventasSnap, clientesSnap] = await Promise.all([
            firebaseDB.collection('ventas')
              .where('userId', '==', uid)
              .orderBy('fecha', 'desc')
              .limit(500)
              .get(),
            firebaseDB.collection('clientes')
              .where('userId', '==', uid)
              .limit(200)
              .get()
          ]);

          const ventas = ventasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          const clientes = clientesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          // Guardar en caché
          await Promise.all([
            saveToCache('ventas', ventas),
            saveToCache('clientes', clientes),
            updateCacheTimestamp('ventas'),
            updateCacheTimestamp('clientes')
          ]);

          return { ventas, clientes };
        } catch (err) {
          console.error('Error cargando datos críticos:', err);
          return { ventas: cachedVentas, clientes: cachedClientes };
        }
      },

      // Cargar datos secundarios en background
      loadSecondaryData: async () => {
        console.log('📦 Cargando datos secundarios en background...');
        
        try {
          const user = window.currentUser || firebase.auth().currentUser;
          const uid = user ? user.uid : null;
          
          if (!uid) {
            console.warn('⚠️ No hay usuario para cargar secundarios');
            return await getFromCache('productos');
          }

          const shouldRefresh = await shouldRefreshCache('productos', 10 * 60 * 1000);
          
          if (shouldRefresh) {
            const productosSnap = await firebaseDB.collection('productos')
              .where('userId', '==', uid)
              .get();
            const productos = productosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            
            await saveToCache('productos', productos);
            await updateCacheTimestamp('productos');
            
            return productos;
          } else {
            return await getFromCache('productos');
          }
        } catch (err) {
          console.error('Error cargando productos:', err);
          return await getFromCache('productos');
        }
      },

      // Obtener datos del caché con fallback
      getCachedData: async (collectionName) => {
        return await getFromCache(collectionName);
      },

      // Guardar datos en caché
      saveData: async (collectionName, data) => {
        await saveToCache(collectionName, data);
        await updateCacheTimestamp(collectionName);
      },

      // Limpiar caché
      clearCache: async () => {
        if (!dbInstance) return;
        
        return new Promise((resolve) => {
          const tx = dbInstance.transaction(
            ['clientes', 'productos', 'ventas', 'precios', 'metadata'],
            'readwrite'
          );
          
          ['clientes', 'productos', 'ventas', 'precios', 'metadata'].forEach(store => {
            tx.objectStore(store).clear();
          });
          
          tx.oncomplete = () => {
            console.log('🗑️ Caché limpiado');
            resolve();
          };
        });
      }
    };
  };

  // ─── OPTIMIZADOR DE RENDERIZADO ──────────────────────────
  const renderOptimizer = {
    // Debounce para actualizaciones frecuentes
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle para eventos de scroll
    throttle: (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Virtual scrolling para listas largas
    setupVirtualScroll: (container, itemHeight, renderItem) => {
      let scrollTop = 0;
      
      container.addEventListener('scroll', renderOptimizer.throttle(() => {
        scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight);
        
        // Renderizar solo items visibles + buffer
        const buffer = 5;
        const items = container.querySelectorAll('[data-index]');
        items.forEach(item => {
          const index = parseInt(item.dataset.index);
          if (index >= startIndex - buffer && index <= endIndex + buffer) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }, 50));
    },

    // Lazy load para imágenes
    setupLazyImages: () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }
  };

  // Agregar estilos para skeletons
  const addSkeletonStyles = () => {
    if (!document.getElementById('skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = `
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // ─── EXPORTAR FUNCIONES ─────────────────────────────────
  window.PerformanceOptimizer = {
    initDB,
    loadDataProgressive,
    renderOptimizer,
    createSkeletonKPI,
    createSkeletonChart,
    createSkeletonCards,
    addSkeletonStyles
  };

  // Inicializar estilos
  addSkeletonStyles();
})();
