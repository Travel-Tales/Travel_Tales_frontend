import React from "react";
import Head from "next/head.js";
import CreatePlanButton from "./CreatePlanButton";

export default async function Banner() {
  return (
    <>
      {/* <Head>
        <link rel="preload" href="/public/main-banner1.avif" as="image" />
      </Head> */}
      <section
        className="banner-section text-center bg-main-banner bg-cover 
bg-bottom md:bg-bottom-1 p-10 sm:p-20 xs:p-7 text-white"
      >
        <h2 className="text-h3 sm:text-h2 font-bold">Your Travel Plans</h2>
        <p className="my-5 text-sm sm:text-base">
          Plan your next adventure with ease
        </p>
        <CreatePlanButton />
      </section>
    </>
  );
}
