// js/auth.js - Manejo de sesión multi-usuario

function initAuth() {
    const auth = firebase.auth();
    const authView = document.getElementById('authView');
    const appView = document.getElementById('appView');
    const splash = document.getElementById('splashScreen');

    // Si los elementos no existen, no hacer nada (el DOM puede estar incompleto)
    if (!authView || !appView) {
        console.warn("Elementos de autenticación no encontrados, pero continuando...");
        return;
    }

    // 1. Escuchar cambios de estado de autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            window.currentUser = user; // Guardar globalmente el usuario actual
            authView.classList.add('hidden');
            appView.classList.remove('hidden');
            if (splash) splash.classList.add('hidden');
            
            // Inicializar la app con los datos del usuario (esperar a que esté disponible)
            if (window.loadDataProgressive && typeof window.loadDataProgressive === 'function') {
                try {
                    await window.loadDataProgressive();
                } catch (err) {
                    console.error("Error en loadDataProgressive:", err);
                }
            } else {
                console.warn("loadDataProgressive aún no disponible, esperando...");
                // Esperar hasta que esté disponible (máximo 30 segundos)
                let attempts = 0;
                const waitForFunction = setInterval(() => {
                    if (window.loadDataProgressive && typeof window.loadDataProgressive === 'function') {
                        clearInterval(waitForFunction);
                        console.log("✅ loadDataProgressive disponible, ejecutando...");
                        window.loadDataProgressive().catch(err => console.error("Error cargando datos:", err));
                    }
                    attempts++;
                    if (attempts > 150) { // 30 segundos = 150 * 200ms
                        clearInterval(waitForFunction);
                        console.error("⏱️ Timeout esperando loadDataProgressive");
                    }
                }, 200);
            }
        } else {
            window.currentUser = null;
            authView.classList.remove('hidden');
            appView.classList.add('hidden');
            if (splash) splash.classList.add('hidden');
        }
    });

    // 2. Lógica de Login/Registro
    const loginForm = document.getElementById('loginForm');
    let isRegistering = false;

    // Toggle Mostrar Contraseña
    const showPassToggle = document.getElementById('showPassToggle');
    if (showPassToggle) {
        showPassToggle.addEventListener('change', (e) => {
            const passInput = document.getElementById('authPassword');
            if (passInput) passInput.type = e.target.checked ? 'text' : 'password';
        });
    }

    const switchLink = document.getElementById('switchToRegister');
    if (switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            const authTitle = document.getElementById('authTitle');
            const btnAuthMain = document.getElementById('btnAuthMain');
            const extraFields = document.getElementById('registerExtraFields');

            // Mostrar/Ocultar campos extra de registro
            if (extraFields) {
                if (isRegistering) {
                    extraFields.classList.remove('hidden');
                    extraFields.querySelectorAll('input').forEach(i => i.required = true);
                } else {
                    extraFields.classList.add('hidden');
                    extraFields.querySelectorAll('input').forEach(i => i.required = false);
                }
            }

            if (authTitle) authTitle.textContent = isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión';
            if (btnAuthMain) btnAuthMain.textContent = isRegistering ? 'Registrarse' : 'Entrar';
            switchLink.textContent = isRegistering ? 'Ya tengo cuenta, entrar' : 'Regístrate aquí';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const pass = document.getElementById('authPassword').value;
            
            // Micro-interacción: Estado de Carga
            const btn = document.getElementById('btnAuthMain');
            const btnText = btn.querySelector('.btn-text');
            const btnLoader = btn.querySelector('.btn-loader');
            const card = document.querySelector('.auth-card-premium');
            
            try {
                btn.disabled = true;
                btnText.classList.add('hidden');
                btnLoader.classList.remove('hidden');

                if (isRegistering) {
                    // 1. Crear usuario en Auth
                    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);

                    // --- VALIDACIONES ADICIONALES PARA REGISTRO ---
                    const regNombre = document.getElementById('regNombre').value.trim();
                    const regApellido = document.getElementById('regApellido').value.trim();
                    const regBirth = document.getElementById('regBirth').value;
                    const regTel = document.getElementById('regTel').value.trim();
                    const regDni = document.getElementById('regDni').value.trim();

                    // Validación de Nombre y Apellido
                    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
                    if (!regNombre || !nameRegex.test(regNombre)) {
                        showToast('El nombre es obligatorio y solo debe contener letras, espacios o guiones.', 'warning');
                        await userCredential.user.delete(); // Eliminar usuario de Auth si la validación falla
                        return;
                    }
                    if (!regApellido || !nameRegex.test(regApellido)) {
                        showToast('El apellido es obligatorio y solo debe contener letras, espacios o guiones.', 'warning');
                        await userCredential.user.delete();
                        return;
                    }

                    // Validación de Fecha de Nacimiento (mayor de 18 años)
                    if (!regBirth) {
                        showToast('La fecha de nacimiento es obligatoria.', 'warning');
                        await userCredential.user.delete();
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
                        showToast('Debes ser mayor de 18 años para registrarte.', 'warning');
                        await userCredential.user.delete();
                        return;
                    }

                    // Validación de Celular (formato peruano: 9 dígitos, empieza con 9)
                    const phoneRegex = /^9\d{8}$/;
                    if (!regTel || !phoneRegex.test(regTel)) {
                        showToast('El número de celular es obligatorio y debe ser un número de 9 dígitos que empiece con 9 (Perú).', 'warning');
                        await userCredential.user.delete();
                        return;
                    }

                    // Validación de DNI (8 dígitos numéricos)
                    const dniRegex = /^\d{8}$/;
                    if (!regDni || !dniRegex.test(regDni)) {
                        showToast('El DNI es obligatorio y debe contener exactamente 8 dígitos numéricos.', 'warning');
                        await userCredential.user.delete();
                        return;
                    }

                    // Validación de Contraseña (Firebase Auth ya valida mínimo 6, añadimos un máximo)
                    if (pass.length > 30) {
                        showToast('La contraseña no puede exceder los 30 caracteres.', 'warning');
                        await userCredential.user.delete();
                        return;
                    }
                    const user = userCredential.user;

                    // 2. Recopilar datos adicionales
                    const perfilAdicional = {
                        nombres: document.getElementById('regNombre').value,
                        apellidos: document.getElementById('regApellido').value,
                        fechaNacimiento: document.getElementById('regBirth').value,
                        telefono: regTel,
                        dni: regDni,
                        email: email,
                        userId: user.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    // 3. Guardar perfil en Firestore
                    await db.collection('profile').doc(user.uid).set(perfilAdicional);

                    if (window.showToast) window.showToast('Cuenta creada exitosamente', 'success');
                } else {
                    await auth.signInWithEmailAndPassword(email, pass);
                }
            } catch (err) {
                // Micro-interacción: Error Shake
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);

                if (window.showToast) window.showToast('Error: ' + err.message, 'error');
                console.error('Auth error:', err);
            } finally {
                btn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
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
    window.logout = () => {
        auth.signOut();
    };
}

// Ejecutar cuando Firebase esté listo y el DOM esté preparado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
