import React from "react";
import CreatePlanButton from "./CreatePlanButton";

export default async function Banner() {
  return (
    <section
      className="banner-section text-center bg-main-banner bg-cover 
bg-bottom md:bg-bottom-1 p-20 text-white"
    >
      <h2 className="text-h2 font-bold">Your Travel Plans</h2>
      <p className="my-5">Plan your next adventure with ease</p>
      <CreatePlanButton />
    </section>
  );
}
