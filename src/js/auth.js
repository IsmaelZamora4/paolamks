// js/auth.js - Manejo de sesión multi-usuario

function initAuth() {
    const auth = firebase.auth();
    const authView = document.getElementById('authView');
    const appView = document.getElementById('appView');
    const splash = document.getElementById('splashScreen');

    // 1. Escuchar cambios de estado de autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            window.currentUser = user; // Guardar globalmente el usuario actual
            
            const path = window.location.pathname;
            // Si el usuario ya está logueado y está en páginas de acceso público (como login o register), redirigirlo al dashboard
            const isPublicPage = path === '/login' || path === '/register' || path.includes('login.html') || path.includes('register.html') || path === '/' || path.endsWith('index.html');
            
            if (isPublicPage) {
                // Redirigir al dashboard. Vercel cargará dashboard.html y app.js manejará el resto.
                window.location.assign('/dashboard/inicio');
                return;
            }

            if (authView) authView.classList.add('hidden');
            if (appView) appView.classList.remove('hidden');
            if (splash) splash.classList.add('hidden');
            
            // Disparar el enrutador una vez que sabemos que hay un usuario
            if (typeof handleRoute === 'function') handleRoute();
            
            // Inicializar la app con los datos del usuario (esperar a que esté disponible)
            const initData = async () => {
                if (window.loadDataProgressive) {
                    await window.loadDataProgressive().catch(e => console.error("Error cargando datos:", e));
                    return true;
                }
                return false;
            };

            if (!await initData()) {
                let attempts = 0;
                const checkInterval = setInterval(async () => {
                    if (await initData()) clearInterval(checkInterval);
                    attempts++;
                    if (attempts > 150) { // 30 segundos
                        clearInterval(checkInterval);
                        console.error("⏱️ Timeout esperando loadDataProgressive");
                    }
                }, 100);
            }
        } else {
            window.currentUser = null;
            
            // Limpieza de datos en la caché local al perder la sesión (ej. token expirado)
            if (window.PerformanceOptimizer && typeof window.PerformanceOptimizer.clearCache === 'function') {
                window.PerformanceOptimizer.clearCache().catch(console.error);
            }

            // Si intentamos acceder a una página restringida (como el dashboard) sin estar logueados, redirigir al login
            const path = window.location.pathname;
            if (path.includes('/dashboard') || path === '/dashboard') {
                window.location.replace('/login');
                return;
            }
            
            if (authView) authView.classList.remove('hidden');
            if (appView) appView.classList.add('hidden');
            if (splash) splash.classList.add('hidden');
        }
    });

    // 2. Lógica de Login/Registro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle Mostrar Contraseña
    const showPassToggle = document.getElementById('showPassToggle');
    if (showPassToggle) {
        showPassToggle.addEventListener('change', (e) => {
            const passInput = document.getElementById('authPassword');
            if (passInput) passInput.type = e.target.checked ? 'text' : 'password';
        });
    }

    // Forgot Password Handler
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value.trim();
            if (!email) {
                if (window.showToast) window.showToast('Por favor, ingresa tu correo primero.', 'warning');
                else alert('Por favor, ingresa tu correo primero.');
                return;
            }
            try {
                await auth.sendPasswordResetEmail(email);
                if (window.showToast) window.showToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.', 'success');
            } catch (err) {
                console.error("Error al enviar reset:", err);
                if (window.showToast) window.showToast('Error: ' + err.message, 'error');
            }
        });
    }

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value.trim();
            const pass = document.getElementById('authPassword').value;
            
            // Micro-interacción: Estado de Carga
            const btn = document.getElementById('btnAuthMain');
            const btnText = btn.querySelector('.btn-text');
            const btnLoader = btn.querySelector('.btn-loader');
            const card = document.querySelector('.auth-card-premium') || document.querySelector('.auth-card');
            
            try {
                btn.disabled = true;
                if (btnText) btnText.classList.add('hidden');
                if (btnLoader) btnLoader.classList.remove('hidden');

                await auth.signInWithEmailAndPassword(email, pass);
            } catch (err) {
                // Micro-interacción: Error Shake
                if (card) card.classList.add('shake');
                setTimeout(() => card && card.classList.remove('shake'), 500);

                let errorMsg = 'Error al procesar la solicitud';

                // Manejo de errores específicos de Firebase Auth
                switch (err.code) {
                    case 'auth/wrong-password':
                        errorMsg = '⚠️ Contraseña incorrecta. Por favor, verifícala e inténtalo de nuevo.';
                        break;
                    case 'auth/user-not-found':
                        errorMsg = '⚠️ No existe una cuenta registrada con este correo electrónico.';
                        break;
                    case 'auth/invalid-email':
                        errorMsg = '⚠️ El formato del correo electrónico no es válido.';
                        break;
                    case 'auth/too-many-requests':
                        errorMsg = '⚠️ Demasiados intentos fallidos. Inténtalo más tarde.';
                        break;
                    default:
                        errorMsg = 'Error: ' + err.message;
                }

                if (window.showToast) {
                    window.showToast(errorMsg, 'error');
                } else {
                    alert(errorMsg);
                }
                
                console.error('Auth error:', err);
            } finally {
                btn.disabled = false;
                if (btnText) btnText.classList.remove('hidden');
                if (btnLoader) btnLoader.classList.add('hidden');
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value.trim();
            const pass = document.getElementById('authPassword').value;
            
            const btn = document.getElementById('btnAuthMain');
            const btnText = btn.querySelector('.btn-text');
            const btnLoader = btn.querySelector('.btn-loader');
            const card = document.querySelector('.auth-card-premium');
            
            try {
                btn.disabled = true;
                if (btnText) btnText.classList.add('hidden');
                if (btnLoader) btnLoader.classList.remove('hidden');

                // --- VALIDACIONES ADICIONALES PARA REGISTRO ---
                const regNombre = document.getElementById('regNombre').value.trim();
                const regApellido = document.getElementById('regApellido').value.trim();
                const regBirth = document.getElementById('regBirth').value;
                const regTel = document.getElementById('regTel').value.trim();
                const regDni = document.getElementById('regDni').value.trim();

                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
                if (!regNombre || !nameRegex.test(regNombre)) {
                    if (window.showToast) window.showToast('El nombre es obligatorio y solo debe contener letras, espacios o guiones.', 'warning');
                    return;
                }
                if (!regApellido || !nameRegex.test(regApellido)) {
                    if (window.showToast) window.showToast('El apellido es obligatorio y solo debe contener letras.', 'warning');
                    return;
                }

                if (!regBirth) {
                    if (window.showToast) window.showToast('La fecha de nacimiento es obligatoria.', 'warning');
                    return;
                }
                const birthDate = new Date(regBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 18) {
                    if (window.showToast) window.showToast('Debes ser mayor de 18 años para registrarte.', 'warning');
                    return;
                }

                const phoneRegex = /^9\d{8}$/;
                if (!regTel || !phoneRegex.test(regTel)) {
                    if (window.showToast) window.showToast('El número de celular es obligatorio y debe ser un número de 9 dígitos que empiece con 9 (Perú).', 'warning');
                    return;
                }

                const dniRegex = /^\d{8}$/;
                if (!regDni || !dniRegex.test(regDni)) {
                    if (window.showToast) window.showToast('El DNI es obligatorio y debe contener exactamente 8 dígitos numéricos.', 'warning');
                    return;
                }

                if (pass.length > 30) {
                    if (window.showToast) window.showToast('La contraseña no puede exceder los 30 caracteres.', 'warning');
                    return;
                }

                // 1. Crear usuario en Auth
                const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
                const user = userCredential.user;

                // 2. Recopilar datos adicionales
                const perfilAdicional = {
                    nombres: regNombre,
                    apellidos: regApellido,
                    fechaNacimiento: regBirth,
                    telefono: regTel,
                    dni: regDni,
                    email: email,
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                // 3. Guardar perfil en Firestore
                await db.collection('profile').doc(user.uid).set(perfilAdicional);

                if (window.showToast) window.showToast('Cuenta creada exitosamente', 'success');
            } catch (err) {
                if (card) card.classList.add('shake');
                setTimeout(() => card && card.classList.remove('shake'), 500);

                let errorMsg = 'Error al procesar la solicitud';
                if (err.code === 'auth/email-already-in-use') errorMsg = '⚠️ Ya existe una cuenta con este correo.';
                else if (err.code === 'auth/weak-password') errorMsg = '⚠️ La contraseña debe tener al menos 6 caracteres.';
                else errorMsg = 'Error: ' + err.message;

                if (window.showToast) window.showToast(errorMsg, 'error');
                else alert(errorMsg);
                console.error('Auth error:', err);
            } finally {
                btn.disabled = false;
                if (btnText) btnText.classList.remove('hidden');
                if (btnLoader) btnLoader.classList.add('hidden');
            }
        });
    }

    const googleBtn = document.getElementById('btnGoogleAuth');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                await auth.signInWithPopup(provider);
            } catch (err) {
                if (window.showToast) window.showToast('Error con Google: ' + err.message, 'error');
                console.error('Google auth error:', err);
            }
        });
    }

    // 3. Logout
    window.logout = async () => {
        if (window.PerformanceOptimizer && typeof window.PerformanceOptimizer.clearCache === 'function') {
            await window.PerformanceOptimizer.clearCache();
        }
        await auth.signOut();
    };
}

// Ejecutar cuando Firebase esté listo y el DOM esté preparado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}