// Chart.js Management

class ChartManager {
    constructor() {
        this.volumeChart = null;
        this.statusChart = null;
    }

    initCharts() {
        this.initVolumeChart();
        this.initStatusChart();
    }

    initVolumeChart() {
        const ctx = document.getElementById('chart-volume').getContext('2d');

        // Mock data for volume
        const data = {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Livraisons',
                data: [12, 19, 3, 5, 2, 3, 10],
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };

        this.volumeChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initStatusChart() {
        const ctx = document.getElementById('chart-status').getContext('2d');
        const stats = dataManager.getStats();

        const data = {
            labels: ['Livré', 'En Transit', 'En Préparation', 'Incident'],
            datasets: [{
                data: [stats.delivered, stats.transit, stats.pending, stats.issues],
                backgroundColor: [
                    '#10b981', // Success
                    '#3b82f6', // Info
                    '#f59e0b', // Warning
                    '#ef4444'  // Danger
                ],
                borderWidth: 0
            }]
        };

        this.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }

    updateCharts() {
        if (this.statusChart) {
            const stats = dataManager.getStats();
            this.statusChart.data.datasets[0].data = [stats.delivered, stats.transit, stats.pending, stats.issues];
            this.statusChart.update();
        }
        // Volume chart would need real historical data to update meaningfully
    }
}

const chartManager = new ChartManager();
