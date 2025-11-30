const slipManager = {
    init: () => {
        slipManager.renderSelectionUI();

        // Search listener
        document.getElementById('search-slip').addEventListener('input', (e) => {
            slipManager.renderSelectionUI(e.target.value);
        });
    },

    renderSelectionUI: (filter = '') => {
        const listContainer = document.getElementById('slip-delivery-list');
        listContainer.innerHTML = '';

        const deliveries = dataManager.getAllDeliveries();
        const filtered = deliveries.filter(d =>
            d.id.toLowerCase().includes(filter.toLowerCase()) ||
            d.client.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(d => {
            const item = document.createElement('div');
            item.className = 'delivery-item';
            item.innerHTML = `
                <div class="d-info"><strong>${d.id}</strong> - ${d.client}</div>
                <div class="d-status">${d.date}</div>
            `;
            item.addEventListener('click', () => slipManager.generateSlip(d.id));
            listContainer.appendChild(item);
        });
    },

    generateSlip: (id) => {
        const delivery = dataManager.getDelivery(id);
        if (!delivery) return;

        const previewArea = document.getElementById('slip-preview-area');

        // Template Selection
        let template = '';
        if (delivery.type === 'international') {
            template = slipManager.getInternationalTemplate(delivery);
        } else {
            template = slipManager.getNationalTemplate(delivery);
        }

        previewArea.innerHTML = `
            <div id="printable-slip" class="slip-paper">
                ${template}
            </div>
        `;
    },

    getNationalTemplate: (d) => {
        const company = dataManager.getCompanyInfo();
        const productsHtml = d.products ? d.products.map(p => `
            <tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${p.qty}</td>
                <td>${p.unit}</td>
            </tr>
        `).join('') : `
            <tr>
                <td>GEN-001</td>
                <td>Marchandise Générale</td>
                <td>1</td>
                <td>Lot</td>
            </tr>
        `;

        return `
            <div class="bl-header">
                <div class="company-section">
                    <img src="https://via.placeholder.com/150x50?text=LogiSIG+Logo" alt="Logo" class="bl-logo">
                    <h2>${company.name}</h2>
                    <p>${company.address}</p>
                    <p>Tél: ${company.phone} | Email: ${company.email}</p>
                    <p>RC: ${company.rc} | ICE: ${company.ice} | IF: ${company.if}</p>
                </div>
                <div class="doc-info">
                    <h1>BON DE LIVRAISON</h1>
                    <div class="info-box">
                        <p><strong>N° BL :</strong> ${d.id}</p>
                        <p><strong>Date :</strong> ${d.date}</p>
                        <p><strong>Réf. Commande :</strong> CMD-${d.id.split('-')[1]}</p>
                    </div>
                </div>
            </div>

            <div class="bl-client-section">
                <div class="client-box">
                    <h3>Destinataire</h3>
                    <p><strong>Client :</strong> ${d.client}</p>
                    <p><strong>Adresse :</strong> ${d.address}</p>
                    <p><strong>ICE :</strong> ${d.clientICE || 'Non renseigné'}</p>
                </div>
                <div class="logistics-box">
                    <h3>Transport & Logistique</h3>
                    <p><strong>Chauffeur :</strong> ${d.driver || 'Non assigné'}</p>
                    <p><strong>Véhicule :</strong> ${d.vehicle || 'Non assigné'}</p>
                    <p><strong>Poids Total :</strong> ${d.weight || '-'} kg</p>
                    <p><strong>Volume :</strong> ${d.volume || '-'} m³</p>
                </div>
            </div>

            <div class="bl-products">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 15%">Réf</th>
                            <th style="width: 55%">Désignation</th>
                            <th style="width: 15%">Qté</th>
                            <th style="width: 15%">Unité</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                </table>
            </div>

            <div class="bl-footer-section">
                <div class="observation-box">
                    <h3>Observations</h3>
                    <p>Marchandise reçue en bon état.</p>
                </div>
                <div class="signatures-box">
                    <div class="sig-block">
                        <p>Le Transporteur</p>
                        <div class="sig-space"></div>
                    </div>
                    <div class="sig-block">
                        <p>Le Client (Cachet & Signature)</p>
                        <div class="sig-space"></div>
                    </div>
                </div>
            </div>

            <div class="bl-legal-footer">
                <p>Société au capital de 100.000 DH - Siège Social: Casablanca, Maroc - Patente: 12345678</p>
            </div>
        `;
    },

    getInternationalTemplate: (d) => {
        const company = dataManager.getCompanyInfo();
        const productsHtml = d.products ? d.products.map(p => `
            <tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>9900.00</td> <!-- HS Code Mock -->
                <td>${p.qty}</td>
                <td>${p.unit}</td>
                <td>${p.price || 0} €</td>
                <td>${(p.qty * (p.price || 0)).toFixed(2)} €</td>
            </tr>
        `).join('') : `
            <tr>
                <td>GEN-INT</td>
                <td>General Cargo</td>
                <td>9900.00</td>
                <td>1</td>
                <td>Lot</td>
                <td>1000 €</td>
                <td>1000 €</td>
            </tr>
        `;

        return `
            <div class="bl-header">
                <div class="company-section">
                    <img src="https://via.placeholder.com/150x50?text=LogiSIG+Intl" alt="Logo" class="bl-logo">
                    <h2>${company.name}</h2>
                    <p>${company.address}, MOROCCO</p>
                    <p>EORI: ${company.ice} | VAT: ${company.if}</p>
                </div>
                <div class="doc-info">
                    <h1>INTERNATIONAL DELIVERY NOTE</h1>
                    <div class="info-box">
                        <p><strong>Slip No:</strong> ${d.id}</p>
                        <p><strong>Date:</strong> ${d.date}</p>
                        <p><strong>Origin:</strong> MOROCCO</p>
                        <p><strong>Destination:</strong> ${d.country || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="bl-client-section">
                <div class="client-box">
                    <h3>Consignee</h3>
                    <p><strong>Name:</strong> ${d.client}</p>
                    <p><strong>Address:</strong> ${d.address}</p>
                    <p><strong>Country:</strong> ${d.country || '-'}</p>
                </div>
                <div class="logistics-box">
                    <h3>Shipment Details</h3>
                    <p><strong>Incoterm:</strong> ${d.incoterm || 'EXW'}</p>
                    <p><strong>Tracking No:</strong> ${d.tracking || '-'}</p>
                    <p><strong>Gross Weight:</strong> ${d.weight || '-'} kg</p>
                    <p><strong>Total Volume:</strong> ${d.volume || '-'} m³</p>
                </div>
            </div>

            <div class="bl-products">
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Description</th>
                            <th>HS Code</th>
                            <th>Qty</th>
                            <th>Unit</th>
                            <th>Unit Value</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                </table>
            </div>

            <div class="bl-footer-section">
                <div class="observation-box">
                    <h3>Declaration</h3>
                    <p>I declare that the information contained in this invoice is true and correct.</p>
                </div>
                <div class="signatures-box">
                    <div class="sig-block">
                        <p>Authorized Signature</p>
                        <div class="sig-space"></div>
                    </div>
                </div>
            </div>

            <div class="bl-legal-footer">
                <p>LogiSIG International Logistics - Casablanca, Morocco</p>
            </div>
        `;
    },

    printSlip: () => {
        window.print();
    }
};

// Initialize when DOM is ready (called by main.js)
// slipManager.init();
