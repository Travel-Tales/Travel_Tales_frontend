import React, { useEffect } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { recommandPlans } from "../../data/temporary.js";
import { introduction } from "../../data/fixed";
import TripCard from "../../components/TripCard";
import Head from "next/head.js";
import { cookies } from "next/headers.js";
import AccessToken from "@/components/Accesstoken";

export default function Home() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh")?.value || null;

  return (
    <>
      <AccessToken refreshToken={refreshToken} />
      <main>
        <section
          className="banner-section text-center bg-main-banner bg-cover 
      bg-bottom md:bg-bottom-1 p-20 text-white"
        >
          <h2 className="text-h2 font-bold">Your Travel Plans</h2>
          <p className="my-5">Plan your next adventure with ease</p>
          <button className="custom-button">Create New Travel Plan</button>
        </section>
        <section className="page-section py-20">
          <h2 className="h2 a11y-hidden">페이지 소개</h2>
          <ul className="flex flex-row justify-between items-center">
            {introduction.map((value) => (
              <li key={value.id} className="introduce">
                <strong>{value.title}</strong>
                <p>{value.discription}</p>
              </li>
            ))}
          </ul>
        </section>
        <section
          aria-label="page introduction"
          className="page-section pt-10 pb-20 text-center"
        >
          <h2 className="text-h2 font-semibold">추천 여행 계획</h2>
          <p className="py-6">We recommend necessary travel plans</p>
          <button className="custom-button mb-6">View Details</button>
          <TripCard list={recommandPlans} />
        </section>
      </main>
    </>
  );
}
