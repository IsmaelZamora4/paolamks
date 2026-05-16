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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

db.enablePersistence()
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistencia no disponible: múltiples pestañas abiertas');
    } else {
      console.warn('Error al habilitar persistencia:', err);
    }
  });

window.db = db;
window.storage = storage;
window.auth = auth;

auth.signInAnonymously().catch(err => {
  console.warn('Auth anónima falló (continuando de todas formas):', err.message);
});

window.dispatchEvent(new CustomEvent('firebase-ready'));
console.log('%cCONECTADO A FIREBASE REAL CON PERSISTENCIA', 'color: blue; font-weight: bold;');