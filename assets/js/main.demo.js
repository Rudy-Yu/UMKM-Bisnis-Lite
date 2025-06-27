// main.demo.js
// Logika aplikasi UMKM Pro Accounting versi demo (100% frontend, LocalStorage)
// Semua fitur utama berjalan tanpa backend, UI/UX tidak diubah

// ========== NAVIGASI ========== //
const pages = [
  'dashboard', 'transactions', 'inventory', 'customers', 'suppliers', 'cash-flow', 'hutang-piutang',
  'analytics', 'reports', 'forecast', 'invoice', 'documents', 'settings', 'help'
];

function showPage(page) {
  pages.forEach(p => {
    document.getElementById(p)?.classList.remove('active');
    document.querySelector(`.nav-item[onclick*="${p}"]`)?.classList.remove('active');
  });
  document.getElementById(page)?.classList.add('active');
  document.querySelector(`.nav-item[onclick*="${page}"]`)?.classList.add('active');
  // Breadcrumb & Title
  document.getElementById('pageTitle').textContent = getPageTitle(page);
  document.getElementById('breadcrumb').textContent = getBreadcrumb(page);
  // Render sesuai halaman
  switch(page) {
    case 'dashboard': renderDashboard(); break;
    case 'transactions': renderTransactions(); break;
    case 'inventory': renderProducts(); break;
    case 'customers': renderCustomers(); break;
    case 'suppliers': renderSuppliers(); break;
    case 'cash-flow': renderCashFlow(); break;
    case 'hutang-piutang': renderDebt(); break;
    case 'settings': loadSettingsForm(); break;
    case 'analytics': renderAnalytics(); break;
    case 'reports': renderReports(); break;
    case 'forecast': renderForecast(); break;
    case 'invoice': renderInvoice(); break;
    case 'documents': renderDocuments(); break;
    case 'help': /* no render needed */ break;
    // Tambah render lain jika ada
  }
}

function getPageTitle(page) {
  const map = {
    'dashboard': 'Dashboard',
    'transactions': 'Transaksi',
    'inventory': 'Inventory',
    'customers': 'Pelanggan',
    'suppliers': 'Supplier',
    'cash-flow': 'Cash Flow',
    'hutang-piutang': 'Hutang Piutang',
    'analytics': 'Analytics',
    'reports': 'Laporan',
    'forecast': 'Forecast',
    'invoice': 'Invoice',
    'documents': 'Documents',
    'settings': 'Pengaturan',
    'help': 'Bantuan',
  };
  return map[page] || 'Dashboard';
}

function getBreadcrumb(page) {
  return `Home > ${getPageTitle(page)}`;
}

// ========== SIDEBAR MOBILE ========== //
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('mobile-visible');
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('nav-item')) {
    document.getElementById('sidebar').classList.remove('mobile-visible');
  }
});

// ========== THEME TOGGLE ========== //
function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('umkm-theme', next);
}

(function() {
  const saved = localStorage.getItem('umkm-theme');
  if (saved) document.body.setAttribute('data-theme', saved);
})();

// ========== MODAL ========== //
showModal = function(id) {
  switch(id) {
    case 'transaction': resetTransactionForm(); break;
    case 'product': resetProductForm(); break;
    case 'customer': resetCustomerForm(); break;
    case 'supplier': resetSupplierForm(); break;
    case 'cashflow': resetCashFlowForm(); break;
    case 'debt': resetDebtForm(); break;
  }
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-close')) {
    const modal = e.target.closest('.modal');
    if (modal) modal.classList.remove('active');
  }
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// ========== DUMMY DATA & LOCALSTORAGE ========== //
const LS = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

