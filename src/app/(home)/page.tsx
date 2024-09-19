import React from "react";
import { introduction } from "../../data/fixed";
import TripCard from "../../components/TripCard";
import AccessToken from "@/components/Accesstoken";
import Banner from "@/components/Banner";

async function getPlans() {
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
  //* 임시방편으로 4개로 자름
  const suggestionList = json.data.slice(0, 4);
  return { jsonData: suggestionList, accessToken: "null" };
}

export default async function Home() {
  const { jsonData, accessToken } = await getPlans();

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
            We recommend necessary travel plans
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
