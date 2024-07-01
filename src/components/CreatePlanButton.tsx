"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: number;
  thumnail: string;
  startDate: Date;
  endDate: Date;
  visibilityStatus: string;
}

export default function CreatePlanButton() {
  const access = useStore((state) => state.accessToken);
  const setPlanId = useStore((state) => state.setPlanId);

  const defaultData = {
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: 1,
    thumnail: "",
    startDate: new Date(),
    endDate: new Date(),
    visibilityStatus: "Public",
  };

  const createPlan = async (defaultData: DefaultData) => {
    try {
      const response = await fetch("http://localhost:9502/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(defaultData),
      });
      const json = await response.json();
      setPlanId(json.data.id);
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
