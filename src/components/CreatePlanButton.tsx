"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LocalStorage from "@/service/localstorage";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: number;
  thumnail: string;
  startDate: string;
  endDate: string;
  visibilityStatus: string;
}

export default function CreatePlanButton() {
  const accessToken = LocalStorage.getItem("accessToken");

  const defaultData = {
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: 1,
    thumnail: "",
    startDate: "",
    endDate: "",
    visibilityStatus: "Pubilc",
  };

  const createPlan = async (defaultData: DefaultData) => {
    try {
      const response = await fetch("http://localhost:9502/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(defaultData),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const movePage = async () => {
    createPlan(defaultData);
    router.push("/travel/plans/create");
  };

  return (
    <button onClick={movePage} className="custom-button">
      Create New Travel Plan
    </button>
  );
}
