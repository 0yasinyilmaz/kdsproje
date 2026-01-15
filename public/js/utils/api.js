// API çağrıları
export async function getSatisVerileri() {
    try {
        const response = await fetch('/api/satislar');
        return await response.json();
    } catch (error) {
        console.error('Satış verisi çekme hatası:', error);
        throw error;
    }
}

export async function getServisVerileri() {
    try {
        const response = await fetch('/api/teknik-servisler');
        return await response.json();
    } catch (error) {
        console.error('Servis verisi çekme hatası:', error);
        throw error;
    }
} 