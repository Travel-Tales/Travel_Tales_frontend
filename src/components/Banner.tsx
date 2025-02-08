import React from "react";
import CreatePostButton from "./CreatePlanButton";

export default async function Banner() {
  return (
    <section
      className="banner-section text-center bg-main-banner bg-cover 
bg-center md:bg-bottom-1 
py-40 md:p-[12rem] sm:px-0 sm:pb-40 sm:pt-40
 text-white bg-no-repeat"
    >
      <h2 className="text-h3 sm:text-h2 font-bold">Your Travel Plans</h2>
      <p className="my-5 text-sm sm:text-base">
        다음 여행을 Travel Talse와 쉽게 계획하세요
      </p>
      <CreatePostButton page={"main"} />
    </section>
  );
}
