"use client";
import React, { useEffect } from "react";

export default function AccessToken({ refreshToken }: any) {
  async function getAccessToken() {
    const response = await fetch("http://localhost:9502/api/auth/refresh", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    // 응답 처리 로직 추가
  }

  useEffect(() => {
    if (refreshToken) {
      getAccessToken();
    }
  }, [refreshToken]);

  return null;
}
