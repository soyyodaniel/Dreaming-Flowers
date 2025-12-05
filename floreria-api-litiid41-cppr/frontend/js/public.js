const API_URL = 'http://localhost:3000/api';
let currentPage = 1;
const limit = 9; // Tarjetas por página
let totalPages = 1; // Variable global para controlar el límite

// ==========================================
// 1. SEGURIDAD Y USUARIO
// ==========================================
const token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = 'login.html';
}

// LOGOUT
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// SALUDO INTELIGENTE
const userGreeting = document.getElementById('userGreeting');

async function initUserGreeting() {
    if (!userGreeting) return;

    if (user.nombre) {
        userGreeting.textContent = `Hola, ${user.nombre}`;
    } else {
        userGreeting.textContent = `Hola, ...`;
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const fullUser = result.data || result;

                if (fullUser.nombre) {
                    userGreeting.textContent = `Hola, ${fullUser.nombre}`;
                    const updatedUser = { ...user, ...fullUser };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    user = updatedUser;
                }
            }
        } catch (error) {
            console.error("Error nombre usuario", error);
            userGreeting.textContent = `Hola, Visitante`;
        }
    }
}

// ==========================================
// 2. CARGAR FLORERÍAS
// ==========================================
async function loadGallery(page = 1, search = '', cityId = '') {
    const grid = document.getElementById('flowersGrid');

    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Spinner de carga
    grid.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-2 text-muted">Cargando página ${page}...</p>
        </div>`;

    try {
        let url = `${API_URL}/florerias?page=${page}&limit=${limit}&estatus=1`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (cityId) url += `&id_ciudad=${cityId}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar datos');

        const result = await response.json();

        // 1. Encontrar el array de florerías
        let florerias = [];
        if (Array.isArray(result)) florerias = result;
        else if (Array.isArray(result.data)) florerias = result.data;
        else if (result.data && Array.isArray(result.data.florerias)) florerias = result.data.florerias;
        else if (result.florerias && Array.isArray(result.florerias)) florerias = result.florerias;

        // 2. Encontrar el TOTAL (Crucial para paginación)
        let totalItems = 0;
        if (result.total !== undefined) totalItems = result.total;
        else if (result.data && result.data.total !== undefined) totalItems = result.data.total;
        else if (result.meta && result.meta.total !== undefined) totalItems = result.meta.total;
        else {
            // Fallback de emergencia
            if (florerias.length === limit) {
                totalItems = (page * limit) + 1;
            } else {
                totalItems = florerias.length + ((page - 1) * limit);
            }
        }

        renderCards(florerias);
        updatePagination(page, totalItems);

    } catch (error) {
        console.error(error);
        grid.innerHTML = `<div class="col-12 text-center py-5 text-muted"><h3>🥀</h3><p>Error de conexión.</p></div>`;
    }
}

// ==========================================
// 3. RENDERIZAR TARJETAS
// ==========================================
function renderCards(florerias) {
    const grid = document.getElementById('flowersGrid');
    grid.innerHTML = '';

    if (!florerias || florerias.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><h4>No se encontraron más resultados 🍃</h4></div>`;
        return;
    }

    florerias.forEach(f => {
        const imgUrl = f.logo_url
            ? `http://localhost:3000${f.logo_url}`
            : 'https://images.unsplash.com/photo-1596068582737-27e1f6a157d6?auto=format&fit=crop&w=500&q=60';

        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="flower-card shadow-sm h-100 position-relative">
                    <span class="status-badge text-success">
                        <i class="fas fa-check-circle"></i> Disponible
                    </span>
                    <img src="${imgUrl}" class="card-img-top" alt="${f.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${f.nombre}</h5>
                        <p class="card-text text-muted small flex-grow-1">
                            ${f.descripcion ? f.descripcion.substring(0, 80) + '...' : 'Sin descripción.'}
                        </p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${f.ciudad_nombre || 'Ver mapa'}</small>
                            <button class="btn btn-details w-auto px-4" onclick='openDetails(${JSON.stringify(f)})'>
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// ==========================================
// 4. PAGINACIÓN
// ==========================================
function updatePagination(page, total) {
    totalPages = Math.ceil(total / limit);
    currentPage = page;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// Listeners fijos
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadGallery(currentPage - 1, getSearchVal(), getCityVal());
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadGallery(currentPage + 1, getSearchVal(), getCityVal());
        }
    });
}

// ==========================================
// 5. HELPERS Y FILTROS
// ==========================================
const getSearchVal = () => document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
const getCityVal = () => document.getElementById('cityFilter') ? document.getElementById('cityFilter').value : '';

