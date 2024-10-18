import React from "react";
import type { Metadata } from "next";
import { introduction } from "../../data/fixed";
import TripCard from "../../components/TripCard";
import AccessToken from "@/components/Accesstoken";
import Banner from "@/components/Banner";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome Travel Tales",
  robots: "index",
  openGraph: {
    title: "Travel Tales",
    description:
      "쉽고 간편하게 여행 계획을 세우고, 일정과 여행지를 공유해보세요.",
    siteName: "Travel Tales",
    // url: "https://www.traveltales.kr",
  },
};

async function getRecommandPlans() {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/post/recommand`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch plans.");
  }
  const json = await response.json();
  const recommandPlanList = json.data.slice(0, 4);
  return { jsonData: recommandPlanList, accessToken: "null" };
}

export default async function Home() {
  const { jsonData, accessToken } = await getRecommandPlans();

  return (
    <>
      <AccessToken />
      <main>
        <Banner />
        <section className="page-section py-10 sm:py-20">
          <h2 className="h2 a11y-hidden">페이지 소개</h2>
          <ul className="flex-none sm:flex sm:flex-row sm:justify-between sm:items-top">
            {introduction.map((value) => (
              <li key={value.id} className="introduce last:mb-0 mb-10 sm:mb-0">
                <strong className="block mb-2">{value.title}</strong>
                <p>{value.discription}</p>
              </li>
            ))}
          </ul>
        </section>
        <section
          aria-label="page introduction"
          className="page-section pt-10 pb-20 text-center"
        >
          <h2 className="text-h3 sm:text-h2 font-semibold">추천 여행 계획</h2>
          <p className="text-sm sm:text-base py-4 sm:py-6">
            딱 맞는 여행 계획을 추천해 드립니다!
          </p>
          {/* <button className="custom-button mb-6 xs:text-xs">
            View Details
          </button> */}
          <TripCard list={jsonData} page={"plans"} />
        </section>
      </main>
    </>
  );
}
