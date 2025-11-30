// Mock Data and Data Management

// Information de l'entreprise (Statique pour le prototype)
const COMPANY_INFO = {
    name: "LogiSIG Maroc S.A.R.L",
    address: "123 Zone Industrielle Sidi Bernoussi, Casablanca, Maroc",
    ice: "001523456000089",
    if: "15234567",
    rc: "456789",
    phone: "+212 5 22 00 00 00",
    email: "contact@logisig.ma",
    logo: "https://ui-avatars.com/api/?name=Logi+SIG&background=0D8ABC&color=fff&size=128", // Placeholder
    eori: "MA1234567890" // Pour export
};

const initialDeliveries = [
    {
        id: 'DEL-001',
        client: 'Tech Solutions SARL',
        clientICE: '000111222333444',
        address: '10 Bd Zerktouni, Casablanca, Maroc',
        lat: 33.5731,
        lng: -7.5898,
        status: 'delivered',
        type: 'national',
        date: '2023-10-25',
        weight: 15.5,
        volume: 0.2,
        driver: 'Ahmed Benali',
        vehicle: '12345-A-6',
        products: [
            { code: 'PROD-001', name: 'Serveur Rack 2U', qty: 1, unit: 'pcs', price: 15000 },
            { code: 'CABLE-ETH', name: 'Câble Ethernet 10m', qty: 5, unit: 'pcs', price: 150 }
        ]
    },
    {
        id: 'DEL-002',
        client: 'Global Trade Ltd',
        address: 'Avenida de América, Madrid, Spain',
        lat: 40.4379,
        lng: -3.6760,
        status: 'transit',
        type: 'international',
        country: 'ES',
        incoterm: 'DDP',
        date: '2023-10-26',
        weight: 120,
        volume: 1.5,
        driver: 'Transport International Express',
        vehicle: 'TIR-9988',
        tracking: 'TRK-99887766',
        currency: 'EUR',
        products: [
            { code: 'TEXT-001', name: 'Tissus Coton Bio', qty: 50, unit: 'rouleaux', price: 200, hsCode: '5208.10' },
            { code: 'TEXT-002', name: 'Fil Polyester', qty: 100, unit: 'bobines', price: 15, hsCode: '5401.10' }
        ]
    },
    {
        id: 'DEL-003',
        client: 'Boutique Al Amal',
        clientICE: '000555666777888',
        address: '5 Avenue Mohammed V, Rabat, Maroc',
        lat: 34.0209,
        lng: -6.8416,
        status: 'pending',
        type: 'national',
        date: '2023-10-27',
        weight: 5,
        volume: 0.05,
        driver: 'Karim Tazi',
        vehicle: '56789-B-1',
        products: [
            { code: 'ACC-005', name: 'Support Téléphone', qty: 20, unit: 'pcs', price: 50 }
        ]
    }
];

class DataManager {
    constructor() {
        this.deliveries = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('erp_sig_deliveries');
        return stored ? JSON.parse(stored) : initialDeliveries;
    }

    saveData() {
        localStorage.setItem('erp_sig_deliveries', JSON.stringify(this.deliveries));
    }

    getAllDeliveries() {
        return this.deliveries;
    }

    addDelivery(delivery) {
        // Add default mock data for fields not in the simple form
        if (!delivery.products) {
            delivery.products = [
                { code: 'GEN-001', name: 'Marchandise Générale', qty: 1, unit: 'colis', price: 0 }
            ];
        }
        if (!delivery.driver) delivery.driver = 'Chauffeur Assigné';
        if (!delivery.vehicle) delivery.vehicle = 'XX-0000-XX';

        this.deliveries.unshift(delivery);
        this.saveData();
    }

    updateStatus(id, newStatus) {
        const delivery = this.deliveries.find(d => d.id === id);
        if (delivery) {
            delivery.status = newStatus;
            this.saveData();
        }
    }

    getStats() {
        const total = this.deliveries.length;
        const delivered = this.deliveries.filter(d => d.status === 'delivered').length;
        const transit = this.deliveries.filter(d => d.status === 'transit').length;
        const pending = this.deliveries.filter(d => d.status === 'pending').length;
        const issues = this.deliveries.filter(d => d.status === 'issue').length;

        return { total, delivered, transit, pending, issues };
    }

    getCompanyInfo() {
        return COMPANY_INFO;
    }
}

const dataManager = new DataManager();
