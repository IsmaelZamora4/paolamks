// ============================================================
// firestore-optimizations.js — Optimizaciones de Firestore
// Índices, límites de datos, queries eficientes
// ============================================================

/**
 * GUÍA DE OPTIMIZACIÓN DE FIRESTORE
 * 
 * Para acelerar las queries, sigue estos pasos en Firebase Console:
 * 
 * 1. CREAR ÍNDICES:
 *    - Colección: ventas
 *      Índices:
 *      - fecha (DESC) - para queries ordenadas
 *      - clienteId + fecha (DESC) - para filtrar por cliente
 *      - mesCompra (ASC) - para agrupar por mes
 * 
 *    - Colección: clientes
 *      Índices:
 *      - activo (ASC) - para filtrar clientes activos
 *      - nombre (ASC) - para búsquedas
 * 
 *    - Colección: precios
 *      Índices:
 *      - clienteId (ASC) - para obtener precios rápido
 * 
 * 2. USAR PAGINACIÓN:
 *    - Evitar cargar todos los documentos a la vez
 *    - Cargar en batches de 500-1000 documentos
 * 
 * 3. LIMITAR CAMPOS:
 *    - Usar select() para cargar solo campos necesarios
 *    - Ejemplo: db.collection('ventas').select('clienteId', 'cantidad', 'fecha')
 * 
 * 4. CACHÉ LOCAL:
 *    - Activado por defecto en Firebase SDK
 *    - Primeras lecturas desde server, después desde caché
 * 
 * 5. DESACTIVA ESCUCHA INNECESARIA:
 *    - No usar onSnapshot() en todas partes
 *    - Usar get() solo cuando sea necesario
 */

