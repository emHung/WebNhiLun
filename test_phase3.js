/**
 * TEST SUITE: Phase P3 - Organizer Portal
 * Kiểm thử toàn diện luồng Ban tổ chức: Tạo hoạt động, Duyệt đơn, Từ chối, Điểm danh & Cấp chứng nhận
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runTest() {
  console.log('=== BẮT ĐẦU KIỂM THỬ PHASE P3: ORGANIZER PORTAL ===\n');
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

  // Test 1: Tạo hoạt động mới từ Organizer
  const initialActs = repo.getActivities();
  const initialLogs = repo.getAuditLogs().length;

  const newAct = repo.createActivity({
    title: 'Đêm Nhạc Gây Quỹ Vì Trẻ Em Vùng Cao 2026',
    category: 'Văn hóa nghệ thuật',
    organizer: 'CLB Ánh Sáng Tương Lai',
    city: 'TP. Hồ Chí Minh',
    location: 'Nhà Văn Hóa Thanh Niên, Quận 1',
    capacity: 60,
    verifiedHours: 8,
    status: 'Chờ Admin duyệt',
    description: 'Đêm nhạc acoustic gây quỹ mua 500 áo ấm cho các em nhỏ tại Hà Giang.'
  });

  assert(newAct && newAct.id && newAct.id.startsWith('ACT-'), `Organizer tạo hoạt động mới thành công: ID=${newAct ? newAct.id : 'N/A'}`);
  assert(newAct.status === 'Chờ Admin duyệt', `Trạng thái ban đầu của hoạt động là 'Chờ Admin duyệt'`);

  // Test 2: Hoạt động chưa được duyệt KHÔNG xuất hiện ở publicOnly
  const publicActs = repo.getActivities({ publicOnly: true });
  const isFoundInPublic = publicActs.some(a => a.id === newAct.id);
  assert(isFoundInPublic === false, `Hoạt động chưa duyệt được ẩn khỏi danh sách công khai (publicOnly=false)`);

  // Test 3: Ghi Audit Log và Thông báo cho Admin khi tạo sự kiện
  const logsAfterCreate = repo.getAuditLogs();
  assert(logsAfterCreate.length === initialLogs + 1, `Audit Log ghi nhận sự kiện tạo hoạt động của Organizer (+1 log)`);

  const adminNotifs = repo.getNotifications('USR-003');
  const foundAdminNotif = adminNotifs.some(n => n.title.includes('phê duyệt') && n.desc.includes(newAct.title));
  assert(foundAdminNotif === true, `Admin nhận được thông báo yêu cầu phê duyệt hoạt động mới`);

  // Test 4: Phê duyệt đơn đăng ký của tình nguyện viên
  // Nộp đơn thử nghiệm
  const appRes = repo.submitApplication({
    activityId: 'ACT-001',
    userId: 'USR-TEST-01',
    userName: 'Lê Hoàng Long',
    userEmail: 'long.le@email.com'
  });
  const appId = appRes.application.id;

  const approveRes = repo.reviewApplication(appId, 'approve');
  assert(approveRes.success === true, `Organizer phê duyệt đơn đăng ký thành công ID=${appId}`);

  const approvedApp = repo.getApplicationById(appId);
  assert(approvedApp && (approvedApp.status === 'approved' || approvedApp.statusText === 'Đã duyệt'), `Trạng thái đơn cập nhật thành 'approved'`);

  const volunteerNotifs = repo.getNotifications('USR-TEST-01');
  const hasApprovedNotif = volunteerNotifs.some(n => n.title.includes('phê duyệt'));
  assert(hasApprovedNotif === true, `Tình nguyện viên nhận được thông báo chúc mừng phê duyệt`);

  // Test 5: Từ chối đơn đăng ký kèm lý do
  const appReject = repo.submitApplication({
    activityId: 'ACT-001',
    userId: 'USR-TEST-02',
    userName: 'Phạm Thu Trang',
    userEmail: 'trang.pham@email.com'
  });
  const rejectAppId = appReject.application.id;

  const rejectRes = repo.reviewApplication(rejectAppId, 'reject', 'Ưu tiên ứng viên có chứng chỉ sơ cứu');
  assert(rejectRes.success === true, `Organizer từ chối đơn đăng ký kèm lý do`);

  const rejectedApp = repo.getApplicationById(rejectAppId);
  assert(rejectedApp && rejectedApp.status === 'rejected' && rejectedApp.rejectReason.includes('sơ cứu'), `Lý do từ chối được lưu trữ chuẩn xác: "${rejectedApp ? rejectedApp.rejectReason : ''}"`);

  // Test 6: Điểm danh và tự động cấp chứng nhận điện tử
  const initialCertCount = repo.getCertificates('USR-TEST-01').length;
  const initialHours = repo.getVolunteerStats('USR-TEST-01').hours;

  const checkinRes = repo.checkinParticipant(appId);
  assert(checkinRes.success === true && checkinRes.checkedIn === true, `Điểm danh thành công cho ứng viên`);

  const certsAfter = repo.getCertificates('USR-TEST-01');
  assert(certsAfter.length === initialCertCount + 1, `Chứng nhận điện tử CERT-* tự động phát hành (+1 cert)`);

  const hoursAfter = repo.getVolunteerStats('USR-TEST-01').hours;
  assert(hoursAfter > initialHours, `Giờ tích lũy tình nguyện được cộng tự động (+${hoursAfter - initialHours}h)`);

  // Test 7: Hủy điểm danh hoàn tác chứng nhận và giờ
  const uncheckRes = repo.checkinParticipant(appId);
  assert(uncheckRes.success === true && uncheckRes.checkedIn === false, `Hoàn tác điểm danh thành công`);

  const certsUnchecked = repo.getCertificates('USR-TEST-01');
  assert(certsUnchecked.length === initialCertCount, `Chứng nhận tự động thu hồi khi hủy điểm danh`);

  // Test 8: Kiểm tra tệp HTML Organizer nạp đủ thư viện chuẩn
  const createHtml = fs.readFileSync(path.join(__dirname, 'organizer', 'create-event.html'), 'utf8');
  const manageHtml = fs.readFileSync(path.join(__dirname, 'organizer', 'manage.html'), 'utf8');

  assert(createHtml.includes('shared/useRepository.js') && createHtml.includes('data/seedData.js'), `create-event.html nạp đúng useRepository và seedData`);
  assert(manageHtml.includes('shared/useRepository.js') && manageHtml.includes('data/seedData.js'), `manage.html nạp đúng useRepository và seedData`);

  console.log(`\n=== TỔNG KẾT PHASE P3: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) process.exit(1);
}

runTest();
