/**
 * ORGANIZER.JS — Logic Ban Điều Phối & Quản Lý Hoạt Động (Organizer Portal)
 * Tương tác chuẩn: shared/useRepository.js, shared/useStorage.js, shared/useToast.js
 */

let currentRejectAppId = null;
let currentQrAppId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof useRepository !== 'undefined') {
    useRepository.init();
  }
  if (typeof useTheme !== 'undefined') {
    useTheme.init();
  }
  populateActivityFilter();
  renderApplicantsList();
  updateOrganizerStats();

  // Sự kiện lọc & tìm kiếm
  const searchInput = document.getElementById('searchApplicantInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderApplicantsList());
  }

  const statusFilter = document.getElementById('filterStatusSelect');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => renderApplicantsList());
  }

  const actFilter = document.getElementById('filterActivitySelect');
  if (actFilter) {
    actFilter.addEventListener('change', () => renderApplicantsList());
  }
});

function populateActivityFilter() {
  const select = document.getElementById('filterActivitySelect');
  if (!select) return;

  const activities = useRepository.getActivities();
  const options = ['<option value="">-- Tất cả hoạt động --</option>'];
  activities.forEach(a => {
    options.push(`<option value="${a.id}">${a.title}</option>`);
  });
  select.innerHTML = options.join('');
}

function updateOrganizerStats() {
  const allActs = useRepository.getActivities();
  const allApps = useRepository.getApplications();

  const statActs = document.getElementById('statMyActs');
  const statTotal = document.getElementById('statTotalApps');
  const statApproved = document.getElementById('statApprovedApps');
  const statChecked = document.getElementById('statCheckedIn');

  if (statActs) statActs.textContent = allActs.length;
  if (statTotal) statTotal.textContent = allApps.length;
  if (statApproved) {
    statApproved.textContent = allApps.filter(a => a.status === 'approved' || a.status === 'Đã duyệt').length;
  }
  if (statChecked) {
    statChecked.textContent = allApps.filter(a => a.checkinStatus === 'checked_in' || a.checkedIn).length;
  }
}

