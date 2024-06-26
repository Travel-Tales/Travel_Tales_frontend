"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import kakaoLogin from "../../../public/kakao_login_large_wide.png";
import googleLogin from "../../../public/web_light_sq_ctn@3x.png";
import logo from "../../../public/main-logo.png";
import Head from "next/head";

export default function LoginPage() {
  const clickKakaoLogin = () => {
    window.location.href = "http://localhost:9502/api/auth/kakao";
  };

  const clickGoogleLogin = () => {
    window.location.href = "http://localhost:9502/api/auth/google";
  };

  return (
    <>
      <main className="relative">
        <section className="absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-3/4">
          <div>
            <h2 className="font-bold text-2xl text-center text-main-color mb-2">
              <Image src={logo} alt="logo" width={200} className="mx-auto " />
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
            <Image
              src={kakaoLogin}
              alt="카카오 로그인 버튼 이미지"
              width={320}
            />
          </button>
          <button
            aria-label="구글 로그인"
            className="block mt-4"
            id="my-signin2"
            onClick={clickGoogleLogin}
          >
            <Image
              src={googleLogin}
              alt="구글 로그인 버튼 이미지"
              width={320}
            />
          </button>
        </section>
      </main>
    </>
  );
}
