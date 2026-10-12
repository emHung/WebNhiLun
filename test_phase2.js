/**
 * TEST SUITE: Phase P2 - Volunteer Portal
 * Kiểm thử toàn diện luồng Tình nguyện viên: Đăng ký, Hủy đơn, Lịch, Chứng nhận, Thông báo, Hồ sơ
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runTest() {
  console.log('=== BẮT ĐẦU KIỂM THỬ PHASE P2: VOLUNTEER PORTAL ===\n');
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
    window: {
      location: { href: 'http://localhost/volunteer/apply.html?id=ACT-001', search: '?id=ACT-001' }
    },
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

  // Test 1: Khởi tạo Seed và lấy danh sách ứng tuyển ban đầu của tình nguyện viên USR-001
  const initialApps = repo.getApplications({ userId: 'USR-001' });
  assert(Array.isArray(initialApps) && initialApps.length >= 1, `Khởi tạo danh sách ứng tuyển cho USR-001 (${initialApps.length} đơn ban đầu)`);

  // Test 2: Nộp đơn đăng ký hợp lệ cho hoạt động còn chỗ (ACT-004) mà USR-001 chưa từng nộp
  const submitRes = repo.submitApplication({
    activityId: 'ACT-004',
    activityTitle: 'Cứu trợ và chăm sóc động vật bị bỏ rơi',
    userId: 'USR-001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    role: 'Tình nguyện viên chăm sóc',
    reason: 'Yêu thương động vật và muốn dành thời gian hỗ trợ trạm cứu hộ.'
  });
  assert(submitRes.success === true && submitRes.application && submitRes.application.id, `Nộp đơn đăng ký thành công cho ACT-004: ID=${submitRes.application ? submitRes.application.id : 'N/A'}`);

  // Test 3: Chặn nộp đơn trùng lặp
  const dupRes = repo.submitApplication({
    activityId: 'ACT-004',
    userId: 'USR-001',
    name: 'Nguyễn Văn An'
  });
  assert(dupRes.success === false && (dupRes.message.includes('đã nộp đơn') || dupRes.message.includes('đã đăng ký')), `Ngăn chặn nộp đơn trùng lặp cho cùng một hoạt động (${dupRes.message})`);

  // Test 4: Chặn nộp đơn khi hoạt động đã hết chỗ
  // Tìm hoặc tạo hoạt động đầy chỗ
  const activities = repo.getActivities();
  const testFullAct = {
    id: 'ACT-FULL-TEST',
    title: 'Hoạt động đã kín chỗ test',
    status: 'Đã đủ số lượng',
    currentParticipants: 10,
    maxParticipants: 10,
    shifts: [{ current: 10, max: 10 }]
  };
  activities.push(testFullAct);
  sandbox.window.useStorage.set(repo.KEYS.ACTIVITIES, activities);

  const fullRes = repo.submitApplication({
    activityId: 'ACT-FULL-TEST',
    userId: 'USR-001',
    name: 'Nguyễn Văn An'
  });
  assert(fullRes.success === false && (fullRes.message.includes('đủ') || fullRes.message.includes('kín')), `Từ chối đăng ký khi hoạt động đã đủ số lượng (${fullRes.message})`);

  // Test 5: Hủy đơn đăng ký hợp lệ
  const cancelAppId = submitRes.application.id;
  const cancelRes = repo.cancelApplication(cancelAppId, 'Bận lịch học đột xuất');
  assert(cancelRes.success === true, `Hủy đơn đăng ký thành công ID=${cancelAppId}`);

  const checkCancelled = repo.getApplicationById(cancelAppId);
  assert(checkCancelled && checkCancelled.status === 'cancelled', `Trạng thái đơn sau khi hủy đổi thành 'cancelled'`);

  // Test 6: Kiểm tra quản lý Chứng nhận điện tử
  const initialCerts = repo.getCertificates('USR-001');
  assert(Array.isArray(initialCerts) && initialCerts.length >= 1, `Truy xuất danh sách chứng nhận điện tử cho USR-001 (${initialCerts.length} chứng nhận)`);

  const initialHours = repo.getVolunteerStats('USR-001').hours;
  // Cấp chứng nhận mới
  const newCert = repo.issueCertificate({
    userId: 'USR-001',
    volunteerName: 'Nguyễn Văn An',
    activityId: 'ACT-002',
    title: 'Chứng nhận Giáo dục Vùng cao 2026',
    issuer: 'Quỹ Giáo Dục Tương Lai',
    hours: 12
  });
  assert(newCert && newCert.code && newCert.code.startsWith('CERT-'), `Cấp chứng nhận điện tử thành công với mã chuẩn: ${newCert ? newCert.code : 'N/A'}`);

  const updatedCerts = repo.getCertificates('USR-001');
  assert(updatedCerts.length === initialCerts.length + 1, `Danh sách chứng nhận tăng lên ${updatedCerts.length}`);

  const updatedHours = repo.getVolunteerStats('USR-001').hours;
  assert(updatedHours === initialHours + 12, `Số giờ cống hiến tự động cộng thêm chính xác: ${initialHours} -> ${updatedHours} giờ (+12h)`);

  // Test 7: Kiểm tra quản lý Thông báo (Notifications)
  const notifs = repo.getNotifications('USR-001');
  assert(Array.isArray(notifs) && notifs.length >= 1, `Lấy danh sách thông báo của người dùng (${notifs.length} thông báo)`);

  const unreadBefore = notifs.filter(n => n.unread).length;
  assert(unreadBefore >= 1, `Có ${unreadBefore} thông báo chưa đọc`);

  // Đánh dấu 1 thông báo là đã đọc
  const targetNotifId = notifs[0].id;
  repo.markNotificationRead(targetNotifId);
  const targetAfter = repo.getNotifications('USR-001').find(n => n.id === targetNotifId);
  assert(targetAfter && targetAfter.unread === false, `Đánh dấu đọc 1 thông báo thành công (ID=${targetNotifId})`);

  // Đánh dấu tất cả đã đọc
  repo.markAllNotificationsRead('USR-001');
  const allRead = repo.getNotifications('USR-001').every(n => !n.unread);
  assert(allRead === true, `Đánh dấu đọc tất cả thông báo thành công (Tất cả unread = false)`);

  // Test 8: Rà soát không còn mock alert() trong các trang Volunteer
  const volunteerFiles = [
    'volunteer/apply.html',
    'NhiLun/apply.html',
    'volunteer/volunteer.js',
    'NhiLun/volunteer.js',
    'volunteer/dashboard.html',
    'NhiLun/dashboard.html',
    'schedule.html',
    'certificates.html',
    'notifications.html',
    'profile.html'
  ];

  let alertCount = 0;
  volunteerFiles.forEach(f => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      // match alert( but exclude alert-related CSS classes or comments
      const matches = content.match(/[^a-zA-Z0-9_]alert\s*\(/g);
      if (matches) {
        console.error(`  [WARN] File ${f} chứa ${matches.length} lời gọi alert()`);
        alertCount += matches.length;
      }
    }
  });
  assert(alertCount === 0, `Không còn bất kỳ lời gọi alert() mock nào trong tất cả file Volunteer (${alertCount} alert)`);

  console.log(`\n=== TỔNG KẾT PHASE P2: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) process.exit(1);
}

runTest();
