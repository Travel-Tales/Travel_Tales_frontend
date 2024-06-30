"use client";
import React, { useEffect } from "react";

export default function AccessToken({ refreshToken }: any) {
  useEffect(() => {
    if (refreshToken) {
      getAccessToken();
    }
  }, [refreshToken]);

  async function getAccessToken() {
    try {
      const response = await fetch("http://localhost:9502/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const jsonData = await response.json();
      const accessToken = jsonData.data.access;
      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      console.log(error);
    }

    // 응답 처리 로직 추가
  }

  return <></>;
}
