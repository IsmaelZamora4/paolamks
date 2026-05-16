// firebase.js - Configuración Real de Firebase

const firebaseConfig = {
  apiKey: "AIzaSyAFhoRGUYD4ZquNd30jm-jKYs-KBjjc2YE",
  authDomain: "paola-mks.firebaseapp.com",
  projectId: "paola-mks",
  storageBucket: "paola-mks.firebasestorage.app",
  messagingSenderId: "481933797778",
  appId: "1:481933797778:web:5e97b15a26b60abb87f94b",
  measurementId: "G-582KTMJQ4P"
};

// Inicialización compatible
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// 🔥 HABILITAR PERSISTENCIA OFFLINE (reduce lecturas)
db.enablePersistence()
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistencia no disponible: múltiples pestañas abiertas');
    } else {
      console.warn('Error al habilitar persistencia:', err);
    }
  });

// Conectamos con app.js
window.db = db;
window.storage = storage;
window.auth = auth;

// Autenticación anónima (necesaria para uploads a Storage)
auth.signInAnonymously().catch(err => {
  console.warn('Auth anónima falló (continuando de todas formas):', err.message);
});

// Avisamos que el sistema está listo
window.dispatchEvent(new CustomEvent('firebase-ready'));

console.log('%cCONECTADO A FIREBASE REAL CON PERSISTENCIA', 'color: blue; font-weight: bold;');