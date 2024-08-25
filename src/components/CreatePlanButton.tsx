"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "store/store";
import { apiClient } from "service/interceptor";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: number;
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  visibilityStatus: string;
}

export default function CreatePlanButton() {
  const access = useStore((state) => state.accessToken);
  const setPlanId = useStore((state) => state.setPlanId);
  const setAccessToken = useStore((state) => state.setAccessToken);
  let planId: number;

  const defaultData = {
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: 1,
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
      return "success";
    } catch (error) {
      console.log(error);
      return "fail";
    }
  };

  const router = useRouter();

  const movePage = async () => {
    const status = await createPlan(defaultData);
    if (status === "success" && planId) {
      router.push(`/travel/plans/edit/${planId}`);
    } else {
      alert("에러발생, 페이지 생성하지 못했습니다.");
    }
  };

  return (
    <button onClick={movePage} className="custom-button xs:text-xs">
      Create New Travel Plan
    </button>
  );
}
