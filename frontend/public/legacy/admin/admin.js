/**
 * ADMIN.JS — Logic riêng cho phân hệ Quản trị hệ thống (Admin Portal)
 * Hỗ trợ: Nhập mã màu HEX, Chọn chế độ Sáng/Tối, Đổi theme nhanh, CRUD
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi động theme
  useTheme.init();

  // 2. Kích hoạt đồng bộ 2 chiều giữa ô chọn màu và ô nhập mã HEX
  setupColorPair('primaryColor', 'primaryHex');
  setupColorPair('ctaColor', 'ctaHex');
  setupColorPair('surfaceColor', 'surfaceHex');

  // 3. Tải danh sách bảng màu
  renderThemesList();

  // 4. Lắng nghe submit form
  const form = document.getElementById('themeForm');
  if (form) {
    form.addEventListener('submit', handleSaveTheme);
  }
});

/**
 * Hàm đồng bộ 2 chiều: Chọn ô màu <---> Gõ mã HEX
 */
function setupColorPair(colorInputId, hexInputId) {
  const colorEl = document.getElementById(colorInputId);
  const hexEl = document.getElementById(hexInputId);
  if (!colorEl || !hexEl) return;

  // Khi chọn màu trên bảng màu: Cập nhật mã HEX
  colorEl.addEventListener('input', () => {
    hexEl.value = colorEl.value.toUpperCase();
  });

  // Khi người dùng gõ / dán mã HEX: Cập nhật ô chọn màu
  hexEl.addEventListener('input', () => {
    let val = hexEl.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    // Kiểm tra mã hex 3 hoặc 6 ký tự hợp lệ
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      colorEl.value = val;
    }
  });

  // Tự động thêm dấu # nếu người dùng chỉ gõ số/chữ
  hexEl.addEventListener('blur', () => {
    let val = hexEl.value.trim();
    if (val && !val.startsWith('#')) {
      hexEl.value = '#' + val.toUpperCase();
    }
  });
}

/**
 * Hiển thị danh sách các bảng màu và nút thao tác
 */
