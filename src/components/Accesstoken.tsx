"use client";
import React, { useEffect } from "react";
import useStore from "@/store/store";
import { refreshAccessToken } from "@/service/interceptor";

export default function AccessToken({ refreshToken }: any) {
  const setAccessToken = useStore((state) => state.setAccessToken);

  useEffect(() => {
    if (refreshToken) {
      getAccessToken();
    }
  }, [refreshToken]);

  async function getAccessToken() {
    try {
      const accessToken = await refreshAccessToken("http://localhost:9502");
      setAccessToken(accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  return <></>;
}
