const API_URL = 'http://localhost:3000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Referencias a elementos del DOM
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorAlert = document.getElementById('errorAlert');
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // 1. Resetear estado UI (Ocultar alertas y bloquear botón)
    errorAlert.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';

    try {
        // 2. Petición de Login
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        // 3. Extracción robusta del Token y Usuario
        // Busca en la raíz o dentro de una propiedad 'data' (por si el backend usa envoltorios)
        const token = data.token || (data.data ? data.data.token : null);
        let user = data.user || (data.data ? data.data.user : null);

        if (!token) {
            throw new Error("Error de comunicación: No se recibió el token de acceso.");
        }

        // 4. Guardar Token
        localStorage.setItem('token', token);

        // 5. Verificar Usuario (Si el login no lo devolvió, consultamos el perfil)
        if (!user) {
            const profileResponse = await fetch(`${API_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (profileResponse.ok) {
                const profileResult = await profileResponse.json();
                user = profileResult.data || profileResult;
            } else {
                throw new Error("No se pudo obtener la información del perfil.");
            }
        }

        // 6. Guardar Usuario y Redireccionar
        if (user) {
            // Normalizar usuario (por si la BD devuelve un array de un solo elemento)
            const finalUser = Array.isArray(user) ? user[0] : user;

            localStorage.setItem('user', JSON.stringify(finalUser));

            // Determinar redirección según el rol
            const role = finalUser.rol || finalUser.role;

            if (role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // Fallback de seguridad
            window.location.href = 'index.html';
        }

    } catch (error) {
        console.error('Login Error:', error);

        // Mostrar mensaje de error al usuario
        errorAlert.textContent = error.message;
        errorAlert.classList.remove('d-none');

        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});