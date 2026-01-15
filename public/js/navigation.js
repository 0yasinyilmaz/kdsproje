import { createSalesCharts } from './charts/sales.js';
import { initializeMap } from './map/config.js';

export async function sayfaYukle(pageId) {
}

export function setupEventListeners() {
}
document.querySelector('.logo-link').addEventListener('click', function(e) {
    e.preventDefault();
    showPage('welcome');
});
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        if (pageId === 'kds') {
            new BolgeKarsilastirma();
        }
    }
} 