function renderThemesList() {
  const container = document.getElementById('themesList');
  const active = useStorage.get('vh_active_theme', useTheme.defaultThemes[0]);
  const themes = useTheme.getAllThemes();

  if (!container) return;
  container.innerHTML = '';

  themes.forEach(t => {
    const isActive = active && active.id === t.id;
    const isDark = t.mode === 'dark';
    const card = document.createElement('div');
    card.className = 'card';
    card.style.borderLeft = `4px solid ${t.primary}`;
    card.style.marginBottom = '6px';
    card.style.padding = '8px 12px';
    if (isActive) {
      card.style.boxShadow = `0 0 0 2px var(--brand-cta), var(--shadow-sm)`;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <div style="display: flex; gap: 3px; align-items: center;">
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${t.primary}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" title="Màu chính: ${t.primary}"></span>
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${t.cta}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" title="Nút CTA: ${t.cta}"></span>
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${t.surface}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" title="Nền thẻ: ${t.surface}"></span>
            </div>
            <strong style="font-size: 0.88rem; color: ${t.primary};">${t.name}</strong>
            ${isActive ? '<span class="badge badge-success" style="font-size:0.68rem; padding:1px 5px;"><i class="ri-check-line"></i> Đang dùng</span>' : ''}
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${t.meaning ? `<span>${t.meaning} • </span>` : ''}
            <code>${t.primary}</code> / <code>${t.cta}</code> / <code>${t.surface}</code>
          </div>
        </div>

        <div style="display: flex; gap: 4px; flex-shrink: 0;">
          <button class="btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}" onclick="activateTheme(${t.id})" style="display: inline-flex; align-items: center; gap: 4px;">
            ${isActive ? '<i class="ri-check-line"></i> Dùng' : '<i class="ri-flashlight-line"></i> Áp dụng'}
          </button>
          <button class="btn btn-sm btn-outline" onclick="editTheme(${t.id})" title="Chỉnh sửa"><i class="ri-edit-line"></i></button>
          ${t.id !== 1 ? `<button class="btn btn-sm btn-danger" onclick="removeTheme(${t.id})" title="Xóa"><i class="ri-delete-bin-line"></i></button>` : ''}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Đổi theme ngay lập tức
 */
window.activateTheme = function(id) {
  const themes = useTheme.getAllThemes();
  const target = themes.find(t => t.id === id);
  if (target) {
    useTheme.applyTheme(target);
    useToast.show(`Đã áp dụng bảng màu: ${target.name}`, 'success');
    renderThemesList();
  }
};

/**
 * Xử lý lưu (Thêm mới hoặc Cập nhật)
 */
function handleSaveTheme(e) {
  e.preventDefault();
  const id = document.getElementById('themeId').value;
  const name = document.getElementById('themeName').value.trim();
  
  // Lấy mã màu từ ô nhập HEX (hoặc ô color)
  let primary = document.getElementById('primaryHex').value.trim() || document.getElementById('primaryColor').value;
  let cta = document.getElementById('ctaHex').value.trim() || document.getElementById('ctaColor').value;
  let surface = document.getElementById('surfaceHex').value.trim() || document.getElementById('surfaceColor').value;
  
  if (!primary.startsWith('#')) primary = '#' + primary;
  if (!cta.startsWith('#')) cta = '#' + cta;
  if (!surface.startsWith('#')) surface = '#' + surface;

  // Lấy chế độ Sáng / Tối
  const modeRadio = document.querySelector('input[name="themeMode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'light';

  const meaning = document.getElementById('themeMeaning').value.trim();

  if (!name) {
    useToast.show('Vui lòng nhập tên chủ đề', 'error');
    return;
  }

  const themeData = {
    name,
    primary,
    cta,
    surface,
    mode,
    meaning
  };
  if (id) themeData.id = parseInt(id);

  useTheme.saveTheme(themeData);
  useToast.show(id ? 'Cập nhật bảng màu thành công!' : 'Đã thêm bảng màu mới!', 'success');

  resetThemeForm();
  renderThemesList();
}

/**
 * Điền thông tin lên form để sửa
 */
window.editTheme = function(id) {
  const themes = useTheme.getAllThemes();
  const t = themes.find(item => item.id === id);
  if (!t) return;

  document.getElementById('themeId').value = t.id;
  document.getElementById('themeName').value = t.name;

  // Cập nhật cả color picker và hex input
  document.getElementById('primaryColor').value = t.primary;
  document.getElementById('primaryHex').value = t.primary.toUpperCase();

  document.getElementById('ctaColor').value = t.cta;
  document.getElementById('ctaHex').value = t.cta.toUpperCase();

  document.getElementById('surfaceColor').value = t.surface;
  document.getElementById('surfaceHex').value = t.surface.toUpperCase();

  // Chọn đúng radio Sáng / Tối
  const modeVal = t.mode || 'light';
  const radio = document.querySelector(`input[name="themeMode"][value="${modeVal}"]`);
  if (radio) radio.checked = true;

  document.getElementById('themeMeaning').value = t.meaning || '';
  document.getElementById('formTitle').innerText = 'Chỉnh sửa: ' + t.name;

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Xóa theme
 */
window.removeTheme = function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa bảng màu này không?')) {
    if (useTheme.deleteTheme(id)) {
      useToast.show('Đã xóa bảng màu!', 'info');
      renderThemesList();
    }
  }
};

/**
 * Đặt lại form về ban đầu
 */
window.resetThemeForm = function() {
  document.getElementById('themeForm').reset();
  document.getElementById('themeId').value = '';
  document.getElementById('formTitle').innerText = 'Thêm bảng màu mới';

  document.getElementById('primaryColor').value = '#12304A';
  document.getElementById('primaryHex').value = '#12304A';

  document.getElementById('ctaColor').value = '#087F78';
  document.getElementById('ctaHex').value = '#087F78';

  document.getElementById('surfaceColor').value = '#E9F7F3';
  document.getElementById('surfaceHex').value = '#E9F7F3';

  const defaultRadio = document.querySelector('input[name="themeMode"][value="light"]');
  if (defaultRadio) defaultRadio.checked = true;
};

/**
 * =========================================================================
 * THUẬT TOÁN GỢI Ý MÀU CHẾ ĐỘ TỐI THÔNG MINH (Không bị quá tối, thẻ và tiêu đề rõ nét)
 * =========================================================================
 */
function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  } else {
    return [210, 50, 50];
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Tự động tính toán bộ màu Tối tương phản cao, thẻ và tiêu đề không bị tối đen
 */
window.autoSuggestDarkMode = function() {
  const curPrimary = document.getElementById('primaryHex').value.trim() || document.getElementById('primaryColor').value;
  const curCta = document.getElementById('ctaHex').value.trim() || document.getElementById('ctaColor').value;

  const [h1, s1] = hexToHsl(curPrimary);
  const [h2, s2] = hexToHsl(curCta);

  // 1. Màu chính / Tiêu đề (Dark Primary): Cần sáng rõ (Lightness 75-80%), tươi sáng
  const darkPrimary = hslToHex(h1, Math.max(70, s1), 76);

  // 2. Nút CTA: Tươi nổi bật (Lightness 54%, Saturation 85%)
  const darkCta = hslToHex(h2, Math.max(75, s2), 54);

  // 3. Nền thẻ card: Tuyệt đối KHÔNG dùng màu đen kịt (#000000). Dùng Slate êm mắt (Lightness 18-20%)
  const darkSurface = hslToHex(h1, 30, 20);

  // Cập nhật lên form
  document.getElementById('primaryColor').value = darkPrimary;
  document.getElementById('primaryHex').value = darkPrimary;

  document.getElementById('ctaColor').value = darkCta;
  document.getElementById('ctaHex').value = darkCta;

  document.getElementById('surfaceColor').value = darkSurface;
  document.getElementById('surfaceHex').value = darkSurface;

  // Chuyển radio sang Tối
  const darkRadio = document.querySelector('input[name="themeMode"][value="dark"]');
  if (darkRadio) darkRadio.checked = true;

  useToast.show('Đã gợi ý bộ màu Tối: Tiêu đề sáng nổi bật, nền thẻ dịu mắt không bị tối đen!', 'success');
};

/**
 * Khi người dùng bấm chuyển radio Sáng / Tối
 */
window.handleModeChange = function(mode) {
  if (mode === 'dark') {
    const curPrimary = document.getElementById('primaryHex').value.trim() || '#12304A';
    const [, , l] = hexToHsl(curPrimary);
    // Nếu màu tiêu đề đang quá tối (Lightness < 40%) vốn chỉ đọc được ở nền sáng, tự động gợi ý màu tối sáng hơn
    if (l < 40) {
      autoSuggestDarkMode();
    }
  }
};
