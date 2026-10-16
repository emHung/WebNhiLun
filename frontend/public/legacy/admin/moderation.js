/**
 * MODERATION.JS — Logic Kiểm Duyệt Tổ Chức, Hoạt Động & Audit Logs (Admin Portal)
 * Phụ thuộc: shared/useRepository.js, shared/useStorage.js, shared/useToast.js
 */

let rejectContext = { type: null, id: null };

document.addEventListener('DOMContentLoaded', () => {
  if (typeof useRepository !== 'undefined') {
    useRepository.init();
  }
  if (typeof useTheme !== 'undefined') {
    useTheme.init();
  }
  refreshAllModeration();

  // Search & Filters
  const orgSearch = document.getElementById('searchOrgInput');
  if (orgSearch) orgSearch.addEventListener('input', renderOrgTable);

  const orgStatus = document.getElementById('filterOrgStatus');
  if (orgStatus) orgStatus.addEventListener('change', renderOrgTable);

  const actSearch = document.getElementById('searchActInput');
  if (actSearch) actSearch.addEventListener('input', renderActivityModerationTable);

  const actStatus = document.getElementById('filterActStatus');
  if (actStatus) actStatus.addEventListener('change', renderActivityModerationTable);

  const auditActionFilter = document.getElementById('filterAuditAction');
  if (auditActionFilter) auditActionFilter.addEventListener('change', renderAuditLogsTable);
});

function refreshAllModeration() {
  updateMetrics();
  renderOrgTable();
  renderActivityModerationTable();
  renderAuditLogsTable();
}

function updateMetrics() {
  const orgs = useRepository.getOrganizations();
  const acts = useRepository.getActivities();
  const users = useStorage.get('vh_users', []);
  const logs = useRepository.getAuditLogs();

  const pendingOrgs = orgs.filter(o => o.status === 'pending' || !o.verified).length;
  const pendingActs = acts.filter(a => a.status === 'Chờ Admin duyệt' || a.status === 'pending').length;

  const elPendingOrgs = document.getElementById('statMetricPendingOrgs');
  const elPendingActs = document.getElementById('statMetricPendingActs');
  const elUsers = document.getElementById('statMetricUsers');
  const elAuditCount = document.getElementById('statMetricAuditCount');

  if (elPendingOrgs) elPendingOrgs.textContent = pendingOrgs;
  if (elPendingActs) elPendingActs.textContent = pendingActs;
  if (elUsers) elUsers.textContent = users.length || 28;
  if (elAuditCount) elAuditCount.textContent = logs.length;
}

/* ==========================================================================
 * 1. KIỂM DUYỆT TỔ CHỨC
 * ========================================================================== */