// Dummy data init
function initDemoData() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  let txs = LS.get('umkm-transactions', null);
  if (!txs) {
    txs = [
      { id: 1, date: todayStr, type: 'Penjualan', amount: 5000000, desc: 'Penjualan Dummy Hari Ini' },
      { id: 2, date: todayStr, type: 'Pembelian', amount: 2000000, desc: 'Pembelian Dummy Hari Ini' },
    ];
    LS.set('umkm-transactions', txs);
  } else {
    // Tambahkan dummy hari ini jika belum ada transaksi di bulan ini
    const hasThisMonth = txs.some(t => {
      const d = new Date(t.date);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    if (!hasThisMonth) {
      const nextId = txs.length ? Math.max(...txs.map(t=>t.id))+1 : 1;
      txs.push(
        { id: nextId, date: todayStr, type: 'Penjualan', amount: 5000000, desc: 'Penjualan Dummy Hari Ini' },
        { id: nextId+1, date: todayStr, type: 'Pembelian', amount: 2000000, desc: 'Pembelian Dummy Hari Ini' }
      );
      LS.set('umkm-transactions', txs);
    }
  }
  if (!LS.get('umkm-products')) {
    LS.set('umkm-products', [
      { id: 1, name: 'Produk A', stock: 10, price: 100000 },
      { id: 2, name: 'Produk B', stock: 2, price: 200000 },
    ]);
  }
  if (!LS.get('umkm-customers')) {
    LS.set('umkm-customers', [
      { id: 1, name: 'Pelanggan A', phone: '08123456789' },
    ]);
  }
  if (!LS.get('umkm-suppliers')) {
    LS.set('umkm-suppliers', [
      { id: 1, name: 'Supplier A', phone: '08129876543' },
    ]);
  }
}

// ========== DASHBOARD ========== //
function renderDashboard() {
  // Statistik
  const txs = LS.get('umkm-transactions', []);
  const products = LS.get('umkm-products', []);
  let revenue = 0, expense = 0;
  txs.forEach(t => {
    if (t.type === 'Penjualan') revenue += t.amount;
    else expense += t.amount;
  });
  document.getElementById('totalRevenue').textContent = 'Rp ' + revenue.toLocaleString('id-ID');
  document.getElementById('totalExpense').textContent = 'Rp ' + expense.toLocaleString('id-ID');
  document.getElementById('totalProfit').textContent = 'Rp ' + (revenue - expense).toLocaleString('id-ID');
  document.getElementById('totalProducts').textContent = products.length;
  // Info stok menipis
  const lowStockProducts = products.filter(p => p.stock < 5);
  const lowStock = lowStockProducts.length;
  document.querySelector('#totalProducts + .stat-label + .stat-change').textContent = lowStock ? `${lowStock} produk stok menipis` : 'Stok aman';

  // Notifikasi stok menipis & hutang/piutang jatuh tempo
  const alerts = [];
  if (lowStock) {
    alerts.push(`<div class='alert alert-warning' style='position:relative;'>
      <b>Perhatian:</b> Ada ${lowStock} produk dengan stok menipis!
      <button onclick='this.parentNode.remove()' style='position:absolute;right:12px;top:12px;background:none;border:none;font-size:18px;line-height:1;color:#d97706;cursor:pointer;'>&times;</button>
    </div>`);
  }
  // Hutang/piutang jatuh tempo
  const debts = LS.get('umkm-debt', []);
  const today = new Date();
  const soon = new Date();
  soon.setDate(today.getDate() + 3);
  const dueDebts = debts.filter(d => {
    const dDate = new Date(d.date);
    return dDate >= today && dDate <= soon;
  });
  if (dueDebts.length) {
    alerts.push(`<div class='alert alert-danger' style='position:relative;'>
      <b>Pengingat:</b> Ada ${dueDebts.length} hutang/piutang yang akan jatuh tempo dalam 3 hari!
      <button onclick='this.parentNode.remove()' style='position:absolute;right:12px;top:12px;background:none;border:none;font-size:18px;line-height:1;color:#dc2626;cursor:pointer;'>&times;</button>
    </div>`);
  }
  document.getElementById('dashboardAlerts').innerHTML = alerts.join('');

  // Grafik penjualan 6 bulan terakhir
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }
  const monthLabels = months.map(m => m.toLocaleString('id-ID', { month: 'short', year: '2-digit' }));
  const salesData = months.map(m => {
    const ym = m.getFullYear() + '-' + String(m.getMonth()+1).padStart(2,'0');
    return txs.filter(t => t.type === 'Penjualan' && t.date.startsWith(ym)).reduce((a,b)=>a+b.amount,0);
  });
  const expenseData = months.map(m => {
    const ym = m.getFullYear() + '-' + String(m.getMonth()+1).padStart(2,'0');
    return txs.filter(t => t.type !== 'Penjualan' && t.date.startsWith(ym)).reduce((a,b)=>a+b.amount,0);
  });
  const ctx = document.getElementById('salesChart').getContext('2d');
  if (window.salesChart && typeof window.salesChart.destroy === 'function') window.salesChart.destroy();
  window.salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'Penjualan',
          data: salesData,
          borderColor: 'rgba(37,99,235,1)',
          backgroundColor: 'rgba(37,99,235,0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Pengeluaran',
          data: expenseData,
          borderColor: 'rgba(220,38,38,1)',
          backgroundColor: 'rgba(220,38,38,0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
  // Analisis penjualan sederhana
  const thisMonth = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
  const thisMonthSales = txs.filter(t => t.type === 'Penjualan' && t.date.startsWith(thisMonth));
  const maxSale = thisMonthSales.length ? Math.max(...thisMonthSales.map(t=>t.amount)) : 0;
  const avgSale = thisMonthSales.length ? Math.round(thisMonthSales.reduce((a,b)=>a+b.amount,0)/thisMonthSales.length) : 0;
  const analysis = `Penjualan tertinggi bulan ini: Rp ${maxSale.toLocaleString('id-ID')}. Rata-rata penjualan: Rp ${avgSale.toLocaleString('id-ID')}.`;
  const analysisBox = document.querySelector('#dashboard .analytics-grid .card p');
  if (analysisBox) analysisBox.textContent = analysis;
}

