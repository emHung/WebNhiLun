/**
 * TEST SUITE: Phase P5 - Full End-to-End Priority Flow
 * Luồng hoàn chỉnh:
 * 1. Organizer tạo hoạt động
 * 2. Admin kiểm duyệt & Công bố
 * 3. Hoạt động hiển thị công khai
 * 4. Volunteer đăng ký
 * 5. Organizer duyệt đơn
 * 6. Organizer điểm danh (QR)
 * 7. Tự động cấp chứng nhận & Cộng giờ công nhận
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runE2ETest() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TOÀN TRÌNH E2E: ORGANIZER -> ADMIN -> VOLUNTEER -> CERTIFICATE ===\n');
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

  const seedCode = fs.readFileSync(path.join(__dirname, 'data', 'seedData.js'), 'utf8');
  const storageCode = fs.readFileSync(path.join(__dirname, 'shared', 'useStorage.js'), 'utf8');
  const repoCode = fs.readFileSync(path.join(__dirname, 'shared', 'useRepository.js'), 'utf8');

  vm.runInContext(seedCode, sandbox);
  vm.runInContext(storageCode, sandbox);
  vm.runInContext(repoCode, sandbox);

  const repo = sandbox.window.useRepository;
  repo.init();

  // BƯỚC 1: Organizer tạo hoạt động mới
  console.log('--- BƯỚC 1: ORGANIZER TẠO HOẠT ĐỘNG ---');
  const createdAct = repo.createActivity({
    title: 'Dự Án Nước Sạch Học Đường Vùng Cao 2026',
    category: 'Môi trường',
    organizer: 'CLB Ánh Sáng Tương Lai',
    organizerVerified: true,
    city: 'Hà Giang',
    location: 'Điểm trường Mèo Vạc, Tỉnh Hà Giang',
    date: '20/11/2026',
    time: '08:00 - 17:00',
    deadline: '15/11/2026',
    capacity: 25,
    verifiedHours: 10,
    status: 'Chờ Admin duyệt',
    description: 'Lắp đặt 3 giếng khoan và hệ thống lọc nước sạch RO cho 400 học sinh tiểu học.'
  });

  const actId = createdAct.id;
  assert(actId && actId.startsWith('ACT-'), `1.1 Tạo sự kiện thành công với mã: ${actId}`);
  assert(createdAct.status === 'Chờ Admin duyệt', `1.2 Trạng thái ban đầu: '${createdAct.status}'`);

  const publicBefore = repo.getActivities({ publicOnly: true });
  assert(!publicBefore.some(a => a.id === actId), `1.3 Sự kiện chưa duyệt không xuất hiện trên trang công khai`);

  const adminNotifs = repo.getNotifications('USR-003');
  assert(adminNotifs.some(n => n.desc.includes(createdAct.title)), `1.4 Admin nhận được thông báo yêu cầu kiểm duyệt sự kiện`);

  // BƯỚC 2: Admin kiểm duyệt và công bố hoạt động
  console.log('\n--- BƯỚC 2: ADMIN KIỂM DUYỆT & CÔNG BỐ ---');
  const publishSuccess = repo.updateActivityStatus(actId, 'Đang tuyển');
  assert(publishSuccess === true, `2.1 Admin phê duyệt thành công`);

  const actPublished = repo.getActivityById(actId);
  assert(actPublished.status === 'Đang tuyển', `2.2 Trạng thái sự kiện đổi thành: '${actPublished.status}'`);

  const publicAfter = repo.getActivities({ publicOnly: true });
  assert(publicAfter.some(a => a.id === actId), `2.3 Sự kiện đã xuất hiện công khai trên activities.html và index.html`);

  const orgNotifs = repo.getNotifications('USR-002');
  assert(orgNotifs.some(n => n.title.includes('công bố') || n.desc.includes(createdAct.title)), `2.4 Ban tổ chức nhận được thông báo công bố sự kiện`);

  // BƯỚC 3: Tình nguyện viên đăng ký tham gia
  console.log('\n--- BƯỚC 3: VOLUNTEER ĐĂNG KÝ THAM GIA ---');
  const initialVolunteerApps = repo.getApplications({ userId: 'USR-001' }).length;
  const applyRes = repo.submitApplication({
    activityId: actId,
    userId: 'USR-001',
    userName: 'Nguyễn Văn An',
    userEmail: 'an.nguyen@email.com',
    userPhone: '0901234567',
    role: 'Tình nguyện viên lắp đặt kỹ thuật',
    reason: 'Đã có kinh nghiệm kỹ thuật ống nước và muốn cống hiến cho trường vùng cao.'
  });

  assert(applyRes.success === true && applyRes.application, `3.1 Đăng ký nộp đơn thành công với mã: ${applyRes.application ? applyRes.application.id : 'N/A'}`);
  const appId = applyRes.application.id;

  const appsAfter = repo.getApplications({ userId: 'USR-001' });
  assert(appsAfter.length === initialVolunteerApps + 1, `3.2 Danh sách đơn của tình nguyện viên tăng lên: ${appsAfter.length}`);

  // Test chặn đăng ký trùng lặp
  const dupApply = repo.submitApplication({ activityId: actId, userId: 'USR-001' });
  assert(dupApply.success === false, `3.3 Ngăn chặn đăng ký trùng lặp cho cùng một sự kiện`);

  // BƯỚC 4: Organizer xét duyệt đơn của Volunteer
  console.log('\n--- BƯỚC 4: ORGANIZER DUYỆT ĐƠN ĐĂNG KÝ ---');
  const initialAppliedCount = repo.getActivityById(actId).applied || 0;
  const approveRes = repo.reviewApplication(appId, 'approve');
  assert(approveRes.success === true, `4.1 Organizer duyệt đơn thành công ID=${appId}`);

  const appApproved = repo.getApplicationById(appId);
  assert(appApproved.status === 'approved', `4.2 Trạng thái đơn đổi thành 'approved'`);

  const actAfterApprove = repo.getActivityById(actId);
  assert(actAfterApprove.applied === initialAppliedCount + 1, `4.3 Số lượng người tham gia của sự kiện tăng lên: ${actAfterApprove.applied}/${actAfterApprove.capacity}`);

  const volNotifs = repo.getNotifications('USR-001');
  assert(volNotifs.some(n => n.title.includes('phê duyệt') && n.desc.includes(createdAct.title)), `4.4 Tình nguyện viên nhận được thông báo chúc mừng phê duyệt`);

  // BƯỚC 5: Organizer điểm danh tại sự kiện (QR Code / Manual)
  console.log('\n--- BƯỚC 5: ORGANIZER ĐIỂM DANH & CẤP CHỨNG NHẬN ---');
  const initialCertsCount = repo.getCertificates('USR-001').length;
  const initialHours = repo.getVolunteerStats('USR-001').hours;

  const checkinRes = repo.checkinParticipant(appId);
  assert(checkinRes.success === true && checkinRes.checkedIn === true, `5.1 Quét QR điểm danh thành công cho ứng viên`);

  const appCheckedIn = repo.getApplicationById(appId);
  assert(appCheckedIn.checkinStatus === 'checked_in' && appCheckedIn.hasCert === true, `5.2 Trạng thái ứng viên đổi thành 'checked_in' và hasCert=true`);

  // BƯỚC 6: Tự động phát hành chứng nhận điện tử CERT-*
  console.log('\n--- BƯỚC 6: TỰ ĐỘNG PHÁT HÀNH CHỨNG NHẬN ĐIỆN TỬ & CỘNG GIỜ ---');
  const certsAfter = repo.getCertificates('USR-001');
  assert(certsAfter.length === initialCertsCount + 1, `6.1 Bộ sưu tập chứng nhận của TNV tăng từ ${initialCertsCount} lên ${certsAfter.length}`);

  const newestCert = certsAfter[0];
  assert(newestCert && (newestCert.code || newestCert.certificateCode).startsWith('CERT-'), `6.2 Chứng chỉ mới có mã định danh chuẩn: ${newestCert.code || newestCert.certificateCode}`);
  assert(newestCert.activityId === actId && newestCert.hours === 10, `6.3 Chứng chỉ ghi nhận đúng hoạt động '${newestCert.title}' và ${newestCert.hours} giờ công nhận`);

  const hoursAfter = repo.getVolunteerStats('USR-001').hours;
  assert(hoursAfter === initialHours + 10, `6.4 Giờ cống hiến tự động cộng thêm chuẩn xác: ${initialHours}h -> ${hoursAfter}h (+10h)`);

  const certNotifs = repo.getNotifications('USR-001');
  assert(certNotifs.some(n => n.title.includes('Chứng nhận điện tử')), `6.5 Tình nguyện viên nhận được thông báo cấp Chứng nhận điện tử`);

  console.log(`\n=== TỔNG KẾT E2E FULL FLOW: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) process.exit(1);
}

runE2ETest();
