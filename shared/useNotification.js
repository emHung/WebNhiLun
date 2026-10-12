/**
 * USENOTIFICATION.JS — Quản lý Notification Popup Dropdown & Đồng bộ Thông báo
 */
const useNotification = {
  defaultNotifications: [
    {
      id: "notif-1",
      icon: "🎉",
      type: "success",
      title: "Đơn tham gia đã được duyệt!",
      desc: "Ban Tổ Chức Quỹ Xanh đã phê duyệt bạn cho Ngày hội trồng cây xanh 2026.",
      time: "10 phút trước",
      unread: true,
      link: "detail.html"
    },
    {
      id: "notif-2",
      icon: "🎖️",
      type: "info",
      title: "Chứng nhận điện tử mới được cấp",
      desc: "Hệ thống vừa cấp mã CERT-2026-001 vào hồ sơ của bạn (+8 giờ tình nguyện).",
      time: "2 giờ trước",
      unread: true,
      link: "certificates.html"
    },
    {
      id: "notif-3",
      icon: "⏰",
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
    const path = window.location.pathname.replace(/\\/g, '/');
    const isInSubdir = path.includes('/volunteer/') ||
                       path.includes('/organizer/') ||
                       path.includes('/admin/');
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
    return useStorage.get('vh_notifications', this.defaultNotifications);
  },

  setNotifications(list) {
    useStorage.set('vh_notifications', list);
    this.renderDropdown();
  },

  renderDropdown() {
    const listContainer = document.getElementById('vhNotifList');
    const badgeDot = document.getElementById('vhNotifBadge');
    const viewAllBtn = document.querySelector('.vh-notif-viewall-btn');

    if (viewAllBtn) {
      viewAllBtn.setAttribute('href', this.resolveLink('notifications.html'));
    }

    if (!listContainer) return;

    const notifs = this.getNotifications();
    const unreadCount = notifs.filter(n => n.unread).length;

    if (badgeDot) {
      if (unreadCount > 0) {
        badgeDot.innerText = unreadCount;
        badgeDot.style.display = 'flex';
      } else {
        badgeDot.style.display = 'none';
      }
    }

    listContainer.innerHTML = notifs.map(n => `
      <a href="${this.resolveLink(n.link)}" class="vh-notif-item ${n.unread ? 'unread' : ''}" onclick="useNotification.markRead('${n.id}')">
        <div class="vh-notif-item-icon ${n.type}">
          ${n.icon}
        </div>
        <div class="vh-notif-item-content">
          <div class="vh-notif-item-title">${n.title}</div>
          <div class="vh-notif-item-desc">${n.desc}</div>
          <div class="vh-notif-item-time">${n.time}</div>
        </div>
      </a>
    `).join('');
  },

  toggle() {
    const dropdown = document.getElementById('vhNotifDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  },

  close() {
    const dropdown = document.getElementById('vhNotifDropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  },

  markRead(id) {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.unread = false;
      this.setNotifications(notifs);
    }
  },

  markAllRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.unread = false);
    this.setNotifications(notifs);
    useToast.show('Đã đánh dấu đọc tất cả thông báo!', 'success');
  },

  bindEvents() {
    // Đóng popup khi click ra ngoài
    document.addEventListener('click', (e) => {
      const bell = e.target.closest('.vh-notif-bell-btn, .vh-notif-btn, #vhNotifBtn');
      const markAll = e.target.closest('.vh-notif-markall, #vhNotifMarkAll');
      const wrapper = e.target.closest('.vh-notif-wrapper');

      if (bell) {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (markAll) {
        e.preventDefault();
        this.markAllRead();
        return;
      }

      if (!wrapper) {
        this.close();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  useNotification.init();
});