// ========== SETTINGS PAGE ========== //
const SETTINGS_KEY = 'umkm-settings';

function loadSettingsForm() {
  const data = LS.get(SETTINGS_KEY, {
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessLogo: '',
    appLanguage: 'id',
    appTheme: 'light',
  });
  document.getElementById('businessName').value = data.businessName;
  document.getElementById('businessEmail').value = data.businessEmail;
  document.getElementById('businessPhone').value = data.businessPhone;
  document.getElementById('businessAddress').value = data.businessAddress;
  document.getElementById('businessLogo').value = data.businessLogo;
  document.getElementById('appLanguage').value = data.appLanguage;
  document.getElementById('appTheme').value = data.appTheme;
}

// Tambah event listener untuk upload file logo
const logoFileInput = document.getElementById('businessLogoFile');
const logoUrlInput = document.getElementById('businessLogo');
if (logoFileInput) {
  logoFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      logoUrlInput.value = '';
      // Simpan base64 ke LocalStorage via form
      logoUrlInput.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}
if (logoUrlInput) {
  logoUrlInput.addEventListener('input', function(e) {
    if (logoUrlInput.value && logoFileInput) logoFileInput.value = '';
  });
}

function updateSidebarLogo() {
  const data = LS.get('umkm-settings', {});
  const logoUrl = data.businessLogo;
  const img = document.getElementById('businessLogoImg');
  const h1 = document.querySelector('.logo h1');
  if (logoUrl && logoUrl.trim() !== '') {
    img.src = logoUrl;
    img.style.display = 'block';
    h1.style.display = 'none';
  } else {
    img.style.display = 'none';
    h1.style.display = 'block';
  }
}

document.getElementById('settingsForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    businessName: document.getElementById('businessName').value,
    businessEmail: document.getElementById('businessEmail').value,
    businessPhone: document.getElementById('businessPhone').value,
    businessAddress: document.getElementById('businessAddress').value,
    businessLogo: document.getElementById('businessLogo').value,
    appLanguage: document.getElementById('appLanguage').value,
    appTheme: document.getElementById('appTheme').value,
  };
  LS.set(SETTINGS_KEY, data);
  document.getElementById('settingsSaved').style.display = 'block';
  setTimeout(()=>{
    document.getElementById('settingsSaved').style.display = 'none';
  }, 2000);
  // Update theme jika diganti
  document.body.setAttribute('data-theme', data.appTheme);
  localStorage.setItem('umkm-theme', data.appTheme);
  updateSidebarLogo();
});

// ========== BACKUP & RESTORE DATA ========== //
function backupData() {
  const allData = {
    settings: LS.get('umkm-settings', {}),
    transactions: LS.get('umkm-transactions', []),
    products: LS.get('umkm-products', []),
    customers: LS.get('umkm-customers', []),
    suppliers: LS.get('umkm-suppliers', []),
    cashflow: LS.get('umkm-cashflow', []),
    debt: LS.get('umkm-debt', []),
  };
  const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'umkmpro-backup-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  document.getElementById('backupRestoreStatus').textContent = 'Backup berhasil diunduh!';
  setTimeout(()=>{document.getElementById('backupRestoreStatus').textContent = ''}, 2500);
}

globalThis.backupData = backupData;

function restoreData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') throw new Error('Format file salah');
      if (!('transactions' in data && 'products' in data)) throw new Error('File backup tidak valid');
      LS.set('umkm-settings', data.settings || {});
      LS.set('umkm-transactions', data.transactions || []);
      LS.set('umkm-products', data.products || []);
      LS.set('umkm-customers', data.customers || []);
      LS.set('umkm-suppliers', data.suppliers || []);
      LS.set('umkm-cashflow', data.cashflow || []);
      LS.set('umkm-debt', data.debt || []);
      document.getElementById('backupRestoreStatus').textContent = 'Restore berhasil! Reload...';
      setTimeout(()=>{ location.reload(); }, 1200);
    } catch(err) {
      document.getElementById('backupRestoreStatus').textContent = 'Restore gagal: ' + err.message;
      setTimeout(()=>{document.getElementById('backupRestoreStatus').textContent = ''}, 3500);
    }
  };
  reader.readAsText(file);
}

