import { CHART_CONFIG, BOLGE_RENKLERI } from '../utils/constants.js';
import { getSatisVerileri } from '../utils/api.js';

export async function createSalesCharts() {
    const satisData = await getSatisVerileri();
    // Grafik oluşturma kodları...
}

export function destroyCharts() {
    // Grafik temizleme kodları...
} 