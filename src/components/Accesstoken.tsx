"use client";
import React, { useEffect } from "react";
import useStore from "@/store/store";
import { refreshAccessToken } from "@/service/interceptor";
import LocalStorage from "@/service/localstorage";

export default function AccessToken({ refreshToken }: any) {
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setIsLogin = useStore((state) => state.setIsLogin);
  const isLogin = useStore((state) => state.isLogin);

  useEffect(() => {
    if (isLogin === "waiting") {
      //: 가장 처음 그냥 홈에 들어왔을 떄
      getAccessToken();
    }
  }, [isLogin]);

  async function getAccessToken() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        //: 어떤 이유에서든 api통신이 실패해서 액세스 토큰을 받아올 수 없을 때
        setIsLogin("false");
      } else {
        //: 액세스 토큰 발급 성공
        const jsonData = await response.json();
        const accessToken = jsonData.data.access;
        localStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
        setIsLogin("true");
      }
    } catch (error) {
      setIsLogin("false");
      console.log(error);
    }
  }

  return <></>;
}
