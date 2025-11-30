// Import / Export Logic

class IOManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const btnImport = document.getElementById('btn-import');
        const fileInput = document.getElementById('file-input');
        const btnExport = document.getElementById('btn-export');

        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleImport(e));
        }

        if (btnExport) {
            btnExport.addEventListener('click', () => this.handleExport());
        }
    }

    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            this.processCSV(text);
        };
        reader.readAsText(file);

        // Reset input
        event.target.value = '';
    }

    processCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        let count = 0;

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = lines[i].split(',');
            const delivery = {
                id: 'IMP-' + Math.floor(Math.random() * 10000),
                status: 'pending', // Default status
                date: new Date().toISOString().split('T')[0]
            };

            // Simple mapping based on index or header name matching could be better
            // For this prototype, we assume a specific order or try to map

            // Expected CSV format: client, address, type, weight, volume
            if (values.length >= 2) {
                delivery.client = values[0].trim();
                delivery.address = values[1].trim();
                delivery.type = values[2]?.trim() || 'national';
                delivery.weight = parseFloat(values[3]) || 0;
                delivery.volume = parseFloat(values[4]) || 0;

                // Mock coords
                delivery.lat = 48.85 + (Math.random() - 0.5) * 0.1;
                delivery.lng = 2.35 + (Math.random() - 0.5) * 0.1;

                dataManager.addDelivery(delivery);
                count++;
            }
        }

        if (count > 0) {
            alert(`${count} livraisons importées avec succès !`);
            // Refresh UI
            location.reload(); // Simple reload to refresh all components
        } else {
            alert('Erreur lors de l\'importation. Vérifiez le format CSV.');
        }
    }

    handleExport() {
        const deliveries = dataManager.getAllDeliveries();
        if (deliveries.length === 0) return alert('Aucune donnée à exporter.');

        const headers = ['ID', 'Client', 'Adresse', 'Type', 'Statut', 'Date', 'Poids', 'Volume'];
        const csvContent = [
            headers.join(','),
            ...deliveries.map(d => [
                d.id,
                `"${d.client}"`,
                `"${d.address}"`,
                d.type,
                d.status,
                d.date,
                d.weight,
                d.volume
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'export_livraisons.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const ioManager = new IOManager();
