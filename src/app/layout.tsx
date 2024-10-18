import type { Metadata } from "next";
import "./globals.css";
import "./custom.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Travel Tales",
    default: "Travel Tales",
  },
  description: "Welcome Travel Tales",
  robots: "index",
  openGraph: {
    title: "Travel Tales",
    description:
      "쉽고 간편하게 여행 계획을 세우고, 일정과 여행지를 공유해보세요.",
    siteName: "Travel Tales",
    url: "https://www.traveltales.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
