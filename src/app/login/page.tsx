"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import logo from "./../../../public/main-logo.png";
import useStore from "@/store/store";
import { Roboto } from "next/font/google";
import kakaoSymbol from "./../../../public/kakao-symbol.png";
import googleSymbol from "./../../../public/g-logo.png";

const roboto = Roboto({
  weight: "500", // Medium
  subsets: ["latin"], // 필요한 서브셋
});

export default function LoginPage() {
  const setIsLogin = useStore((state) => state.setIsLogin);
  const setAccessToken = useStore((state) => state.setAccessToken);

  useEffect(() => {
    setAccessToken("");
  }, []);

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
        <section className="absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 md:w-6/12 w-10/12">
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
            className="flex items-center justify-center bg-[#FEE500] rounded-[12px]
           py-3 px-4 hover:shadow-xs transition m-auto sm:w-72 sm:mb-8 mb-4 w-[211px]"
            onClick={clickKakaoLogin}
          >
            <Image
              src={kakaoSymbol} // 카카오 로고 URL
              width={20}
              height={20}
              alt="Kakao"
              className="sm:w-[25px] sm:h-[25px] w-[18px] h-[18px] mr-3"
            />
            <span className={`text-black-85 sm:text-[18px] text-[14px]`}>
              카카오 로그인
            </span>
          </button>

          <button
            className="flex items-center bg-white rounded-sm 
          py-2 px-4 shadow-md hover:shadow-xs transition m-auto sm:w-72 w-[211px] justify-between"
            onClick={clickGoogleLogin}
          >
            <Image
              src={googleSymbol}
              alt="Google"
              className="sm:w-[30px] sm:h-[30px] w-[18px] h-[18px] sm:mr-[30px] mr-[24px]"
              width={20}
              height={20}
            />
            <span
              className={`text-black-54 ${roboto.className} sm:text-[18px] text-[14px]`}
            >
              Google 계정으로 로그인
            </span>
          </button>
        </section>
      </main>
    </>
  );
}
