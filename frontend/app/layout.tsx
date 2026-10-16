import type { Metadata } from "next";
import "./globals.css";
import { LiveDataSync } from "@/components/portal/LiveDataSync";
import { LegacyStyles } from "@/components/portal/LegacyStyles";
import { ThemeSync } from "@/components/portal/ThemeSync";

export const metadata: Metadata = {
  title: "VolunteerHub | NhiLun",
  description: "Cổng kết nối và quản lý hoạt động tình nguyện",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
        />
        <link rel="stylesheet" href="/legacy/css/base.css" />
        <link rel="stylesheet" href="/legacy/css/components.css" />
        <LegacyStyles />
      </head>
      <body>
        <LiveDataSync />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
