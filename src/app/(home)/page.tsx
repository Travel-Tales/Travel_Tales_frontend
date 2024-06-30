import React, { useEffect } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { recommandPlans } from "../../data/temporary.js";
import { introduction } from "../../data/fixed";
import TripCard from "../../components/TripCard";
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
