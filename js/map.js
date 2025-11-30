// Map Management with Leaflet

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
    }

    initMap() {
        if (this.map) return; // Already initialized

        // Center on Paris by default
        this.map = L.map('map').setView([46.603354, 1.888334], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.refreshMarkers();
    }

    refreshMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        const deliveries = dataManager.getAllDeliveries();

        deliveries.forEach(delivery => {
            if (delivery.lat && delivery.lng) {
                const color = this.getStatusColor(delivery.status);

                const markerHtml = `
                    <div style="
                        background-color: ${color};
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 0 4px rgba(0,0,0,0.3);
                    "></div>
                `;

                const icon = L.divIcon({
                    className: 'custom-marker',
                    html: markerHtml,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                const marker = L.marker([delivery.lat, delivery.lng], { icon: icon })
                    .addTo(this.map)
                    .bindPopup(`
                        <b>${delivery.id}</b><br>
                        ${delivery.client}<br>
                        ${delivery.address}<br>
                        <span class="status-badge ${delivery.status}">${this.formatStatus(delivery.status)}</span>
                    `);

                this.markers.push(marker);
            }
        });
    }

    getStatusColor(status) {
        switch (status) {
            case 'delivered': return '#10b981';
            case 'transit': return '#3b82f6';
            case 'pending': return '#f59e0b';
            case 'issue': return '#ef4444';
            default: return '#64748b';
        }
    }

    formatStatus(status) {
        const map = {
            'delivered': 'Livré',
            'transit': 'En Transit',
            'pending': 'En Préparation',
            'issue': 'Incident'
        };
        return map[status] || status;
    }
}

const mapManager = new MapManager();
