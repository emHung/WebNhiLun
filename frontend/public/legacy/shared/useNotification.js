/**
 * USENOTIFICATION.JS — Quản lý Notification Popup Dropdown & Đồng bộ Thông báo
 * Phụ thuộc: shared/useRepository.js, shared/useStorage.js, shared/useToast.js
 */
const useNotification = {
  defaultNotifications: [
    {
      id: "notif-1",
      icon: '<i class="ri-checkbox-circle-line"></i>',
      type: "success",
      title: "Đơn tham gia đã được duyệt!",
      desc: "Ban Tổ Chức Quỹ Xanh đã phê duyệt bạn cho Ngày hội trồng cây xanh 2026.",
      time: "10 phút trước",
      unread: true,
      link: "detail.html?id=ACT-001"
    },
    {
      id: "notif-2",
      icon: '<i class="ri-award-line"></i>',
      type: "info",
      title: "Chứng nhận điện tử mới được cấp",
      desc: "Hệ thống vừa cấp mã CERT-2026-001 vào hồ sơ của bạn (+8 giờ tình nguyện).",
      time: "2 giờ trước",
      unread: true,
      link: "certificates.html"
    },
    {
      id: "notif-3",
      icon: '<i class="ri-time-line"></i>',
      type: "warning",
      title: "Nhắc nhở sự kiện sắp diễn ra",
      desc: "Ngày hội trồng 1.000 cây xanh sẽ bắt đầu lúc 07:30 ngày 24/10/2026.",
      time: "1 ngày trước",
      unread: true,
      link: "schedule.html"
    }
  ],

  resolveLink(url) {
    if (!url) return '#';
    const path = (typeof window !== 'undefined' ? window.location.pathname : '').replace(/\\/g, '/');
    const isInSubdir = path.includes('/volunteer/') ||
                       path.includes('/organizer/') ||
                       path.includes('/admin/') ||
                       path.includes('/NhiLun/');
    if (isInSubdir && !url.startsWith('../') && !url.startsWith('http') && !url.startsWith('javascript:')) {
      return '../' + url;
    }
    return url;
  },

  init() {
    this.renderDropdown();
    this.bindEvents();
  },

  getNotifications() {
    if (typeof useRepository !== 'undefined' && typeof useRepository.getNotifications === 'function') {
      const list = useRepository.getNotifications('USR-001');
      if (list && list.length > 0) return list;
    }
    return typeof useStorage !== 'undefined' 
      ? useStorage.get('vh_notifications', this.defaultNotifications) 
      : this.defaultNotifications;
  },

  setNotifications(list) {
    if (typeof useStorage !== 'undefined') {
      useStorage.set('vh_notifications', list);
      useStorage.set('vh_repo_notifications', list);
    }
    this.renderDropdown();
  },

  renderDropdown() {
    if (typeof document === 'undefined') return;

    const listContainer = document.getElementById('vhNotifList') || document.querySelector('.vh-notif-list');
    const badgeElements = document.querySelectorAll('#vhNotifBadge, .vh-notif-badge, .vh-notif-badge-dot');
    const viewAllBtn = document.querySelector('.vh-notif-viewall-btn, .vh-notif-view-all-btn');

    if (viewAllBtn) {
      viewAllBtn.setAttribute('href', this.resolveLink('notifications.html'));
    }

    const notifs = this.getNotifications();
    const unreadCount = notifs.filter(n => n.unread).length;

    badgeElements.forEach(badge => {
      if (unreadCount > 0) {
        badge.innerText = unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });

    if (!listContainer) return;

    if (notifs.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 24px 16px; color: var(--text-secondary); font-size: 0.8rem;">
          <div style="font-size: 1.6rem; margin-bottom: 4px; color: #94a3b8;"><i class="ri-inbox-line"></i></div>
          <div>Bạn không có thông báo nào.</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = notifs.slice(0, 6).map(n => {
      const defaultIcon = n.type === 'success' ? '<i class="ri-checkbox-circle-line"></i>' : (n.type === 'warning' ? '<i class="ri-time-line"></i>' : '<i class="ri-notification-3-line"></i>');
      const icon = (n.icon && (n.icon.includes('<i') || n.icon.length > 4)) ? n.icon : (n.icon === '🎉' ? '<i class="ri-checkbox-circle-line"></i>' : (n.icon === '🎖️' ? '<i class="ri-award-line"></i>' : (n.icon === '⏰' ? '<i class="ri-time-line"></i>' : defaultIcon)));
      return `
        <a href="${this.resolveLink(n.link || 'notifications.html')}" class="vh-notif-item ${n.unread ? 'unread' : ''}" onclick="useNotification.markRead('${n.id}')">
          <div class="vh-notif-item-icon ${n.type || 'info'}">
            ${icon}
          </div>
          <div class="vh-notif-item-content">
            <div class="vh-notif-item-title">${n.title || 'Thông báo mới'}</div>
            <div class="vh-notif-item-desc">${n.desc || ''}</div>
            <div class="vh-notif-item-time"><i class="ri-time-line"></i> ${n.time || 'Vừa xong'}</div>
          </div>
          ${n.unread ? `<span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; margin-top: 6px; flex-shrink: 0;"></span>` : ''}
        </a>
      `;
    }).join('');
  },

  _lastToggleTime: 0,

  toggle(force) {
    const now = Date.now();
    if (now - this._lastToggleTime < 200 && typeof force !== 'boolean') {
      return;
    }
    this._lastToggleTime = now;

    const dropdown = document.getElementById('vhNotifDropdown') || document.querySelector('.vh-notif-dropdown');
    if (!dropdown) return;

    const willShow = (typeof force === 'boolean') ? force : !dropdown.classList.contains('show');
    if (willShow) {
      dropdown.classList.add('show');
      dropdown.style.display = 'block';
    } else {
      dropdown.classList.remove('show');
      dropdown.style.display = 'none';
    }

    const bell = document.getElementById('vhNotifBtn') || document.querySelector('.vh-notif-btn, .vh-notif-bell-btn');
    if (bell) {
      bell.setAttribute('aria-expanded', willShow ? 'true' : 'false');
    }
  },

  close() {
    const dropdown = document.getElementById('vhNotifDropdown') || document.querySelector('.vh-notif-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
      dropdown.style.display = 'none';
    }
    const bell = document.getElementById('vhNotifBtn') || document.querySelector('.vh-notif-btn, .vh-notif-bell-btn');
    if (bell) {
      bell.setAttribute('aria-expanded', 'false');
    }
  },

  markRead(id) {
    if (typeof useRepository !== 'undefined' && typeof useRepository.markNotificationRead === 'function') {
      useRepository.markNotificationRead(id);
    }
    const notifs = this.getNotifications();
    const target = notifs.find(n => String(n.id) === String(id));
    if (target) {
      target.unread = false;
      this.setNotifications(notifs);
    }
  },

  markAllRead() {
    if (typeof useRepository !== 'undefined' && typeof useRepository.markAllNotificationsRead === 'function') {
      useRepository.markAllNotificationsRead('USR-001');
    }
    const notifs = this.getNotifications();
    notifs.forEach(n => n.unread = false);
    this.setNotifications(notifs);
    if (typeof useToast !== 'undefined') {
      useToast.show('Đã đánh dấu đọc tất cả thông báo!', 'success');
    }
  },

  bindEvents() {
    if (typeof document === 'undefined') return;
    if (this._eventsBound) return;
    this._eventsBound = true;

    document.addEventListener('click', (e) => {
      const bell = e.target.closest('.vh-notif-bell-btn, .vh-notif-btn, #vhNotifBtn');
      const markAll = e.target.closest('.vh-notif-markall, .vh-notif-header-mark-all, #vhNotifMarkAll');
      const dropdown = e.target.closest('.vh-notif-dropdown, #vhNotifDropdown');
      const wrapper = e.target.closest('.vh-notif-wrapper');

      if (bell) {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
        return;
      }

      if (markAll) {
        e.preventDefault();
        e.stopPropagation();
        this.markAllRead();
        return;
      }

      if (dropdown) {
        return;
      }

      if (!wrapper) {
        this.close();
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.useNotification = useNotification;
  document.addEventListener('DOMContentLoaded', () => {
    useNotification.init();
  });
}
