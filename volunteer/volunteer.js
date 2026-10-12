/**
 * VOLUNTEER.JS — Logic riêng cho phân hệ Tình nguyện viên (Volunteer Portal)
 * Tương tác với: shared/useStorage.js, shared/useToast.js, shared/useTheme.js
 */

document.addEventListener('DOMContentLoaded', () => {
  useTheme.init();
  renderVolunteerDashboard();
});

// Dữ liệu mẫu đơn đăng ký ban đầu (nếu chưa có trong localStorage)
const defaultApps = [
  {
    id: "APP-2026-001",
    activityTitle: "Ngày hội trồng 1.000 cây xanh vì môi trường",
    organizer: "Quỹ Xanh Việt Nam",
    date: "24/10/2026",
    status: "approved",
    statusText: "Đã xác nhận",
    verifiedHours: 6,
    hasCert: true
  },
  {
    id: "APP-2026-002",
    activityTitle: "Tủ sách trao em - Đem tri thức đến trường vùng sâu",
    organizer: "CLB Ánh Sáng Tương Lai",
    date: "02/11/2026",
    status: "pending",
    statusText: "Chờ duyệt",
    verifiedHours: 0,
    hasCert: false
  }
];

function renderVolunteerDashboard() {
  const listContainer = document.getElementById('applicationsTableBody');
  const apps = useStorage.get('vh_user_apps', defaultApps);

  if (!listContainer) return;
  listContainer.innerHTML = '';

  let totalHours = 0;
  let totalCerts = 0;

  apps.forEach(app => {
    if (app.status === 'approved') {
      totalHours += app.verifiedHours;
      if (app.hasCert) totalCerts++;
    }

    const badgeClass = app.status === 'approved' ? 'badge-success' : 'badge-warning';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${app.id}</code></td>
      <td><strong>${app.activityTitle}</strong><br><small style="color:var(--text-secondary)">${app.organizer}</small></td>
      <td>${app.date}</td>
      <td><span class="badge ${badgeClass}">${app.statusText}</span></td>
      <td>${app.verifiedHours > 0 ? `<strong>${app.verifiedHours} giờ</strong>` : '—'}</td>
      <td>
        ${app.hasCert
        ? `<button class="btn btn-sm btn-primary" onclick="viewCert('${app.id}', '${app.activityTitle}')">📜 Chứng nhận</button>`
        : `<button class="btn btn-sm btn-outline btn-danger" onclick="cancelApp('${app.id}')">Hủy đơn</button>`}
      </td>
    `;
    listContainer.appendChild(tr);
  });

  // Cập nhật số liệu thống kê
  const hoursEl = document.getElementById('statTotalHours');
  const certsEl = document.getElementById('statTotalCerts');
  const appsEl = document.getElementById('statTotalApps');

  if (hoursEl) hoursEl.innerText = totalHours + ' giờ';
  if (certsEl) certsEl.innerText = totalCerts;
  if (appsEl) appsEl.innerText = apps.length;
}

window.cancelApp = function (appId) {
  if (confirm(`Bạn có chắc chắn muốn hủy đơn đăng ký [${appId}] không?`)) {
    let apps = useStorage.get('vh_user_apps', defaultApps);
    apps = apps.filter(a => a.id !== appId);
    useStorage.set('vh_user_apps', apps);
    useToast.show('Đã hủy đơn đăng ký thành công.', 'info');
    renderVolunteerDashboard();
  }
};

window.viewCert = function (appId, title) {
  alert(`📜 CHỨNG NHẬN ĐIỆN TỬ CHÍNH THỨC\n\nMã xác thực: CERT-${appId}\nHoạt động: ${title}\nNgười tham gia: Nguyễn Văn An\nTình trạng: ĐÃ XÁC NHẬN HOÀN THÀNH\n\n(Dữ liệu được bảo chứng bởi VolunteerHub)`);
};
