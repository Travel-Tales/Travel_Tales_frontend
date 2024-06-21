import React, { useEffect, useRef } from "react";
import Image from "next/image";
import kakaoLogin from "../../../public/kakao_login_large_wide.png";
import googleLogin from "../../../public/web_light_sq_ctn@3x.png";
import logo from "../../../public/main-logo.png";

export default function LoginPage() {
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

          <button aria-label="카카오 로그인" className="block">
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
