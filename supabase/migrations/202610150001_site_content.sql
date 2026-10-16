create table if not exists public.site_content (
  content_key text primary key,
  content_html text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content for select to anon, authenticated using (true);
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;

-- Seed the migrated About and Stories page content into the database.
insert into public.site_content(content_key,content_html) values ('aboutContent','

    <!-- 1. HERO BANNER VỀ VOLUNTEERHUB -->
    <section class="about-hero-banner">
      <div class="about-hero-top-row">
        <div class="about-hero-left">
          <div class="about-badge-pill">VỀ VOLUNTEERHUB</div>
          <h1 class="about-hero-title">
            Kết nối những trái tim<br>Lan tỏa những hành động đẹp
          </h1>
          <p class="about-hero-desc">
            NhiLun là nền tảng kết nối tình nguyện viên với các tổ chức, dự án thiện nguyện trên khắp Việt Nam. Chúng
            tôi tin rằng mỗi hành động nhỏ đều có thể tạo nên thay đổi lớn cho cộng đồng.
          </p>
          <div class="about-hero-actions">
            <a href="activities.html" class="btn-about-join">
              <i class="ri-plant-line"></i>
              <span>Tham gia ngay</span>
            </a>
            <a href="#" class="btn-about-video">
              <i class="ri-play-circle-line"></i>
              <span>Xem video giới thiệu</span>
            </a>
          </div>
        </div>

        <div class="about-hero-right">
          <div class="about-hero-quote">
            "Vì một cộng đồng<br>khỏe mạnh hơn ♡"
          </div>
          <img src="/legacy/images/profile-cover.jpg" alt="Đội ngũ tình nguyện" class="about-hero-img">
        </div>
      </div>

      <!-- 4 THẺ SỐ LIỆU ĐÈ DƯỚI BANNER -->
      <div class="about-hero-stats-row">
        <div class="about-stat-box">
          <div class="about-stat-icon green"><i class="ri-team-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">12.5K</div>
            <div class="about-stat-label">Tình nguyện viên</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon blue"><i class="ri-building-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">320</div>
            <div class="about-stat-label">Tổ chức đối tác</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon pink"><i class="ri-heart-3-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">1.2K</div>
            <div class="about-stat-label">Hoạt động đã tổ chức</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon teal"><i class="ri-time-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">350K+</div>
            <div class="about-stat-label">Giờ tình nguyện</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SỨ MỆNH & TẦM NHÌN -->
    <section class="about-mission-section">
      <div class="about-mission-left-card">
        <img src="/legacy/images/sapling-soil.jpg" alt="Mầm non hy vọng" class="about-mission-img">
        <div class="about-mission-overlay">
          <div class="about-mission-quote-overlay">
            "Hành động hôm nay<br>vì ngày mai tươi sáng ♡"
          </div>
        </div>
      </div>

      <div class="about-mission-right">
        <div>
          <div class="about-section-subtitle">SỨ MỆNH & TẦM NHÌN</div>
          <h2 class="about-section-heading">Vì một xã hội tốt đẹp hơn</h2>
        </div>

        <div class="about-mission-cards-grid">
          <!-- SỨ MỆNH -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-focus-3-line" style="color: #059669; font-size: 1.25rem;"></i>
              <span>Sứ mệnh</span>
            </div>
            <p class="mission-feature-desc">
              Tạo cầu nối giữa những người có mong muốn làm thiện nguyện với các tổ chức uy tín, giúp việc tham gia hoạt
              động cộng đồng trở nên dễ dàng, minh bạch và hiệu quả hơn.
            </p>
          </div>

          <!-- TẦM NHÌN -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-eye-line" style="color: #0284c7; font-size: 1.25rem;"></i>
              <span>Tầm nhìn</span>
            </div>
            <p class="mission-feature-desc">
              Trở thành nền tảng thiện nguyện hàng đầu Việt Nam, xây dựng một cộng đồng năng động, nhân văn, nơi mọi
              người đều có cơ hội đóng góp và tạo ra giá trị tích cực cho xã hội.
            </p>
          </div>

          <!-- GIÁ TRỊ CỐT LÕI -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-gem-line" style="color: #7c3aed; font-size: 1.25rem;"></i>
              <span>Giá trị cốt lõi</span>
            </div>
            <ul class="mission-values-list">
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Minh bạch và tin cậy</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Kết nối và sẻ chia</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Tôn trọng con người</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Hành động vì cộng đồng</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. CÁCH THỨC HOẠT ĐỘNG (4 BƯỚC) -->
    <section class="about-how-it-works-section">
      <div class="how-header-wrap">
        <div class="about-section-subtitle">CÁCH THỨC HOẠT ĐỘNG</div>
        <h2 class="about-section-heading">Tham gia thiện nguyện dễ dàng chỉ với 4 bước</h2>
        <p class="how-header-desc">
          Chúng tôi đơn giản hóa quy trình tham gia, giúp bạn nhanh chóng tìm được hoạt động phù hợp và bắt đầu hành
          trình lan tỏa những giá trị tốt đẹp.
        </p>
      </div>

      <div class="how-steps-row">
        <!-- BƯỚC 1 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-search-line"></i></div>
          <span class="how-step-num">01</span>
          <h4 class="how-step-title">Khám phá</h4>
          <p class="how-step-desc">Tìm kiếm hoạt động theo địa điểm, lĩnh vực và thời gian</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 2 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-edit-line"></i></div>
          <span class="how-step-num">02</span>
          <h4 class="how-step-title">Đăng ký</h4>
          <p class="how-step-desc">Đăng ký tham gia với vài thao tác đơn giản</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 3 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-team-line"></i></div>
          <span class="how-step-num">03</span>
          <h4 class="how-step-title">Tham gia</h4>
          <p class="how-step-desc">Tham gia hoạt động cùng cộng đồng</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 4 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-award-line"></i></div>
          <span class="how-step-num">04</span>
          <h4 class="how-step-title">Ghi nhận</h4>
          <p class="how-step-desc">Nhận chứng nhận giờ tình nguyện và lưu trữ hành trình</p>
        </div>
      </div>
    </section>

    <!-- 4. HÀNH TRÌNH & TÁC ĐỘNG -->
    <section class="about-impact-section">
      <div>
        <div class="about-section-subtitle">HÀNH TRÌNH & TÁC ĐỘNG</div>
        <h2 class="about-section-heading">Những con số biết nói</h2>
      </div>

      <div class="impact-content-grid">
        <div>
          <p class="impact-desc-text">
            Mỗi con số là một câu chuyện, một nụ cười và một tác động đến cộng đồng. Cùng nhau, chúng ta đã và đang tạo
            nên những thay đổi ý nghĩa.
          </p>
        </div>

        <!-- 4 METRIC TĂNG TRƯỞNG -->
        <div class="impact-metrics-row">
          <div class="impact-metric-card">
            <div class="impact-metric-icon blue"><i class="ri-team-line"></i></div>
            <div>
              <div class="impact-metric-num">12.5K+</div>
              <div class="impact-metric-label">Tình nguyện viên</div>
              <div class="impact-metric-growth">↗ +25% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon green"><i class="ri-building-line"></i></div>
            <div>
              <div class="impact-metric-num">320+</div>
              <div class="impact-metric-label">Tổ chức đối tác</div>
              <div class="impact-metric-growth">↗ +40% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon red"><i class="ri-heart-3-line"></i></div>
            <div>
              <div class="impact-metric-num">1.200+</div>
              <div class="impact-metric-label">Hoạt động đã tổ chức</div>
              <div class="impact-metric-growth">↗ +35% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon teal"><i class="ri-time-line"></i></div>
            <div>
              <div class="impact-metric-num">350K+</div>
              <div class="impact-metric-label">Giờ tình nguyện</div>
              <div class="impact-metric-growth">↗ +60% so với năm trước</div>
            </div>
          </div>
        </div>

        <!-- VIDEO BANNER THỰC TẾ -->
        <div class="impact-video-box">
          <img src="/legacy/images/home-hero-volunteer.jpg" alt="Video Hành Trình" class="impact-video-img">
          <div class="impact-video-overlay">
            <a href="#" class="impact-video-btn">
              <span><i class="ri-play-fill"></i></span>
              <span>Xem video hành trình 2026 (2:30)</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. ĐỐI TÁC & ĐỒNG HÀNH -->
    <section class="about-partners-section">
      <div>
        <div class="about-section-subtitle">ĐỐI TÁC & ĐỒNG HÀNH</div>
        <h2 class="about-section-heading">Cùng nhau tạo nên thay đổi</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0;">
          Chúng tôi hợp tác với nhiều tổ chức, doanh nghiệp và cộng đồng để mở rộng cơ hội thiện nguyện và tạo ra tác
          động bền vững.
        </p>
      </div>

      <div class="partners-logos-row">
        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #dc2626;"><i class="ri-hospital-line"></i></div>
          <div>
            <div class="partner-name">Hội Chữ Thập Đỏ Việt Nam</div>
            <div class="partner-sub">Đối tác chiến lược</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #16a34a;"><i class="ri-plant-line"></i></div>
          <div>
            <div class="partner-name">GreenViet</div>
            <div class="partner-sub">Vì môi trường xanh</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #2563eb;"><i class="ri-graduation-cap-line"></i></div>
          <div>
            <div class="partner-name">Teach For Vietnam</div>
            <div class="partner-sub">Giáo dục trẻ em</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #eab308;"><i class="ri-award-line"></i></div>
          <div>
            <div class="partner-name">Trung tâm Hỗ trợ Trẻ em</div>
            <div class="partner-sub">Bảo trợ trẻ em</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #ec4899;"><i class="ri-wallet-3-line"></i></div>
          <div>
            <div class="partner-name">MoMo</div>
            <div class="partner-sub">Ví cộng đồng</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #059669;"><i class="ri-bank-line"></i></div>
          <div>
            <div class="partner-name">Vietcombank</div>
            <div class="partner-sub">Chung niềm tin vững tương lai</div>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: #64748b; font-weight: 600; padding: 8px 12px;">
          Và nhiều đối tác khác...
        </div>
      </div>
    </section>

  ') on conflict(content_key) do update set content_html=excluded.content_html,updated_at=now();
insert into public.site_content(content_key,content_html) values ('storiesContent','

    <!-- 1. HERO BANNER CÂU CHUYỆN CỘNG ĐỒNG -->
    <div class="stories-hero-banner">
      <div class="stories-hero-left">
        <div class="stories-hero-pill">Stories • Câu chuyện cộng đồng</div>
        <h1 class="stories-hero-title">
          Mỗi hành động nhỏ<br>đều tạo nên thay đổi lớn
        </h1>
        <p class="stories-hero-desc">
          Cùng chia sẻ những khoảnh khắc, câu chuyện và cảm xúc trong hành trình tình nguyện của bạn.
        </p>
        <div class="stories-hero-actions">
          <button type="button" class="btn-share-story" onclick="openStoryModal()">
            <i class="ri-edit-box-line"></i>
            <span>Chia sẻ câu chuyện</span>
          </button>
          <a href="#" class="btn-watch-video" onclick="openStoryVideoModal(event)">
            <i class="ri-play-circle-line"></i>
            <span>Xem video nổi bật</span>
          </a>
        </div>
      </div>

      <div class="stories-hero-right">
        <div class="stories-hero-quote">
          "Lan tỏa yêu thương<br>Kết nối cộng đồng ♡"
        </div>
        <img src="/legacy/images/profile-cover.jpg" alt="Volunteers Looking at Nature" class="stories-hero-img">
      </div>
    </div>

    <!-- 2. BỘ LỌC DẠNG PILL & THANH TÌM KIẾM CÂU CHUYỆN -->
    <div class="stories-filter-strip">
      <div class="stories-pill-list">
        <button type="button" class="story-pill-btn active" onclick="filterStories(''all'', this)"><i class="ri-apps-2-line"></i> Tất cả</button>
        <button type="button" class="story-pill-btn" onclick="filterStories(''article'', this)"><i class="ri-article-line"></i> Bài viết</button>
        <button type="button" class="story-pill-btn" onclick="filterStories(''image'', this)"><i class="ri-image-line"></i> Hình ảnh</button>
        <button type="button" class="story-pill-btn" onclick="filterStories(''video'', this)"><i class="ri-video-line"></i> Video</button>
        <button type="button" class="story-pill-btn" onclick="filterStories(''inspire'', this)"><i class="ri-sparkling-line"></i> Câu chuyện truyền cảm hứng</button>
      </div>

      <div class="stories-search-input-box">
        <i class="ri-search-line stories-search-icon"></i>
        <input type="text" placeholder="Tìm kiếm câu chuyện..." oninput="handleSearchStories(this.value)">
      </div>
    </div>

    <!-- 3. LƯỚI CÂU CHUYỆN & SIDEBAR PHẢI -->
    <div class="stories-main-grid">

      <!-- LƯỚI 6 CÂU CHUYỆN CHÍNH (2 CỘT x 3 HÀNG) -->
      <section class="stories-cards-grid" id="storiesCardsContainer">

        <!-- THẺ 1: MÔI TRƯỜNG -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-tree.jpg" alt="Ngày hội trồng cây" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-leaf-line"></i> Môi trường</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Ngày hội trồng 1.000 cây xanh — Những nụ cười xanh</h3>
            <p class="story-card-desc">Tuy mệt nhưng rất vui khi được cùng các bạn trẻ góp phần làm cho thành phố xanh hơn. Mỗi cây được trồng là một hy vọng...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Nguyễn Thị Lan</div>
                  <div class="story-card-time">2 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>128</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 12</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 5</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 2: GIÁO DỤC -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-books.jpg" alt="Tủ sách trao em" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-book-read-line"></i> Giáo dục</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Tủ sách trao em — Hành trình của những cuốn sách biết đi</h3>
            <p class="story-card-desc">Nhìn các em nhỏ háo hức chọn sách, mình thấy mọi nỗ lực đều xứng đáng. Hy vọng những cuốn sách này sẽ mở ra nhiều...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/home-hero-volunteer.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Trần Minh Khoa</div>
                  <div class="story-card-time">3 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>256</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 18</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 11</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 3: CỘNG ĐỒNG -->
        <article class="story-card-item" data-category="inspire">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-beach.jpg" alt="Làm sạch bờ biển" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-heart-3-line"></i> Cộng đồng</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Làm sạch bờ biển — Trả lại màu xanh cho đại dương</h3>
            <p class="story-card-desc">Biển hôm nay sạch hơn nhờ sự chung tay của 50 tình nguyện viên. Chúng mình đã thu gom hơn 200kg rác thải nhựa...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Lê Thu Thảo</div>
                  <div class="story-card-time">5 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>189</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 24</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 16</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 4: Y TẾ -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-medical.jpg" alt="Khám bệnh miễn phí" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-heart-pulse-line"></i> Y tế</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Khám bệnh miễn phí — Nụ cười là liều thuốc quý nhất</h3>
            <p class="story-card-desc">Được gặp và lắng nghe những câu chuyện của bà con, mình thấy trân trọng hơn những gì mình đang có. Sức khỏe là tài sản...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Phạm Ngọc Anh</div>
                  <div class="story-card-time">1 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>302</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 20</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 14</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 5: CỨU TRỢ -->
        <article class="story-card-item" data-category="inspire">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-food.jpg" alt="Chung tay sau bão lũ" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-lifebuoy-line"></i> Cứu trợ</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Chung tay sau bão lũ — Không ai bị bỏ lại phía sau</h3>
            <p class="story-card-desc">Chúng mình đã trao hơn 500 phần quà thiết yếu đến các hộ dân vùng lũ. Những cái bắt tay, ánh mắt biết ơn là động lực để...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/home-hero-volunteer.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Vũ Đức Thành</div>
                  <div class="story-card-time">1 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>214</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 15</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 8</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 6: VIDEO -->
        <article class="story-card-item" data-category="video">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/home-hero-volunteer.jpg" alt="Một ngày làm tình nguyện viên" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-play-circle-line"></i> Video</span>
            <div class="story-video-play-badge">
              <div class="story-play-icon"><i class="ri-play-fill"></i></div>
            </div>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Một ngày làm tình nguyện viên cùng chúng mình <i class="ri-heart-fill" style="color: #10b981;"></i></h3>
            <p class="story-card-desc">Video ghi lại hành trình 1 ngày tham gia hoạt động tại trạm y tế xã. Nhiều cảm xúc, nhiều kỷ niệm đáng nhớ!</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Nguyễn Hoài Nam</div>
                  <div class="story-card-time">2 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" onclick="toggleLike(this)" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>176</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 10</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 22</span>
              </div>
            </div>
          </div>
        </article>

      </section>

      <!-- SIDEBAR THỐNG KÊ & NỔI BẬT BÊN PHẢI -->
      <aside class="stories-sidebar">

        <!-- HỘP THỐNG KÊ CỘNG ĐỒNG -->
        <div class="story-side-box">
          <div class="story-side-header">
            <h4 class="story-side-title">Câu chuyện cộng đồng</h4>
            <a href="#" class="story-side-link">Xem tất cả &rarr;</a>
          </div>
          <div class="story-stats-grid">
            <div class="story-stat-cell">
              <div class="story-stat-icon green"><i class="ri-file-text-line"></i></div>
              <div>
                <div class="story-stat-num">428</div>
                <div class="story-stat-label">Bài viết</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon blue"><i class="ri-image-line"></i></div>
              <div>
                <div class="story-stat-num">1.2K</div>
                <div class="story-stat-label">Hình ảnh</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon pink"><i class="ri-play-fill"></i></div>
              <div>
                <div class="story-stat-num">86</div>
                <div class="story-stat-label">Video</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon orange"><i class="ri-heart-fill"></i></div>
              <div>
                <div class="story-stat-num">3.4K</div>
                <div class="story-stat-label">Lượt thích</div>
              </div>
            </div>
          </div>
        </div>

        <!-- HỘP CÂU CHUYỆN NỔI BẬT -->
        <div class="story-side-box">
          <div class="story-side-header">
            <h4 class="story-side-title"><i class="ri-trophy-line" style="color: #f59e0b;"></i> Câu chuyện nổi bật</h4>
          </div>
          <div class="story-top-list">
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-tree.jpg" alt="Cùng nhau phủ xanh" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Cùng nhau phủ xanh quê hương</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Nguyễn Thị Lan</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 1.2K</div>
            </a>
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-books.jpg" alt="Những nụ cười vùng cao" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Những nụ cười vùng cao</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Trần Minh Khoa</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 953</div>
            </a>
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-beach.jpg" alt="Biển sạch hơn mỗi ngày" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Biển sạch hơn mỗi ngày</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Lê Thu Thảo</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 876</div>
            </a>
          </div>
        </div>

        <!-- HỘP KÊU GỌI TRUYỀN CẢM HỨNG -->
        <div class="story-inspire-box">
          <div class="story-inspire-icon"><i class="ri-plant-line"></i></div>
          <p class="story-inspire-text">"Câu chuyện của bạn có thể truyền cảm hứng cho hàng ngàn người khác"</p>
          <button type="button" class="btn-inspire-share" onclick="openStoryModal()">Chia sẻ ngay &rarr;</button>
        </div>

      </aside>

    </div>

  ') on conflict(content_key) do update set content_html=excluded.content_html,updated_at=now();
