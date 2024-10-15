"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { apiClient } from "@/service/interceptor";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  visibilityStatus: string;
}

type Page = { page: string };

export default function CreatePlanButton({ page }: Page) {
  const access = useStore((state) => state.accessToken);
  const setPlanId = useStore((state) => state.setPlanId);
  const setAccessToken = useStore((state) => state.setAccessToken);
  let planId: number;

  const defaultData = {
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: "1",
    thumbnail: "",
    startDate: new Date(),
    endDate: new Date(),
    visibilityStatus: "Public",
  };

  const createPlan = async (defaultData: DefaultData) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = { body: JSON.stringify(defaultData) };
      const { data, accessToken } = await apiClient.post(
        `/api/post`,
        options,
        headers
      );
      setPlanId(data.data.id);
      planId = data.data.id;
      if (accessToken !== "null") {
        setAccessToken(accessToken);
      }
      return { error: null, statusExpressText: "success" };
    } catch (error) {
      if (error) {
        return { error, statusExpressText: "fail" };
      } else {
        return { error, statusExpressText: "fail" };
      }
    }
  };

  const router = useRouter();

  const movePage = async () => {
    const { error, statusExpressText } = await createPlan(defaultData);

    if (statusExpressText === "success" && planId) {
      router.push(`/travel/plans/edit/${planId}`);
    } else {
      if (error instanceof Response) {
        if (error.status === 401) {
          alert("로그인이 필요한 서비스 입니다.");
        } else {
          alert(`${error.status}에러:${error.statusText}`);
        }
      }
    }
  };

  return (
    <div
      className={`flex ${
        page === "main" ? "justify-center" : "justify-end mb-4"
      }`}
    >
      <button
        onClick={movePage}
        className={`${
          page === "main" ? "custom-button" : "custom-button2"
        } xs:text-xs`}
      >
        {page === "main" ? "새로운 여행 계획 작성하기" : "게시물 작성"}
      </button>
    </div>
  );
}
