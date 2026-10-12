/**
 * TEST SUITE: Phase P4 - Admin Portal
 * Kiểm duyệt Tổ chức, Phê duyệt & Công bố Hoạt động, Nhật ký Audit Logs, Theme Settings
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runTest() {
  console.log('=== BẮT ĐẦU KIỂM THỬ PHASE P4: ADMIN PORTAL ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Chuẩn bị Sandbox
  const mockLocalStorage = {
    store: {},
    getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  };

  const sandbox = {
    console: console,
    localStorage: mockLocalStorage,
    window: {},
    document: {
      addEventListener: () => {},
      getElementById: () => null,
      querySelectorAll: () => []
    },
    setTimeout: (cb) => cb(),
    Date: Date
  };
  sandbox.window.localStorage = mockLocalStorage;

  vm.createContext(sandbox);

  // Load Seed, Storage, Repository
  const seedCode = fs.readFileSync(path.join(__dirname, 'data', 'seedData.js'), 'utf8');
  const storageCode = fs.readFileSync(path.join(__dirname, 'shared', 'useStorage.js'), 'utf8');
  const repoCode = fs.readFileSync(path.join(__dirname, 'shared', 'useRepository.js'), 'utf8');

  vm.runInContext(seedCode, sandbox);
  vm.runInContext(storageCode, sandbox);
  vm.runInContext(repoCode, sandbox);

  const repo = sandbox.window.useRepository;
  repo.init();

  // Test 1: Lấy danh sách tổ chức và kiểm duyệt cấp tích xanh
  const initialOrgs = repo.getOrganizations();
  assert(Array.isArray(initialOrgs) && initialOrgs.length >= 3, `Khởi tạo danh sách tổ chức (${initialOrgs.length} tổ chức ban đầu)`);

  const pendingOrg = initialOrgs.find(o => !o.verified) || initialOrgs[0];
  const targetOrgId = pendingOrg.id;

  const approveOrgRes = repo.updateOrgStatus(targetOrgId, 'approved');
  assert(approveOrgRes === true, `Admin duyệt tổ chức thành công ID=${targetOrgId}`);

  const orgAfter = repo.getOrganizations().find(o => o.id === targetOrgId);
  assert(orgAfter && orgAfter.verified === true && orgAfter.status === 'approved', `Tổ chức được cấp tích xanh xác thực (verified=true, status='approved')`);

  // Test 2: Tạo hoạt động mới ở trạng thái chờ duyệt và kiểm tra chưa xuất hiện ở publicOnly
  const createdAct = repo.createActivity({
    title: 'Chiến Dịch Khám Mắt Miễn Phí Cho Trẻ Em 2026',
    category: 'Y tế',
    organizer: 'Hội Thầy Thuốc Vì Cộng Đồng',
    status: 'Chờ Admin duyệt'
  });
  const actId = createdAct.id;

  const publicBefore = repo.getActivities({ publicOnly: true });
  assert(!publicBefore.some(a => a.id === actId), `Hoạt động mới '${createdAct.title}' chưa công bố bị ẩn khỏi publicOnly`);

  // Test 3: Admin phê duyệt và công bố hoạt động
  const logsBeforePublish = repo.getAuditLogs().length;
  const publishRes = repo.updateActivityStatus(actId, 'Đang tuyển');
  assert(publishRes === true, `Admin công bố hoạt động thành công ID=${actId}`);

  const actAfterPublish = repo.getActivityById(actId);
  assert(actAfterPublish && actAfterPublish.status === 'Đang tuyển', `Trạng thái hoạt động chuyển sang 'Đang tuyển'`);

  // Test 4: Hoạt động ngay lập tức xuất hiện trong tìm kiếm công khai (publicOnly = true)
  const publicAfter = repo.getActivities({ publicOnly: true });
  assert(publicAfter.some(a => a.id === actId), `Hoạt động ngay lập tức hiển thị công khai trên activities.html và trang chủ`);

  // Test 5: Ghi nhận Audit Log chuẩn xác khi Admin thao tác
  const logsAfterPublish = repo.getAuditLogs();
  assert(logsAfterPublish.length > logsBeforePublish, `Audit Logs ghi nhận hành động công bố của Admin (+1 log)`);

  const latestLog = logsAfterPublish[0];
  assert((latestLog.actor.toLowerCase().includes('admin') || latestLog.actor.includes('Quản Trị')) && latestLog.action.includes('Đang tuyển'), `Audit log lưu đúng actor="${latestLog.actor}" và action="${latestLog.action}"`);

  // Test 6: Admin từ chối hoạt động kèm lý do
  const actReject = repo.createActivity({
    title: 'Hoạt động thiếu giấy phép khảo sát',
    status: 'Chờ Admin duyệt'
  });
  const rejectRes = repo.updateActivityStatus(actReject.id, 'Từ chối', 'Thiếu giấy phép địa phương');
  assert(rejectRes === true, `Admin từ chối hoạt động kèm lý do thành công`);

  const rejectedAct = repo.getActivityById(actReject.id);
  assert(rejectedAct && rejectedAct.status === 'Từ chối', `Trạng thái hoạt động đổi thành 'Từ chối'`);

  // Test 7: Kiểm tra tệp HTML Admin nạp đủ thư viện và không có alert mock
  const modHtml = fs.readFileSync(path.join(__dirname, 'admin', 'moderation.html'), 'utf8');
  const themeHtml = fs.readFileSync(path.join(__dirname, 'admin', 'theme-settings.html'), 'utf8');

  assert(modHtml.includes('shared/useRepository.js') && modHtml.includes('data/seedData.js'), `moderation.html nạp đúng useRepository và seedData`);
  assert(modHtml.includes('moderation.js'), `moderation.html nạp file logic riêng moderation.js`);

  const adminFiles = ['admin/moderation.html', 'admin/theme-settings.html', 'admin/moderation.js', 'admin/admin.js'];
  let alertCount = 0;
  adminFiles.forEach(f => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const matches = content.match(/[^a-zA-Z0-9_]alert\s*\(/g);
      if (matches) alertCount += matches.length;
    }
  });
  assert(alertCount === 0, `Không còn bất kỳ alert() mock nào trong toàn bộ thư mục admin/ (0 alert)`);

  console.log(`\n=== TỔNG KẾT PHASE P4: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) process.exit(1);
}

runTest();