(function() {
  'use strict';

  // ─── OPTIMIZADORES DE QUERY ──────────────────────────────

  const QueryOptimizer = {
    /**
     * Cargar datos con paginación
     * @param {Firebase DB} db
     * @param {string} collectionName
     * @param {number} pageSize
     */
    paginatedQuery: async (db, collectionName, pageSize = 500) => {
      let allDocs = [];
      let lastDoc = null;
      let hasMore = true;

      while (hasMore) {
        let query = db.collection(collectionName).limit(pageSize);
        
        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        allDocs = allDocs.concat(docs);
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        hasMore = snapshot.docs.length === pageSize;

        console.log(`📄 Cargados ${allDocs.length} documentos de ${collectionName}`);
      }

      return allDocs;
    },

    /**
     * Cargar solo campos específicos (más rápido)
     * @param {Firebase DB} db
     * @param {string} collectionName
     * @param {array} fields
     */
    selectiveQuery: async (db, collectionName, fields = []) => {
      const snapshot = await db.collection(collectionName)
        .select(...fields)
        .get();
      
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Query con índice optimizado
     * @param {Firebase DB} db
     * @param {string} collectionName
     * @param {array} filters - [{ field, operator, value }]
     * @param {object} orderBy
     * @param {number} limit
     */
    optimizedQuery: async (db, collectionName, filters = [], orderBy = null, limit = 500) => {
      let query = db.collection(collectionName);

      // Aplicar filtros
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator || '==', filter.value);
      });

      // Aplicar orden
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }

      // Aplicar límite
      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Batch reads para múltiples documentos
     * @param {Firebase DB} db
     * @param {array} refs - Array de referencias a documentos
     */
    batchRead: async (db, refs) => {
      const batches = [];
      for (let i = 0; i < refs.length; i += 100) {
        batches.push(refs.slice(i, i + 100));
      }

      let results = [];
      for (const batch of batches) {
        const docs = await Promise.all(
          batch.map(ref => ref.get())
        );
        results = results.concat(docs.map(d => ({ id: d.id, ...d.data() })));
      }

      return results;
    }
  };

  // ─── AGREGACIONES RÁPIDAS ────────────────────────────────

  const AggregationHelper = {
    /**
     * Sumar campo en colección (más rápido con datos cacheados)
     */
    sumField: (docs, fieldName) => {
      return docs.reduce((sum, doc) => sum + (parseFloat(doc[fieldName]) || 0), 0);
    },

    /**
     * Contar documentos con filtro
     */
    countWith: (docs, filterFn) => {
      return docs.filter(filterFn).length;
    },

    /**
     * Agrupar documentos por campo
     */
    groupBy: (docs, fieldName) => {
      return docs.reduce((groups, doc) => {
        const key = doc[fieldName];
        if (!groups[key]) groups[key] = [];
        groups[key].push(doc);
        return groups;
      }, {});
    },

    /**
     * Obtener valor máximo
     */
    maxBy: (docs, fieldName) => {
      return docs.reduce((max, doc) => {
        const val = parseFloat(doc[fieldName]) || 0;
        return val > max ? val : max;
      }, 0);
    },

    /**
     * Obtener valor mínimo
     */
    minBy: (docs, fieldName) => {
      return docs.reduce((min, doc) => {
        const val = parseFloat(doc[fieldName]) || 0;
        return val < min ? val : min;
      }, Infinity);
    }
  };

  // ─── CACHÉ ESTRATÉGICO ──────────────────────────────────

  const StrategicCache = {
    // Caché en memoria con TTL
    memoryCache: new Map(),

    /**
     * Guardar en caché con tiempo de expiración
     */
    set: (key, value, ttlMs = 5 * 60 * 1000) => {
      StrategicCache.memoryCache.set(key, {
        value,
        expires: Date.now() + ttlMs
      });
    },

    /**
     * Obtener del caché
     */
    get: (key) => {
      const cached = StrategicCache.memoryCache.get(key);
      if (!cached) return null;

      if (Date.now() > cached.expires) {
        StrategicCache.memoryCache.delete(key);
        return null;
      }

      return cached.value;
    },

    /**
     * Limpiar caché expirado
     */
    cleanup: () => {
      const now = Date.now();
      for (const [key, { expires }] of StrategicCache.memoryCache) {
        if (now > expires) {
          StrategicCache.memoryCache.delete(key);
        }
      }
    },

    /**
     * Vaciar todo el caché
     */
    clear: () => {
      StrategicCache.memoryCache.clear();
    }
  };

  // ─── MONITOREO DE PERFORMANCE ───────────────────────────

  const PerformanceMonitor = {
    metrics: {
      queries: [],
      renders: [],
      events: []
    },

    /**
     * Registrar tiempo de query
     */
    recordQuery: (name, duration, docCount) => {
      PerformanceMonitor.metrics.queries.push({
        name,
        duration,
        docCount,
        timestamp: Date.now()
      });

      if (duration > 1000) {
        console.warn(`⚠️ Query lenta: ${name} (${duration}ms, ${docCount} docs)`);
      } else {
        console.log(`✅ Query: ${name} (${duration}ms, ${docCount} docs)`);
      }
    },

    /**
     * Registrar tiempo de renderizado
     */
    recordRender: (name, duration) => {
      PerformanceMonitor.metrics.renders.push({
        name,
        duration,
        timestamp: Date.now()
      });

      if (duration > 200) {
        console.warn(`⚠️ Render lento: ${name} (${duration}ms)`);
      }
    },

    /**
     * Obtener reporte de performance
     */
    report: () => {
      const queryAvg = PerformanceMonitor.metrics.queries.reduce((a, q) => a + q.duration, 0) / PerformanceMonitor.metrics.queries.length || 0;
      const renderAvg = PerformanceMonitor.metrics.renders.reduce((a, r) => a + r.duration, 0) / PerformanceMonitor.metrics.renders.length || 0;

      console.group('📊 REPORTE DE PERFORMANCE');
      console.log(`Queries: ${PerformanceMonitor.metrics.queries.length} (promedio: ${queryAvg.toFixed(0)}ms)`);
      console.log(`Renders: ${PerformanceMonitor.metrics.renders.length} (promedio: ${renderAvg.toFixed(0)}ms)`);
      console.log(`Eventos: ${PerformanceMonitor.metrics.events.length}`);
      console.groupEnd();
    },

    /**
     * Limpiar métricas
     */
    reset: () => {
      PerformanceMonitor.metrics = { queries: [], renders: [], events: [] };
    }
  };

  // ─── WORKER PARA PROCESAMIENTO PESADO (opcional) ─────────

  const WorkerOptimizer = {
    /**
     * Procesar datos pesados sin bloquear UI
     */
    processInBackground: async (data, processFn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = processFn(data);
          resolve(result);
        }, 0);
      });
    }
  };

  // ─── EXPORTAR ────────────────────────────────────────────

  window.FirestoreOptimizations = {
    QueryOptimizer,
    AggregationHelper,
    StrategicCache,
    PerformanceMonitor,
    WorkerOptimizer
  };

  console.log('🚀 Firestore Optimizations cargadas');
})();
