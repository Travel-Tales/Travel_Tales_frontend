import React, { useEffect } from "react";
import Image from "next/image";
import { recommandPlans } from "data/temporary.js";
import { introduction } from "data/fixed";
import TripCard from "components/TripCard";
import Head from "next/head.js";
import { cookies } from "next/headers.js";
import AccessToken from "@/components/Accesstoken";
import Link from "next/link.js";
import Banner from "@/components/Banner";

export default function Home() {
  function getRefreshToken() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh")?.value;
    return refreshToken;
  }

  return (
    <>
      <AccessToken refreshToken={getRefreshToken()} />
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
          <button className="custom-button mb-6 xs:text-xs">
            View Details
          </button>
          <TripCard list={recommandPlans} />
        </section>
      </main>
    </>
  );
}
