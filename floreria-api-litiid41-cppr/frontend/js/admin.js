const API_URL = 'http://localhost:3000/api';
let currentPage = 1;
const limit = 10;
let totalPages = 1;
let globalTotalRecords = 0; // Variable para guardar el total real

// ==========================================
// 1. SEGURIDAD Y NAVBAR
// ==========================================
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) window.location.href = 'login.html';

document.getElementById('userNameDisplay').textContent = `${user.nombre || 'Admin'}`;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// ==========================================
// 2. ESTADÍSTICAS (Ahora guarda el total global)
// ==========================================
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/florerias/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error stats');
        const data = await response.json();
        const stats = data.data || data;

        // Guardamos los valores reales
        const total = Number(stats.total) || 0;
        const activas = Number(stats.activas) || 0;
        const inactivas = Number(stats.inactivas) || 0;

        // Guardamos el total en la variable global para usarlo en la tabla
        globalTotalRecords = total;

        animateValue("totalFlorerias", 0, total, 1000);
        animateValue("activeFlorerias", 0, activas, 1000);
        animateValue("inactiveFlorerias", 0, inactivas, 1000);
    } catch (e) { console.error(e); }
}

function animateValue(id, start, end, duration) {
    if (start === end) {
        const el = document.getElementById(id);
        if (el) el.textContent = end;
        return;
    }
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const obj = document.getElementById(id);
    if (!obj) return;

    const timer = setInterval(() => {
        current += increment;
        obj.textContent = current;
        if (current == end) clearInterval(timer);
    }, stepTime);
}

// ==========================================
// 3. CRUD CON PAGINACIÓN INTELIGENTE
// ==========================================
const tableBody = document.getElementById('floreriasTableBody');
let currentFloreriaId = null;

async function loadFlorerias(page = 1) {
    try {
        // Pedimos con parámetros de paginación
        const response = await fetch(`${API_URL}/florerias?page=${page}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error cargando');

        const result = await response.json();

        // 1. Extracción robusta de datos
        let florerias = [];
        if (Array.isArray(result)) florerias = result;
        else if (Array.isArray(result.data)) florerias = result.data;
        else if (result.data && Array.isArray(result.data.florerias)) florerias = result.data.florerias;
        else if (result.florerias && Array.isArray(result.florerias)) florerias = result.florerias;

        // 2. Extracción de total (Con respaldo de Stats)
        let totalItems = 0;

        // Intento 1: Buscar en la respuesta del endpoint
        if (result.total !== undefined) totalItems = result.total;
        else if (result.data?.total !== undefined) totalItems = result.data.total;
        else if (result.pagination?.total !== undefined) totalItems = result.pagination.total;
        else if (result.meta?.total !== undefined) totalItems = result.meta.total;

        // Intento 2: Si no vino en la respuesta, usar el Global de Stats
        if (!totalItems || totalItems === 0) {
            if (globalTotalRecords > 0) {
                console.log("Usando total global de stats:", globalTotalRecords);
                totalItems = globalTotalRecords;
            } else {
                // Intento 3: Fallback de emergencia (adivinar)
                if (florerias.length === limit) {
                    totalItems = (page * limit) + 1; // Fingimos que hay uno más
                } else {
                    totalItems = florerias.length + ((page - 1) * limit);
                }
            }
        }

        renderTable(florerias);
        updatePagination(page, totalItems);

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error cargando datos</td></tr>`;
    }
}

function renderTable(florerias) {
    tableBody.innerHTML = '';
    if (!florerias || florerias.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No hay florerías en esta página</td></tr>`;
        return;
    }

    florerias.forEach(f => {
        const logoUrl = f.logo_url
            ? `http://localhost:3000${f.logo_url}`
            : 'https://via.placeholder.com/50?text=IMG';

        const estatusBadge = f.estatus == 1
            ? '<span class="badge bg-success status-badge">Activa</span>'
            : '<span class="badge bg-secondary status-badge">Inactiva</span>';

        const row = `
            <tr>
                <td class="ps-4">
                    <img src="${logoUrl}" class="rounded-circle border" width="40" height="40" style="object-fit: cover;">
                </td>
                <td class="fw-bold">${f.nombre}</td>
                <td class="small text-muted">${f.ubicacion || f.direccion || '-'}</td>
                <td class="small">${f.telefono || '-'}</td>
                <td>${estatusBadge}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary me-1 rounded-circle" onclick="openModal(${f.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="deleteFloreria(${f.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updatePagination(page, total) {
    totalPages = Math.ceil(total / limit);
    currentPage = page;

    const start = (page - 1) * limit + 1;
    // Aseguramos que el fin no sea mayor al total real
    const end = Math.min(page * limit, total);

    const infoEl = document.getElementById('pagingInfo');
    if (infoEl) {
        infoEl.textContent = `Mostrando ${start}-${end} de ${total} registros`;
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// Listeners
document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentPage > 1) loadFlorerias(currentPage - 1);
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (currentPage < totalPages) loadFlorerias(currentPage + 1);
});


// --- MODAL Y FUNCIONES CRUD (Sin cambios) ---
window.openModal = async function (id = null) {
    currentFloreriaId = id;
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('floreriaForm');
    form.reset();

    if (id) {
        modalTitle.textContent = 'Editar Florería';
        try {
            const response = await fetch(`${API_URL}/florerias/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const result = await response.json();
            const data = result.data || result;

            document.getElementById('nombre').value = data.nombre;
            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('descripcion').value = data.descripcion || '';
            document.getElementById('ubicacion').value = data.direccion || data.ubicacion || '';
            document.getElementById('horario').value = data.horarios || data.horario || '';
            document.getElementById('id_ciudad').value = data.id_ciudad;
            document.getElementById('email').value = data.correo_electronico || data.email || '';
            document.getElementById('estatus').value = data.estatus;
        } catch (e) { console.error(e); }
    } else {
        modalTitle.textContent = 'Nueva Florería';
        document.getElementById('estatus').value = "1";
    }
    new bootstrap.Modal(document.getElementById('floreriaModal')).show();
}

