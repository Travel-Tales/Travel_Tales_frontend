import React from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import { recommandPlans } from "@/data/temporary";
import Category from "@/components/Category";
import CreatePostButton from "@/components/CreatePostButton";

export const metadata: Metadata = {
  title: "Reviews",
  description: "여행 리뷰를 모아보고 관리하세요.",
  robots: "index",
  openGraph: {
    title: "여행 리뷰 리스트",
    description: "모든 여행 리뷰를 한눈에 보고 관리할 수 있는 페이지입니다",
    siteName: "Travel Tales",
    // url: "https://www.traveltales.kr/travel/plans",
  },
};

async function getReviews() {
  // try {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/review`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch reviews.");
  }
  const json = await response.json();
  return { jsonData: json.data, accessToken: "null" };
  // } catch (error) {
  //   console.error("API 요청 중 오류 발생:", error);
  //   return { jsonData: [], accessToken: "null" };
  // }
}

export default async function TravelReviewList() {
  const { jsonData, accessToken } = await getReviews();

  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <h2 className="h2 a11y-hidden">리뷰 리스트 페이지</h2>
        <SearchBar />
        <Category page={"review"} />
        <section>
          <TripCard
            list={jsonData}
            accessToken={accessToken}
            page={"reviews"}
          />
        </section>
      </section>
    </main>
  );
}
