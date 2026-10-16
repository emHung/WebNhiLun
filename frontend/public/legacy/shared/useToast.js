/**
 * HOOK: useToast — Quản lý thông báo nổi (Toast Notification)
 * Dùng chung để hiển thị thông báo thành công / lỗi đẹp mắt
 */
const useToast = {
  container: null,

  _getContainer() {
    if (!this.container) {
      let el = document.getElementById('toast-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-container';
        document.body.appendChild(el);
      }
      this.container = el;
    }
    return this.container;
  },

  /**
   * Hiển thị thông báo
   * @param {string} message - Nội dung
   * @param {'success'|'error'|'info'} type - Loại thông báo
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  show(message, type = 'success', duration = 3000) {
    const container = this._getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '<i class="ri-checkbox-circle-fill" style="color: #10b981;"></i>' : (type === 'error' ? '<i class="ri-error-warning-fill" style="color: #ef4444;"></i>' : '<i class="ri-information-fill" style="color: #3b82f6;"></i>');
    toast.innerHTML = `<span style="font-size: 1.15rem; display: inline-flex; align-items: center;">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
