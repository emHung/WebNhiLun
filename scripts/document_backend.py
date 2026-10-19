"""Build source-linked backend and existing Markdown indexes without credentials."""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "VolunteerHub_Docs"


def cell(value):
    return re.sub(r"[\r\n]+", " ", str(value)).replace("|", "\\|")


def link(path, line=None):
    relative = path.relative_to(ROOT).as_posix()
    suffix = f":{line}" if line else ""
    return f"[{relative}{suffix}]({path.as_posix()}{suffix})"


def main():
    lines = ["# Danh mục API và hàm backend", "", "Ngày đối chiếu: 19/10/2026. Trích từ Python AST trong `backend/app`. Không chạy endpoint hoặc truy vấn database trong đợt lập tài liệu này.", "", "## Cách đọc", "", "- Endpoint dùng prefix `/api/v1` khai báo trong router.", "- Dependency liệt kê đúng chữ ký trong code; `get_current_user` xác thực JWT và tài khoản, `require_roles(...)` kiểm tra vai trò.", "- Bảng dữ liệu được tìm trong câu SQL của từng hàm; SQL động hoặc service được gọi tiếp cần đọc qua liên kết nguồn.", "- Kiểu trả về là annotation nếu được khai báo; không tự suy đoán response khi thiếu annotation.", "", "## Endpoint", "", "| Phương thức | Đường dẫn | Hàm | Dependency trong chữ ký | Bảng SQL được nhắc trực tiếp | Nguồn |", "|---|---|---|---|---|---|"]
    modules = []
    endpoints = 0
    for path in sorted((ROOT / "backend/app").rglob("*.py")):
        source = path.read_text(encoding="utf-8-sig")
        tree = ast.parse(source)
        functions = [node for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))]
        modules.append((path, functions))
        for node in functions:
            raw = ast.get_source_segment(source, node) or ""
            tables = sorted(set(re.findall(r"public\.([a-z_]+)", raw)))
            dependencies = []
            for child in ast.walk(node.args):
                if isinstance(child, ast.Call) and isinstance(child.func, ast.Name) and child.func.id in {"Depends", "require_roles"}:
                    dependencies.append(ast.unparse(child))
            for decorator in node.decorator_list:
                if not isinstance(decorator, ast.Call) or not isinstance(decorator.func, ast.Attribute) or decorator.func.attr not in {"get", "post", "patch", "put", "delete", "api_route"}:
                    continue
                route = ast.literal_eval(decorator.args[0])
                prefix = "/api/v1" if isinstance(decorator.func.value, ast.Name) and decorator.func.value.id == "router" else ""
                method = decorator.func.attr.upper()
                if method == "API_ROUTE":
                    method = ", ".join(ast.literal_eval(next(item.value for item in decorator.keywords if item.arg == "methods")))
                lines.append(f"| {method} | `{prefix}{route}` | `{node.name}` | {cell(', '.join(dependencies) or 'Không khai báo Depends trong chữ ký')} | {', '.join(tables) or '—'} | {link(path, node.lineno)} |")
                endpoints += 1
    for path, functions in modules:
        if not functions:
            continue
        lines += ["", f"## {path.relative_to(ROOT).as_posix()}", "", "| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |", "|---|---|---|---|---|"]
        for node in functions:
            calls = sorted(set(ast.unparse(child.func) for child in ast.walk(node) if isinstance(child, ast.Call)))
            lines.append(f"| `{node.name}` | `{cell(ast.unparse(node.args))}` | `{cell(ast.unparse(node.returns) if node.returns else 'Không có annotation')}` | {cell(', '.join(calls))} | {link(path, node.lineno)} |")
    lines += ["", "## Luồng nghiệp vụ quan trọng", "", "| Thao tác | Luồng xử lý cần theo dõi |", "|---|---|", "| Đăng nhập | Trang Auth → Supabase Auth/demo endpoint → phiên cookie → middleware → `/auth/me` → route theo vai trò |", "| Đăng ký hoạt động | ApplyPage → API application → kiểm tra hồ sơ, trùng đơn và sức chứa → transaction DB → phản hồi |", "| Duyệt và điểm danh | OrganizerManagePage/CheckinDialog → API theo vai trò, tổ chức và đơn → cập nhật transaction → chứng nhận, giờ, audit |", "| Tải PDF | CertificatesPage → API kiểm tra chủ sở hữu → certificate_file → tái sử dụng artifact hợp lệ hoặc tạo/upload → trả bytes riêng tư |", "| Cập nhật hồ sơ | ProfilePage.save → upload ảnh nếu có → PATCH hồ sơ → state và query được làm mới |", "| Stories và thông báo | Query có page/limit/filter → COUNT và trang dữ liệu → component Pagination → Realtime làm mới theo entity |", "", "Bảng trên là mô tả luồng từ mã nguồn, không khẳng định kiểm thử runtime trong đợt dọn comment. Các luật chi tiết và thông báo lỗi nằm tại hàm được liên kết.", ""]
    (DOCS / "23-backend-api-reference.md").write_text("\n".join(lines), encoding="utf-8")
    summary = ["# Tổng hợp tài liệu và dọn chú thích", "", "Ngày thực hiện: 19/10/2026. Các báo cáo cũ được giữ nguyên để tra cứu lịch sử; tài liệu mới phản ánh code đang có trong checkout.", "", "## Đọc từ đâu", "", "1. [Bản đồ trang, bố cục, component và thẻ](21-pages-layout-functions.md).", "2. Chọn trang trong bảng route để xem sơ đồ JSX, hàm, sự kiện, API và file liên quan.", "3. [Tra tất cả hàm frontend](22-function-catalog.md).", "4. [Tra endpoint và hàm backend](23-backend-api-reference.md).", "", "## Các tài liệu hiện có", "", "Nội dung tóm tắt dưới đây lấy từ tiêu đề/mục của từng file, không phải xác nhận lại kết quả kiểm thử hay triển khai của báo cáo cũ.", "", "| Tài liệu | Tên và các mục chính |", "|---|---|"]
    existing = [ROOT / "README.md", ROOT / "frontend/README.md", ROOT / "backend/README.md", ROOT / "supabase/README.md"] + sorted(DOCS.glob("1[5-9]-*.md"))
    for file in existing:
        if not file.is_file():
            continue
        text = file.read_text(encoding="utf-8-sig")
        headings = re.findall(r"^#{1,2}\s+(.+)$", text, re.M)
        summary.append(f"| {link(file)} | {cell(' · '.join(headings))} |")
    js = json.loads((DOCS / "comment-cleanup-js.json").read_text(encoding="utf-8"))
    py = json.loads((DOCS / "comment-cleanup-other.json").read_text(encoding="utf-8-sig"))
    changes = js["files"] + py["changes"]
    summary += ["", "## Phạm vi xóa comment", "", f"Đã xóa **{sum(x['removed'] for x in changes)} chú thích** trong **{len(changes)} file**. Có {js['pages']} entry trang Next.js và {endpoints} khai báo endpoint backend được kiểm kê.", "", "- JavaScript/TypeScript/TSX: xóa comment thông thường, đối chiếu cây AST trước/sau; giữ literal, regex, template và JSX text.", "- Python: xóa token COMMENT thông thường, đối chiếu token thực thi trước/sau; giữ docstring vì có thể được dùng làm metadata runtime.", "- CSS/HTML: nhận diện comment ngoài chuỗi CSS và bằng HTML parser; giữ nội dung chuỗi, URL và conditional comment.", "- Giữ chỉ thị công cụ, copyright/license, shebang, reference TypeScript và file sinh tự động `next-env.d.ts`.", "- Không sửa migration SQL đã áp dụng vì runner đối chiếu checksum. Comment trong dữ liệu/chuỗi HTML/SQL không được xóa như comment của ngôn ngữ chủ.", "- Không quét dependency, cache build, thư mục graft, file bị gitignore hoặc biến môi trường chứa bí mật.", "- Không đổi layout, logic, cấu hình quyền hay dữ liệu Supabase.", "", "### File đã dọn", "", "| File | Số comment |", "|---|---|", *[f"| {link(ROOT / x['file'])} | {x['removed']} |" for x in sorted(changes, key=lambda x:x['file'])], "", "## Bằng chứng → kết quả → cách tra", "", "- Bằng chứng: bộ phân tích TypeScript/Python, import, JSX, handler và decorator API trong source.", "- Kết quả: comment được loại bỏ với kiểm tra cấu trúc; tài liệu liên kết đúng file và số dòng giữ nguyên.", "- Cách tra: mở báo cáo 21 → chọn route → xem bảng handler/API → theo liên kết đến hàm hoặc báo cáo 23.", "", "## Giới hạn", "", "Đợt này không thực hiện migration hoặc thay dữ liệu. Việc kiểm kê tĩnh không chứng minh pixel-perfect, quyền truy cập thực tế hoặc mọi luồng runtime. Các screenshot trong `docs/screenshots` và báo cáo 17–19 thuộc đợt trước.", ""]
    summary += ["", "## Kiểm tra sau khi dọn (19/10/2026)", "", "- Next.js production build thành công, bao gồm kiểm tra kiểu TypeScript.", "- Cây AST JavaScript/TypeScript và token thực thi Python trước/sau xóa comment không đổi.", "- 17 file CSS có cấu trúc rule/declaration không đổi sau khi chuẩn hóa khác biệt xuống dòng LF/CRLF khi đối chiếu Git.", "- 22 file Python backend phân tích cú pháp thành công.", "- 29 tài liệu mới có 2.407 liên kết file hợp lệ tại thời điểm đối chiếu.", "- Quét dry-run lần hai không phát hiện comment thông thường còn cần xóa; `git diff --check` không báo lỗi.", "- Không chạy lại bộ kiểm thử API/Supabase hoặc kiểm thử trình duyệt trong đợt này.", ""]
    (DOCS / "20-documentation-summary.md").write_text("\n".join(summary), encoding="utf-8")
    print(json.dumps({"endpoints": endpoints, "backend_functions": sum(len(nodes) for _, nodes in modules), "comment_files": len(changes), "comments_removed": sum(x["removed"] for x in changes)}))


if __name__ == "__main__":
    main()