const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadGallery(1, getSearchVal(), getCityVal());
    });
}

const cityFilter = document.getElementById('cityFilter');
if (cityFilter) {
    cityFilter.addEventListener('change', () => {
        loadGallery(1, getSearchVal(), getCityVal());
    });
}

// ==========================================
// 6. MODAL DE DETALLES Y RULETA
// ==========================================
window.openDetails = function (f) {
    document.getElementById('modalTitle').textContent = f.nombre;
    document.getElementById('modalDesc').textContent = f.descripcion || 'Sin descripción';
    document.getElementById('modalAddress').textContent = f.direccion || f.ubicacion || 'No especificada';
    document.getElementById('modalPhone').textContent = f.telefono || 'No disponible';
    document.getElementById('modalEmail').textContent = f.correo_electronico || f.email || 'No disponible';
    document.getElementById('modalSchedule').textContent = f.horarios || f.horario || 'No especificado';
    document.getElementById('modalCity').textContent = f.ciudad_nombre || '';

    const imgUrl = f.logo_url ? `http://localhost:3000${f.logo_url}` : 'https://via.placeholder.com/500x300?text=Dreaming+Flowers';
    document.getElementById('modalImg').src = imgUrl;

    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}

// NUEVO: Funciones para la Ruleta
window.openSurpriseModal = function () {
    const modal = new bootstrap.Modal(document.getElementById('surpriseModal'));
    // Limpiar resultado anterior
    document.getElementById('surpriseResult').innerHTML = '';
    document.getElementById('surpriseResult').classList.add('d-none');
    modal.show();
}

// NUEVO: Transición suave de Ruleta a Detalles
window.openDetailsFromSurprise = function (f) {
    // 1. Identificar y cerrar la ruleta
    const surpriseEl = document.getElementById('surpriseModal');
    const surpriseModal = bootstrap.Modal.getInstance(surpriseEl);
    if (surpriseModal) {
        surpriseModal.hide();
    }

    // 2. Esperar 400ms (tiempo que tarda la animación de Bootstrap)
    // Esto evita que los modales choquen o que la pantalla negra (backdrop) se quede pegada
    setTimeout(() => {
        openDetails(f);
    }, 400);
}

window.spinRoulette = async function () {
    const cityId = document.getElementById('surpriseCity').value;
    if (!cityId) {
        alert("⚠️ Por favor, selecciona una ciudad primero.");
        return;
    }

    const resultDiv = document.getElementById('surpriseResult');
    resultDiv.classList.remove('d-none');
    resultDiv.innerHTML = '<div class="spinner-border text-danger" role="status"></div><p>Buscando la mejor opción...</p>';

    try {
        const response = await fetch(`${API_URL}/florerias?id_ciudad=${cityId}&limit=50&estatus=1`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();

        let list = [];
        if (Array.isArray(json)) list = json;
        else if (Array.isArray(json.data)) list = json.data;
        else if (json.data?.florerias) list = json.data.florerias;

        if (list.length === 0) {
            resultDiv.innerHTML = '<p class="text-muted">No encontramos florerías en esta ciudad 😢</p>';
            return;
        }

        const winner = list[Math.floor(Math.random() * list.length)];

        setTimeout(() => {
            const imgUrl = winner.logo_url
                ? `http://localhost:3000${winner.logo_url}`
                : 'https://images.unsplash.com/photo-1596068582737-27e1f6a157d6?auto=format&fit=crop&w=150&q=60';

            resultDiv.innerHTML = `
                <div class="card border-0 shadow-sm mt-3 animate__animated animate__zoomIn">
                    <div class="card-body">
                        <h5 class="text-muted text-uppercase small">¡Tu match perfecto es!</h5>
                        <img src="${imgUrl}" class="rounded-circle my-3 shadow-sm" width="100" height="100" style="object-fit:cover">
                        <h3 class="fw-bold" style="color: #d63384;">${winner.nombre}</h3>
                        <p class="small text-muted mb-3">${winner.descripcion ? winner.descripcion.substring(0, 60) + '...' : ''}</p>
                        <!-- AQUÍ ESTÁ EL CAMBIO: Llamamos a la función de transición -->
                        <button class="btn btn-outline-danger rounded-pill w-100" onclick='openDetailsFromSurprise(${JSON.stringify(winner)})'>
                            Ver Detalles Completos
                        </button>
                    </div>
                </div>
            `;
        }, 1000);

    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = '<p class="text-danger">Error consultando el oráculo floral.</p>';
    }
}

// Inicializar
initUserGreeting();
loadGallery();