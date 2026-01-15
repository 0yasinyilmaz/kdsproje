async function initializeKDS() {
    try {
        const [servisData, satisData, ilYeterlilik] = await Promise.all([
            fetch('/api/teknik-servisler').then(res => res.json()),
            fetch('/api/satislar').then(res => res.json()),
            fetch('/api/il-yeterlilik').then(res => res.json())
        ]);
        updateBolgeselKarsilamaTable(servisData, satisData);
        updateServisVerimlilikTable(servisData, satisData);
    } catch (error) {
        console.error('KDS başlatma hatası:', error);
    }
}
function updateBolgeselKarsilamaTable(servisData, satisData) {
    const bolgeler = {
        'Marmara': { aracSayisi: 0, servisSayisi: 0 },
        'Ege': { aracSayisi: 0, servisSayisi: 0 },
        'İç Anadolu': { aracSayisi: 0, servisSayisi: 0 },
        'Akdeniz': { aracSayisi: 0, servisSayisi: 0 },
        'Karadeniz': { aracSayisi: 0, servisSayisi: 0 },
        'Doğu Anadolu': { aracSayisi: 0, servisSayisi: 0 },
        'Güneydoğu Anadolu': { aracSayisi: 0, servisSayisi: 0 }
    };
    servisData.forEach(servis => {
        if (bolgeler[servis.bolge_adi]) {
            bolgeler[servis.bolge_adi].servisSayisi++;
        }
    });

    satisData.forEach(satis => {
        if (bolgeler[satis.bolge_adi]) {
            bolgeler[satis.bolge_adi].aracSayisi += satis.satistoplam;
        }
    });
    const tableBody = document.getElementById('bolgeselKarsilamaTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    Object.entries(bolgeler).forEach(([bolge, data]) => {
        const servisKapasitesi = data.servisSayisi * 500;
        const karsilamaOrani = data.aracSayisi > 0 
            ? ((servisKapasitesi / data.aracSayisi) * 100).toFixed(1)
            : '0.0';
        const status = getKarsilamaStatus(karsilamaOrani);

        const row = `
            <tr>
                <td>${bolge}</td>
                <td>${data.aracSayisi.toLocaleString()}</td>
                <td>${servisKapasitesi.toLocaleString()}</td>
                <td>%${karsilamaOrani}</td>
                <td>
                    <div class="status-cell status-${status}">
                        <span class="status-indicator"></span>
                        ${getStatusText(status)}
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
const verimlilikPagination = {
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
    data: []
};
function updateServisVerimlilikTable(servisData, satisData) {
    const tableBody = document.getElementById('servisVerimlilikTable');
    if (!tableBody) return;
    const ilBazliVeriler = {};
    servisData.forEach(servis => {
        if (!ilBazliVeriler[servis.il_adi]) {
            ilBazliVeriler[servis.il_adi] = {
                servisSayisi: 0,
                aracSayisi: 0
            };
        }
        ilBazliVeriler[servis.il_adi].servisSayisi++;
    });
    satisData.forEach(satis => {
        if (!ilBazliVeriler[satis.il_adi]) {
            ilBazliVeriler[satis.il_adi] = {
                servisSayisi: 0,
                aracSayisi: 0
            };
        }
        ilBazliVeriler[satis.il_adi].aracSayisi += satis.satistoplam;
    });
    verimlilikPagination.data = Object.entries(ilBazliVeriler)
        .sort((a, b) => b[1].aracSayisi - a[1].aracSayisi)
        .map(([il, data]) => ({il, ...data}));
    verimlilikPagination.totalPages = Math.ceil(verimlilikPagination.data.length / verimlilikPagination.pageSize);
    verimlilikPagination.currentPage = 1;
    updateVerimlilikTablePage();
    updateVerimlilikPaginationControls();
}

function updateVerimlilikTablePage() {
    const tableBody = document.getElementById('servisVerimlilikTable');
    const start = (verimlilikPagination.currentPage - 1) * verimlilikPagination.pageSize;
    const end = start + verimlilikPagination.pageSize;
    const pageData = verimlilikPagination.data.slice(start, end);

    tableBody.innerHTML = '';

    pageData.forEach(data => {
        const servisBasinaArac = data.servisSayisi > 0 
            ? Math.round(data.aracSayisi / data.servisSayisi) 
            : data.aracSayisi;
        
        let status, statusText;
        if (data.servisSayisi === 0) {
            status = 'secondary';
            statusText = 'Teknik Servis Yok';
        } else {
            const kapasiteKullanimi = ((servisBasinaArac / 500) * 100).toFixed(1);
            status = getVerimlilikStatus(kapasiteKullanimi);
            statusText = getVerimlilikStatusText(status);
        }

        const row = `
            <tr>
                <td>${data.il}</td>
                <td>${data.servisSayisi}</td>
                <td>${data.aracSayisi.toLocaleString()}</td>
                <td>${servisBasinaArac.toLocaleString()}</td>
                <td>
                    <div class="status-cell status-${status}">
                        <span class="status-indicator"></span>
                        ${statusText}
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updateVerimlilikPaginationControls() {
    const pageInfo = document.getElementById('verimlilikPageInfo');
    const prevBtn = document.getElementById('verimlilikPrevPage');
    const nextBtn = document.getElementById('verimlilikNextPage');

    pageInfo.textContent = `Sayfa ${verimlilikPagination.currentPage} / ${verimlilikPagination.totalPages}`;
    prevBtn.disabled = verimlilikPagination.currentPage === 1;
    nextBtn.disabled = verimlilikPagination.currentPage === verimlilikPagination.totalPages;
}
document.getElementById('verimlilikPrevPage')?.addEventListener('click', () => {
    if (verimlilikPagination.currentPage > 1) {
        verimlilikPagination.currentPage--;
        updateVerimlilikTablePage();
        updateVerimlilikPaginationControls();
    }
});

document.getElementById('verimlilikNextPage')?.addEventListener('click', () => {
    if (verimlilikPagination.currentPage < verimlilikPagination.totalPages) {
        verimlilikPagination.currentPage++;
        updateVerimlilikTablePage();
        updateVerimlilikPaginationControls();
    }
});

document.getElementById('verimilikPageSize')?.addEventListener('change', (e) => {
    verimlilikPagination.pageSize = parseInt(e.target.value);
    verimlilikPagination.totalPages = Math.ceil(verimlilikPagination.data.length / verimlilikPagination.pageSize);
    verimlilikPagination.currentPage = 1;
    updateVerimlilikTablePage();
    updateVerimlilikPaginationControls();
});
function getKarsilamaStatus(oran) {
    const numOran = parseFloat(oran);
    if (numOran >= 120) return 'success';
    if (numOran >= 100) return 'warning';
    return 'danger';
}

function getStatusText(status) {
    switch(status) {
        case 'success': return 'Yeterli';
        case 'warning': return 'Sınırda';
        case 'danger': return 'Yetersiz';
        default: return '';
    }
}

function getVerimlilikStatus(oran) {
    const numOran = parseFloat(oran);
    if (numOran <= 60) return 'success';      // Mükemmel (300 araç/servis)
    if (numOran <= 80) return 'info';         // Yeterli (400 araç/servis)
    if (numOran <= 100) return 'warning';     // Geliştirilmeli (500 araç/servis)
    return 'danger';                          // Yetersiz (500+ araç/servis)
}

function getVerimlilikStatusText(status) {
    switch(status) {
        case 'success': return 'Mükemmel';
        case 'info': return 'Yeterli';
        case 'warning': return 'Geliştirilmeli';
        case 'danger': return 'Yetersiz';
        default: return '';
    }
}
const sortStates = {
    bolgesel: { column: null, direction: 'asc' },
    verimlilik: { column: null, direction: 'asc' },
    kritik: { column: null, direction: 'asc' }
};
document.querySelectorAll('.sort-btn').forEach(button => {
    button.addEventListener('click', () => {
        const table = button.dataset.table;
        const column = button.dataset.sort;
        if (sortStates[table].column === column) {
            sortStates[table].direction = sortStates[table].direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortStates[table].column = column;
            sortStates[table].direction = 'asc';
        }
        button.closest('.table-sort-controls').querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        button.querySelector('i').className = `fas fa-sort-${sortStates[table].direction === 'asc' ? 'up' : 'down'}`;
        switch(table) {
            case 'bolgesel':
                sortBolgeselTable(column, sortStates[table].direction);
                break;
            case 'verimlilik':
                sortVerimlilikTable(column, sortStates[table].direction);
                break;
            case 'kritik':
                sortKritikTable(column, sortStates[table].direction);
                break;
        }
    });
});
function sortBolgeselTable(column, direction) {
    const tbody = document.getElementById('bolgeselKarsilamaTable');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aVal, bVal;
        
        if (column === 'bolge') {
            aVal = a.cells[0].textContent;
            bVal = b.cells[0].textContent;
            return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else if (column === 'oran') {
            aVal = parseFloat(a.cells[3].textContent.replace('%', ''));
            bVal = parseFloat(b.cells[3].textContent.replace('%', ''));
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}
function sortVerimlilikTable(column, direction) {
    const tbody = document.getElementById('servisVerimlilikTable');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const durumSirasi = {
        'Mükemmel': 1,
        'Yeterli': 2,
        'Geliştirilmeli': 3,
        'Yetersiz': 4,
        'Teknik Servis Yok': 5
    };
    
    rows.sort((a, b) => {
        let aVal, bVal;
        
        switch(column) {
            case 'il':
                aVal = a.cells[0].textContent;
                bVal = b.cells[0].textContent;
                return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            
            case 'arac':
                aVal = parseInt(a.cells[2].textContent.replace(/,/g, ''));
                bVal = parseInt(b.cells[2].textContent.replace(/,/g, ''));
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            
            case 'durum':
                aVal = a.cells[4].querySelector('.status-cell').textContent.trim();
                bVal = b.cells[4].querySelector('.status-cell').textContent.trim();
                const durumKarsilastirma = durumSirasi[aVal] - durumSirasi[bVal];
                
                if (durumKarsilastirma === 0) {
                    aVal = parseInt(a.cells[2].textContent.replace(/,/g, ''));
                    bVal = parseInt(b.cells[2].textContent.replace(/,/g, ''));
                    return direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                return direction === 'asc' ? durumKarsilastirma : -durumKarsilastirma;
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}
function sortKritikTable(column, direction) {
    const tbody = document.getElementById('kritikIlTable');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aVal, bVal;
        
        if (column === 'il') {
            aVal = a.cells[0].textContent;
            bVal = b.cells[0].textContent;
            return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else if (column === 'durum') {
            aVal = a.cells[3].querySelector('.status-cell').textContent.trim();
            bVal = b.cells[3].querySelector('.status-cell').textContent.trim();
            const durumSirasi = {
                'Teknik Servis Yok': 1,
                'Yetersiz': 2
            };
            
            const durumKarsilastirma = durumSirasi[aVal] - durumSirasi[bVal];
            
            if (durumKarsilastirma === 0) {
                aVal = parseInt(a.cells[2].textContent.replace(/,/g, ''));
                bVal = parseInt(b.cells[2].textContent.replace(/,/g, ''));
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            return direction === 'asc' ? durumKarsilastirma : -durumKarsilastirma;
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}
