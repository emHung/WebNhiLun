# Kiểm tra code và kích hoạt SonarQube Cloud

## Trạng thái

Workflow `.github/workflows/quality.yml` chạy khi push `main`, mở/cập nhật pull request hoặc chạy thủ công. Hai job độc lập kiểm tra Next.js/TypeScript và FastAPI/Bandit. Không cấp credential Supabase thật cho CI; không chạy seed, migration hay kiểm thử ghi DB thật.

SonarQube Cloud **chưa chạy** vì chủ repository chưa có tài khoản/project. Khi thiếu cấu hình, bước Sonar ghi `NOT RUN` vào summary và cảnh báo; đây không phải kết quả Quality Gate đạt. Fork PR không được cấp token và không chạy Sonar. Build/test/Bandit vẫn chạy được.

## Kích hoạt

1. Đăng nhập [SonarQube Cloud EU](https://sonarcloud.io) bằng tài khoản GitHub sở hữu repository. Import đúng `emHung/WebNhiLun`, chọn phân tích bằng GitHub Actions. Nếu đang bật Automatic Analysis, chuyển sang CI analysis theo hướng dẫn của Sonar để tránh hai cơ chế xung đột.
2. Chỉ cấp ứng dụng Sonar quyền truy cập repository này. Dịch vụ sẽ nhận mã nguồn trong phạm vi quét, thông tin commit/PR và coverage; quyền GitHub App cụ thể cần xem trên màn hình cấp quyền. Tự xác nhận lựa chọn gói, không đăng ký thanh toán chỉ để chạy workflow.
3. Trong GitHub → Settings → Secrets and variables → Actions, thêm:

   | Loại | Tên | Giá trị |
   | --- | --- | --- |
   | Repository secret | `SONAR_TOKEN` | Token có quyền phân tích project từ SonarQube Cloud |
   | Repository variable | `SONAR_ORGANIZATION` | Organization Key thực tế |
   | Repository variable | `SONAR_PROJECT_KEY` | Project Key thực tế |

   Không gửi token qua chat, không ghi vào `sonar-project.properties`. Không tự đoán hai key từ tên GitHub. Workflow mặc định dùng Cloud EU; nếu project thuộc US phải sửa endpoint theo tài liệu Sonar trước khi chạy.
4. Actions → Code quality → Run workflow. Khi đủ cấu hình, scanner gửi phân tích và đợi Quality Gate tối đa 300 giây; gate không đạt sẽ làm bước scan thất bại. Lượt phân tích đầu có thể chưa có baseline; xem kết quả trên dashboard.
5. Sau khi có lượt Sonar thực sự đạt, chủ repository có thể cấu hình branch protection yêu cầu các check. Workflow tự nó không cấm push trực tiếp vào `main`; đợt tích hợp này không thay branch protection.

## Phạm vi và giới hạn

- Quét code runtime trong `backend/app` và các thư mục Next.js app/components/hooks/lib, middleware/config. HTML legacy, bản sao tài nguyên, script vận hành/migration và dữ liệu seed không nằm trong phạm vi Sonar hiện tại.
- Coverage Python do các unit test offline sinh ra, không phải coverage end-to-end. Chưa có coverage frontend; không tạo dữ liệu coverage giả hay bỏ qua tiêu chí gate để làm xanh báo cáo.
- Bandit chặn phát hiện có severity từ Medium và confidence từ Medium; kết quả Low không được coi là đã review hết. Báo cáo JSON và coverage được lưu artifact 7 ngày. Đây không phải chứng nhận không còn lỗ hổng.
- Các bài kiểm thử có DB/Realtime/email thật vẫn cần chạy riêng trong môi trường kiểm thử đã được kiểm soát. Không thêm Secret Key hay credential DB production vào workflow này.
- Các action được cố định bằng commit SHA. Cập nhật phiên bản phải xác minh lại commit của nhà cung cấp.

## Kiểm tra cục bộ

Từ thư mục gốc, đặt `PYTHONPATH=backend`, dùng Python trong `backend/.venv`:

```text
python -m pip install -r backend/requirements.lock -r backend/requirements-ci.txt
python -m coverage run -m unittest discover -s backend/tests -v
python -m coverage xml
python -m bandit -r backend/app -ll -ii -f json -o bandit-report.json
npm --prefix frontend run build
```

`coverage.xml`, `.coverage`, `.scannerwork/` và `bandit-report.json` được Git ignore. Không đọc token/env riêng trong báo cáo.

## Tài liệu chính thức

- [SonarQube Cloud và GitHub Actions](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud)
- [SonarQube Scan Action](https://github.com/SonarSource/sonarqube-scan-action)

## Kiểm tra cục bộ ngày 20/11/2026

- 23 unit test offline đạt; coverage tổng backend khoảng 24%, chưa bao phủ đầy đủ nghiệp vụ/DB/Realtime.
- Build Next.js đạt. Có cảnh báo cache Webpack khi serialize chuỗi lớn; chưa có số đo cho thấy ảnh hưởng tới tốc độ người dùng nên không sửa cấu hình cache trong đợt này.
- Bandit lần đầu yêu cầu review 9 lời gọi `urlopen` (B310). Đã thay bằng transport chung chỉ cho HTTPS đến đúng origin Supabase và đường dẫn Auth/Storage, không follow redirect. Sau sửa không còn phát hiện từ Medium/Medium trở lên; không thêm `nosec` hoặc bỏ rule.
- Workflow được kiểm tra bằng actionlint 1.7.12; các action cố định SHA tương ứng checkout 7.0.1, setup-node 7.1.0, setup-python 7.1.0, upload-artifact 7.0.2 và SonarQube Scan 8.5.0.
- Thử đọc JWKS Supabase thật không hoàn tất vì DNS trả `getaddrinfo failed`. Không khẳng định đã kiểm thử lại Auth/Storage end-to-end trong lượt này; không thực hiện ghi DB thật.
- SonarQube Cloud chưa có project/token nên chưa có lượt phân tích hay điểm Quality Gate thực tế.
- Báo cáo Bandit đầy đủ vẫn giữ 9 cảnh báo SQL B608 confidence Low và 2 cảnh báo severity Low. Review thủ công: các câu SQL ghép tên cột/tập điều kiện từ schema hoặc hằng server, giá trị người dùng truyền qua bind `$n`; `xml.sax.saxutils.escape` chỉ dùng escape văn bản chứ không parse XML; subprocess PDF dùng executable/module cố định, không bật shell. Không xóa hoặc ẩn các phát hiện này khỏi artifact.
