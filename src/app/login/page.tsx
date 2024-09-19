"use client";

import React from "react";
import Image from "next/image";
import kakaoLogin from "./../../../public/kakao_login_large_wide.png";
import googleLogin from "./../../../public/web_light_sq_ctn@3x.png";
import logo from "./../../../public/main-logo.png";
import useStore from "@/store/store";

export default function LoginPage() {
  const setIsLogin = useStore((state) => state.setIsLogin);

  const clickKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao`;
    setIsLogin("waiting");
  };

  const clickGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    setIsLogin("waiting");
  };

  return (
    <>
      <main className="relative">
        <section className="absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4">
          <div>
            <h2 className="font-bold text-2xl text-center text-main-color mb-2">
              <Image
                src={logo}
                alt="logo"
                width={200}
                height={100}
                priority={true}
                className="mx-auto"
                style={{ width: "auto", height: "auto" }}
              />
              Login
            </h2>
            <p className="mb-10 text-lg text-gray-700 text-center">
              Welcome to travel tales
            </p>
          </div>

          <button
            aria-label="카카오 로그인"
            className="block"
            onClick={clickKakaoLogin}
          >
            <div>
              <Image
                src={kakaoLogin}
                alt="카카오 로그인 버튼 이미지"
                width={300}
                height={200}
                priority={true}
              />
            </div>
          </button>
          <button
            aria-label="구글 로그인"
            className="block mt-4"
            id="my-signin2"
            onClick={clickGoogleLogin}
          >
            <div style={{ maxWidth: "300px", minWidth: "250px" }}>
              <Image
                src={googleLogin}
                alt="구글 로그인 버튼 이미지"
                width={300}
                height={200}
                priority={true}
              />
            </div>
          </button>
        </section>
      </main>
    </>
  );
}
