/**
 * HOOK: useTheme — Quản lý Bảng màu Hệ thống (Chế độ Sáng chuẩn)
 * Đã loại bỏ hoàn toàn chế độ tối (Dark mode) theo yêu cầu.
 * Phụ thuộc: shared/useStorage.js
 */
const useTheme = {
  // 5 Bảng màu chuẩn tươi sáng của NhiLun
  defaultThemes: [
    {
      id: 1,
      name: "Đại dương & Hy vọng (Mặc định)",
      primary: "#12304A",
      cta: "#087F78",
      surface: "#E9F7F3",
      meaning: "Nền tảng tổng quát, kết nối minh bạch, đáng tin cậy"
    },
    {
      id: 2,
      name: "Mầm Xanh Tươi",
      primary: "#1B4332",
      cta: "#2D6A4F",
      surface: "#E8F5E9",
      meaning: "Môi trường, phủ xanh đồi trọc, nhặt rác bờ biển"
    },
    {
      id: 3,
      name: "Trái Tim Ấm Áp",
      primary: "#4A1521",
      cta: "#E05D5D",
      surface: "#FDF2F0",
      meaning: "Bếp ăn 0 đồng, mái ấm tình thương, trẻ em & người già"
    },
    {
      id: 4,
      name: "Nắng Mai Hy Vọng",
      primary: "#1E293B",
      cta: "#D97706",
      surface: "#FEF3C7",
      meaning: "Giáo dục vùng cao, quyên góp sách vở, khuyến học"
    },
    {
      id: 5,
      name: "Bình Yên & Chữa Lành",
      primary: "#1E3A8A",
      cta: "#0284C7",
      surface: "#F0F9FF",
      meaning: "Cứu trợ thiên tai, túi thuốc nghĩa tình, y tế cộng đồng"
    }
  ],

  /**
   * Lấy toàn bộ danh sách chủ đề
   */
  getAllThemes() {
    return useStorage.get('vh_themes', this.defaultThemes);
  },

  /**
   * Áp dụng bảng màu lên giao diện (luôn duy trì Chế độ Sáng)
   */
  applyTheme(theme) {
    if (!theme) theme = this.defaultThemes[0];
    const root = document.documentElement;

    // 1. Áp dụng các biến màu thương hiệu
    root.style.setProperty('--brand-primary', theme.primary || '#12304A');
    root.style.setProperty('--brand-cta', theme.cta || '#087F78');
    root.style.setProperty('--brand-surface', theme.surface || '#E9F7F3');
    root.style.setProperty('--brand-cta-hover', theme.cta || '#066963');

    // 2. Cố định chế độ Sáng chuẩn (Light mode)
    root.removeAttribute('data-mode');
    root.style.setProperty('--canvas', '#F4F7FA');
    root.style.setProperty('--surface-white', '#FFFFFF');
    root.style.setProperty('--text-primary', '#172B3A');
    root.style.setProperty('--text-secondary', '#536779');
    root.style.setProperty('--border-default', '#DCE5EA');
    root.style.setProperty('--table-header-bg', '#FAFBFD');

    // 3. Lưu vào LocalStorage
    theme.mode = 'light';
    useStorage.set('vh_active_theme', theme);
  },

  /**
   * Thêm hoặc Cập nhật bảng màu (Dành cho Admin)
   */
  saveTheme(themeData) {
    const list = this.getAllThemes();
    themeData.mode = 'light';
    if (themeData.id) {
      const index = list.findIndex(t => t.id == themeData.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...themeData };
      }
    } else {
      themeData.id = Date.now();
      list.push(themeData);
    }
    useStorage.set('vh_themes', list);
    return themeData;
  },

  /**
   * Xóa bảng màu tùy biến
   */
  deleteTheme(id) {
    if (id === 1) {
      if (typeof useToast !== 'undefined') {
        useToast.show('Không thể xóa Bảng màu mặc định của hệ thống!', 'warning');
      }
      return false;
    }
    let list = this.getAllThemes();
    list = list.filter(t => t.id != id);
    useStorage.set('vh_themes', list);
    return true;
  },

  /**
   * Khởi động trên mọi trang: Khôi phục lại theme đang kích hoạt và dọn dẹp nút đổi chế độ tối
   */
  init() {
    const active = useStorage.get('vh_active_theme', this.defaultThemes[0]);
    if (active.mode === 'dark') {
      active.mode = 'light';
    }
    this.applyTheme(active);

    // Tự động gỡ bỏ mọi nút chuyển đổi chế độ tối cũ nếu còn tồn tại trong DOM
    document.querySelectorAll('.theme-mode-toggle').forEach(btn => {
      btn.remove();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  useTheme.init();
});
