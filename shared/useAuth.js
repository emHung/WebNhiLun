/**
 * ==========================================================================
 * HOOK: useAuth — Quản lý Xác thực & Phân quyền Tài khoản (RBAC)
 * Vai trò: Volunteer (TNV) | Organizer (BTC) | Admin (Quản trị viên)
 * Phụ thuộc: shared/useStorage.js, shared/useToast.js
 * ==========================================================================
 */

const useAuth = {
  // Danh sách tài khoản demo theo 3 phân quyền
  defaultUsers: [
    {
      id: "USR-001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      password: "123",
      role: "volunteer",
      roleTitle: "Tình nguyện viên",
      avatarImg: "images/profile-avatar.jpg",
      dashboardUrl: "dashboard.html"
    },
    {
      id: "USR-002",
      name: "Ban Điều Phối Quỹ Xanh",
      email: "coordinator@quyxanh.vn",
      password: "123",
      role: "organizer",
      roleTitle: "Ban tổ chức",
      avatarImg: "images/act-tree.jpg",
      dashboardUrl: "organizer/manage.html"
    },
    {
      id: "USR-003",
      name: "Quản Trị Viên Hệ Thống",
      email: "admin@volunteerhub.vn",
      password: "123",
      role: "admin",
      roleTitle: "Quản trị viên",
      avatarImg: "images/sapling-soil.jpg",
      dashboardUrl: "admin/moderation.html"
    }
  ],

  // Chuẩn hóa đường dẫn tương đối theo vị trí thư mục hiện tại
  resolvePath(url) {
    if (!url) return '#';
    const path = window.location.pathname.replace(/\\/g, '/');
    const isSubDir = path.includes('/admin/') ||
      path.includes('/volunteer/') ||
      path.includes('/organizer/');
    if (isSubDir && !url.startsWith('../') && !url.startsWith('http') && !url.startsWith('javascript:')) {
      return '../' + url;
    }
    return url;
  },

  getAllUsers() {
    return useStorage.get('vh_users', this.defaultUsers);
  },

  getCurrentUser() {
    return useStorage.get('vh_current_user', this.defaultUsers[0]);
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, message: 'Email này chưa được đăng ký trong hệ thống.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác.' };
    }

    useStorage.set('vh_current_user', user);
    return {
      success: true,
      user,
      redirectUrl: this.getRoleDashboardLink(user.role),
      message: `Chào mừng trở lại, ${user.name} (${user.roleTitle})!`
    };
  },

  // Đăng xuất tài khoản
  logout() {
    useStorage.set('vh_current_user', null);
    if (typeof useToast !== 'undefined') {
      useToast.show('Đã đăng xuất khỏi tài khoản.', 'info');
    }
    setTimeout(() => {
      window.location.href = this.resolvePath('auth.html');
    }, 350);
  },

  // Chuyển đổi nhanh vai trò demo trực tiếp trên popup avatar
  switchRole(roleKey) {
    const target = this.defaultUsers.find(u => u.role === roleKey) || this.defaultUsers[0];
    useStorage.set('vh_current_user', target);
    if (typeof useToast !== 'undefined') {
      useToast.show(`Đã chuyển sang vai trò: ${target.roleTitle} (${target.name})`, 'success');
    }
    this.renderAllNavAuth();

    // Nếu đang ở dashboard, tự cập nhật nội dung tương ứng
    if (typeof renderDashboardByRole === 'function') {
      renderDashboardByRole(target);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  },

  // Link Dashboard phân chia rõ ràng theo từng Role
  getRoleDashboardLink(role) {
    switch (role) {
      case 'organizer':
        return this.resolvePath('organizer/manage.html');
      case 'admin':
        return this.resolvePath('admin/moderation.html');
      case 'volunteer':
      default:
        return this.resolvePath('dashboard.html');
    }
  },

  // Chi tiết Dashboard cho từng Role
  getRoleDashboardInfo(role) {
    switch (role) {
      case 'organizer':
        return {
          title: "Dashboard Ban tổ chức",
          desc: "Quản lý chiến dịch, duyệt đơn & quét điểm danh",
          icon: '<i class="ri-building-line"></i>',
          link: this.resolvePath('organizer/manage.html'),
          themeClass: "organizer"
        };
      case 'admin':
        return {
          title: "Dashboard Quản trị viên",
          desc: "Kiểm duyệt tổ chức & sự kiện toàn hệ thống",
          icon: '<i class="ri-shield-check-line"></i>',
          link: this.resolvePath('admin/moderation.html'),
          themeClass: "admin"
        };
      case 'volunteer':
      default:
        return {
          title: "Dashboard Tình nguyện viên",
          desc: "Theo dõi giờ thiện nguyện, chỉ số & huy hiệu",
          icon: '<i class="ri-bar-chart-2-line"></i>',
          link: this.resolvePath('dashboard.html'),
          themeClass: "volunteer"
        };
    }
  },

  toggleUserDropdown() {
    const dropdown = document.getElementById('vhUserDropdown');
    const btn = document.getElementById('vhUserPillBtn');
    if (dropdown) {
      const isShow = dropdown.classList.toggle('show');
      if (btn) btn.setAttribute('aria-expanded', isShow ? 'true' : 'false');
    }
  },

  closeUserDropdown() {
    const dropdown = document.getElementById('vhUserDropdown');
    const btn = document.getElementById('vhUserPillBtn');
    if (dropdown) {
      dropdown.classList.remove('show');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  },

  // Render Avatar Pill & Dropdown Popup (Chứa Dashboard, Profile, Cài đặt, Role Switcher, Logout)
  renderNavbarAuth(elementIdOrSelector = 'navAuthBadge') {
    let container = document.getElementById(elementIdOrSelector);
    if (!container) {
      container = document.querySelector(elementIdOrSelector);
    }
    if (!container) return;

    const user = this.getCurrentUser();

    // Nếu chưa đăng nhập: Hiển thị nút Đăng nhập / Đăng ký
    if (!user) {
      container.innerHTML = `
        <a href="${this.resolvePath('auth.html')}" class="btn btn-sm btn-primary" style="padding: 6px 14px; font-weight: 600; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-login-box-line"></i>
          <span>Đăng nhập / Đăng ký</span>
        </a>
      `;
      return;
    }

    const dashInfo = this.getRoleDashboardInfo(user.role);
    const avatarSrc = this.resolvePath(user.avatarImg || 'images/profile-avatar.jpg');
    const roleBadgeClass = user.role || 'volunteer';

    // Tạo các mục liên kết phụ trợ phù hợp theo từng vai trò
    let roleSpecificHtml = '';
    if (user.role === 'volunteer') {
      roleSpecificHtml = `
        <a href="${this.resolvePath('schedule.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-calendar-line"></i></span>
          <span class="vh-user-item-title">Lịch hoạt động</span>
        </a>
        <a href="${this.resolvePath('certificates.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-award-line"></i></span>
          <span class="vh-user-item-title">Chứng nhận điện tử</span>
        </a>
        <a href="${this.resolvePath('volunteer/dashboard.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-file-list-3-line"></i></span>
          <span class="vh-user-item-title">Hoạt động của tôi</span>
        </a>
      `;
    } else if (user.role === 'organizer') {
      roleSpecificHtml = `
        <a href="${this.resolvePath('organizer/create-event.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-add-circle-line"></i></span>
          <span class="vh-user-item-title">Tạo hoạt động mới</span>
        </a>
        <a href="${this.resolvePath('organizer/manage.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-team-line"></i></span>
          <span class="vh-user-item-title">Duyệt đơn tình nguyện viên</span>
        </a>
      `;
    } else if (user.role === 'admin') {
      roleSpecificHtml = `
        <a href="${this.resolvePath('admin/moderation.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-shield-check-line"></i></span>
          <span class="vh-user-item-title">Kiểm duyệt tổ chức & sự kiện</span>
        </a>
        <a href="${this.resolvePath('admin/theme-settings.html')}" class="vh-user-item">
          <span class="vh-user-item-icon"><i class="ri-palette-line"></i></span>
          <span class="vh-user-item-title">Quản lý Bảng màu hệ thống</span>
        </a>
      `;
    }

    container.innerHTML = `
      <div class="vh-user-menu-wrapper" id="vhUserMenuWrapper">
        <!-- NÚT BẤM AVATAR PILL -->
        <button type="button" class="vh-user-pill-btn" id="vhUserPillBtn" aria-expanded="false" title="Nhấp để mở menu tài khoản">
          <img src="${avatarSrc}" alt="${user.name}" class="vh-user-pill-avatar" />
          <div class="vh-user-pill-info">
            <span class="vh-user-pill-name">${user.name}</span>
            <span class="vh-user-pill-role">${user.roleTitle}</span>
          </div>
          <span class="vh-user-pill-arrow">▾</span>
        </button>

        <!-- KHUNG POPUP DROPDOWN KHI BẤM AVATAR -->
        <div class="vh-user-dropdown" id="vhUserDropdown">
          <!-- 1. Header Người dùng -->
          <div class="vh-user-dropdown-header">
            <img src="${avatarSrc}" alt="${user.name}" class="vh-user-dropdown-avatar" />
            <div class="vh-user-dropdown-meta">
              <div class="vh-user-dropdown-name">${user.name}</div>
              <div class="vh-user-dropdown-email">${user.email}</div>
              <span class="vh-role-badge ${roleBadgeClass}">${user.roleTitle}</span>
            </div>
          </div>

          <!-- 2. Thẻ DASHBOARD (Phân theo từng vai trò) -->
          <div class="vh-user-dropdown-section">
            <div class="vh-user-section-title">Bảng điều khiển theo quyền</div>
            <a href="${dashInfo.link}" class="vh-user-item-dashboard ${dashInfo.themeClass}">
              <span class="vh-user-dashboard-icon">${dashInfo.icon}</span>
              <div class="vh-user-dashboard-text">
                <div class="vh-user-dashboard-title">${dashInfo.title}</div>
                <div class="vh-user-dashboard-desc">${dashInfo.desc}</div>
              </div>
              <span class="vh-user-dashboard-arrow">&rarr;</span>
            </a>
          </div>

          <!-- 3. Hồ sơ & Cài đặt cá nhân -->
          <div class="vh-user-dropdown-section">
            <div class="vh-user-section-title">Cá nhân & Cài đặt</div>
            <a href="${this.resolvePath('profile.html')}" class="vh-user-item">
              <span class="vh-user-item-icon"><i class="ri-user-3-line"></i></span>
              <span class="vh-user-item-title">Hồ sơ cá nhân</span>
            </a>
            <a href="${this.resolvePath('profile.html#settings')}" class="vh-user-item">
              <span class="vh-user-item-icon"><i class="ri-settings-4-line"></i></span>
              <span class="vh-user-item-title">Cài đặt tài khoản</span>
            </a>
            ${roleSpecificHtml}
          </div>

          <!-- 4. Chuyển đổi nhanh vai trò demo (RBAC Switcher) -->
          <div class="vh-user-dropdown-section vh-role-switcher-section">
            <div class="vh-user-section-title">Đổi vai trò demo (Phân quyền)</div>
            <div class="vh-role-switch-grid">
              <button type="button" class="vh-role-switch-btn ${user.role === 'volunteer' ? 'active' : ''}" onclick="useAuth.switchRole('volunteer')" title="Đóng vai Tình nguyện viên">
                <i class="ri-user-heart-line"></i> TNV
              </button>
              <button type="button" class="vh-role-switch-btn ${user.role === 'organizer' ? 'active' : ''}" onclick="useAuth.switchRole('organizer')" title="Đóng vai Ban tổ chức">
                <i class="ri-building-line"></i> Ban tổ chức
              </button>
              <button type="button" class="vh-role-switch-btn ${user.role === 'admin' ? 'active' : ''}" onclick="useAuth.switchRole('admin')" title="Đóng vai Quản trị viên">
                <i class="ri-shield-user-line"></i> Admin
              </button>
            </div>
          </div>

          <!-- 5. Nút Đăng xuất -->
          <div class="vh-user-dropdown-footer">
            <button type="button" class="vh-logout-btn" onclick="useAuth.logout()">
              <i class="ri-logout-box-r-line"></i>
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Quét và render trên tất cả các vị trí avatar khả dụng
  renderAllNavAuth() {
    // 1. Vị trí navAuthBadge (trên navbar chuẩn)
    if (document.getElementById('navAuthBadge')) {
      this.renderNavbarAuth('navAuthBadge');
    }
    // 2. Vị trí vhUserNavWrap
    if (document.getElementById('vhUserNavWrap')) {
      this.renderNavbarAuth('vhUserNavWrap');
    }
    // 3. Vị trí topbar sidebar (dashboard, profile, certificates, schedule)
    const topbarUser = document.querySelector('.topbar-user-dropdown');
    if (topbarUser && topbarUser.parentElement) {
      const parent = topbarUser.parentElement;
      const wrap = document.createElement('div');
      wrap.id = 'topbarAuthContainer';
      parent.replaceChild(wrap, topbarUser);
      this.renderNavbarAuth('topbarAuthContainer');
    }
  },

  _lastToggleTime: 0,

  toggleMobileMenu(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - (this._lastToggleTime || 0) < 250) {
      return; // Prevent duplicate toggle from inline onclick + event listener
    }
    this._lastToggleTime = now;

    const navbars = document.querySelectorAll('.vh-navbar-wrapper, .app-header, .vh-navbar-container, .navbar');
    if (!navbars.length) return;

    const isCurrentlyOpen = Array.from(navbars).some(el => el.classList.contains('mobile-open'));
    const willOpen = !isCurrentlyOpen;

    navbars.forEach(el => {
      el.classList.toggle('mobile-open', willOpen);
    });

    const toggleBtns = document.querySelectorAll('.vh-mobile-toggle-btn, #vhMobileToggle');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = willOpen ? 'ri-close-line' : 'ri-menu-line';
      }
    });
  },

  closeMobileMenu() {
    const navbars = document.querySelectorAll('.vh-navbar-wrapper, .app-header, .vh-navbar-container, .navbar');
    navbars.forEach(el => el.classList.remove('mobile-open'));

    const toggleBtns = document.querySelectorAll('.vh-mobile-toggle-btn, #vhMobileToggle');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = 'ri-menu-line';
      }
    });
  },

  setupMobileNav() {
    if (typeof document === 'undefined') return;
    const navMenu = document.querySelector('.vh-nav-menu-list, .nav-menu, .org-nav-links');
    if (!navMenu) return;

    if (!document.querySelector('.vh-mobile-toggle-btn, #vhMobileToggle')) {
      const actionsWrap = document.querySelector('.vh-nav-actions') || 
                          document.querySelector('.container.navbar > div:last-child') ||
                          document.querySelector('.navbar > div:last-child') ||
                          document.querySelector('.vh-navbar-container');
      if (actionsWrap) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vh-mobile-toggle-btn';
        btn.id = 'vhMobileToggle';
        btn.setAttribute('aria-label', 'Menu điều hướng');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="ri-menu-line" id="vhMobileToggleIcon"></i>';
        actionsWrap.appendChild(btn);
      }
    }
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const pillBtn = e.target.closest('#vhUserPillBtn, .vh-user-pill-btn');
      const menuWrap = e.target.closest('#vhUserMenuWrapper, .vh-user-menu-wrapper');
      const toggleBtn = e.target.closest('.vh-mobile-toggle-btn, #vhMobileToggle');
      const navItemLink = e.target.closest('.vh-nav-item a, .nav-menu li a, .org-nav-links li a');
      const navbar = e.target.closest('.vh-navbar-wrapper, .app-header, .vh-navbar-container, .navbar');

      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
        return;
      }

      if (navItemLink) {
        this.closeMobileMenu();
      }

      if (pillBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleUserDropdown();
        return;
      }

      if (!menuWrap) {
        this.closeUserDropdown();
      }

      if (!navbar && !toggleBtn) {
        this.closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeUserDropdown();
        this.closeMobileMenu();
      }
    });
  },

  init() {
    this.renderAllNavAuth();
    this.setupMobileNav();
    this.bindEvents();
  }
};

if (typeof window !== 'undefined') {
  window.useAuth = useAuth;
  window.toggleMobileMenu = () => useAuth.toggleMobileMenu();
}

document.addEventListener('DOMContentLoaded', () => {
  useAuth.init();
});
