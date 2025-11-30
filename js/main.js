// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Initialize UI
    updateKPIs();
    renderDeliveriesTable();
    setupNavigation();
    setupModal();
    setupForms();

    // Initialize Charts
    chartManager.initCharts();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');
    const pageHeader = document.getElementById('page-header');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Update Active Nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show Section
            const targetId = item.getAttribute('data-target');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`view-${targetId}`).classList.add('active');

            // Update Header
            const text = item.querySelector('a').innerText;
            pageHeader.innerText = text;

            // Trigger specific inits
            if (targetId === 'map') {
                setTimeout(() => {
                    mapManager.initMap();
                    mapManager.map.invalidateSize();
                }, 100);
            }
        });
    });
}

// UI Updates
function updateKPIs() {
    const stats = dataManager.getStats();

    animateValue('kpi-total', stats.total);
    animateValue('kpi-delivered', stats.delivered);
    animateValue('kpi-transit', stats.transit);
    animateValue('kpi-issues', stats.issues);
}

function animateValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.innerText = value;
    // Add simple animation logic here if needed
}

function renderDeliveriesTable() {
    const tbody = document.querySelector('#deliveries-table tbody');
    tbody.innerHTML = '';

    const deliveries = dataManager.getAllDeliveries();

    deliveries.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${d.id}</strong></td>
            <td>${d.client}</td>
            <td>${d.address}</td>
            <td><span class="badge-type">${d.type === 'national' ? '🇫🇷 Nat.' : '🌍 Int.'}</span></td>
            <td><span class="status-badge ${d.status}">${formatStatus(d.status)}</span></td>
            <td>${d.date}</td>
            <td>
                <button class="btn-small" onclick="viewDelivery('${d.id}')"><i class="fa-solid fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatStatus(status) {
    const map = {
        'delivered': 'Livré',
        'transit': 'En Transit',
        'pending': 'En Préparation',
        'issue': 'Incident'
    };
    return map[status] || status;
}

// Modal & Forms
function setupModal() {
    const modal = document.getElementById('modal-new-delivery');
    const btnNew = document.getElementById('btn-new-delivery');
    const btnClose = document.querySelectorAll('.close-modal');

    btnNew.addEventListener('click', () => {
        // Generate ID
        const form = document.getElementById('form-delivery');
        form.reset();
        form.querySelector('[name="ref"]').value = 'DEL-' + Math.floor(Math.random() * 10000);
        modal.classList.add('active');
    });

    btnClose.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Toggle International Fields
    const radioType = document.querySelectorAll('input[name="type"]');
    const intFields = document.getElementById('international-fields');

    radioType.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'international') {
                intFields.classList.remove('hidden');
            } else {
                intFields.classList.add('hidden');
            }
        });
    });
}

function setupForms() {
    // Geocoding Mock
    const btnGeocode = document.getElementById('btn-geocode');
    btnGeocode.addEventListener('click', async () => {
        const address = document.getElementById('input-address').value;
        if (!address) return alert('Veuillez entrer une adresse');

        // Mock Geocoding
        const lat = 33.57 + (Math.random() - 0.5) * 0.1; // Near Casablanca
        const lng = -7.58 + (Math.random() - 0.5) * 0.1;

        document.getElementById('input-lat').value = lat.toFixed(4);
        document.getElementById('input-lng').value = lng.toFixed(4);
    });

    // Product Management Logic
    let currentProducts = [];
    const btnAddProd = document.getElementById('btn-add-product');

    btnAddProd.addEventListener('click', () => {
        const code = document.getElementById('prod-code').value;
        const name = document.getElementById('prod-name').value;
        const qty = parseFloat(document.getElementById('prod-qty').value) || 0;
        const unit = document.getElementById('prod-unit').value || 'pcs';
        const price = parseFloat(document.getElementById('prod-price').value) || 0;

        if (!name || qty <= 0) return alert('Désignation et Quantité requises');

        currentProducts.push({ code, name, qty, unit, price });
        renderFormProducts();

        // Clear inputs
        document.getElementById('prod-code').value = '';
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-qty').value = '';
        document.getElementById('prod-price').value = '';
    });

    window.removeProduct = (index) => {
        currentProducts.splice(index, 1);
        renderFormProducts();
    };

    function renderFormProducts() {
        const tbody = document.querySelector('#form-products-table tbody');
        tbody.innerHTML = '';
        currentProducts.forEach((p, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${p.qty} ${p.unit}</td>
                <td><button type="button" class="btn-remove" onclick="removeProduct(${i})"><i class="fa-solid fa-trash"></i></button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Reset products when modal opens
    const btnNew = document.getElementById('btn-new-delivery');
    btnNew.addEventListener('click', () => {
        currentProducts = [];
        renderFormProducts();
        document.querySelector('[name="date"]').value = new Date().toISOString().split('T')[0];
    });

    // Save Logic
    const handleSave = (print = false) => {
        const form = document.getElementById('form-delivery');
        const formData = new FormData(form);

        const delivery = {
            id: formData.get('ref'),
            client: formData.get('client'),
            clientICE: formData.get('clientICE'),
            address: formData.get('address'),
            lat: parseFloat(formData.get('lat')) || 0,
            lng: parseFloat(formData.get('lng')) || 0,
            status: 'pending',
            type: formData.get('type'),
            date: formData.get('date'),
            weight: formData.get('weight'),
            volume: formData.get('volume'),
            driver: formData.get('driver'),
            vehicle: formData.get('vehicle'),
            country: formData.get('country'),
            incoterm: formData.get('incoterm'),
            tracking: formData.get('tracking'),
            products: currentProducts.length > 0 ? currentProducts : [{ code: 'DIV', name: 'Marchandise diverse', qty: 1, unit: 'lot', price: 0 }]
        };

        dataManager.addDelivery(delivery);

        // Refresh UI
        updateKPIs();
        renderDeliveriesTable();
        chartManager.updateCharts();
        mapManager.refreshMarkers();

        // Close Modal
        document.getElementById('modal-new-delivery').classList.remove('active');

        if (print) {
            // Switch to Slips view and generate
            document.querySelector('[data-target="slips"]').click();
            setTimeout(() => {
                // Re-render selection UI to include new item
                slipManager.renderSelectionUI();
                slipManager.generateSlip(delivery.id);
            }, 100);
        }
    };

    document.getElementById('form-delivery').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSave(false);
    });

    document.getElementById('btn-save-print').addEventListener('click', (e) => {
        e.preventDefault();
        if (document.getElementById('form-delivery').checkValidity()) {
            handleSave(true);
        } else {
            document.getElementById('form-delivery').reportValidity();
        }
    });
}

// Global scope for onclick
window.viewDelivery = (id) => {
    alert('Détails de la livraison: ' + id);
};