function renderOrgTable() {
  const tbody = document.getElementById('orgTableBody');
  if (!tbody) return;

  let list = useRepository.getOrganizations();

  const q = document.getElementById('searchOrgInput') ? document.getElementById('searchOrgInput').value.trim().toLowerCase() : '';
  if (q) {
    list = list.filter(o => o.name.toLowerCase().includes(q) || (o.rep && o.rep.toLowerCase().includes(q)));
  }

  const status = document.getElementById('filterOrgStatus') ? document.getElementById('filterOrgStatus').value : '';
  if (status) {
    if (status === 'verified') {
      list = list.filter(o => o.verified || o.status === 'approved');
    } else if (status === 'pending') {
      list = list.filter(o => !o.verified && o.status !== 'rejected');
    } else if (status === 'rejected') {
      list = list.filter(o => o.status === 'rejected');
    }
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 24px;">Không có tổ chức nào phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((o, idx) => {
    const isVerified = o.verified || o.status === 'approved';
    const isRejected = o.status === 'rejected';

    let badge = '<span class="badge badge-warning"><i class="ri-time-line"></i> Chờ duyệt</span>';
    if (isVerified) {
      badge = '<span class="badge badge-success"><i class="ri-check-line"></i> Đã xác nhận</span>';
    } else if (isRejected) {
      badge = '<span class="badge badge-danger"><i class="ri-close-line"></i> Từ chối</span>';
    }

    const orgInitial = o.name.charAt(0);
    return `
      <tr>
        <td style="font-weight: 600; color: #64748b;">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 9px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              ${orgInitial}
            </div>
            <div>
              <strong style="color: #0f172a; font-size: 0.84rem;">${o.name}</strong>
              ${isVerified ? '<span title="Đã xác thực" style="color:#10b981; margin-left: 4px; font-size: 0.95rem; vertical-align: middle;"><i class="ri-verified-badge-fill"></i></span>' : ''}
            </div>
          </div>
        </td>
        <td style="color: #334155; font-weight: 500;">${o.rep || o.representative || 'Chưa cập nhật'}</td>
        <td><span class="badge" style="background:#ecfdf5; color:#047857; border: 1px solid rgba(16, 185, 129, 0.2);"><i class="ri-leaf-line" style="font-size:0.75rem;"></i> ${o.category || 'Môi trường'}</span></td>
        <td><a href="javascript:void(0)" onclick="openOrgDetailModal('${o.id}')" style="font-size:0.75rem; color:#059669; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; text-decoration: none;"><i class="ri-file-pdf-2-line" style="font-size: 0.95rem;"></i> ${o.document || o.docName || 'GiayPhepHoatDong.pdf'}</a></td>
        <td style="color: #64748b; font-size: 0.76rem;">${o.date || o.registeredAt || '10/10/2026'}</td>
        <td>${badge}</td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${!isVerified ? `
              <button class="btn btn-sm btn-primary" onclick="approveOrg('${o.id}')" title="Cấp tích xanh xác thực">Duyệt</button>
              <button class="btn btn-sm btn-outline btn-danger" onclick="openRejectOrgModal('${o.id}')" title="Từ chối hồ sơ">Từ chối</button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="openOrgDetailModal('${o.id}')">Chi tiết</button>
            `}
            <button type="button" class="btn btn-sm btn-ghost" onclick="openOrgDetailModal('${o.id}')" style="border-radius: 50%; width: 28px; height: 28px; padding: 0;" title="Tùy chọn khác"><i class="ri-more-fill"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.approveOrg = function(id) {
  const success = useRepository.updateOrgStatus(id, 'approved');
  if (success) {
    useToast.show('Đã duyệt cấp tích xanh xác thực cho tổ chức!', 'success');
    refreshAllModeration();
  }
};

window.openRejectOrgModal = function(id) {
  rejectContext = { type: 'org', id: id };
  openRejectModal('Từ chối xác thực tổ chức', 'Nhập lý do từ chối hồ sơ pháp lý của tổ chức:');
};

/* ==========================================================================
 * 2. KIỂM DUYỆT HOẠT ĐỘNG
 * ========================================================================== */
function renderActivityModerationTable() {
  const tbody = document.getElementById('actModerationTableBody');
  if (!tbody) return;

  let list = useRepository.getActivities();

  const q = document.getElementById('searchActInput') ? document.getElementById('searchActInput').value.trim().toLowerCase() : '';
  if (q) {
    list = list.filter(a => a.title.toLowerCase().includes(q) || (a.organizer && a.organizer.toLowerCase().includes(q)));
  }

  const status = document.getElementById('filterActStatus') ? document.getElementById('filterActStatus').value : '';
  if (status) {
    if (status === 'published') {
      list = list.filter(a => a.status === 'Đang tuyển');
    } else if (status === 'pending') {
      list = list.filter(a => a.status === 'Chờ Admin duyệt' || a.status === 'Bản nháp' || a.status === 'pending');
    } else if (status === 'rejected') {
      list = list.filter(a => a.status === 'Từ chối');
    }
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 24px;">Không có hoạt động nào trong hàng đợi.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((a, idx) => {
    const isPublished = a.status === 'Đang tuyển';
    const isPending = a.status === 'Chờ Admin duyệt' || a.status === 'pending';
    const isRejected = a.status === 'Từ chối';

    let badge = '<span class="badge badge-warning"><i class="ri-time-line"></i> Chờ duyệt</span>';
    if (isPublished) {
      badge = '<span class="badge badge-success"><i class="ri-check-line"></i> Đã công bố</span>';
    } else if (isRejected) {
      badge = '<span class="badge badge-danger"><i class="ri-close-line"></i> Từ chối</span>';
    }

    return `
      <tr>
        <td style="font-weight: 600; color: #64748b;">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${a.banner || '../images/act-tree.jpg'}" alt="Thumb" class="table-act-thumb-small" style="width: 44px; height: 44px; object-fit: cover; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
            <div>
              <strong style="font-size: 0.85rem; display: block; color: #0f172a; line-height: 1.3;">${a.title}</strong>
              <small style="color: #059669; font-weight: 600;">${a.category || 'Môi trường'} • <span style="color: #64748b; font-weight: normal;">${a.city}</span></small>
            </div>
          </div>
        </td>
        <td style="color: #334155; font-weight: 600;">${a.organizer}</td>
        <td>
          <div style="font-size: 0.78rem; color: #0f172a; display: flex; align-items: center; gap: 4px;">
            <i class="ri-calendar-line" style="color: #10b981;"></i> ${a.date}
          </div>
          <small style="color: #64748b;">${a.time || '07:00 - 13:00'}</small>
        </td>
        <td style="color: #334155; font-size: 0.78rem; white-space: nowrap;"><i class="ri-group-line" style="color: #0ea5e9;"></i> ${a.capacity || 50} chỉ tiêu</td>
        <td>${badge}</td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${isPending ? `
              <button class="btn btn-sm btn-primary" onclick="publishAct('${a.id}')" title="Phê duyệt và công bố công khai">Công bố</button>
              <button class="btn btn-sm btn-outline btn-danger" onclick="openRejectActModal('${a.id}')" title="Từ chối hoạt động">Từ chối</button>
            ` : `
              <a href="../detail.html?id=${a.id}" target="_blank" class="btn btn-sm btn-outline">Xem trang</a>
            `}
            <a href="../detail.html?id=${a.id}" target="_blank" class="btn btn-sm btn-ghost" style="border-radius: 50%; width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Xem chi tiết"><i class="ri-more-fill"></i></a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.publishAct = function(id) {
  const success = useRepository.updateActivityStatus(id, 'Đang tuyển');
  if (success) {
    useToast.show('Đã phê duyệt và công bố hoạt động ra công chúng!', 'success');
    refreshAllModeration();
  }
};

window.openRejectActModal = function(id) {
  rejectContext = { type: 'act', id: id };
  openRejectModal('Từ chối hoạt động', 'Nhập lý do từ chối hoạt động để gửi thông báo cho Ban tổ chức:');
};

/* ==========================================================================
 * 3. AUDIT LOGS
 * ========================================================================== */
function renderAuditLogsTable() {
  const tbody = document.getElementById('auditLogsTableBody');
  const countEl = document.getElementById('auditTodayCount');
  if (!tbody) return;

  let list = useRepository.getAuditLogs();
  if (countEl) countEl.textContent = `Hôm nay: ${list.length}`;

  const filterAction = document.getElementById('filterAuditAction') ? document.getElementById('filterAuditAction').value : '';
  if (filterAction) {
    list = list.filter(l => l.action.toLowerCase().includes(filterAction.toLowerCase()));
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 24px;">Chưa có bản ghi Audit log nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((l, idx) => {
    let actionClass = 'theme';
    let actionIcon = '<i class="ri-check-line"></i>';
    if (l.action.includes('Từ chối') || l.action.includes('reject')) {
      actionClass = 'reject';
      actionIcon = '<i class="ri-close-line"></i>';
    } else if (l.action.includes('Tạo') || l.action.includes('Xác minh') || l.action.includes('verify')) {
      actionClass = 'verify';
      actionIcon = '<i class="ri-add-line"></i>';
    }

    return `
      <tr>
        <td style="font-weight: 600; color: #64748b;">${idx + 1}</td>
        <td style="white-space: nowrap; color: #64748b; font-size: 0.74rem;"><i class="ri-time-line"></i> ${l.time}</td>
        <td><strong style="color: #0f172a; font-size: 0.8rem;">${l.actor}</strong></td>
        <td><span class="audit-action-badge ${actionClass}">${actionIcon} ${l.action}</span></td>
        <td><strong style="color: #047857; font-size: 0.8rem;">${l.target}</strong></td>
        <td style="color: #475569; font-size: 0.78rem;">${l.details}</td>
        <td><code style="background: #f1f5f9; color: #475569; border-radius: 6px; padding: 2px 6px;">${l.ip || '118.69.182.45'}</code></td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
 * 4. REJECT & DETAIL MODALS
 * ========================================================================== */
function openRejectModal(title, label) {
  const modal = document.getElementById('adminRejectModal');
  const titleEl = document.getElementById('rejectModalTitle');
  const labelEl = document.getElementById('rejectModalLabel');
  const inputEl = document.getElementById('rejectModalInput');

  if (titleEl) titleEl.textContent = title;
  if (labelEl) labelEl.textContent = label;
  if (inputEl) inputEl.value = 'Chưa đáp ứng tiêu chuẩn quy định của nền tảng.';
  if (modal) modal.style.display = 'flex';
}

window.closeAdminRejectModal = function() {
  rejectContext = { type: null, id: null };
  const modal = document.getElementById('adminRejectModal');
  if (modal) modal.style.display = 'none';
};

window.confirmAdminReject = function() {
  const reason = document.getElementById('rejectModalInput') ? document.getElementById('rejectModalInput').value.trim() : 'Từ chối bởi Admin';
  if (!rejectContext.id) return;

  if (rejectContext.type === 'org') {
    useRepository.updateOrgStatus(rejectContext.id, 'rejected');
    useToast.show('Đã từ chối cấp phép cho tổ chức.', 'info');
  } else if (rejectContext.type === 'act') {
    useRepository.updateActivityStatus(rejectContext.id, 'Từ chối', reason);
    useToast.show('Đã từ chối phê duyệt hoạt động.', 'info');
  }

  closeAdminRejectModal();
  refreshAllModeration();
};

window.openOrgDetailModal = function(id) {
  const orgs = useRepository.getOrganizations();
  const o = orgs.find(item => item.id === id);
  if (!o) return;

  const modal = document.getElementById('adminDetailModal');
  const body = document.getElementById('adminDetailModalBody');
  const title = document.getElementById('adminDetailModalTitle');

  if (title) title.textContent = `Hồ Sơ Tổ Chức: ${o.name}`;
  if (body) {
    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.84rem;">
        <div><strong>Người đại diện:</strong> ${o.rep || o.representative || 'Chưa cập nhật'}</div>
        <div><strong>Lĩnh vực:</strong> ${o.category || 'Cộng đồng'}</div>
        <div><strong>Trạng thái:</strong> ${o.verified ? '<i class="ri-check-line" style="color: #10b981;"></i> Đã xác thực Bộ Nội Vụ' : 'Chờ duyệt'}</div>
        <div><strong>Ngày đăng ký:</strong> ${o.date || '10/10/2026'}</div>
        <div style="grid-column: 1 / -1;">
          <strong>Tài liệu pháp lý đính kèm:</strong>
          <div style="background: var(--bg-surface); padding: 8px 12px; border-radius: 6px; margin-top: 4px; border: 1px solid var(--border-default); display: flex; align-items: center; gap: 6px;">
            <i class="ri-file-pdf-2-line" style="color: #ef4444; font-size: 1.1rem;"></i> ${o.document || 'GiayPhepHoatDong_BoNoiVu_XacNhan.pdf'} (Có chữ ký số)
          </div>
        </div>
      </div>
    `;
  }
  if (modal) modal.style.display = 'flex';
};

window.closeAdminDetailModal = function() {
  const modal = document.getElementById('adminDetailModal');
  if (modal) modal.style.display = 'none';
};
