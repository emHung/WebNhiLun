/**
 * ==========================================================================
 * REPOSITORY LAYER: useRepository
 * Trung tâm điều phối dữ liệu toàn hệ thống NhiLun
 * Phụ thuộc: shared/useStorage.js, data/seedData.js
 * ==========================================================================
 */

const useRepository = {
  // Key lưu trữ trong localStorage
  KEYS: {
    ACTIVITIES: 'vh_repo_activities',
    ORGANIZATIONS: 'vh_repo_organizations',
    APPLICATIONS: 'vh_repo_applications',
    CERTIFICATES: 'vh_repo_certificates',
    NOTIFICATIONS: 'vh_repo_notifications',
    AUDIT_LOGS: 'vh_repo_audit_logs',
    FAVORITES: 'vh_repo_favorites',
    USERS: 'vh_users'
  },

  // Khởi tạo và tự động Seed dữ liệu nếu chưa có
  init() {
    if (typeof window === 'undefined' || typeof useStorage === 'undefined') return;

    const seed = window.SEED_DATA || {};

    if (!useStorage.get(this.KEYS.ACTIVITIES, null)) {
      useStorage.set(this.KEYS.ACTIVITIES, seed.activities || []);
    }
    if (!useStorage.get(this.KEYS.ORGANIZATIONS, null)) {
      useStorage.set(this.KEYS.ORGANIZATIONS, seed.organizations || []);
    }
    if (!useStorage.get(this.KEYS.APPLICATIONS, null)) {
      useStorage.set(this.KEYS.APPLICATIONS, seed.applications || []);
    }
    if (!useStorage.get(this.KEYS.CERTIFICATES, null)) {
      useStorage.set(this.KEYS.CERTIFICATES, seed.certificates || []);
    }
    if (!useStorage.get(this.KEYS.NOTIFICATIONS, null)) {
      useStorage.set(this.KEYS.NOTIFICATIONS, seed.notifications || []);
    }
    if (!useStorage.get(this.KEYS.AUDIT_LOGS, null)) {
      useStorage.set(this.KEYS.AUDIT_LOGS, seed.auditLogs || []);
    }
    if (!useStorage.get(this.KEYS.FAVORITES, null)) {
      useStorage.set(this.KEYS.FAVORITES, seed.favorites || []);
    }
    if (!useStorage.get(this.KEYS.USERS, null) && seed.users) {
      useStorage.set(this.KEYS.USERS, seed.users);
    }
  },

  /* ==========================================================================
   * 1. HOẠT ĐỘNG (ACTIVITIES)
   * ========================================================================== */
  getActivities(filter = {}) {
    this.init();
    let list = useStorage.get(this.KEYS.ACTIVITIES, []);

    if (filter.status) {
      list = list.filter(a => a.status === filter.status);
    } else if (filter.publicOnly) {
      // Chỉ lấy các hoạt động đã được công bố / mở đăng ký
      list = list.filter(a => a.status !== 'Chờ Admin duyệt' && a.status !== 'Bản nháp');
    }

    if (filter.category && filter.category !== 'all') {
      list = list.filter(a => a.category === filter.category);
    }

    if (filter.city && filter.city !== 'all') {
      list = list.filter(a => a.city === filter.city);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.organizer.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
      );
    }

    if (filter.featuredOnly) {
      list = list.filter(a => a.featured);
    }

    return list;
  },

  getActivityById(id) {
    this.init();
    const list = useStorage.get(this.KEYS.ACTIVITIES, []);
    return list.find(a => String(a.id) === String(id) || a.slug === String(id)) || null;
  },

  createActivity(activityData) {
    this.init();
    const list = useStorage.get(this.KEYS.ACTIVITIES, []);
    const newId = 'ACT-' + String(list.length + 1).padStart(3, '0');

    const newActivity = {
      id: newId,
      slug: (activityData.title || 'hoat-dong')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-') + '-' + Date.now().toString().slice(-4),
      title: activityData.title || 'Hoạt động mới',
      category: activityData.category || 'Cộng đồng',
      organizer: activityData.organizer || 'Ban tổ chức NhiLun',
      organizerVerified: true,
      date: activityData.date || '24/10/2026',
      time: activityData.time || '08:00 - 12:00',
      deadline: activityData.deadline || '20/10/2026',
      city: activityData.city || 'TP. Hồ Chí Minh',
      location: activityData.location || 'TP. Hồ Chí Minh',
      locations: activityData.locations || [],
      capacity: parseInt(activityData.capacity) || 30,
      applied: 0,
      verifiedHours: parseInt(activityData.verifiedHours) || 6,
      status: activityData.status || 'Chờ Admin duyệt', // 'Bản nháp' | 'Chờ Admin duyệt' | 'Đang tuyển'
      featured: false,
      banner: activityData.banner || 'images/act-tree.jpg',
      description: activityData.description || '',
      schedule: activityData.schedule || [
        { time: "07:30 - 08:30", content: "Tập trung, phát đồng phục và phổ biến công việc" },
        { time: "08:30 - 11:30", content: "Tiến hành hoạt động theo nhóm điều phối" },
        { time: "11:30 - 12:00", content: "Tổng kết, quét QR điểm danh và nhận xác nhận" }
      ],
      requirements: activityData.requirements || 'Nhiệt tình, có tinh thần trách nhiệm và tuân thủ điều phối.',
      itemsToBring: activityData.itemsToBring || 'Trang phục thoải mái, chai nước cá nhân, CCCD.',
      contact: activityData.contact || 'Ban tổ chức - 0901 234 567',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    list.unshift(newActivity);
    useStorage.set(this.KEYS.ACTIVITIES, list);

    // Ghi Audit Log
    this.addAuditLog(
      activityData.organizer || 'Ban tổ chức',
      'Tạo hoạt động mới',
      newActivity.title,
      `Thiết lập chỉ tiêu ${newActivity.capacity} người tại ${newActivity.city}`
    );

    // Bắn thông báo cho Admin
    this.addNotification({
      userId: 'USR-003',
      icon: '<i class="ri-shield-check-line"></i>',
      type: 'warning',
      title: 'Hoạt động mới cần phê duyệt',
      desc: `BTC ${newActivity.organizer} vừa gửi duyệt sự kiện '${newActivity.title}'.`,
      link: 'admin/moderation.html'
    });

    return newActivity;
  },

  updateActivityStatus(id, newStatus, reason = '') {
    this.init();
    const list = useStorage.get(this.KEYS.ACTIVITIES, []);
    const target = list.find(a => String(a.id) === String(id));
    if (!target) return false;

    const oldStatus = target.status;
    target.status = newStatus;
    useStorage.set(this.KEYS.ACTIVITIES, list);

    this.addAuditLog(
      'Quản Trị Viên (admin@volunteerhub.vn)',
      `Chuyển trạng thái hoạt động: ${newStatus}`,
      target.title,
      `Từ '${oldStatus}' sang '${newStatus}'. ${reason ? 'Lý do: ' + reason : ''}`
    );

    // Bắn thông báo cho BTC
    this.addNotification({
      userId: 'USR-002',
      icon: newStatus === 'Đang tuyển' ? '<i class="ri-checkbox-circle-line"></i>' : '<i class="ri-notification-3-line"></i>',
      type: newStatus === 'Đang tuyển' ? 'success' : 'info',
      title: newStatus === 'Đang tuyển' ? 'Hoạt động đã được công bố!' : `Cập nhật trạng thái: ${newStatus}`,
      desc: `Hoạt động '${target.title}' hiện ở trạng thái '${newStatus}'.`,
      link: `detail.html?id=${target.id}`
    });

    return true;
  },

  /* ==========================================================================
   * 2. ĐƠN ĐĂNG KÝ (APPLICATIONS)
   * ========================================================================== */
  getApplications(filter = {}) {
    this.init();
    let list = useStorage.get(this.KEYS.APPLICATIONS, []);

    if (filter.userId) {
      list = list.filter(a => a.userId === filter.userId);
    }
    if (filter.activityId) {
      list = list.filter(a => String(a.activityId) === String(filter.activityId));
    }
    if (filter.status) {
      list = list.filter(a => a.status === filter.status);
    }

    return list;
  },

  getApplicationById(appId) {
    this.init();
    const apps = useStorage.get(this.KEYS.APPLICATIONS, []);
    return apps.find(a => a.id === appId) || null;
  },

  submitApplication(formData) {
    this.init();
    const act = this.getActivityById(formData.activityId);
    if (!act) {
      return { success: false, message: 'Hoạt động không tồn tại hoặc đã bị gỡ.' };
    }

    // Kiểm tra sức chứa & trạng thái
    const isFull = (act.status === 'Đã đủ số lượng' || act.status === 'closed') ||
                   (act.capacity !== undefined && act.applied !== undefined && act.applied >= act.capacity) ||
                   (act.maxParticipants !== undefined && act.currentParticipants !== undefined && act.currentParticipants >= act.maxParticipants);
    if (isFull) {
      return { success: false, message: 'Rất tiếc! Hoạt động này đã đủ chỉ tiêu số lượng.' };
    }

    const apps = useStorage.get(this.KEYS.APPLICATIONS, []);

    // Chống nộp trùng lặp
    const existing = apps.find(a =>
      a.userId === formData.userId &&
      String(a.activityId) === String(formData.activityId) &&
      a.status !== 'cancelled' && a.status !== 'rejected'
    );
    if (existing) {
      return { success: false, message: 'Bạn đã nộp đơn cho hoạt động này rồi (Mã đơn: ' + existing.id + ').' };
    }

    const newId = 'APP-2026-' + String(apps.length + 1).padStart(3, '0');
    const newApp = {
      id: newId,
      activityId: act.id,
      activityTitle: act.title,
      organizer: act.organizer,
      userId: formData.userId || 'USR-001',
      userName: formData.userName || 'Nguyễn Văn An',
      userEmail: formData.userEmail || 'an.nguyen@email.com',
      userPhone: formData.userPhone || '0901 234 567',
      date: act.date,
      shift: formData.shift || 'Toàn thời gian (Cả ngày theo lịch trình)',
      experience: formData.experience || 'Lần đầu tham gia',
      skill: formData.skill || 'Không có',
      status: 'pending',
      statusText: 'Chờ duyệt',
      checkinStatus: 'not_yet',
      verifiedHours: 0,
      hasCert: false,
      appliedAt: new Date().toLocaleString('vi-VN')
    };

    apps.unshift(newApp);
    useStorage.set(this.KEYS.APPLICATIONS, apps);

    // Đồng bộ lại key cũ vh_user_apps và vh_applicants để các trang cũ hoạt động mượt
    useStorage.set('vh_user_apps', apps);
    useStorage.set('vh_applicants', apps);

    // Thông báo cho TNV
    this.addNotification({
      userId: newApp.userId,
      icon: '<i class="ri-file-text-line"></i>',
      type: 'info',
      title: 'Đã gửi đơn đăng ký thành công',
      desc: `Bạn đã nộp đơn tham gia '${act.title}'. Vui lòng chờ BTC xét duyệt.`,
      link: 'volunteer/dashboard.html'
    });

    // Thông báo cho BTC
    this.addNotification({
      userId: 'USR-002',
      icon: '<i class="ri-inbox-line"></i>',
      type: 'info',
      title: 'Có đơn đăng ký mới',
      desc: `${newApp.userName} vừa đăng ký tham gia '${act.title}'.`,
      link: 'organizer/manage.html'
    });

    return { success: true, application: newApp, message: 'Nộp đơn đăng ký thành công!' };
  },

  reviewApplication(appId, decision, reason = '') {
    this.init();
    const apps = useStorage.get(this.KEYS.APPLICATIONS, []);
    const target = apps.find(a => a.id === appId);
    if (!target) return { success: false, message: 'Không tìm thấy đơn đăng ký.' };

    const act = this.getActivityById(target.activityId);

    if (decision === 'approve') {
      target.status = 'approved';
      target.statusText = 'Đã duyệt';

      // Tăng số lượng applied nếu chưa tính
      if (act && act.applied < act.capacity) {
        act.applied += 1;
        const allActs = useStorage.get(this.KEYS.ACTIVITIES, []);
        const idx = allActs.findIndex(a => a.id === act.id);
        if (idx !== -1) {
          allActs[idx] = act;
          useStorage.set(this.KEYS.ACTIVITIES, allActs);
        }
      }

      this.addNotification({
        userId: target.userId,
        icon: '<i class="ri-checkbox-circle-line"></i>',
        type: 'success',
        title: 'Đơn tham gia đã được phê duyệt!',
        desc: `Ban tổ chức đã duyệt bạn tham gia '${target.activityTitle}'. Hãy chuẩn bị đúng giờ nhé!`,
        link: `detail.html?id=${target.activityId}`
      });

    } else if (decision === 'reject') {
      target.status = 'rejected';
      target.statusText = 'Từ chối';
      target.rejectReason = reason || 'Đã đủ số lượng tiếp nhận';

      this.addNotification({
        userId: target.userId,
        icon: '<i class="ri-error-warning-line"></i>',
        type: 'warning',
        title: 'Đơn tham gia chưa được tiếp nhận',
        desc: `Rất tiếc, đơn '${target.activityTitle}' của bạn không được duyệt. Lý do: ${target.rejectReason}`,
        link: 'volunteer/dashboard.html'
      });
    }

    useStorage.set(this.KEYS.APPLICATIONS, apps);
    useStorage.set('vh_user_apps', apps);
    useStorage.set('vh_applicants', apps);

    return { success: true, application: target };
  },

  cancelApplication(appId) {
    this.init();
    const apps = useStorage.get(this.KEYS.APPLICATIONS, []);
    const target = apps.find(a => a.id === appId);
    if (!target) return { success: false, message: 'Không tìm thấy đơn.' };

    // Nếu đơn từng được duyệt, giảm lại số lượng applied
    if (target.status === 'approved') {
      const act = this.getActivityById(target.activityId);
      if (act && act.applied > 0) {
        act.applied -= 1;
        const allActs = useStorage.get(this.KEYS.ACTIVITIES, []);
        const idx = allActs.findIndex(a => a.id === act.id);
        if (idx !== -1) {
          allActs[idx] = act;
          useStorage.set(this.KEYS.ACTIVITIES, allActs);
        }
      }
    }

    target.status = 'cancelled';
    target.statusText = 'Đã hủy';
    useStorage.set(this.KEYS.APPLICATIONS, apps);
    useStorage.set('vh_user_apps', apps);
    useStorage.set('vh_applicants', apps);

    return { success: true, message: 'Đã hủy đơn thành công.' };
  },

  /* ==========================================================================
   * 3. ĐIỂM DANH & CẤP CHỨNG NHẬN (CHECK-IN & CERTIFICATES)
   * ========================================================================== */
  checkinParticipant(appId) {
    this.init();
    const apps = useStorage.get(this.KEYS.APPLICATIONS, []);
    const app = apps.find(a => a.id === appId);
    if (!app) return { success: false, message: 'Không tìm thấy người tham gia.' };

    const act = this.getActivityById(app.activityId);
    const hours = act ? act.verifiedHours : 6;

    const isCurrentlyChecked = app.checkinStatus === 'checked_in';

    if (!isCurrentlyChecked) {
      // ĐIỂM DANH THÀNH CÔNG
      app.checkinStatus = 'checked_in';
      app.verifiedHours = hours;
      app.hasCert = true;

      // Sinh chứng nhận
      const certs = useStorage.get(this.KEYS.CERTIFICATES, []);
      const newCertCode = 'CERT-2026-' + String(certs.length + 1).padStart(3, '0');
      const newCert = {
        id: 'CERT-' + Date.now(),
        certificateCode: newCertCode,
        userId: app.userId,
        userName: app.userName,
        activityId: app.activityId,
        title: app.activityTitle,
        issuer: app.organizer,
        hours: hours,
        issueDate: new Date().toLocaleDateString('vi-VN'),
        badgeType: 'Chứng nhận hoàn thành',
        qrVerified: true
      };
      certs.unshift(newCert);
      useStorage.set(this.KEYS.CERTIFICATES, certs);

      // Thông báo cho TNV
      this.addNotification({
        userId: app.userId,
        icon: '<i class="ri-award-line"></i>',
        type: 'success',
        title: 'Chúc mừng! Bạn đã nhận Chứng nhận điện tử',
        desc: `Hệ thống vừa cấp mã ${newCertCode} cho hoạt động '${app.activityTitle}' (+${hours} giờ đóng góp).`,
        link: 'certificates.html'
      });

      this.addAuditLog(
        app.organizer,
        'Quét điểm danh & cấp chứng nhận',
        app.userName,
        `Xác nhận ${hours} giờ cho hoạt động '${app.activityTitle}', cấp mã ${newCertCode}`
      );
    } else {
      // HỦY ĐIỂM DANH
      app.checkinStatus = 'not_yet';
      app.verifiedHours = 0;
      app.hasCert = false;

      // Gỡ cert tương ứng
      let certs = useStorage.get(this.KEYS.CERTIFICATES, []);
      certs = certs.filter(c => !(c.userId === app.userId && c.activityId === app.activityId));
      useStorage.set(this.KEYS.CERTIFICATES, certs);
    }

    useStorage.set(this.KEYS.APPLICATIONS, apps);
    useStorage.set('vh_user_apps', apps);
    useStorage.set('vh_applicants', apps);

    return {
      success: true,
      checkedIn: app.checkinStatus === 'checked_in',
      message: app.checkinStatus === 'checked_in'
        ? `Điểm danh thành công cho ${app.userName}! Đã cấp chứng nhận +${hours} giờ.`
        : `Đã hủy điểm danh cho ${app.userName}.`
    };
  },

  getCertificates(userId = 'USR-001') {
    this.init();
    const list = useStorage.get(this.KEYS.CERTIFICATES, []);
    return list.filter(c => c.userId === userId).map(c => {
      if (!c.code && c.certificateCode) c.code = c.certificateCode;
      return c;
    });
  },

  issueCertificate(data) {
    this.init();
    const certs = useStorage.get(this.KEYS.CERTIFICATES, []);
    const newCertCode = 'CERT-2026-' + String(certs.length + 1).padStart(3, '0');
    const newCert = {
      id: 'CERT-' + Date.now(),
      code: newCertCode,
      certificateCode: newCertCode,
      userId: data.userId || 'USR-001',
      volunteerName: data.volunteerName || data.userName || 'Nguyễn Văn An',
      userName: data.volunteerName || data.userName || 'Nguyễn Văn An',
      activityId: data.activityId || 'ACT-001',
      title: data.title || 'Chứng nhận tình nguyện',
      issuer: data.issuer || 'NhiLun',
      hours: Number(data.hours) || 6,
      issueDate: data.issueDate || new Date().toLocaleDateString('vi-VN'),
      badgeType: data.badgeType || 'Chứng nhận hoàn thành',
      qrVerified: true
    };
    certs.unshift(newCert);
    useStorage.set(this.KEYS.CERTIFICATES, certs);
    return newCert;
  },

  getVolunteerStats(userId = 'USR-001') {
    this.init();
    const certs = this.getCertificates(userId);
    const hours = certs.reduce((sum, c) => sum + (Number(c.hours) || 0), 0);
    const apps = this.getApplications({ userId });
    return {
      hours,
      certificatesCount: certs.length,
      activitiesJoined: apps.length
    };
  },

  /* ==========================================================================
   * 4. THÔNG BÁO (NOTIFICATIONS)
   * ========================================================================== */
  getNotifications(userId = 'USR-001') {
    this.init();
    const list = useStorage.get(this.KEYS.NOTIFICATIONS, []);
    return list.filter(n => !n.userId || n.userId === userId);
  },

  addNotification(notif) {
    this.init();
    const list = useStorage.get(this.KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
      userId: notif.userId || 'USR-001',
      icon: notif.icon || '<i class="ri-notification-3-line"></i>',
      type: notif.type || 'info',
      title: notif.title || 'Thông báo mới',
      desc: notif.desc || '',
      time: 'Vừa xong',
      unread: true,
      link: notif.link || 'notifications.html'
    };
    list.unshift(newNotif);
    useStorage.set(this.KEYS.NOTIFICATIONS, list);
    if (window.useNotification) {
      window.useNotification.renderDropdown();
    }
    return newNotif;
  },

  markNotificationRead(id) {
    this.init();
    const list = useStorage.get(this.KEYS.NOTIFICATIONS, []);
    const target = list.find(n => String(n.id) === String(id));
    if (target) {
      target.unread = false;
      useStorage.set(this.KEYS.NOTIFICATIONS, list);
    }
  },

  markAllNotificationsRead(userId = 'USR-001') {
    this.init();
    const list = useStorage.get(this.KEYS.NOTIFICATIONS, []);
    list.forEach(n => {
      if (!n.userId || n.userId === userId) {
        n.unread = false;
      }
    });
    useStorage.set(this.KEYS.NOTIFICATIONS, list);
    if (window.useNotification) {
      window.useNotification.renderDropdown();
    }
  },

  /* ==========================================================================
   * 5. NHẬT KÝ KIỂM TOÁN (AUDIT LOGS)
   * ========================================================================== */
  getAuditLogs() {
    this.init();
    return useStorage.get(this.KEYS.AUDIT_LOGS, []);
  },

  addAuditLog(actor, action, target, details, ip = '118.69.182.45') {
    this.init();
    const list = useStorage.get(this.KEYS.AUDIT_LOGS, []);
    const newLog = {
      id: 'LOG-' + String(list.length + 1).padStart(3, '0'),
      time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      actor: actor,
      action: action,
      target: target,
      details: details,
      ip: ip
    };
    list.unshift(newLog);
    useStorage.set(this.KEYS.AUDIT_LOGS, list);
    return newLog;
  },

  /* ==========================================================================
   * 6. HOẠT ĐỘNG YÊU THÍCH (FAVORITES)
   * ========================================================================== */
  getFavorites(userId = 'USR-001') {
    this.init();
    return useStorage.get(this.KEYS.FAVORITES, []);
  },

  isFavorite(actId, userId = 'USR-001') {
    const favs = this.getFavorites(userId);
    return favs.includes(String(actId));
  },

  toggleFavorite(actId, userId = 'USR-001') {
    this.init();
    let favs = useStorage.get(this.KEYS.FAVORITES, []);
    const idStr = String(actId);
    const index = favs.indexOf(idStr);
    let isNowFav = false;

    if (index !== -1) {
      favs.splice(index, 1);
      isNowFav = false;
    } else {
      favs.push(idStr);
      isNowFav = true;
    }

    useStorage.set(this.KEYS.FAVORITES, favs);
    return isNowFav;
  },

  /* ==========================================================================
   * 7. TỔ CHỨC (ORGANIZATIONS)
   * ========================================================================== */
  getOrganizations() {
    this.init();
    return useStorage.get(this.KEYS.ORGANIZATIONS, []);
  },

  updateOrgStatus(orgId, status) {
    this.init();
    const list = useStorage.get(this.KEYS.ORGANIZATIONS, []);
    const target = list.find(o => o.id === orgId);
    if (target) {
      target.status = status;
      target.verified = (status === 'approved');
      useStorage.set(this.KEYS.ORGANIZATIONS, list);
      this.addAuditLog('Quản Trị Viên', `Cập nhật trạng thái tổ chức: ${status}`, target.name, `Cấp tích xanh xác thực`);
      return true;
    }
    return false;
  }
};

// Khởi chạy ngay khi nạp script
if (typeof window !== 'undefined') {
  window.useRepository = useRepository;
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      useRepository.init();
    });
  }
}
