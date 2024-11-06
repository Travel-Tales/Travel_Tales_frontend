// import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware is running"); // 로그 추가

  const refreshToken = req.cookies.get("refresh")?.value;

  // 세션이 없으면 로그인 페이지로 리다이렉트
  if (!refreshToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 세션이 있으면 요청을 정상 처리
  return NextResponse.next();
}

// 이 미들웨어가 적용될 경로 (보호된 경로 설정)
export const config = {
  matcher: "/:path*",
};
