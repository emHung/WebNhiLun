/**
 * VOLUNTEER.JS — Logic riêng cho phân hệ Tình nguyện viên (Volunteer Portal)
 * Tương tác với: data/seedData.js, shared/useStorage.js, shared/useRepository.js, shared/useToast.js, shared/useTheme.js, shared/useAuth.js, shared/useNotification.js
 */

let currentTabFilter = 'all';
let currentSearchTerm = '';
let currentSortOrder = 'newest';
let currentCertIndex = 0;
let userCertificates = [];

document.addEventListener('DOMContentLoaded', () => {
  if (window.useTheme) useTheme.init();
  initVolunteerDashboard();
});

function initVolunteerDashboard() {
  bindDashboardEvents();
  renderVolunteerDashboard();
  renderMiniCalendar();
  renderCertificateWidget();
  renderSidebarNotifications();
}

function bindDashboardEvents() {
  // Search input
  const searchInput = document.getElementById('regSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.trim().toLowerCase();
      renderVolunteerDashboard();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('regSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortOrder = e.target.value;
      renderVolunteerDashboard();
    });
  }

  // Tabs
  const tabBtns = document.querySelectorAll('.v-tab-btn, [data-tab]');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTabFilter = btn.getAttribute('data-tab') || 'all';
      renderVolunteerDashboard();
    });
  });

  // Certificate carousel buttons
  const prevCertBtn = document.getElementById('prevCertBtn');
  const nextCertBtn = document.getElementById('nextCertBtn');
  if (prevCertBtn) {
    prevCertBtn.addEventListener('click', () => {
      if (userCertificates.length === 0) return;
      currentCertIndex = (currentCertIndex - 1 + userCertificates.length) % userCertificates.length;
      updateCertWidgetDisplay();
    });
  }
  if (nextCertBtn) {
    nextCertBtn.addEventListener('click', () => {
      if (userCertificates.length === 0) return;
      currentCertIndex = (currentCertIndex + 1) % userCertificates.length;
      updateCertWidgetDisplay();
    });
  }
}