function renderApplicantsList() {
  const container = document.getElementById('applicantsTableBody');
  if (!container) return;

  let list = useRepository.getApplications();

  // Tìm kiếm theo từ khóa
  const q = document.getElementById('searchApplicantInput') 
    ? document.getElementById('searchApplicantInput').value.trim().toLowerCase() 
    : '';
  if (q) {
    list = list.filter(a => {
      const name = (a.userName || a.name || '').toLowerCase();
      const email = (a.userEmail || a.email || '').toLowerCase();
      const actTitle = (a.activityTitle || a.activity || '').toLowerCase();
      const id = (a.id || '').toLowerCase();
      return name.includes(q) || email.includes(q) || actTitle.includes(q) || id.includes(q);
    });
  }

  // Lọc theo trạng thái
  const statusVal = document.getElementById('filterStatusSelect') 
    ? document.getElementById('filterStatusSelect').value 
    : '';
  if (statusVal) {
    if (statusVal === 'pending') {
      list = list.filter(a => a.status === 'pending' || a.status === 'Chờ duyệt');
    } else if (statusVal === 'approved') {
      list = list.filter(a => a.status === 'approved' || a.status === 'Đã duyệt');
    } else if (statusVal === 'rejected') {
      list = list.filter(a => a.status === 'rejected' || a.status === 'Từ chối');
    } else if (statusVal === 'cancelled') {
      list = list.filter(a => a.status === 'cancelled');
    }
  }

  // Lọc theo hoạt động
  const actVal = document.getElementById('filterActivitySelect') 
    ? document.getElementById('filterActivitySelect').value 
    : '';
  if (actVal) {
    list = list.filter(a => String(a.activityId) === String(actVal));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
          <div style="font-size: 2.2rem; margin-bottom: 6px;"><i class="ri-folder-open-line"></i></div>
          <p style="margin: 0;">Không tìm thấy đơn đăng ký nào phù hợp với bộ lọc.</p>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = list.map(item => {
    const isApproved = item.status === 'approved' || item.status === 'Đã duyệt';
    const isRejected = item.status === 'rejected' || item.status === 'Từ chối';
    const isCancelled = item.status === 'cancelled';
    const isCheckedIn = item.checkinStatus === 'checked_in' || item.checkedIn;

    let statusBadge = '<span class="badge badge-warning"><i class="ri-time-line"></i> Chờ duyệt</span>';
    if (isApproved) {
      statusBadge = '<span class="badge badge-success"><i class="ri-check-line"></i> Đã duyệt</span>';
    } else if (isRejected) {
      statusBadge = '<span class="badge badge-danger"><i class="ri-close-line"></i> Từ chối</span>';
    } else if (isCancelled) {
      statusBadge = '<span class="badge badge-secondary">Đã hủy</span>';
    }

    let checkinBadge = '<span class="badge" style="background: rgba(148,163,184,0.15); color: var(--text-secondary);">Chưa đến</span>';
    if (isCheckedIn) {
      checkinBadge = '<span class="badge badge-success"><i class="ri-checkbox-circle-line"></i> Đã điểm danh (+Cert)</span>';
    }

    let actionsHtml = '';
    if (!isApproved && !isRejected && !isCancelled) {
      actionsHtml = `
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary" onclick="approveApp('${item.id}')" title="Phê duyệt tham gia">
            Duyệt
          </button>
          <button type="button" class="btn btn-sm btn-outline btn-danger" onclick="openRejectModal('${item.id}')" title="Từ chối đơn">
            Từ chối
          </button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="openAppDetailModal('${item.id}')" title="Chi tiết">
            <i class="ri-eye-line"></i>
          </button>
        </div>
      `;
    } else if (isApproved) {
      actionsHtml = `
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm ${isCheckedIn ? 'btn-outline' : 'btn-secondary'}" onclick="toggleCheckin('${item.id}')" title="${isCheckedIn ? 'Hủy điểm danh' : 'Xác nhận điểm danh & cấp cert'}">
            ${isCheckedIn ? 'Hủy điểm danh' : '<i class="ri-qr-scan-2-line"></i> Điểm danh'}
          </button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="openQrModal('${item.id}')" title="Quét mã QR">
            <i class="ri-qr-code-line"></i> QR
          </button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="openAppDetailModal('${item.id}')" title="Chi tiết">
            <i class="ri-eye-line"></i>
          </button>
        </div>
      `;
    } else {
      actionsHtml = `
        <button type="button" class="btn btn-sm btn-ghost" onclick="openAppDetailModal('${item.id}')" title="Xem chi tiết" style="display: inline-flex; align-items: center; gap: 4px;">
          <i class="ri-eye-line"></i> Chi tiết
        </button>
      `;
    }

    return `
      <tr>
        <td><strong style="font-family: monospace; font-size: 0.76rem;">${item.id}</strong></td>
        <td>
          <strong>${item.userName || item.name || 'Tình nguyện viên'}</strong><br>
          <small style="color: var(--text-secondary); font-size: 0.72rem;">${item.userEmail || item.email || ''}</small>
        </td>
        <td>
          <span style="font-weight: 600;">${item.activityTitle || item.activity || ''}</span><br>
          <small style="color: var(--text-secondary); font-size: 0.72rem;">${item.date || ''}</small>
        </td>
        <td style="font-size: 0.76rem;">${item.shift || 'Cả ngày'}</td>
        <td>${statusBadge}</td>
        <td>${checkinBadge}</td>
        <td>${actionsHtml}</td>
      </tr>
    `;
  }).join('');
}

// Phê duyệt đơn
window.approveApp = function(id) {
  const res = useRepository.reviewApplication(id, 'approve');
  if (res.success) {
    useToast.show(`Đã phê duyệt đơn thành công cho ứng viên!`, 'success');
    renderApplicantsList();
    updateOrganizerStats();
  } else {
    useToast.show(res.message || 'Có lỗi xảy ra', 'warning');
  }
};

// Mở modal từ chối
window.openRejectModal = function(id) {
  currentRejectAppId = id;
  const modal = document.getElementById('rejectModal');
  const reasonInput = document.getElementById('rejectReasonInput');
  if (reasonInput) reasonInput.value = 'Đã đủ số lượng tiếp nhận cho vị trí này.';
  if (modal) modal.style.display = 'flex';
};

window.closeRejectModal = function() {
  currentRejectAppId = null;
  const modal = document.getElementById('rejectModal');
  if (modal) modal.style.display = 'none';
};

window.confirmRejectApp = function() {
  if (!currentRejectAppId) return;
  const reason = document.getElementById('rejectReasonInput') 
    ? document.getElementById('rejectReasonInput').value.trim() 
    : 'Chưa phù hợp với yêu cầu';

  const res = useRepository.reviewApplication(currentRejectAppId, 'reject', reason);
  closeRejectModal();

  if (res.success) {
    useToast.show('Đã từ chối đơn và gửi thông báo lý do tới ứng viên.', 'info');
    renderApplicantsList();
    updateOrganizerStats();
  } else {
    useToast.show(res.message || 'Có lỗi xảy ra', 'warning');
  }
};

// Quét điểm danh & Cấp chứng nhận
window.toggleCheckin = function(id) {
  const res = useRepository.checkinParticipant(id);
  if (res.success) {
    useToast.show(res.message, 'success');
    renderApplicantsList();
    updateOrganizerStats();
  } else {
    useToast.show(res.message || 'Không thể điểm danh', 'warning');
  }
};

// Modal Quét QR
window.openQrModal = function(id) {
  currentQrAppId = id;
  const modal = document.getElementById('qrModal');
  const codeEl = document.getElementById('qrTargetCode');
  if (codeEl) codeEl.textContent = id;
  if (modal) modal.style.display = 'flex';
};

window.closeQrModal = function() {
  currentQrAppId = null;
  const modal = document.getElementById('qrModal');
  if (modal) modal.style.display = 'none';
};

window.confirmQrCheckin = function() {
  if (!currentQrAppId) return;
  const appId = currentQrAppId;
  closeQrModal();
  toggleCheckin(appId);
};

// Modal Chi tiết ứng viên
window.openAppDetailModal = function(id) {
  const app = useRepository.getApplicationById(id);
  if (!app) return;

  const modal = document.getElementById('appDetailModal');
  const body = document.getElementById('appDetailModalBody');
  if (body) {
    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.82rem;">
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">MÃ ĐƠN:</label>
          <div style="font-weight: 700;">${app.id}</div>
        </div>
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">NGÀY NỘP:</label>
          <div>${app.appliedAt || '10/10/2026'}</div>
        </div>
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">HỌ VÀ TÊN:</label>
          <div style="font-weight: 700;">${app.userName || app.name || ''}</div>
        </div>
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">EMAIL:</label>
          <div>${app.userEmail || app.email || ''}</div>
        </div>
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">SỐ ĐIỆN THOẠI:</label>
          <div>${app.userPhone || app.phone || '0901 234 567'}</div>
        </div>
        <div>
          <label style="color: var(--text-secondary); font-size: 0.72rem;">CA ĐĂNG KÝ:</label>
          <div>${app.shift || 'Cả ngày'}</div>
        </div>
        <div style="grid-column: 1 / -1;">
          <label style="color: var(--text-secondary); font-size: 0.72rem;">HOẠT ĐỘNG:</label>
          <div style="font-weight: 700; color: #10b981;">${app.activityTitle || app.activity || ''}</div>
        </div>
        <div style="grid-column: 1 / -1;">
          <label style="color: var(--text-secondary); font-size: 0.72rem;">LÝ DO & NGUYỆN VỌNG:</label>
          <div style="background: var(--bg-surface); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-default);">
            ${app.reason || app.experience || 'Mong muốn đóng góp sức trẻ cho hoạt động thiện nguyện.'}
          </div>
        </div>
        ${app.rejectReason ? `
          <div style="grid-column: 1 / -1; color: var(--status-danger);">
            <label style="font-size: 0.72rem;">LÝ DO TỪ CHỐI:</label>
            <div>${app.rejectReason}</div>
          </div>
        ` : ''}
      </div>
    `;
  }
  if (modal) modal.style.display = 'flex';
};

window.closeAppDetailModal = function() {
  const modal = document.getElementById('appDetailModal');
  if (modal) modal.style.display = 'none';
};

// Xuất file CSV báo cáo thực tế
window.exportApplicantsCSV = function() {
  const list = useRepository.getApplications();
  if (list.length === 0) {
    useToast.show('Không có dữ liệu để xuất file CSV!', 'warning');
    return;
  }

  const headers = ['Mã Đơn', 'Họ Tên', 'Email', 'SĐT', 'Hoạt Động', 'Ca Trực', 'Trạng Thái Duyệt', 'Điểm Danh', 'Số Giờ', 'Ngày Nộp'];
  const rows = list.map(a => [
    `"${a.id || ''}"`,
    `"${(a.userName || a.name || '').replace(/"/g, '""')}"`,
    `"${a.userEmail || a.email || ''}"`,
    `"${a.userPhone || a.phone || ''}"`,
    `"${(a.activityTitle || a.activity || '').replace(/"/g, '""')}"`,
    `"${a.shift || ''}"`,
    `"${a.status || ''}"`,
    `"${a.checkinStatus === 'checked_in' ? 'Đã điểm danh' : 'Chưa điểm danh'}"`,
    `"${a.verifiedHours || 0}"`,
    `"${a.appliedAt || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `danh-sach-ung-vien-volunteerhub-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  useToast.show(`Đã xuất thành công file báo cáo CSV (${list.length} bản ghi)!`, 'success');
};