globalThis.restoreData = restoreData;

// ========== LOGIN SEDERHANA ========== //
const LOGIN_KEY = 'umkm-login';
const DEFAULT_USER = { username: 'admin', password: 'admin123' };

function getUser() {
  return LS.get(LOGIN_KEY, DEFAULT_USER);
}

function isLoggedIn() {
  return localStorage.getItem('umkm-loggedin') === '1';
}

function setLoggedIn(val) {
  if (val) localStorage.setItem('umkm-loggedin', '1');
  else localStorage.removeItem('umkm-loggedin');
}

function showLoginModal() {
  document.getElementById('modal-login').style.display = 'flex';
  document.querySelector('.app-container').style.display = 'none';
}

function hideLoginModal() {
  document.getElementById('modal-login').style.display = 'none';
  document.querySelector('.app-container').style.display = '';
}

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const user = getUser();
  if (username === user.username && password === user.password) {
    setLoggedIn(true);
    hideLoginModal();
    document.getElementById('loginError').style.display = 'none';
  } else {
    document.getElementById('loginError').textContent = 'Username atau password salah!';
    document.getElementById('loginError').style.display = 'block';
  }
});

globalThis.logout = function() {
  setLoggedIn(false);
  // Reset form login
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').style.display = 'none';
  showLoginModal();
}

// Cek login saat load
(function() {
  if (!isLoggedIn()) {
    showLoginModal();
  } else {
    hideLoginModal();
  }
})();

// ========== INISIALISASI ========== //
document.addEventListener('DOMContentLoaded', function() {
  initDemoData();
  updateSidebarLogo();
  renderDashboard();
  // Tambah render lain sesuai kebutuhan (transactions, inventory, etc)
});

// ========== EXPORT ========== //
// Tambahkan fungsi lain (transaksi, inventory, pelanggan, dsb) sesuai kebutuhan
globalThis.showPage = showPage;
globalThis.toggleSidebar = toggleSidebar;
globalThis.toggleTheme = toggleTheme;
globalThis.showModal = showModal;
globalThis.closeModal = closeModal;

