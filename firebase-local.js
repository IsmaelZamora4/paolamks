// MODO DEMO - Firebase simulado localmente

class MockQuery {
  constructor(docs) {
    this.docs = docs;
  }
  async get() {
    return { docs: this.docs, empty: this.docs.length === 0 };
  }
}

class MockDB {
  constructor() {
    this.data = {
      clientes: {},
      productos: {},
      precios: {},
      ventas: {},
      settings: {}
    };
    this.init();
  }

  init() {
    if (window.mockData) {
      window.mockData.clientes.forEach(c => {
        this.data.clientes[c.id] = { ...c };
      });
      window.mockData.productos.forEach(p => {
        this.data.productos[p.id] = { ...p };
      });
      window.mockData.precios.forEach(pr => {
        const key = pr.clienteId + '_' + pr.productoId;
        this.data.precios[key] = { ...pr };
      });
      window.mockData.ventas.forEach((v, i) => {
        const key = 'v_' + i;
        this.data.ventas[key] = { ...v, fechaVenta: new Date(v.fechaVenta), fechaVencimiento: v.fechaVencimiento ? new Date(v.fechaVencimiento) : null };
      });
    }
  }

  collection(name) {
    const self = this;
    return {
      doc: (id) => ({
        get: async () => {
          const d = self.data[name] && self.data[name][id];
          return { exists: !!d, data: () => d ? { ...d } : {}, id };
        },
        set: async (data) => {
          if (!self.data[name]) self.data[name] = {};
          self.data[name][id] = { ...data };
        }
      }),
      get: async () => {
        const docs = Object.entries(self.data[name] || {}).map(([k, v]) => ({
          id: k, data: () => ({ ...v }), exists: true
        }));
        return { docs, empty: docs.length === 0 };
      },
      add: async (data) => {
        if (!self.data[name]) self.data[name] = {};
        const id = 'doc_' + Date.now() + '_' + Math.random();
        self.data[name][id] = { ...data };
        return { id };
      },
      where: (field, op, val) => {
        const filterAndOrder = (sortField, sortDir, limit) => {
          let results = Object.entries(self.data[name] || {})
            .filter(([k, doc]) => doc[field] === val)
            .map(([k, doc]) => ({ id: k, data: () => ({ ...doc }), exists: true }));
          
          if (sortField) {
            results = results.sort((a, b) => {
              const av = a.data()[sortField];
              const bv = b.data()[sortField];
              if (!av || !bv) return 0;
              return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
            });
          }
          
          if (limit) results = results.slice(0, limit);
          return results;
        };

        return {
          orderBy: (sortField, sortDir) => ({
            limit: (limit) => new MockQuery(filterAndOrder(sortField, sortDir, limit)),
            get: async () => {
              const docs = filterAndOrder(sortField, sortDir);
              return { docs, empty: docs.length === 0 };
            }
          }),
          limit: (limit) => new MockQuery(filterAndOrder(null, null, limit)),
          get: async () => {
            const docs = filterAndOrder(null, null);
            return { docs, empty: docs.length === 0 };
          },
          where: (field2, op2, val2) => ({
            limit: (limit) => {
              const results = Object.entries(self.data[name] || {})
                .filter(([k, doc]) => doc[field] === val && doc[field2] === val2)
                .map(([k, doc]) => ({ id: k, data: () => ({ ...doc }), exists: true }))
                .slice(0, limit);
              return new MockQuery(results);
            },
            orderBy: (sortField, sortDir) => ({
              limit: (limit) => {
                let results = Object.entries(self.data[name] || {})
                  .filter(([k, doc]) => doc[field] === val && doc[field2] === val2)
                  .map(([k, doc]) => ({ id: k, data: () => ({ ...doc }), exists: true }));
                
                results = results.sort((a, b) => {
                  const av = a.data()[sortField];
                  const bv = b.data()[sortField];
                  if (!av || !bv) return 0;
                  return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
                });
                
                return new MockQuery(results.slice(0, limit));
              }
            }),
            get: async () => {
              const docs = Object.entries(self.data[name] || {})
                .filter(([k, doc]) => doc[field] === val && doc[field2] === val2)
                .map(([k, doc]) => ({ id: k, data: () => ({ ...doc }), exists: true }));
              return { docs, empty: docs.length === 0 };
            }
          })
        };
      },
      orderBy: (sortField, sortDir) => ({
        limit: (limit) => {
          let results = Object.entries(self.data[name] || {})
            .map(([k, v]) => ({ id: k, data: () => ({ ...v }), exists: true }));
          
          results = results.sort((a, b) => {
            const av = a.data()[sortField];
            const bv = b.data()[sortField];
            if (!av || !bv) return 0;
            return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
          });
          
          return new MockQuery(results.slice(0, limit));
        }
      })
    };
  }
}

class MockStorage {
  constructor() {
    this.files = {};
  }
  ref() {
    const self = this;
    return {
      child: (path) => ({
        put: async (file) => { self.files[path] = file; },
        getDownloadURL: async () => URL.createObjectURL(self.files[path])
      })
    };
  }
}

function initFirebase() {
  window.db = new MockDB();
  window.storage = new MockStorage();
  console.log('%cMODO DEMO ACTIVO', 'color: green; font-weight: bold; font-size: 14px');
  window.dispatchEvent(new CustomEvent('firebase-ready'));
}

function waitForMockData(attempts = 0) {
  if (window.mockData) {
    initFirebase();
  } else if (attempts < 50) {
    setTimeout(() => waitForMockData(attempts + 1), 100);
  }
}

waitForMockData();
