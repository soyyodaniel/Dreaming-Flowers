const API_URL = 'http://localhost:3000/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Elementos del DOM
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('button[type="submit"]');

    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    // 1. Limpiar estados
    errorAlert.classList.add('d-none');
    successAlert.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando cuenta...';

    try {
        // 2. Preparar datos (El rol 'user' se asigna por defecto en el backend)
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        // 3. Enviar petición
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        // 4. Éxito
        successAlert.textContent = '¡Cuenta creada con éxito! Redirigiendo al login...';
        successAlert.classList.remove('d-none');

        // Limpiar formulario
        document.getElementById('registerForm').reset();

        // 5. Redirigir después de 1.5 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Error de registro:', error);
        errorAlert.textContent = error.message;
        errorAlert.classList.remove('d-none');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrarse';
    }
});