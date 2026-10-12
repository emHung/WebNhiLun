/**
 * ORGANIZER.JS — Logic riêng cho Ban tổ chức (Organizer Portal)
 * Tương tác với: shared/useStorage.js, shared/useToast.js, shared/useTheme.js
 */

document.addEventListener('DOMContentLoaded', () => {
  useTheme.init();
  renderApplicantsList();
});

const defaultApplicants = [
  {
    id: "APP-2026-001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    activity: "Ngày hội trồng 1.000 cây xanh",
    status: "approved",
    checkinStatus: "checked_in"
  },
  {
    id: "APP-2026-002",
    name: "Trần Thị Mai",
    email: "mai.tran@email.com",
    activity: "Tủ sách trao em",
    status: "pending",
    checkinStatus: "not_yet"
  },
  {
    id: "APP-2026-003",
    name: "Lê Hoàng Long",
    email: "long.le@email.com",
    activity: "Bữa cơm 0 đồng yêu thương",
    status: "pending",
    checkinStatus: "not_yet"
  }
];

function renderApplicantsList() {
  const container = document.getElementById('applicantsTableBody');
  const applicants = useStorage.get('vh_applicants', defaultApplicants);

  if (!container) return;
  container.innerHTML = '';

  applicants.forEach(item => {
    const isApproved = item.status === 'approved';
    const isCheckedIn = item.checkinStatus === 'checked_in';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong><br><small style="color:var(--text-secondary)">${item.email}</small></td>
      <td>${item.activity}</td>
      <td>
        <span class="badge ${isApproved ? 'badge-success' : 'badge-warning'}">
          ${isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
        </span>
      </td>
      <td>
        <span class="badge ${isCheckedIn ? 'badge-success' : 'badge-mint'}">
          ${isCheckedIn ? '✓ Đã điểm danh' : 'Chưa đến'}
        </span>
      </td>
      <td>
        ${!isApproved ? `
          <button class="btn btn-sm btn-primary" onclick="approveApp('${item.id}')">Duyệt</button>
          <button class="btn btn-sm btn-outline btn-danger" onclick="rejectApp('${item.id}')">Từ chối</button>
        ` : `
          <button class="btn btn-sm ${isCheckedIn ? 'btn-outline' : 'btn-secondary'}" onclick="toggleCheckin('${item.id}')">
            ${isCheckedIn ? 'Hủy điểm danh' : '📷 Quét QR Điểm Danh'}
          </button>
        `}
      </td>
    `;
    container.appendChild(tr);
  });
}

window.approveApp = function(id) {
  let list = useStorage.get('vh_applicants', defaultApplicants);
  const target = list.find(a => a.id === id);
  if (target) {
    target.status = 'approved';
    useStorage.set('vh_applicants', list);
    useToast.show(`Đã duyệt người tham gia: ${target.name}`, 'success');
    renderApplicantsList();
  }
};

window.rejectApp = function(id) {
  const reason = prompt('Nhập lý do từ chối đơn này:', 'Đã hết chỉ tiêu cho vị trí này');
  if (reason) {
    let list = useStorage.get('vh_applicants', defaultApplicants);
    list = list.filter(a => a.id !== id);
    useStorage.set('vh_applicants', list);
    useToast.show('Đã từ chối đơn và gửi thông báo lý do.', 'info');
    renderApplicantsList();
  }
};

window.toggleCheckin = function(id) {
  let list = useStorage.get('vh_applicants', defaultApplicants);
  const target = list.find(a => a.id === id);
  if (target) {
    target.checkinStatus = target.checkinStatus === 'checked_in' ? 'not_yet' : 'checked_in';
    useStorage.set('vh_applicants', list);
    useToast.show(target.checkinStatus === 'checked_in' ? `Điểm danh thành công cho: ${target.name}` : `Đã hủy điểm danh cho: ${target.name}`, 'success');
    renderApplicantsList();
  }
};
