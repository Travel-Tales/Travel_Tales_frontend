import React from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import Category from "@/components/Category";
import CreatePlanButton from "@/components/CreatePlanButton";

export const metadata: Metadata = {
  title: "Plans",
  description: "여행 계획을 모아보고 관리하세요.",
  robots: "index",
  openGraph: {
    title: "여행 계획 리스트",
    description: "모든 여행 계획을 한눈에 보고 관리할 수 있는 페이지입니다",
    siteName: "Travel Tales",
    // url: "https://www.traveltales.kr/travel/plans",
  },
};

async function getPlans() {
  // try {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch plans.");
  }
  const json = await response.json();
  return { jsonData: json.data, accessToken: "null" };
  // } catch (error) {
  //   console.error("API 요청 중 오류 발생:", error);
  //   return { jsonData: [], accessToken: "null" };
  // }
}

export default async function TravelPlansPage() {
  const { jsonData, accessToken } = await getPlans();
  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <SearchBar />
        <Category page={"plans"} />
        <section>
          <CreatePlanButton page={"plan"} />
          <TripCard list={jsonData} accessToken={accessToken} page={"plans"} />
        </section>
      </section>
    </main>
  );
}
