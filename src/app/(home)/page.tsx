import React from "react";
import type { Metadata } from "next";
import { introduction } from "../../data/fixed";
import TripCard from "../../components/TripCard";
import AccessToken from "@/components/Accesstoken";
import Banner from "@/components/Banner";
import Image from "next/image";

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
      <main className="pt-0">
        <Banner />
        <section className="page-section py-10 sm:py-20 s:mt-[-150px] mt-[-80px]">
          <h2 className="h2 a11y-hidden">메인페이지</h2>
          <article>
            {/* <h3 className="text-h3 sm:text-h2 font-semibold text-center">
              Top values for you
            </h3>
            <p
              className="text-sm sm:text-base py-4 sm:pb-12 sm:pt-3 text-center text-gray-500
"
            >
              다양한 서비스를 이용해 보세요!
            </p> */}
            <ul
              className="flex-none sm:flex sm:flex-row sm:justify-between 
            sm:items-top"
            >
              {introduction.map((value) => (
                <li
                  key={value.id}
                  className="introduce last:mb-0 mb-10 sm:mb-0
                  bg-white p-6 rounded-md shadow-lg"
                >
                  <Image
                    src={value.icon}
                    width={50}
                    height={50}
                    alt=""
                    className="mb-4"
                  />
                  <strong className="block mb-2">{value.title}</strong>
                  <p>{value.discription}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section
          aria-label="page introduction"
          className="page-section pt-10 pb-20 text-center"
        >
          <h3 className="text-h3 sm:text-h2 font-semibold">추천 여행 계획</h3>
          <p className="text-sm sm:text-base py-4 sm:pb-12 sm:pt-3 text-gray-500">
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
