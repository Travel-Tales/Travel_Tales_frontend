import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./custom.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { SocketProvider } from "@/components/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Tales",
  description: "Welcome Travel Tales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* <SocketProvider> */}
      <body>
        <Header />
        {children}
        <Footer />
      </body>
      {/* </SocketProvider> */}
    </html>
  );
}