window.saveFloreria = async function () {
    const form = document.getElementById('floreriaForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const nombre = document.getElementById('nombre').value.trim();
    if (nombre.length < 3) { alert("Nombre muy corto"); return; }

    const btn = document.querySelector('#floreriaModal .btn-primary');
    const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'Guardando...';

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('ubicacion', document.getElementById('ubicacion').value);
    formData.append('direccion', document.getElementById('ubicacion').value);
    formData.append('horario', document.getElementById('horario').value);
    formData.append('id_ciudad', document.getElementById('id_ciudad').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('estatus', document.getElementById('estatus').value);

    const logoInput = document.getElementById('logoInput');
    if (logoInput.files.length > 0) formData.append('logo', logoInput.files[0]);

    try {
        let url = `${API_URL}/florerias`;
        let method = 'POST';
        if (currentFloreriaId) { url += `/${currentFloreriaId}`; method = 'PUT'; }

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error');
        }

        alert('Guardado exitosamente');
        bootstrap.Modal.getInstance(document.getElementById('floreriaModal')).hide();

        // Recargar stats primero para actualizar el total global, luego la tabla
        await loadDashboardStats();
        loadFlorerias(currentPage);

    } catch (e) { alert(e.message); }
    finally { btn.disabled = false; btn.textContent = txt; }
}

window.deleteFloreria = async function (id) {
    if (!confirm('¿Eliminar florería?')) return;
    try {
        const response = await fetch(`${API_URL}/florerias/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error');
        alert('Eliminado');
        await loadDashboardStats();
        loadFlorerias(currentPage);
    } catch (e) { alert('No se pudo eliminar'); }
}

// INICIALIZACIÓN SECUENCIAL (Clave del arreglo)
// Primero cargamos Stats (obtenemos el 18), luego cargamos la Tabla
loadDashboardStats().then(() => {
    loadFlorerias(1);
});