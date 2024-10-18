import React from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import { recommandPlans } from "@/data/temporary";
import Category from "@/components/Category";

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

export default function TravelReviewList() {
  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <SearchBar />
        <Category page={"review"} />
        <section>
          {/* <TripCard list={recommandPlans} page={"review"} /> */}
          준비 중입니다.
        </section>
      </section>
    </main>
  );
}