// ========== TRANSAKSI PAGE ========== //
function renderTransactions() {
  const txs = LS.get('umkm-transactions', []);
  const tbody = document.querySelector('#transactionsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!txs.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--secondary)">Belum ada transaksi</td></tr>';
    return;
  }
  txs.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>Rp ${tx.amount.toLocaleString('id-ID')}</td>
      <td>${tx.desc || ''}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editTransaction(${tx.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteTransaction(${tx.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetTransactionForm() {
  document.getElementById('transactionId').value = '';
  document.getElementById('transactionDate').value = '';
  document.getElementById('transactionType').value = 'Penjualan';
  document.getElementById('transactionAmount').value = '';
  document.getElementById('transactionDesc').value = '';
  document.getElementById('transactionModalTitle').textContent = 'Tambah Transaksi';
}

function editTransaction(id) {
  const txs = LS.get('umkm-transactions', []);
  const tx = txs.find(t => t.id === id);
  if (!tx) return;
  document.getElementById('transactionId').value = tx.id;
  document.getElementById('transactionDate').value = tx.date;
  document.getElementById('transactionType').value = tx.type;
  document.getElementById('transactionAmount').value = tx.amount;
  document.getElementById('transactionDesc').value = tx.desc;
  document.getElementById('transactionModalTitle').textContent = 'Edit Transaksi';
  showModal('transaction');
}
globalThis.editTransaction = editTransaction;

document.getElementById('transactionForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('transactionId').value;
  const txs = LS.get('umkm-transactions', []);
  const data = {
    id: id ? Number(id) : (txs.length ? Math.max(...txs.map(t=>t.id))+1 : 1),
    date: document.getElementById('transactionDate').value,
    type: document.getElementById('transactionType').value,
    amount: Number(document.getElementById('transactionAmount').value),
    desc: document.getElementById('transactionDesc').value,
  };
  if (id) {
    // Edit
    const idx = txs.findIndex(t => t.id == id);
    if (idx > -1) txs[idx] = data;
  } else {
    // Tambah
    txs.push(data);
  }
  LS.set('umkm-transactions', txs);
  renderTransactions();
  closeModal('transaction');
});

function deleteTransaction(id) {
  if (!confirm('Hapus transaksi ini?')) return;
  let txs = LS.get('umkm-transactions', []);
  txs = txs.filter(t => t.id !== id);
  LS.set('umkm-transactions', txs);
  renderTransactions();
}
globalThis.deleteTransaction = deleteTransaction;

// ========== CUSTOMERS PAGE ========== //
function renderCustomers() {
  const customers = LS.get('umkm-customers', []);
  const tbody = document.querySelector('#customersTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!customers.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--secondary)">Belum ada pelanggan</td></tr>';
    return;
  }
  customers.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editCustomer(${c.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteCustomer(${c.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetCustomerForm() {
  document.getElementById('customerId').value = '';
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerModalTitle').textContent = 'Tambah Pelanggan';
}

function editCustomer(id) {
  const customers = LS.get('umkm-customers', []);
  const c = customers.find(x => x.id === id);
  if (!c) return;
  document.getElementById('customerId').value = c.id;
  document.getElementById('customerName').value = c.name;
  document.getElementById('customerPhone').value = c.phone;
  document.getElementById('customerModalTitle').textContent = 'Edit Pelanggan';
  showModal('customer');
}
globalThis.editCustomer = editCustomer;

document.getElementById('customerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('customerId').value;
  const customers = LS.get('umkm-customers', []);
  const data = {
    id: id ? Number(id) : (customers.length ? Math.max(...customers.map(x=>x.id))+1 : 1),
    name: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
  };
  if (id) {
    // Edit
    const idx = customers.findIndex(x => x.id == id);
    if (idx > -1) customers[idx] = data;
  } else {
    // Tambah
    customers.push(data);
  }
  LS.set('umkm-customers', customers);
  renderCustomers();
  closeModal('customer');
});

function deleteCustomer(id) {
  if (!confirm('Hapus pelanggan ini?')) return;
  let customers = LS.get('umkm-customers', []);
  customers = customers.filter(x => x.id !== id);
  LS.set('umkm-customers', customers);
  renderCustomers();
}
globalThis.deleteCustomer = deleteCustomer;

// ========== SUPPLIERS PAGE ========== //
function renderSuppliers() {
  const suppliers = LS.get('umkm-suppliers', []);
  const tbody = document.querySelector('#suppliersTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!suppliers.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--secondary)">Belum ada supplier</td></tr>';
    return;
  }
  suppliers.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editSupplier(${s.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteSupplier(${s.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetSupplierForm() {
  document.getElementById('supplierId').value = '';
  document.getElementById('supplierName').value = '';
  document.getElementById('supplierPhone').value = '';
  document.getElementById('supplierModalTitle').textContent = 'Tambah Supplier';
}

function editSupplier(id) {
  const suppliers = LS.get('umkm-suppliers', []);
  const s = suppliers.find(x => x.id === id);
  if (!s) return;
  document.getElementById('supplierId').value = s.id;
  document.getElementById('supplierName').value = s.name;
  document.getElementById('supplierPhone').value = s.phone;
  document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
  showModal('supplier');
}
globalThis.editSupplier = editSupplier;

document.getElementById('supplierForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('supplierId').value;
  const suppliers = LS.get('umkm-suppliers', []);
  const data = {
    id: id ? Number(id) : (suppliers.length ? Math.max(...suppliers.map(x=>x.id))+1 : 1),
    name: document.getElementById('supplierName').value,
    phone: document.getElementById('supplierPhone').value,
  };
  if (id) {
    // Edit
    const idx = suppliers.findIndex(x => x.id == id);
    if (idx > -1) suppliers[idx] = data;
  } else {
    // Tambah
    suppliers.push(data);
  }
  LS.set('umkm-suppliers', suppliers);
  renderSuppliers();
  closeModal('supplier');
});

function deleteSupplier(id) {
  if (!confirm('Hapus supplier ini?')) return;
  let suppliers = LS.get('umkm-suppliers', []);
  suppliers = suppliers.filter(x => x.id !== id);
  LS.set('umkm-suppliers', suppliers);
  renderSuppliers();
}
globalThis.deleteSupplier = deleteSupplier;

// ========== CASH FLOW PAGE ========== //
function renderCashFlow() {
  const flows = LS.get('umkm-cashflow', []);
  const tbody = document.querySelector('#cashFlowTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!flows.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--secondary)">Belum ada data cash flow</td></tr>';
    return;
  }
  flows.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.date}</td>
      <td>${f.type}</td>
      <td>Rp ${f.amount.toLocaleString('id-ID')}</td>
      <td>${f.desc || ''}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editCashFlow(${f.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteCashFlow(${f.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetCashFlowForm() {
  document.getElementById('cashflowId').value = '';
  document.getElementById('cashflowDate').value = '';
  document.getElementById('cashflowType').value = 'Masuk';
  document.getElementById('cashflowAmount').value = '';
  document.getElementById('cashflowDesc').value = '';
  document.getElementById('cashflowModalTitle').textContent = 'Tambah Cash Flow';
}

function editCashFlow(id) {
  const flows = LS.get('umkm-cashflow', []);
  const f = flows.find(x => x.id === id);
  if (!f) return;
  document.getElementById('cashflowId').value = f.id;
  document.getElementById('cashflowDate').value = f.date;
  document.getElementById('cashflowType').value = f.type;
  document.getElementById('cashflowAmount').value = f.amount;
  document.getElementById('cashflowDesc').value = f.desc;
  document.getElementById('cashflowModalTitle').textContent = 'Edit Cash Flow';
  showModal('cashflow');
}
globalThis.editCashFlow = editCashFlow;

document.getElementById('cashflowForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('cashflowId').value;
  const flows = LS.get('umkm-cashflow', []);
  const data = {
    id: id ? Number(id) : (flows.length ? Math.max(...flows.map(x=>x.id))+1 : 1),
    date: document.getElementById('cashflowDate').value,
    type: document.getElementById('cashflowType').value,
    amount: Number(document.getElementById('cashflowAmount').value),
    desc: document.getElementById('cashflowDesc').value,
  };
  if (id) {
    // Edit
    const idx = flows.findIndex(x => x.id == id);
    if (idx > -1) flows[idx] = data;
  } else {
    // Tambah
    flows.push(data);
  }
  LS.set('umkm-cashflow', flows);
  renderCashFlow();
  closeModal('cashflow');
});

function deleteCashFlow(id) {
  if (!confirm('Hapus data cash flow ini?')) return;
  let flows = LS.get('umkm-cashflow', []);
  flows = flows.filter(x => x.id !== id);
  LS.set('umkm-cashflow', flows);
  renderCashFlow();
}
globalThis.deleteCashFlow = deleteCashFlow;

// ========== HUTANG PIUTANG PAGE ========== //
function renderDebt() {
  const debts = LS.get('umkm-debt', []);
  const tbody = document.querySelector('#debtTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!debts.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--secondary)">Belum ada data hutang/piutang</td></tr>';
    return;
  }
  debts.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.date}</td>
      <td>${d.type}</td>
      <td>${d.name}</td>
      <td>Rp ${d.amount.toLocaleString('id-ID')}</td>
      <td>${d.desc || ''}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editDebt(${d.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteDebt(${d.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetDebtForm() {
  const id = document.getElementById('debtId');
  const date = document.getElementById('debtDate');
  const type = document.getElementById('debtType');
  const name = document.getElementById('debtName');
  const amount = document.getElementById('debtAmount');
  const desc = document.getElementById('debtDesc');
  const title = document.getElementById('debtModalTitle');
  if (id) id.value = '';
  if (date) date.value = '';
  if (type) type.value = 'Hutang';
  if (name) name.value = '';
  if (amount) amount.value = '';
  if (desc) desc.value = '';
  if (title) title.textContent = 'Tambah Hutang/Piutang';
}

function editDebt(id) {
  const debts = LS.get('umkm-debt', []);
  const d = debts.find(x => x.id === id);
  if (!d) return;
  document.getElementById('debtId').value = d.id;
  document.getElementById('debtDate').value = d.date;
  document.getElementById('debtType').value = d.type;
  document.getElementById('debtName').value = d.name;
  document.getElementById('debtAmount').value = d.amount;
  document.getElementById('debtDesc').value = d.desc;
  document.getElementById('debtModalTitle').textContent = 'Edit Hutang/Piutang';
  showModal('debt');
}
globalThis.editDebt = editDebt;

document.getElementById('debtForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('debtId').value;
  const debts = LS.get('umkm-debt', []);
  const data = {
    id: id ? Number(id) : (debts.length ? Math.max(...debts.map(x=>x.id))+1 : 1),
    date: document.getElementById('debtDate').value,
    type: document.getElementById('debtType').value,
    name: document.getElementById('debtName').value,
    amount: Number(document.getElementById('debtAmount').value),
    desc: document.getElementById('debtDesc').value,
  };
  if (id) {
    // Edit
    const idx = debts.findIndex(x => x.id == id);
    if (idx > -1) debts[idx] = data;
  } else {
    // Tambah
    debts.push(data);
  }
  LS.set('umkm-debt', debts);
  renderDebt();
  closeModal('debt');
});

function deleteDebt(id) {
  if (!confirm('Hapus data hutang/piutang ini?')) return;
  let debts = LS.get('umkm-debt', []);
  debts = debts.filter(x => x.id !== id);
  LS.set('umkm-debt', debts);
  renderDebt();
}
globalThis.deleteDebt = deleteDebt;

// ========== INVENTORY PAGE ========== //
function renderProducts() {
  const products = LS.get('umkm-products', []);
  const tbody = document.querySelector('#productsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--secondary)">Belum ada produk</td></tr>';
    return;
  }
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.stock}</td>
      <td>Rp ${p.price.toLocaleString('id-ID')}</td>
      <td>
        <button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='editProduct(${p.id})'>Edit</button>
        <button class='btn btn-danger' style='padding:4px 10px;font-size:12px' onclick='deleteProduct(${p.id})'>Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetProductForm() {
  const id = document.getElementById('productId');
  const name = document.getElementById('productName');
  const stock = document.getElementById('productStock');
  const price = document.getElementById('productPrice');
  const title = document.getElementById('productModalTitle');
  if (id) id.value = '';
  if (name) name.value = '';
  if (stock) stock.value = '';
  if (price) price.value = '';
  if (title) title.textContent = 'Tambah Produk';
}

function editProduct(id) {
  const products = LS.get('umkm-products', []);
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productId').value = p.id;
  document.getElementById('productName').value = p.name;
  document.getElementById('productStock').value = p.stock;
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productModalTitle').textContent = 'Edit Produk';
  showModal('product');
}
globalThis.editProduct = editProduct;

document.getElementById('productForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const products = LS.get('umkm-products', []);
  const data = {
    id: id ? Number(id) : (products.length ? Math.max(...products.map(x=>x.id))+1 : 1),
    name: document.getElementById('productName').value,
    stock: Number(document.getElementById('productStock').value),
    price: Number(document.getElementById('productPrice').value),
  };
  if (id) {
    // Edit
    const idx = products.findIndex(x => x.id == id);
    if (idx > -1) products[idx] = data;
  } else {
    // Tambah
    products.push(data);
  }
  LS.set('umkm-products', products);
  renderProducts();
  closeModal('product');
});

function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  let products = LS.get('umkm-products', []);
  products = products.filter(x => x.id !== id);
  LS.set('umkm-products', products);
  renderProducts();
}
globalThis.deleteProduct = deleteProduct;

// ========== ANALYTICS PAGE ========== //
function renderAnalytics() {
  // Data transaksi bulan ini
  const txs = LS.get('umkm-transactions', []);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const thisMonthTxs = txs.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const totalTx = thisMonthTxs.length;
  const totalSales = thisMonthTxs.filter(t => t.type === 'Penjualan').reduce((a,b)=>a+b.amount,0);
  const totalExpense = thisMonthTxs.filter(t => t.type !== 'Penjualan').reduce((a,b)=>a+b.amount,0);
  document.getElementById('analyticsTotalTx').textContent = totalTx;
  document.getElementById('analyticsTotalSales').textContent = 'Rp ' + totalSales.toLocaleString('id-ID');
  document.getElementById('analyticsTotalExpense').textContent = 'Rp ' + totalExpense.toLocaleString('id-ID');
  // Grafik dummy
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  if (window.analyticsChart && typeof window.analyticsChart.destroy === 'function') {
    window.analyticsChart.destroy();
  }
  window.analyticsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      datasets: [
        {
          label: 'Penjualan',
          data: [1200000, 1500000, 1800000, 2000000, 1700000, 2100000, 1900000, 2200000, 2000000, 2300000, 2100000, 2500000],
          backgroundColor: 'rgba(37,99,235,0.7)'
        },
        {
          label: 'Pengeluaran',
          data: [800000, 900000, 1000000, 1100000, 950000, 1200000, 1100000, 1300000, 1200000, 1400000, 1300000, 1500000],
          backgroundColor: 'rgba(220,38,38,0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderReports() {
  const txs = LS.get('umkm-transactions', []);
  const tbody = document.querySelector('#reportsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!txs.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--secondary)">Belum ada data laporan</td></tr>';
    return;
  }
  txs.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
      <td>${t.desc || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportReport() {
  alert('Fitur export laporan (PDF/Excel) hanya demo.');
}
globalThis.exportReport = exportReport;

function renderForecast() {
  // Grafik dummy
  const ctx = document.getElementById('forecastChart').getContext('2d');
  if (window.forecastChart && typeof window.forecastChart.destroy === 'function') {
    window.forecastChart.destroy();
  }
  window.forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      datasets: [
        {
          label: 'Penjualan',
          data: [1200000, 1500000, 1800000, 2000000, 1700000, 2100000, 1900000, 2200000, 2000000, 2300000, 2100000, 2500000],
          borderColor: 'rgba(37,99,235,1)',
          backgroundColor: 'rgba(37,99,235,0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
  // Ringkasan dummy
  document.getElementById('forecastNextMonth').textContent = 'Rp 2.600.000';
  document.getElementById('forecastGrowth').textContent = '+8%';
}

function renderInvoice() {
  // Data dummy invoice
  const invoices = [
    { no: 1, tanggal: '2024-07-01', pelanggan: 'Pelanggan A', total: 1500000, status: 'Lunas' },
    { no: 2, tanggal: '2024-07-02', pelanggan: 'Pelanggan B', total: 2000000, status: 'Belum Lunas' },
  ];
  const tbody = document.querySelector('#invoiceTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  invoices.forEach(inv => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${inv.no}</td>
      <td>${inv.tanggal}</td>
      <td>${inv.pelanggan}</td>
      <td>Rp ${inv.total.toLocaleString('id-ID')}</td>
      <td><span class="badge ${inv.status === 'Lunas' ? 'badge-success' : 'badge-warning'}">${inv.status}</span></td>
      <td><button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='alert("Preview invoice hanya demo.")'>Preview</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDocuments() {
  // Data dummy dokumen
  const docs = [
    { no: 1, nama: 'Surat Jalan', tanggal: '2024-07-01', kategori: 'Logistik' },
    { no: 2, nama: 'Kontrak Kerja', tanggal: '2024-07-02', kategori: 'Legal' },
  ];
  const tbody = document.querySelector('#documentsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  docs.forEach(doc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${doc.no}</td>
      <td>${doc.nama}</td>
      <td>${doc.tanggal}</td>
      <td>${doc.kategori}</td>
      <td><button class='btn btn-secondary' style='padding:4px 10px;font-size:12px' onclick='alert("Preview dokumen hanya demo.")'>Preview</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('changePasswordForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const oldPass = document.getElementById('oldPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  const status = document.getElementById('changePasswordStatus');
  const user = getUser();
  status.style.display = 'block';
  if (oldPass !== user.password) {
    status.textContent = 'Password lama salah!';
    status.style.color = '#dc2626';
    return;
  }
  if (newPass.length < 5) {
    status.textContent = 'Password baru minimal 5 karakter.';
    status.style.color = '#dc2626';
    return;
  }
  if (newPass !== confirmPass) {
    status.textContent = 'Password baru tidak sama.';
    status.style.color = '#dc2626';
    return;
  }
  LS.set(LOGIN_KEY, { username: user.username, password: newPass });
  status.textContent = 'Password berhasil diganti!';
  status.style.color = '#059669';
  setTimeout(()=>{ status.style.display = 'none'; }, 2000);
  document.getElementById('oldPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
});

function exportReportCSV() {
  const txs = LS.get('umkm-transactions', []);
  if (!txs.length) {
    alert('Tidak ada data transaksi untuk diexport.');
    return;
  }
  const header = ['Tanggal','Tipe','Nominal','Deskripsi'];
  const rows = txs.map(t => [t.date, t.type, t.amount, t.desc ? '"'+t.desc.replace(/"/g,'""')+'"' : '']);
  const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\r\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'umkmpro-laporan-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},100);
}
globalThis.exportReportCSV = exportReportCSV;

function importReportCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const lines = e.target.result.split(/\r?\n/).filter(Boolean);
      if (!lines.length) throw new Error('File kosong');
      const header = lines[0].split(',');
      if (header.length < 4) throw new Error('Format header tidak sesuai');
      const txs = LS.get('umkm-transactions', []);
      let added = 0;
      for (let i=1; i<lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 4) continue;
        const [date, type, amount, desc] = cols;
        if (!date || !type || !amount) continue;
        txs.push({
          id: txs.length ? Math.max(...txs.map(t=>t.id))+1 : 1,
          date,
          type,
          amount: Number(amount),
          desc: desc ? desc.replace(/^"|"$/g,'').replace(/""/g,'"') : ''
        });
        added++;
      }
      LS.set('umkm-transactions', txs);
      renderReports();
      alert('Import selesai. ' + added + ' data berhasil ditambahkan.');
    } catch(err) {
      alert('Import gagal: ' + err.message);
    }
  };
  reader.readAsText(file);
}
globalThis.importReportCSV = importReportCSV; 