/**
 * HOOK: useStorage — Quản lý đọc/ghi dữ liệu JSON vào LocalStorage
 * Dùng chung cho toàn bộ các trang (Frontend thuần)
 */
const useStorage = {
  /**
   * Lấy dữ liệu theo key. Nếu chưa có thì trả về defaultValue.
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Lỗi đọc localStorage key [${key}]:`, e);
      return defaultValue;
    }
  },

  /**
   * Lưu dữ liệu JSON vào localStorage.
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Lỗi ghi localStorage key [${key}]:`, e);
      return false;
    }
  },

  /**
   * Xóa một key.
   */
  remove(key) {
    localStorage.removeItem(key);
  }
};

if (typeof window !== 'undefined') {
  window.useStorage = useStorage;
}

