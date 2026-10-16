import Link from "next/link";
export default function ForbiddenPage() {
  return (
    <main className="container portal-empty">
      <h1>Bạn không có quyền truy cập trang này</h1>
      <p>Vui lòng dùng tài khoản có vai trò phù hợp.</p>
      <Link className="btn btn-primary" href="/dashboard">
        Về trang của tôi
      </Link>
    </main>
  );
}
