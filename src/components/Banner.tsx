"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Banner() {
  const router = useRouter();

  return (
    <section
      className="banner-section text-center bg-main-banner bg-cover 
bg-bottom md:bg-bottom-1 p-20 text-white"
    >
      <h2 className="text-h2 font-bold">Your Travel Plans</h2>
      <p className="my-5">Plan your next adventure with ease</p>
      <button
        onClick={() => router.push("/travel/plans/create", { scroll: false })}
        className="custom-button"
      >
        Create New Travel Plan
      </button>
    </section>
  );
}
