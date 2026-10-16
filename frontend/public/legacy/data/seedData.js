/**
 * SEED_DATA.JS — Dữ liệu mẫu chuẩn hóa cho nền tảng NhiLun
 * Đồng bộ các thực thể: Organizations, Activities, Applications, Certificates, Audit Logs
 */

const SEED_DATA = {
  users: [
    {
      id: "USR-001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901 234 567",
      dob: "12/05/2003",
      city: "TP. Hồ Chí Minh",
      role: "volunteer",
      roleTitle: "Tình nguyện viên",
      avatarImg: "images/profile-avatar.jpg",
      bio: "Sinh viên yêu thích hoạt động môi trường và cộng đồng. Mong muốn cống hiến cho xã hội.",
      skills: ["Làm việc nhóm", "Giao tiếp", "Sơ cấp cứu", "Tổ chức sự kiện", "Chụp ảnh"]
    },
    {
      id: "USR-002",
      name: "Ban Điều Phối Quỹ Xanh",
      email: "coordinator@quyxanh.vn",
      phone: "0908 123 456",
      city: "TP. Hồ Chí Minh",
      role: "organizer",
      roleTitle: "Ban tổ chức",
      avatarImg: "images/act-tree.jpg",
      orgName: "Quỹ Xanh Việt Nam"
    },
    {
      id: "USR-003",
      name: "Quản Trị Viên Hệ Thống",
      email: "admin@volunteerhub.vn",
      phone: "0988 777 666",
      city: "Hà Nội",
      role: "admin",
      roleTitle: "Quản trị viên",
      avatarImg: "images/sapling-soil.jpg"
    }
  ],

  organizations: [
    {
      id: "ORG-001",
      name: "Quỹ Xanh Việt Nam",
      representative: "Anh Minh Trí",
      category: "Môi trường",
      status: "approved",
      verified: true,
      docName: "Giấy phép hoạt động số 12/GP-BNV.pdf",
      registeredAt: "10/10/2026",
      desc: "Tổ chức bảo tồn thiên nhiên và phục hồi rừng ngập mặn hàng đầu."
    },
    {
      id: "ORG-002",
      name: "CLB Ánh Sáng Tương Lai",
      representative: "Chị Thu Thảo",
      category: "Giáo dục",
      status: "approved",
      verified: true,
      docName: "Quyết định thành lập CLB.pdf",
      registeredAt: "12/10/2026",
      desc: "Dự án trao gửi sách vở và hỗ trợ học sinh vùng cao khó khăn."
    },
    {
      id: "ORG-003",
      name: "Nhóm Thiện Nguyện Hoa Sen",
      representative: "Nguyễn Thị Lan",
      category: "Cộng đồng",
      status: "pending",
      verified: false,
      docName: "Điều lệ tổ chức Hoa Sen.pdf",
      registeredAt: "08/10/2026",
      desc: "Nấu cơm thiện nguyện và hỗ trợ mái ấm người già neo đơn."
    },
    {
      id: "ORG-004",
      name: "Hội Thầy Thuốc Vì Cộng Đồng",
      representative: "Bác sĩ Hoàng Nam",
      category: "Y tế",
      status: "pending",
      verified: false,
      docName: "Giấy phép hành nghề y tế.pdf",
      registeredAt: "05/10/2026",
      desc: "Khám chữa bệnh và cấp phát thuốc miễn phí cho đồng bào biên giới."
    }
  ],

  activities: [
    {
      id: "ACT-001",
      slug: "trong-cay-can-gio-2026",
      title: "Ngày hội trồng 1.000 cây xanh vì môi trường",
      category: "Môi trường",
      organizer: "Quỹ Xanh Việt Nam",
      organizerVerified: true,
      date: "24/10/2026",
      time: "07:00 - 13:00",
      city: "TP. Hồ Chí Minh",
      location: "Rừng ngập mặn Cần Giờ, Huyện Cần Giờ, TP. Hồ Chí Minh",
      capacity: 50,
      applied: 38,
      verifiedHours: 6,
      status: "Đang tuyển",
      featured: true,
      banner: "images/act-tree.jpg",
      description: "Chung tay trồng cây xanh phục hồi rừng ngập mặn Cần Giờ, góp phần bảo vệ lá phổi xanh của thành phố và ứng phó với biến đổi khí hậu.",
      schedule: [
        { time: "06:30 - 07:00", content: "Tập trung tại điểm hẹn & di chuyển xe chung đến Cần Giờ" },
        { time: "07:00 - 07:30", content: "Phổ biến kiến thức an toàn rừng ngập mặn & phát dụng cụ bảo hộ" },
        { time: "07:30 - 11:30", content: "Tiến hành trồng 1.000 cây mắm và cây đước theo luống phân công" },
        { time: "11:30 - 12:30", content: "Thu dọn dụng cụ, vệ sinh cá nhân và dùng bữa trưa dã ngoại thân mật" },
        { time: "12:30 - 13:00", content: "Quét QR điểm danh, tổng kết đóng góp và chụp ảnh lưu niệm" }
      ],
      requirements: "Tuổi từ 18 trở lên, có sức khỏe tốt, không ngại lội bùn, có tinh thần làm việc nhóm và bảo vệ thiên nhiên.",
      itemsToBring: "Ủng hoặc giày cũ đi bùn, 1 bộ quần áo dự phòng để thay, nón rộng vành, bình nước cá nhân.",
      contact: "Anh Minh Trí - 0908 123 456 (Điều phối viên)"
    },
    {
      id: "ACT-002",
      slug: "tu-sach-trao-em-dong-nai",
      title: "Tủ sách trao em — Đem tri thức đến trường vùng sâu",
      category: "Giáo dục",
      organizer: "CLB Ánh Sáng Tương Lai",
      organizerVerified: true,
      date: "02/11/2026",
      time: "08:00 - 16:00",
      city: "Đồng Nai",
      location: "Trường Tiểu Học La Ngà, Huyện Định Quán, Tỉnh Đồng Nai",
      capacity: 30,
      applied: 22,
      verifiedHours: 8,
      status: "Sắp diễn ra",
      featured: true,
      banner: "images/act-books.jpg",
      description: "Trao tặng 500 đầu sách thiếu nhi, sơn sửa góc đọc sách thân thiện và tổ chức các trò chơi giao lưu bổ ích cho học sinh tiểu học.",
      schedule: [
        { time: "07:30 - 08:30", content: "Tập trung tại trường, phân chia nhóm phụ trách từng khu vực" },
        { time: "08:30 - 11:30", content: "Sơn tường, lắp ráp kệ sách và phân loại sách theo chủ đề" },
        { time: "11:30 - 13:30", content: "Nghỉ ngơi và dùng bữa trưa cùng thầy cô nhà trường" },
        { time: "13:30 - 15:30", content: "Tổ chức ngày hội đọc sách và các trò chơi đố vui có thưởng cho các em nhỏ" },
        { time: "15:30 - 16:00", content: "Bàn giao tủ sách, quét QR điểm danh và nhận xác nhận giờ" }
      ],
      requirements: "Yêu thích trẻ em, khéo tay hoặc có kỹ năng sinh hoạt tập thể, nhiệt tình và kiên nhẫn.",
      itemsToBring: "Trang phục lịch sự, cọ sơn cá nhân (nếu có), tinh thần hào hứng và nụ cười rạng rỡ.",
      contact: "Chị Thu Thảo - 0912 345 678 (Chủ nhiệm CLB)"
    },
    {
      id: "ACT-003",
      slug: "bua-com-0-dong-binh-thanh",
      title: "Bữa cơm yêu thương 0 đồng cuối tuần",
      category: "Cộng đồng",
      organizer: "Nhóm Thiện Nguyện Hoa Sen",
      organizerVerified: false,
      date: "28/10/2026",
      time: "07:30 - 13:30",
      city: "TP. Hồ Chí Minh",
      location: "Bếp Ăn Nghĩa Tình, Quận 10, TP. Hồ Chí Minh",
      capacity: 40,
      applied: 20,
      verifiedHours: 5,
      status: "Sắp diễn ra",
      featured: true,
      banner: "images/act-food.jpg",
      description: "Chung tay chế biến và trao tận tay 400 suất ăn nóng sốt, đầy đủ dinh dưỡng cho bệnh nhân nghèo và người lao động có hoàn cảnh khó khăn.",
      schedule: [
        { time: "07:30 - 08:30", content: "Sơ chế rau củ, chuẩn bị nguyên vật liệu và vệ sinh khu bếp" },
        { time: "08:30 - 11:00", content: "Phụ bếp, nấu nướng và đóng hộp các phần cơm dinh dưỡng" },
        { time: "11:00 - 12:30", content: "Phát cơm tận tay bà con và hỗ trợ người già, khuyết tật" },
        { time: "12:30 - 13:30", content: "Dọn dẹp khu vực bếp, họp rút kinh nghiệm và điểm danh" }
      ],
      requirements: "Sạch sẽ, cẩn thận, có trách nhiệm, đảm bảo vệ sinh an toàn thực phẩm.",
      itemsToBring: "Tạp dề, khẩu trang, găng tay thực phẩm cá nhân.",
      contact: "Chị Lan - 0933 456 789 (Trưởng nhóm)"
    },
    {
      id: "ACT-004",
      slug: "chung-tay-vi-thu-cung-vung-tau",
      title: "Chung tay vì thú cưng và động vật cứu hộ",
      category: "Động vật",
      organizer: "Mái Ấm Yêu Thương Vũng Tàu",
      organizerVerified: true,
      date: "05/11/2026",
      time: "08:00 - 14:00",
      city: "Vũng Tàu",
      location: "Trạm Cứu Hộ Động Vật, TP. Vũng Tàu",
      capacity: 25,
      applied: 15,
      verifiedHours: 6,
      status: "Đang tuyển",
      featured: true,
      banner: "images/act-animal.jpg",
      description: "Chăm sóc, dọn dẹp chuồng trại, tắm rửa và hỗ trợ tiêm phòng cho các chú chó, mèo bị bỏ rơi hoặc gặp tai nạn.",
      schedule: [
        { time: "08:00 - 09:00", content: "Làm quen với các bé thú cưng và phân công nhiệm vụ" },
        { time: "09:00 - 11:30", content: "Vệ sinh khu lưu trú, cho ăn và hỗ trợ bác sĩ thú y" },
        { time: "11:30 - 13:00", content: "Nghỉ trưa và giao lưu cùng các thành viên tình nguyện" },
        { time: "13:00 - 14:00", content: "Tắm nắng, dắt thú đi dạo và điểm danh" }
      ],
      requirements: "Yêu thương động vật, không dị ứng lông chó mèo, trang phục năng động.",
      itemsToBring: "Găng tay bảo hộ, trang phục dài tay, khăn lau cá nhân.",
      contact: "Anh Tuấn - 0977 112 233"
    },
    {
      id: "ACT-005",
      slug: "kham-benh-cap-thuoc-binh-phuoc",
      title: "Khám bệnh & cấp phát túi thuốc gia đình miễn phí",
      category: "Y tế",
      organizer: "Hội Thầy Thuốc Vì Cộng Đồng",
      organizerVerified: true,
      date: "15/11/2026",
      time: "07:30 - 15:00",
      city: "Bình Phước",
      location: "Trạm Y Tế Xã Đắk Ơ, Huyện Bù Gia Mập, Bình Phước",
      capacity: 20,
      applied: 14,
      verifiedHours: 7,
      status: "Đang tuyển",
      featured: false,
      banner: "images/act-medical.jpg",
      description: "Hỗ trợ các bác sĩ hướng dẫn người dân làm thủ tục khám bệnh, đo huyết áp và phát 300 phần thuốc thiết yếu cho đồng bào vùng biên giới.",
      schedule: [
        { time: "07:30 - 08:30", content: "Tập trung tại trạm y tế, sắp xếp bàn ghế, phân công nhiệm vụ" },
        { time: "08:30 - 11:30", content: "Hỗ trợ đo mạch, huyết áp và điều phối vào các phòng khám chuyên khoa" },
        { time: "11:30 - 13:00", content: "Nghỉ trưa tại trạm y tế (BTC hỗ trợ cơm trưa dinh dưỡng)" },
        { time: "13:00 - 15:00", content: "Đóng gói túi thuốc theo đơn và hướng dẫn bà con sử dụng thuốc an toàn" }
      ],
      requirements: "Ưu tiên sinh viên ngành Y/Dược hoặc tình nguyện viên có kinh nghiệm sơ cấp cứu.",
      itemsToBring: "Áo blouse (nếu có), trang phục lịch sự, thẻ sinh viên/CCCD.",
      contact: "BS. Hoàng Nam - 0989 334 455"
    },
    {
      id: "ACT-006",
      slug: "lam-sach-bo-bien-binh-thuan",
      title: "Làm sạch bờ biển — Trả lại màu xanh cho đại dương",
      category: "Cộng đồng",
      organizer: "Quỹ Xanh Việt Nam",
      organizerVerified: true,
      date: "18/10/2026",
      time: "07:00 - 12:00",
      city: "Bình Thuận",
      location: "Bãi biển Đồi Dương, TP. Phan Thiết, Bình Thuận",
      capacity: 40,
      applied: 25,
      verifiedHours: 5,
      status: "Đang diễn ra",
      featured: false,
      banner: "images/act-beach.jpg",
      description: "Thu gom rác thải nhựa, dọn sạch bờ biển và tuyên truyền nâng cao ý thức bảo vệ môi trường biển cho du khách.",
      schedule: [
        { time: "07:00 - 07:30", content: "Tập trung tại tượng đài Chiến Thắng, phát găng tay và bao tải thu gom" },
        { time: "07:30 - 11:00", content: "Thu gom và phân loại rác thải nhựa dọc bờ biển 3km" },
        { time: "11:00 - 12:00", content: "Chuyển giao rác cho xe chuyên dụng của môi trường đô thị và điểm danh" }
      ],
      requirements: "Sức khỏe tốt, chịu được thời tiết nắng gió biển, tinh thần trách nhiệm cao.",
      itemsToBring: "Nón rộng vành, kem chống nắng, chai nước cá nhân.",
      contact: "Anh Trí - 0908 123 456"
    }
  ],

  applications: [
    {
      id: "APP-2026-001",
      activityId: "ACT-001",
      activityTitle: "Ngày hội trồng 1.000 cây xanh vì môi trường",
      organizer: "Quỹ Xanh Việt Nam",
      userId: "USR-001",
      userName: "Nguyễn Văn An",
      userEmail: "an.nguyen@email.com",
      userPhone: "0901 234 567",
      date: "24/10/2026",
      shift: "Toàn thời gian (Cả ngày theo lịch trình)",
      status: "approved",
      statusText: "Đã duyệt",
      checkinStatus: "checked_in",
      verifiedHours: 6,
      hasCert: true,
      appliedAt: "10/10/2026 14:30"
    },
    {
      id: "APP-2026-002",
      activityId: "ACT-002",
      activityTitle: "Tủ sách trao em — Đem tri thức đến trường vùng sâu",
      organizer: "CLB Ánh Sáng Tương Lai",
      userId: "USR-001",
      userName: "Nguyễn Văn An",
      userEmail: "an.nguyen@email.com",
      userPhone: "0901 234 567",
      date: "02/11/2026",
      shift: "Ca sáng (08:00 - 12:00)",
      status: "pending",
      statusText: "Chờ duyệt",
      checkinStatus: "not_yet",
      verifiedHours: 0,
      hasCert: false,
      appliedAt: "11/10/2026 09:15"
    },
    {
      id: "APP-2026-003",
      activityId: "ACT-003",
      activityTitle: "Bữa cơm yêu thương 0 đồng cuối tuần",
      organizer: "Nhóm Thiện Nguyện Hoa Sen",
      userId: "USR-004",
      userName: "Trần Thị Mai",
      userEmail: "mai.tran@email.com",
      userPhone: "0912 888 999",
      date: "28/10/2026",
      shift: "Ca sáng (07:30 - 13:30)",
      status: "pending",
      statusText: "Chờ duyệt",
      checkinStatus: "not_yet",
      verifiedHours: 0,
      hasCert: false,
      appliedAt: "12/10/2026 08:00"
    }
  ],

  certificates: [
    {
      id: "CERT-001",
      certificateCode: "CERT-2026-001",
      userId: "USR-001",
      userName: "Nguyễn Văn An",
      activityId: "ACT-001",
      title: "Chiến Sĩ Môi Trường Xanh 2026",
      issuer: "Quỹ Xanh Việt Nam",
      hours: 6,
      issueDate: "15/09/2026",
      badgeType: "Chứng nhận hoàn thành",
      qrVerified: true
    },
    {
      id: "CERT-002",
      certificateCode: "CERT-2026-002",
      userId: "USR-001",
      userName: "Nguyễn Văn An",
      activityId: "ACT-006",
      title: "20 Giờ Cống Hiến Vì Cộng Đồng",
      issuer: "Thành Đoàn TP. Hồ Chí Minh",
      hours: 20,
      issueDate: "15/07/2026",
      badgeType: "Huy hiệu cống hiến",
      qrVerified: true
    },
    {
      id: "CERT-003",
      certificateCode: "CERT-2026-003",
      userId: "USR-001",
      userName: "Nguyễn Văn An",
      activityId: "ACT-002",
      title: "Tiếp Sức Mùa Thi Đại Học 2026",
      issuer: "Hội Sinh Viên ĐHQG TP.HCM",
      hours: 4,
      issueDate: "01/07/2026",
      badgeType: "Giấy khen thành tích",
      qrVerified: true
    }
  ],

  notifications: [
    {
      id: "notif-1",
      userId: "USR-001",
      icon: '<i class="ri-checkbox-circle-line"></i>',
      type: "success",
      title: "Đơn tham gia đã được duyệt!",
      desc: "Ban Điều Phối Quỹ Xanh đã phê duyệt bạn cho 'Ngày hội trồng cây xanh 2026'.",
      time: "10 phút trước",
      unread: true,
      link: "detail.html?id=ACT-001"
    },
    {
      id: "notif-2",
      userId: "USR-001",
      icon: '<i class="ri-award-line"></i>',
      type: "info",
      title: "Chứng nhận điện tử mới được cấp",
      desc: "Hệ thống vừa cấp mã CERT-2026-001 vào hồ sơ của bạn (+6 giờ tình nguyện).",
      time: "2 giờ trước",
      unread: true,
      link: "certificates.html"
    },
    {
      id: "notif-3",
      userId: "USR-001",
      icon: '<i class="ri-time-line"></i>',
      type: "warning",
      title: "Nhắc nhở sự kiện sắp diễn ra",
      desc: "Hoạt động 'Sách Cho Em' sẽ bắt đầu sau 6 ngày nữa. Hãy kiểm tra vật dụng.",
      time: "1 ngày trước",
      unread: true,
      link: "schedule.html"
    }
  ],

  auditLogs: [
    {
      id: "LOG-001",
      time: "12/10/2026 15:45",
      actor: "Quản Trị Viên (admin@volunteerhub.vn)",
      action: "Phê duyệt tổ chức",
      target: "Quỹ Xanh Việt Nam",
      details: "Xác minh giấy phép Bộ Nội Vụ cấp tích xanh hợp lệ",
      ip: "118.69.182.45"
    },
    {
      id: "LOG-002",
      time: "12/10/2026 14:10",
      actor: "Ban Điều Phối (coordinator@quyxanh.vn)",
      action: "Tạo hoạt động mới",
      target: "Ngày hội trồng 1.000 cây xanh",
      details: "Thiết lập chỉ tiêu 50 người, địa điểm Cần Giờ",
      ip: "14.241.233.10"
    },
    {
      id: "LOG-003",
      time: "12/10/2026 11:20",
      actor: "Quản Trị Viên (admin@volunteerhub.vn)",
      action: "Công bố hoạt động",
      target: "Tủ sách trao em — Đồng Nai",
      details: "Kiểm duyệt nội dung an toàn và cho phép hiển thị công khai",
      ip: "118.69.182.45"
    }
  ],

  favorites: ["ACT-001", "ACT-003"]
};

if (typeof window !== 'undefined') {
  window.SEED_DATA = SEED_DATA;
}