function renderVolunteerDashboard() {
  const curUser = (window.useAuth && useAuth.getCurrentUser()) || { id: 'USR-001', name: 'Nguyễn Văn An' };
  const allApps = (window.useRepository && useRepository.getApplications({ userId: curUser.id })) 
    || (window.useStorage && useStorage.get('vh_user_apps', [])) 
    || [];

  // Update KPI Stats
  let totalHours = 0;
  let totalCerts = 0;
  let upcomingCount = 0;

  if (window.useRepository) {
    userCertificates = useRepository.getCertificates(curUser.id) || [];
    totalCerts = userCertificates.length;
    userCertificates.forEach(c => {
      totalHours += (c.hours || 0);
    });
  }

  allApps.forEach(a => {
    if (a.status === 'approved' && a.checkinStatus !== 'checked_in') {
      upcomingCount++;
    }
  });

  // Update DOM KPI elements
  const hoursEl = document.getElementById('statTotalHours');
  const certsEl = document.getElementById('statTotalCerts');
  const appsEl = document.getElementById('statTotalApps');
  const upcomingEl = document.getElementById('statUpcomingCount');

  if (hoursEl) hoursEl.innerText = (totalHours > 0 ? totalHours : 30) + ' giờ';
  if (certsEl) certsEl.innerText = totalCerts > 0 ? totalCerts : 3;
  if (appsEl) appsEl.innerText = allApps.length;
  if (upcomingEl) upcomingEl.innerText = Math.max(upcomingCount, 1);

  // Tab counters
  updateTabCounts(allApps);

  // Filter and sort apps
  let filteredApps = allApps.filter(app => {
    // Status filter
    const isCompleted = app.checkinStatus === 'checked_in' || app.hasCert || app.status === 'completed';
    const isApproved = (app.status === 'approved' || app.status === 'Đã duyệt') && !isCompleted;
    const isPending = app.status === 'pending' || app.status === 'Chờ duyệt';
    const isCancelled = app.status === 'cancelled' || app.status === 'Đã hủy';
    const isInProgress = app.status === 'in_progress';

    if (currentTabFilter === 'completed' && !isCompleted) return false;
    if (currentTabFilter === 'pending' && !isPending) return false;
    if (currentTabFilter === 'accepted' && !isApproved) return false;
    if (currentTabFilter === 'cancelled' && !isCancelled) return false;
    if (currentTabFilter === 'in_progress' && !isInProgress) return false;

    // Search filter
    if (currentSearchTerm) {
      const matchTitle = (app.activityTitle || '').toLowerCase().includes(currentSearchTerm);
      const matchOrg = (app.organizer || '').toLowerCase().includes(currentSearchTerm);
      const matchId = (app.id || '').toLowerCase().includes(currentSearchTerm);
      if (!matchTitle && !matchOrg && !matchId) return false;
    }

    return true;
  });

  // Sorting
  if (currentSortOrder === 'oldest') {
    filteredApps.sort((a, b) => (a.id > b.id ? 1 : -1));
  } else {
    filteredApps.sort((a, b) => (a.id < b.id ? 1 : -1));
  }

  // Render to Cards Container (#registeredAppsList)
  const cardsContainer = document.getElementById('registeredAppsList');
  if (cardsContainer) {
    if (filteredApps.length === 0) {
      cardsContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-secondary); background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <div style="margin-bottom: 6px;"><i class="ri-folder-open-line" style="font-size: 2.2rem; color: #94a3b8;"></i></div>
          <div style="font-size: 0.9rem; font-weight: 600; color: #475569;">Không tìm thấy hoạt động nào trong mục này</div>
          <p style="font-size: 0.78rem; margin: 4px 0 12px 0;">Hãy chuyển tab hoặc khám phá thêm các chiến dịch mới nhé!</p>
          <a href="../activities.html" class="v-hero-cta" style="padding: 6px 16px; font-size: 0.76rem; display: inline-flex; align-items: center; gap: 4px;"><i class="ri-compass-3-line"></i> Khám phá ngay</a>
        </div>
      `;
    } else {
      cardsContainer.innerHTML = filteredApps.map(app => renderRegisteredCard(app)).join('');
    }
  }

  // Backward compatibility with table (#applicationsTableBody)
  const tableBody = document.getElementById('applicationsTableBody');
  if (tableBody) {
    if (filteredApps.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 28px 16px; color: var(--text-secondary);">
            Không tìm thấy hoạt động phù hợp.
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = filteredApps.map(app => {
        const isCheckedIn = app.checkinStatus === 'checked_in' || app.hasCert;
        const isPending = app.status === 'pending' || app.status === 'Chờ duyệt';
        const isApproved = (app.status === 'approved' || app.status === 'Đã duyệt') && !isCheckedIn;
        const isCancelled = app.status === 'cancelled' || app.status === 'Đã hủy';

        let badgeClass = 'badge-warning';
        let statusLabel = app.statusText || 'Chờ duyệt';
        if (isCheckedIn) { badgeClass = 'badge-mint'; statusLabel = '<i class="ri-checkbox-circle-line"></i> Đã hoàn thành'; }
        else if (isApproved) { badgeClass = 'badge-success'; statusLabel = 'Đã duyệt'; }
        else if (isCancelled) { badgeClass = 'badge-gray'; statusLabel = 'Đã hủy'; }

        return `
          <tr>
            <td><code>${app.id}</code></td>
            <td><strong>${app.activityTitle}</strong><br><small style="color:var(--text-secondary)">${app.organizer || 'Ban tổ chức'}</small></td>
            <td>${app.date || 'Sắp diễn ra'}</td>
            <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
            <td>${isCheckedIn ? `<strong>+${app.verifiedHours || 6} giờ</strong>` : '—'}</td>
            <td>
              ${isCheckedIn
                ? `<button type="button" class="btn btn-sm btn-primary" onclick="openCertModal('${app.id}', '${app.activityTitle.replace(/'/g, "\\'")}', ${app.verifiedHours || 6})">📜 Chứng nhận</button>`
                : (isPending || isApproved)
                  ? `<button type="button" class="btn btn-sm btn-outline btn-danger" onclick="cancelApp('${app.id}')">Hủy đơn</button>`
                  : `<span style="font-size: 0.75rem; color: var(--text-secondary);">—</span>`
              }
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

function updateTabCounts(allApps) {
  let counts = {
    all: allApps.length,
    pending: 0,
    accepted: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  };

  allApps.forEach(a => {
    const isCompleted = a.checkinStatus === 'checked_in' || a.hasCert || a.status === 'completed';
    const isApproved = (a.status === 'approved' || a.status === 'Đã duyệt') && !isCompleted;
    const isPending = a.status === 'pending' || a.status === 'Chờ duyệt';
    const isCancelled = a.status === 'cancelled' || a.status === 'Đã hủy';
    const isInProgress = a.status === 'in_progress';

    if (isCompleted) counts.completed++;
    else if (isApproved) counts.accepted++;
    else if (isPending) counts.pending++;
    else if (isCancelled) counts.cancelled++;
    else if (isInProgress) counts.in_progress++;
  });

  const tabPills = document.querySelectorAll('[data-tab]');
  tabPills.forEach(pill => {
    const tab = pill.getAttribute('data-tab');
    const label = pill.getAttribute('data-label') || pill.innerText.split('(')[0].trim();
    if (counts[tab] !== undefined) {
      pill.setAttribute('data-label', label);
      pill.innerText = `${label} (${counts[tab]})`;
    }
  });
}

function renderRegisteredCard(app) {
  const isCompleted = app.checkinStatus === 'checked_in' || app.hasCert || app.status === 'completed';
  const isPending = app.status === 'pending' || app.status === 'Chờ duyệt';
  const isCancelled = app.status === 'cancelled' || app.status === 'Đã hủy';

  let banner = 'images/act-tree.jpg';
  let category = 'Môi trường';
  let location = 'TP. Hồ Chí Minh';
  let categoryClass = '';

  if (app.activityId === 'ACT-002' || (app.activityTitle && app.activityTitle.includes('Tủ sách'))) {
    banner = 'images/act-books.jpg';
    category = 'Giáo dục';
    location = 'Bình Phước';
    categoryClass = 'edu';
  } else if (app.activityId === 'ACT-003') {
    banner = 'images/act-food.jpg';
    category = 'Cộng đồng';
  } else if (app.activityId === 'ACT-006') {
    banner = 'images/act-beach.jpg';
    category = 'Môi trường';
    location = 'Bình Thuận';
  }

  // Prepend ../ if in subfolder
  const inSubDir = window.location.pathname.includes('/volunteer/') || window.location.pathname.includes('/NhiLun/');
  const imgPath = inSubDir ? '../' + banner : banner;
  const detailUrl = inSubDir ? `../detail.html?id=${app.activityId || 'ACT-001'}` : `detail.html?id=${app.activityId || 'ACT-001'}`;

  if (isCompleted) {
    return `
      <div class="v-reg-item">
        <div class="v-reg-left">
          <img src="${imgPath}" alt="${app.activityTitle}" class="v-reg-thumb" onerror="this.src='../images/act-tree.jpg'">
          <div class="v-reg-content">
            <span class="v-reg-code">${app.id}</span>
            <h3 class="v-reg-title">${app.activityTitle}</h3>
            <div class="v-reg-org">${app.organizer || 'Ban tổ chức'}</div>
            <div class="v-reg-tags">
              <span class="v-reg-cat-pill ${categoryClass}"><i class="ri-leaf-line"></i> ${category}</span>
              <span class="v-reg-tag"><i class="ri-map-pin-line"></i> ${location}</span>
              <span class="v-reg-tag"><i class="ri-calendar-line"></i> ${app.date || '24/10/2026'}</span>
            </div>
          </div>
        </div>

        <div class="v-reg-right">
          <div class="v-reg-status-block">
            <span class="v-status-badge completed"><i class="ri-checkbox-circle-line"></i> Đã hoàn thành</span>
            <div class="v-reg-progress-wrap">
              <div class="v-reg-progress-label">6/6 giờ</div>
              <div class="v-reg-progress-bar">
                <div class="v-reg-progress-fill" style="width: 100%;"></div>
              </div>
              <div class="v-reg-verified-text">+6 giờ đã xác nhận</div>
            </div>
          </div>
          <div class="v-reg-actions">
            <button type="button" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:4px; font-weight:600;" onclick="openCertModal('${app.id}', '${app.activityTitle.replace(/'/g, "\\'")}', ${app.verifiedHours || 6})">
              <i class="ri-award-line"></i> Xem chứng nhận
            </button>
            <a href="${detailUrl}" class="btn btn-sm btn-outline" style="display:inline-flex; align-items:center; gap:4px; justify-content:center;">
              <i class="ri-eye-line"></i> Xem chi tiết
            </a>
          </div>
        </div>
      </div>
    `;
  }

  if (isPending) {
    return `
      <div class="v-reg-item">
        <div class="v-reg-left">
          <img src="${imgPath}" alt="${app.activityTitle}" class="v-reg-thumb" onerror="this.src='../images/act-books.jpg'">
          <div class="v-reg-content">
            <span class="v-reg-code">${app.id}</span>
            <h3 class="v-reg-title">${app.activityTitle}</h3>
            <div class="v-reg-org">${app.organizer || 'Ban tổ chức'}</div>
            <div class="v-reg-tags">
              <span class="v-reg-cat-pill ${categoryClass}"><i class="ri-book-open-line"></i> ${category}</span>
              <span class="v-reg-tag"><i class="ri-map-pin-line"></i> ${location}</span>
              <span class="v-reg-tag"><i class="ri-calendar-line"></i> ${app.date || '02/11/2026'}</span>
            </div>
          </div>
        </div>

        <div class="v-reg-right">
          <div class="v-reg-status-block">
            <span class="v-status-badge pending"><i class="ri-time-line"></i> Chờ duyệt</span>
            <div class="v-reg-msg-box">
              Hồ sơ đang được ban tổ chức xem xét. Vui lòng chờ thông báo kết quả.
            </div>
          </div>
          <div class="v-reg-actions">
            <button type="button" class="btn btn-sm btn-outline btn-danger" style="display:inline-flex; align-items:center; gap:4px; justify-content:center;" onclick="cancelApp('${app.id}')">
              <i class="ri-delete-bin-line"></i> Hủy đơn
            </button>
            <a href="${detailUrl}" class="btn btn-sm btn-outline" style="display:inline-flex; align-items:center; gap:4px; justify-content:center;">
              <i class="ri-eye-line"></i> Xem chi tiết
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Cancelled or other status
  return `
    <div class="v-reg-item" style="opacity: 0.85;">
      <div class="v-reg-left">
        <img src="${imgPath}" alt="${app.activityTitle}" class="v-reg-thumb">
        <div class="v-reg-content">
          <span class="v-reg-code">${app.id}</span>
          <h3 class="v-reg-title">${app.activityTitle}</h3>
          <div class="v-reg-org">${app.organizer || 'Ban tổ chức'}</div>
          <div class="v-reg-tags">
            <span class="v-reg-tag"><i class="ri-calendar-line"></i> ${app.date || 'Sắp diễn ra'}</span>
          </div>
        </div>
      </div>
      <div class="v-reg-right">
        <span class="v-status-badge" style="background:#f1f5f9; color:#64748b;">${isCancelled ? 'Đã hủy' : (app.statusText || 'Đã đóng')}</span>
        <a href="${detailUrl}" class="btn btn-sm btn-outline" style="display:inline-flex; align-items:center; gap:4px;"><i class="ri-eye-line"></i> Xem lại</a>
      </div>
    </div>
  `;
}

function renderMiniCalendar() {
  const container = document.getElementById('miniCalendarDays');
  if (!container) return;

  // Calendar for October 2026
  // October 1st 2026 is Thursday (T5).
  // Days of Oct 2026: 31 days.
  // Leading blank spaces for Mon, Tue, Wed: 3 empty cells.
  let html = '';
  // 3 empty slots before Thursday
  for (let i = 0; i < 3; i++) {
    html += `<div class="v-cal-day" style="opacity: 0.3;">${28 + i}</div>`;
  }

  for (let day = 1; day <= 31; day++) {
    let classes = 'v-cal-day';
    if (day === 24) {
      classes += ' active-participated'; // Đã tham gia (Ngày hội trồng cây)
    } else if (day === 18) {
      classes += ' active-upcoming'; // Sắp diễn ra (Làm sạch bờ biển)
    }
    html += `<div class="${classes}" onclick="onCalendarDayClick(${day})">${day}</div>`;
  }

  container.innerHTML = html;
}

window.onCalendarDayClick = function(day) {
  if (day === 24) {
    if (window.useToast) useToast.show('Ngày 24/10: Ngày hội trồng 1.000 cây xanh (Đã hoàn thành)', 'success');
  } else if (day === 18) {
    if (window.useToast) useToast.show('Ngày 18/10: Làm sạch bờ biển Bình Thuận (Sắp diễn ra)', 'info');
  } else {
    if (window.useToast) useToast.show(`Ngày ${day}/10/2026: Không có lịch trình thiện nguyện`, 'info');
  }
};

function renderCertificateWidget() {
  const curUser = (window.useAuth && useAuth.getCurrentUser()) || { id: 'USR-001' };
  if (window.useRepository) {
    userCertificates = useRepository.getCertificates(curUser.id) || [];
  }
  if (!userCertificates || userCertificates.length === 0) {
    userCertificates = [
      {
        id: "CERT-001",
        certificateCode: "CERT-2026-001",
        title: "Ngày hội trồng 1.000 cây xanh",
        badgeType: "Chứng nhận tham gia",
        issueDate: "24/10/2026",
        hours: 6
      },
      {
        id: "CERT-002",
        certificateCode: "CERT-2026-002",
        title: "20 Giờ Cống Hiến Vì Cộng Đồng",
        badgeType: "Huy hiệu cống hiến",
        issueDate: "15/07/2026",
        hours: 20
      },
      {
        id: "CERT-003",
        certificateCode: "CERT-2026-003",
        title: "Tình Nguyện Viên Năng Động",
        badgeType: "Chứng nhận xuất sắc",
        issueDate: "01/06/2026",
        hours: 4
      }
    ];
  }
  updateCertWidgetDisplay();
}

function updateCertWidgetDisplay() {
  const cert = userCertificates[currentCertIndex] || userCertificates[0];
  if (!cert) return;

  const typeEl = document.getElementById('widgetCertType');
  const titleEl = document.getElementById('widgetCertTitle');
  const dateEl = document.getElementById('widgetCertDate');
  const hoursEl = document.getElementById('widgetCertHours');
  const dotsEl = document.getElementById('widgetCertDots');

  if (typeEl) typeEl.innerText = cert.badgeType || 'Chứng nhận tham gia';
  if (titleEl) titleEl.innerText = cert.title || 'Chiến sĩ vì môi trường';
  if (dateEl) dateEl.innerText = cert.issueDate || '24/10/2026';
  if (hoursEl) hoursEl.innerText = `${cert.hours || 6} giờ tình nguyện`;

  if (dotsEl) {
    dotsEl.innerHTML = userCertificates.map((c, i) => `
      <div class="v-cert-dot ${i === currentCertIndex ? 'active' : ''}" onclick="selectCertIndex(${i})"></div>
    `).join('');
  }
}

window.selectCertIndex = function(index) {
  currentCertIndex = index;
  updateCertWidgetDisplay();
};

window.previewCurrentCert = function() {
  const cert = userCertificates[currentCertIndex] || userCertificates[0];
  if (cert) {
    openCertModal(cert.id, cert.title, cert.hours);
  }
};

function renderSidebarNotifications() {
  const listEl = document.getElementById('sideNotifList');
  if (!listEl) return;

  const notifs = [
    {
      icon: '<i class="ri-heart-line"></i>',
      colorClass: 'red',
      title: 'Đơn đăng ký của bạn đang được xem xét',
      desc: 'Tủ sách trao em – Đem tri thức đến trường vùng sâu',
      time: '2 giờ trước'
    },
    {
      icon: '<i class="ri-award-line"></i>',
      colorClass: 'green',
      title: 'Chứng nhận đã được cấp',
      desc: 'Ngày hội trồng 1.000 cây xanh',
      time: '1 ngày trước'
    },
    {
      icon: '<i class="ri-compass-3-line"></i>',
      colorClass: 'blue',
      title: 'Có hoạt động mới phù hợp với bạn',
      desc: 'Khám bệnh & cấp phát thuốc miễn phí',
      time: '2 ngày trước'
    }
  ];

  listEl.innerHTML = notifs.map(n => `
    <a href="../notifications.html" class="v-side-notif-item">
      <div class="v-side-notif-icon ${n.colorClass}">${n.icon}</div>
      <div class="v-side-notif-body">
        <div class="v-side-notif-title">${n.title}</div>
        <div class="v-side-notif-sub">${n.desc}</div>
        <div class="v-side-notif-time">${n.time}</div>
      </div>
    </a>
  `).join('');
}

window.toggleBookmark = function(btn) {
  if (!btn) return;
  const isBookmarked = btn.getAttribute('data-bookmarked') === 'true';
  if (isBookmarked) {
    btn.setAttribute('data-bookmarked', 'false');
    btn.innerHTML = '<i class="ri-heart-line"></i>';
    btn.style.color = '#ef4444';
    if (window.useToast) useToast.show('Đã bỏ lưu hoạt động', 'info');
  } else {
    btn.setAttribute('data-bookmarked', 'true');
    btn.innerHTML = '<i class="ri-heart-fill"></i>';
    btn.style.color = '#ef4444';
    if (window.useToast) useToast.show('Đã lưu hoạt động vào danh sách yêu thích!', 'success');
  }
};

window.cancelApp = function (appId) {
  if (confirm(`Bạn có chắc chắn muốn hủy đơn đăng ký [${appId}] không?`)) {
    if (window.useRepository) {
      const res = useRepository.cancelApplication(appId);
      if (res.success) {
        if (window.useToast) useToast.show(res.message, 'info');
      } else {
        if (window.useToast) useToast.show(res.message, 'error');
      }
    } else {
      let apps = useStorage.get('vh_user_apps', []);
      apps = apps.filter(a => a.id !== appId);
      useStorage.set('vh_user_apps', apps);
      if (window.useToast) useToast.show('Đã hủy đơn đăng ký thành công.', 'info');
    }
    renderVolunteerDashboard();
  }
};

window.viewCert = function (appId, title) {
  openCertModal(appId, title, 6);
};

window.openCertModal = function (appId, title, hours) {
  let modal = document.getElementById('volunteerCertModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'volunteerCertModal';
    modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(4px);';
    modal.innerHTML = `
      <div style="background:#ffffff; border-radius:18px; max-width:540px; width:92%; padding:28px 24px; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.3); border: 4px double #d97706; text-align:center;">
        <button onclick="closeCertModal()" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:1.8rem; cursor:pointer; color:#94a3b8;">&times;</button>
        <div style="font-size:2.8rem; margin-bottom:8px; color: #f59e0b;"><i class="ri-award-fill"></i></div>
        <div style="font-size:0.78rem; font-weight:700; color:#b45309; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-size:0.7rem; color:#64748b; margin-bottom:14px;">Độc lập - Tự do - Hạnh phúc</div>
        <h2 style="font-size:1.35rem; color:#0f172a; margin:0 0 10px 0; font-family:serif;">CHỨNG NHẬN ĐIỆN TỬ CHÍNH THỨC</h2>
        <p style="font-size:0.85rem; color:#475569; margin:0 0 16px 0;">Chứng nhận tình nguyện viên xuất sắc hoàn thành nhiệm vụ:</p>
        <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:12px; padding:12px 16px; margin-bottom:16px;">
          <h3 style="margin:0 0 4px 0; font-size:1.05rem; color:#92400e;" id="modalCertActTitle">Hoạt động</h3>
          <div style="font-size:0.82rem; color:#78350f;">Mã tra cứu: <code id="modalCertCode">CERT-XXX</code> • Ghi nhận: <strong id="modalCertHours">6 giờ</strong></div>
        </div>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:20px; flex-wrap:wrap;">
          <a href="../certificates.html" class="btn btn-primary" style="padding:8px 18px;">Xem thư viện chứng nhận</a>
          <button type="button" class="btn btn-outline" onclick="window.print()" style="display: inline-flex; align-items: center; gap: 4px;"><i class="ri-printer-line"></i> In chứng nhận</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modalCertActTitle').textContent = title || 'Chiến dịch thiện nguyện';
  document.getElementById('modalCertCode').textContent = (appId && appId.startsWith('CERT-')) ? appId : 'CERT-' + (appId || '2026-001');
  document.getElementById('modalCertHours').textContent = (hours || 6) + ' giờ tình nguyện';
  modal.style.display = 'flex';
};

window.closeCertModal = function () {
  const modal = document.getElementById('volunteerCertModal');
  if (modal) modal.style.display = 'none';
};
