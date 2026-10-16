"use client";

import { PageIntro, PortalShell } from "./shared";

const articles: Record<
  string,
  {
    title: string;
    eyebrow: string;
    intro: string;
    sections: [string, string][];
  }
> = {
  stories: {
    title: "Câu chuyện cộng đồng",
    eyebrow: "Lan tỏa điều tử tế",
    intro:
      "Những trải nghiệm thật của tình nguyện viên và tổ chức trên hành trình cùng cộng đồng.",
    sections: [
      [
        "Một ngày xanh bắt đầu từ những bàn tay nhỏ",
        "Các tình nguyện viên cùng nhau trồng cây, làm sạch không gian công cộng và kết nối người dân địa phương.",
      ],
      [
        "Khi sự sẻ chia trở thành hành động",
        "Mỗi chuyến đi mang theo sự hỗ trợ thiết thực và những cuộc gặp gỡ làm nên thay đổi lâu dài.",
      ],
      [
        "Cùng nhau tạo nên cộng đồng bền vững",
        "Từ những việc nhỏ, cộng đồng tình nguyện tiếp tục lan tỏa tinh thần trách nhiệm và sự tử tế.",
      ],
    ],
  },
  about: {
    title: "Về NhiLun · VolunteerHub",
    eyebrow: "Kết nối trái tim, lan tỏa hành động",
    intro:
      "NhiLun là nền tảng kết nối tình nguyện viên với các tổ chức và hoạt động vì cộng đồng.",
    sections: [
      [
        "Sứ mệnh",
        "Giúp mọi người dễ dàng tìm thấy cơ hội đóng góp phù hợp và giúp tổ chức xây dựng những hoạt động an toàn, có tác động.",
      ],
      [
        "Giá trị cốt lõi",
        "Minh bạch, tôn trọng, trách nhiệm và cùng học hỏi trong mỗi hoạt động.",
      ],
      [
        "Cộng đồng",
        "Chúng tôi tin rằng thay đổi tích cực bắt đầu từ sự tham gia của mỗi người.",
      ],
    ],
  },
  privacy: {
    title: "Chính sách bảo mật",
    eyebrow: "Quyền riêng tư của bạn",
    intro:
      "Chúng tôi sử dụng thông tin cần thiết để vận hành tài khoản và kết nối bạn với hoạt động tình nguyện.",
    sections: [
      [
        "Thông tin được thu thập",
        "Thông tin hồ sơ, liên hệ, đăng ký hoạt động và lịch sử tham gia được lưu để cung cấp dịch vụ.",
      ],
      [
        "Cách sử dụng thông tin",
        "Dữ liệu chỉ được sử dụng cho vận hành nền tảng, xác minh hoạt động, hỗ trợ người dùng và bảo đảm an toàn cộng đồng.",
      ],
      [
        "Bảo vệ dữ liệu",
        "Quyền truy cập được giới hạn theo vai trò; thông tin nhạy cảm không hiển thị công khai. Bạn có thể cập nhật hồ sơ trong trang cá nhân.",
      ],
    ],
  },
  terms: {
    title: "Điều khoản sử dụng",
    eyebrow: "Cùng xây dựng môi trường an toàn",
    intro:
      "Khi sử dụng VolunteerHub, bạn đồng ý tuân thủ các quy tắc ứng xử và hướng dẫn an toàn trong hoạt động.",
    sections: [
      [
        "Ứng xử tôn trọng",
        "Tôn trọng người tham gia, cộng đồng địa phương và các quy định của đơn vị tổ chức.",
      ],
      [
        "Thông tin chính xác",
        "Cung cấp thông tin đăng ký chính xác và cập nhật khi có thay đổi ảnh hưởng đến việc tham gia.",
      ],
      [
        "An toàn hoạt động",
        "Tuân theo hướng dẫn của ban tổ chức, không thực hiện hành vi gây nguy hiểm hoặc ảnh hưởng đến người khác.",
      ],
    ],
  },
};

export function StaticContentPage({ page }: { page: keyof typeof articles }) {
  const content = articles[page];
  return (
    <PortalShell>
      <div className="container">
        <PageIntro
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.intro}
        />
        <div className="portal-grid">
          {content.sections.map(([title, body]) => (
            <article key={title} className="portal-card">
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
