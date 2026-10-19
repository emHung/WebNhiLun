const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require('../frontend/node_modules/typescript');
const root = path.resolve(__dirname, '..');
const apply = process.argv.includes('--apply');
const names = [...new Set(cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0'))].filter(Boolean).sort();
const sourceFiles = names.filter(f => /\.(tsx?|[cm]?jsx?)$/.test(f) && !f.startsWith('graft/') && !f.endsWith('next-env.d.ts'));
const keep = /copyright|license|@preserve|@type\b|@ts-|eslint|prettier|istanbul|c8 ignore|webpack|vite-ignore|sourceMappingURL|<reference|^#!/i;
const removed = [];
const parse = (f, s) => ts.createSourceFile(f, s, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : f.endsWith('.jsx') ? ts.ScriptKind.JSX : f.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS);
const walk = (n, fn) => { fn(n); ts.forEachChild(n, c => walk(c, fn)); };
const norm = s => s.replace(/\s+/g, ' ').trim();
const cell = s => String(s).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const link = (f, line) => `[${f}${line ? ':' + line : ''}](${root.replace(/\\/g, '/')}/${f}${line ? ':' + line : ''})`;
for (const f of sourceFiles) {
  if (process.argv.includes('--docs-only')) break;
  const absolute = path.join(root, f), source = fs.readFileSync(absolute, 'utf8'), ast = parse(f, source);
  const protectedRanges = [];
  walk(ast, n => {
    if (ts.isStringLiteralLike(n) || ts.isRegularExpressionLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isJsxText(n)) protectedRanges.push([n.getStart(ast), n.end]);
  });
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, source), ranges = [];
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (![ts.SyntaxKind.SingleLineCommentTrivia, ts.SyntaxKind.MultiLineCommentTrivia].includes(token)) continue;
    const a = scanner.getTokenPos(), b = scanner.getTextPos();
    if (protectedRanges.some(([x, y]) => a >= x && a < y) || keep.test(source.slice(a, b))) continue;
    ranges.push([a, b]);
  }
  let result = source;
  for (const [a, b] of ranges.reverse()) result = result.slice(0, a) + result.slice(a, b).replace(/[^\r\n]/g, ' ') + result.slice(b);
  const touched = new Set();
  for (const [a,b] of ranges) for (let i=ast.getLineAndCharacterOfPosition(a).line;i<=ast.getLineAndCharacterOfPosition(b).line;i++) touched.add(i);
  result = result.split('\n').map((line,i)=>touched.has(i)?line.replace(/[ \t]+(?=\r?$)/,''):line).join('\n');
  const structural = ast => { const out = []; walk(ast, n => out.push([n.kind, ts.isIdentifier(n) || ts.isLiteralExpression(n) || ts.isJsxText(n) ? n.getText(ast) : ''])); return JSON.stringify(out); };
  if (structural(ast) !== structural(parse(f, result))) throw Error(`AST changed: ${f}`);
  if (ranges.length) { removed.push({ file: f, removed: ranges.length }); if (apply) fs.writeFileSync(absolute, result); }
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', changes: removed }));
if (!apply) process.exit(0);
const docs = path.join(root, 'VolunteerHub_Docs', 'page-reference');
fs.mkdirSync(docs, { recursive: true });
const records = new Map();
const isFunction = n => ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n) || ts.isMethodDeclaration(n);
function functionName(n, ast) {
  if (n.name) return n.name.getText(ast);
  if (ts.isVariableDeclaration(n.parent) || ts.isPropertyAssignment(n.parent)) return n.parent.name.getText(ast);
  if (ts.isCallExpression(n.parent)) return `callback ${callName(n.parent.expression, ast)}`;
  if (ts.isJsxExpression(n.parent) && ts.isJsxAttribute(n.parent.parent)) return `inline ${n.parent.parent.name.getText(ast)}`;
  return 'callback ẩn danh';
}
function callName(n, ast) {
  const text = norm(n.getText(ast));
  return text.length > 85 && ts.isPropertyAccessExpression(n) ? `….${n.name.text}` : text;
}
const purposes = {favorite:'Thêm hoặc bỏ hoạt động yêu thích.', saveFavorite:'Thay đổi trạng thái yêu thích của hoạt động.', search:'Áp dụng điều kiện tìm kiếm.', resetFilters:'Đặt lại các bộ lọc.', categoryClass:'Chọn lớp CSS theo lĩnh vực.', statusClass:'Chọn lớp CSS theo trạng thái.', shareActivity:'Chia sẻ hoặc sao chép đường dẫn hoạt động.', goToSection:'Di chuyển đến mục nội dung.', decide:'Gửi quyết định kiểm duyệt lên API.', save:'Lưu dữ liệu biểu mẫu; xem endpoint và handler ở bảng bên dưới.', activate:'Kích hoạt bộ màu đã chọn.', edit:'Đưa dữ liệu đã chọn vào trạng thái chỉnh sửa.', handleSearchSubmit:'Gửi điều kiện tìm kiếm từ biểu mẫu.', handleResetFilter:'Xóa điều kiện lọc đang chọn.', handleDeleteStory:'Gửi yêu cầu xóa Stories.', submit:'Xử lý gửi biểu mẫu và phản hồi thành công/lỗi.', copyCertificateLink:'Sao chép liên kết xác minh chứng nhận.', verify:'Mở hoặc thực hiện xác minh chứng nhận theo mã.', set:'Cập nhật một trường trong state biểu mẫu.', nextStep:'Kiểm tra trường bắt buộc trước khi sang bước kế tiếp.', persist:'Lưu bản nháp hoặc gửi hoạt động theo cờ publish.', saveDraft:'Lưu hoạt động ở trạng thái nháp.', submitQuickSearch:'Chuyển điều kiện tìm nhanh sang trang hoạt động.', like:'Thay đổi lượt thích Stories qua API.', handleImageSelect:'Xử lý ảnh được chọn cho nội dung Stories.', handleRemoveImage:'Bỏ ảnh đang chọn khỏi biểu mẫu.', share:'Chia sẻ nội dung hoặc sao chép liên kết.', markOne:'Đánh dấu một thông báo đã đọc.', markAll:'Đánh dấu toàn bộ thông báo đã đọc.', registerOrganization:'Gửi hồ sơ tổ chức và giấy tờ xác minh.', retryOrganizationDocument:'Gửi lại giấy tờ xác minh tổ chức.', review:'Duyệt hoặc từ chối đơn ứng viên.', checkin:'Cập nhật trạng thái điểm danh.', exportCsv:'Tải danh sách ứng viên dạng CSV.', cancel:'Hủy đơn đăng ký hoạt động.'};
function purpose(fn) {
  const auth = {quickLogin:'Đăng nhập tài khoản demo theo vai trò, thiết lập phiên và điều hướng.', finishSignIn:'Hoàn tất thiết lập phiên đăng nhập và chuyển đến trang đích.', destinationFromVerifiedProfile:'Lấy hồ sơ đã xác thực để xác định trang đích theo vai trò.', resetPassword:'Gửi yêu cầu khôi phục mật khẩu qua Supabase Auth.'};
  if(auth[fn.name]) return auth[fn.name];
  if(purposes[fn.name]) return purposes[fn.name];
  if(fn.name.startsWith('inline ')) return 'Handler trực tiếp tại thuộc tính ' + fn.name.slice(7) + '; xem các lời gọi và bảng sự kiện.';
  if(fn.name.startsWith('callback useEffect')) return 'Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies.';
  if(fn.name.startsWith('callback ')) return 'Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu.';
  if(/Page$|^Page$|^LegacyRoute$/.test(fn.name)) return 'Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API.';
  return 'Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ.';
}
for (const f of sourceFiles.filter(f => f.startsWith('frontend/'))) {
  const source = fs.readFileSync(path.join(root, f), 'utf8'), ast = parse(f, source);
  const record = { f, ast, source, imports: [], functions: [], tags: new Set(), components: new Set(), headings: [], calls: [], events: [] };
  const line = n => ast.getLineAndCharacterOfPosition(n.getStart(ast)).line + 1;
  walk(ast, n => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier) {
      const spec = n.moduleSpecifier.text;
      const base = spec.startsWith('@/') ? 'frontend/' + spec.slice(2) : spec.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(f), spec)) : null;
      if (base) { const target = ['', '.tsx', '.ts', '.js', '/index.tsx', '/index.ts'].map(s => base + s).find(x => sourceFiles.includes(x)); if (target) record.imports.push(target); }
    }
    if (isFunction(n)) {
      let owner = n.parent;
      while (owner && !isFunction(owner)) owner = owner.parent;
      const calls = [], outputs = [];
      const scan = c => {
        if (c !== n && isFunction(c)) return;
        if (ts.isCallExpression(c)) calls.push(callName(c.expression, ast));
        if (ts.isReturnStatement(c)) outputs.push(c.expression ? (/^\s*\(?\s*</.test(c.expression.getText(ast)) ? 'JSX giao diện' : norm(c.expression.getText(ast)).slice(0,160)) : 'undefined / dừng xử lý');
        ts.forEachChild(c, scan);
      };
      scan(n);
      if (ts.isArrowFunction(n) && !ts.isBlock(n.body)) outputs.push(norm(n.body.getText(ast)).slice(0,160));
      record.functions.push({ name: functionName(n, ast), line: line(n), params: norm(n.parameters.map(p => p.getText(ast)).join(', ')), owner: owner ? functionName(owner, ast) : 'module', calls: [...new Set(calls)], output: n.type ? norm(n.type.getText(ast)) : [...new Set(outputs)].join('; ') || 'Không return tường minh; xem hiệu ứng state/API' });
    }
    if (ts.isCallExpression(n)) {
      const callee = n.expression.getText(ast);
      if (/useLoad|apiRequest|apiDownload|fetch|signIn|signUp|signOut|resetPassword|updateUser|setSession|redirect|router\.(push|replace)/.test(callee)) {
        let owner = n.parent; while (owner && !isFunction(owner)) owner = owner.parent;
        record.calls.push({ callee, args: norm(n.arguments.map(a => a.getText(ast)).join(', ')).slice(0, 600), line: line(n), owner: owner ? functionName(owner, ast) : 'module' });
      }
    }
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = n.tagName.getText(ast);
      (/^[a-z]/.test(tag) ? record.tags : record.components).add(tag);
      for (const a of n.attributes.properties) if (ts.isJsxAttribute(a) && /^on[A-Z]/.test(a.name.getText(ast))) record.events.push({ tag, event: a.name.getText(ast), action: a.initializer ? norm(a.initializer.getText(ast)).slice(0, 200) : '', line: line(a) });
    }
    if (ts.isJsxElement(n) && /^h[1-6]$/.test(n.openingElement.tagName.getText(ast))) {
      const text = n.children.filter(ts.isJsxText).map(x => norm(x.text)).filter(Boolean).join(' ');
      if (text && !record.headings.includes(text)) record.headings.push(text);
    }
  });
  records.set(f, record);
}
const labels = { '/': 'Trang chủ', '/activities': 'Danh sách hoạt động', '/activities/[identifier]': 'Chi tiết hoạt động', '/about': 'Giới thiệu', '/stories': 'Stories', '/auth': 'Đăng nhập và đăng ký', '/auth/reset': 'Đặt lại mật khẩu', '/profile': 'Hồ sơ cá nhân', '/notifications': 'Thông báo', '/schedule': 'Lịch hoạt động', '/certificates': 'Chứng nhận', '/certificates/verify': 'Xác minh chứng nhận', '/favorites': 'Yêu thích', '/volunteer/dashboard': 'Dashboard tình nguyện viên', '/volunteer/apply/[activityId]': 'Đăng ký tham gia', '/organizer/manage': 'Quản lý ban tổ chức', '/organizer/create-event': 'Tạo hoạt động', '/admin/moderation': 'Kiểm duyệt', '/admin/theme-settings': 'Cài đặt giao diện', '/admin/stories': 'Quản lý Stories', '/privacy': 'Chính sách riêng tư', '/terms': 'Điều khoản', '/dashboard': 'Chuyển hướng dashboard', '/forbidden': 'Không có quyền', '/[...legacy]': 'Điều hướng đường dẫn HTML cũ' };
const routeRecords = [...records.values()].filter(r => /\/page\.tsx$/.test(r.f));
const pages = [];
function closure(f, seen = new Set()) { if (seen.has(f) || !records.has(f)) return seen; seen.add(f); for (const dep of records.get(f).imports) closure(dep, seen); return seen; }
function outline(record) {
  const functions = []; walk(record.ast, n => { if (ts.isFunctionDeclaration(n)) functions.push(n); });
  const all = [];
  for (const fn of functions) {
    const returns = [];
    const visit = n => { if (n !== fn && isFunction(n)) return; if (ts.isReturnStatement(n) && n.expression) returns.push(n.expression); ts.forEachChild(n, visit); }; visit(fn);
    const expr = returns.sort((a,b) => (b.end-b.pos)-(a.end-a.pos))[0];
    if (!expr) continue;
    let count = 0;
    const draw = (n, depth) => {
      if (count >= 65) return;
      let next = depth;
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
        const op = ts.isJsxElement(n) ? n.openingElement : n;
        const tag = op.tagName.getText(record.ast);
        const cls = op.attributes.properties.find(a => ts.isJsxAttribute(a) && a.name.getText(record.ast) === 'className');
        const hint = cls?.initializer && ts.isStringLiteral(cls.initializer) ? '.' + cls.initializer.text.split(/\s+/).join('.') : '';
        if (depth <= 5 && !['i', 'span', 'option', 'br', 'path', 'svg'].includes(tag)) { all.push('  '.repeat(depth) + tag + hint); count++; next++; }
      }
      ts.forEachChild(n, c => draw(c, next));
    };
    all.push(fn.name?.text || 'Page'); draw(expr, 1);
  }
  return all.join('\n') || 'Trang chuyển hướng hoặc nội dung được dựng qua component nhập vào.';
}
const semantic = { aside:'Thanh bên', nav:'Điều hướng hoặc tab', header:'Phần đầu', main:'Nội dung chính', section:'Nhóm nội dung', article:'Nội dung độc lập', form:'Biểu mẫu', input:'Ô nhập', button:'Nút thao tác', select:'Danh sách lựa chọn', textarea:'Nhập nhiều dòng', table:'Bảng dữ liệu', ul:'Danh sách', li:'Mục danh sách', div:'Khối bố cục', h1:'Tiêu đề chính', h2:'Tiêu đề mục', h3:'Tiêu đề khối', a:'Liên kết', footer:'Chân trang', img:'Ảnh', label:'Nhãn trường', dialog:'Hộp thoại' };
for (const route of routeRecords) {
  const url = '/' + route.f.replace(/^frontend\/app\//,'').replace(/\/?page\.tsx$/,'');
  const deps = [...closure(route.f)], direct = route.imports.filter(f => f.includes('/components/'));
  const displayFiles = direct.length ? direct : [route.f];
  const slug = url === '/' ? 'home' : url.replace(/^\//,'').replace(/[^a-zA-Z0-9-]+/g,'-').replace(/-$/,'');
  const file = `${slug}.md`;
  const access = url.startsWith('/admin') ? 'Admin.' : url.startsWith('/organizer') ? 'Organizer; riêng /organizer/manage?onboard=1 cho phép volunteer làm hồ sơ tổ chức.' : url.startsWith('/volunteer') || url==='/certificates' ? 'Volunteer.' : ['/profile','/schedule','/notifications','/favorites','/dashboard'].includes(url) ? 'Tài khoản đã đăng nhập; /dashboard điều hướng theo vai trò thực tế.' : 'Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng.';
  const lines = [`# ${labels[url] || url}`, '', `Đường dẫn: \`${url}\`. Đối chiếu mã nguồn ngày 19/10/2026.`, '', `Entry: ${link(route.f)}.`, '', `**Truy cập theo middleware:** ${access} Nguồn: ${link('frontend/middleware.ts')}.`, '', '## 1. Bố cục và thành phần', '', 'Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.', ''];
  for (const f of displayFiles) lines.push(`### ${path.basename(f)}`, '', `Nguồn: ${link(f)}.`, '', '```text', outline(records.get(f)), '```', '');
  const relevant = [...new Set([...displayFiles, ...deps.filter(f => /VolunteerWorkspaceFrame|shared\.tsx|ProfileOverview|ProfileDocuments|NotificationBell|ActivityCard|Pagination|StoryCard|CheckinDialog/.test(f))])];
  lines.push('### Component và thẻ', '', '| File | Component JSX sử dụng | Thẻ HTML trực tiếp |', '|---|---|---|');
  for (const f of relevant) { const r=records.get(f); lines.push(`| ${link(f)} | ${cell([...r.components].map(x=>'`'+x+'`').join(', ') || '—')} | ${cell([...r.tags].map(x=>'`<'+x+'>`').join(', ') || '—')} |`); }
  const headings = [...new Set(displayFiles.flatMap(f=>records.get(f).headings))];
  if (headings.length) lines.push('', '**Tiêu đề trực tiếp trong JSX:** ' + headings.join(' · '), '');
  if (deps.some(f=>/LegacyMarketingPage|LegacyDocumentPage/.test(f))) lines.push('', 'Nội dung HTML được chèn qua `dangerouslySetInnerHTML`/template: cây JSX không chứa đầy đủ các thẻ bên trong chuỗi HTML hoặc nội dung lấy từ database. Không suy diễn những thẻ đó thành JSX đã kiểm kê.', '');
  lines.push('', '## 2. Hàm và thao tác', '', 'Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.', '', '| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |', '|---|---|---|---|---|---|---|');
  for (const f of [...new Set([route.f,...displayFiles])]) for (const fn of records.get(f).functions) if (!/callback ẩn danh/.test(fn.name)) lines.push(`| ${cell(fn.name)} | ${cell(purpose(fn))} | ${cell(fn.owner)} | ${cell(fn.params || 'Không có')} | ${cell(fn.output)} | ${cell(fn.calls.join(', ') || 'Không gọi hàm khác trực tiếp')} | ${link(f,fn.line)} |`);
  lines.push('', '### Sự kiện giao diện', '', '| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |', '|---|---|---|---|');
  for (const f of displayFiles) for (const event of records.get(f).events) lines.push(`| ${cell(event.tag)} | ${event.event} | \`${cell(event.action).replace(/`/g,'ˋ')}\` | ${link(f,event.line)} |`);
  lines.push('', '## 3. Dữ liệu, API và điều hướng', '', '| Nơi gọi | Hàm | Đối số trong code | Nguồn |', '|---|---|---|---|');
  for (const f of [...new Set([route.f,...displayFiles,...deps.filter(f=>/ProfileDocuments|ProfileOverview|NotificationBell|use-notifications/.test(f))])]) for (const c of records.get(f).calls) lines.push(`| ${cell(c.owner)} | ${cell(c.callee)} | \`${cell(c.args).replace(/`/g,'ˋ')}\` | ${link(f,c.line)} |`);
  lines.push('', 'Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.', '', 'Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.', '', '## 4. Giới hạn và điểm cần kiểm chứng', '', '- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.', '- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.', '- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.', '', '## 5. File liên quan', '', ...deps.map(f=>'- '+link(f)), '');
  fs.writeFileSync(path.join(docs,file),lines.join('\n'));
  pages.push({url,label:labels[url]||url,file,source:route.f});
}
const catalog = ['# Danh mục hàm frontend', '', 'Ngày đối chiếu: 19/10/2026. Trích từ TypeScript AST; bao gồm hàm lồng, callback hook và handler inline. Số dòng giữ nguyên khi xóa comment. Tên callback mô tả nơi gắn, không phải tên hàm được export. Lời gọi trực tiếp không mở rộng các callback con.', ''];
for (const r of records.values()) if(r.functions.length) {
 catalog.push(`## ${r.f}`, '', '| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |', '|---|---|---|---|---|---|');
 for(const fn of r.functions) catalog.push(`| ${cell(fn.name)} | ${cell(fn.owner)} | ${cell(fn.params||'—')} | ${cell(fn.output)} | ${cell(fn.calls.join(', ')||'—')} | ${link(r.f,fn.line)} |`);
 catalog.push('');
}
fs.writeFileSync(path.join(root,'VolunteerHub_Docs/22-function-catalog.md'),catalog.join('\n'));
const index = ['# Tổng quan bố cục và chức năng từng trang', '', 'Ngày đối chiếu: 19/10/2026. Báo cáo mô tả mã nguồn hiện có; không thay đổi thiết kế, nghiệp vụ, database hoặc nội dung demo.', '', '## Cách đọc', '', '- **Component**: khối React có thể tái sử dụng, ví dụ `VolunteerWorkspaceFrame`.', '- **Thẻ HTML**: phần tử trình duyệt như `<aside>`, `<nav>`, `<main>`.', '- **Hàm**: đơn vị xử lý trong code; callback là hàm được truyền vào hook/sự kiện.', '- **Handler**: hàm chạy khi bấm nút, nhập liệu hoặc gửi biểu mẫu.', '- **API**: điểm giao tiếp giữa giao diện và backend; quyền nằm tại server.', '', '## Sơ đồ hệ thống', '', '```mermaid', 'flowchart LR', '  U[Người dùng] --> P[Next.js: trang và component]', '  P --> H[Handler và hook dùng chung]', '  H --> A[Supabase Auth]', '  H --> F[FastAPI: JWT và phân quyền]', '  F --> D[PostgreSQL]', '  F --> S[Supabase Storage]', '  D --> R[Realtime theo entity]', '  R --> H', '```', '', '## Các lớp bố cục', '', '| Lớp | Nguồn | Trách nhiệm |', '|---|---|---|', `| Layout gốc | ${link('frontend/app/layout.tsx')} | CSS, metadata, LiveDataSync, ThemeSync |`, `| Khung công khai/portal | ${link('frontend/components/portal/shared.tsx')} | PortalShell, header, trạng thái, liên kết theo vai trò |`, `| Workspace tình nguyện viên | ${link('frontend/components/portal/VolunteerWorkspaceFrame.tsx')} | Sidebar, thanh tìm kiếm, tài khoản, thông báo, children |`, `| Nội dung marketing | ${link('frontend/components/portal/LegacyMarketingPage.tsx')} | HTML template từ site-content, Stories, modal và tương tác |`, '', '## Danh sách trang', '', '| Route | Trang | Báo cáo chi tiết | Entry |', '|---|---|---|---|', ...pages.map(p=>`| \`${p.url}\` | ${p.label} | [Xem bố cục, hàm và API](page-reference/${p.file}) | ${link(p.source)} |`), '', 'Route `/auth/callback` là handler xử lý xác thực, không phải trang giao diện. Các query như `/profile?tab=settings` và `/volunteer/dashboard?section=applications` là nhánh trong một trang, không phải route độc lập.', '', '## Ý nghĩa các thẻ thường gặp', '', '| Thẻ | Vai trò |', '|---|---|', ...Object.entries(semantic).map(([tag, meaning])=>`| \`<${tag}>\` | ${meaning} |`), '', '## Tra cứu bổ sung', '', '- [Danh mục hàm frontend](22-function-catalog.md)', '- [API và hàm backend](23-backend-api-reference.md)', '- [Tổng hợp tài liệu và kết quả xóa comment](20-documentation-summary.md)', '', '## Bằng chứng và giới hạn', '', 'Bằng chứng: import, AST JSX, chữ ký hàm, JSX event handler và lời gọi API trong file được liên kết. Kết quả: có bản đồ route → component → hàm/API. Cách sử dụng: chọn route, theo link đến dòng nguồn rồi đối chiếu endpoint trong tài liệu backend.', '', 'Không tìm thấy HTML gốc trong danh sách file nguồn hiện tại; chỉ có CSS legacy, template chuỗi và nội dung được tải qua API. Vì vậy không khẳng định độ giống HTML bằng kiểm kê này. Các file báo cáo cũ được giữ để tra lịch sử.', ''];
fs.writeFileSync(path.join(root,'VolunteerHub_Docs/21-pages-layout-functions.md'),index.join('\n'));
if (!process.argv.includes('--docs-only')) fs.writeFileSync(path.join(root,'VolunteerHub_Docs/comment-cleanup-js.json'),JSON.stringify({files:removed,total:removed.reduce((n,x)=>n+x.removed,0),pages:pages.length},null,2)+'\n');
console.log(JSON.stringify({pages:pages.length,functionFiles:[...records.values()].filter(r=>r.functions.length).length,functions:[...records.values()].reduce((n,r)=>n+r.functions.length,0)}));
