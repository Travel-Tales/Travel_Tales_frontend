import React, { useState } from "react";
import ProfileImg from "@/components/ProfileImg";

export default function Mypage() {
  return (
    <main>
      <section className="page-section ">
        <article
          className="flex flex-row justify-between items-center 
        sm:px-0 md:px-24 lg:px-44 pt-5"
        >
          <div className="flex flex-row">
            <ProfileImg />
            <section className="ml-4 mt-5">
              <p>wlgus_57@naver.com</p>
              <p>John Doe</p>
            </section>
          </div>
          <button className="bg-black text-white px-14 py-2 text-sm rounded-md">
            Edit
          </button>
        </article>
        <article className="w-full flex flex-row text-center border-y mt-5 text-sm">
          <section
            className="flex-1 py-3 hover:bg-gray-100 cursor-pointer after:content-['|']
          after:text-border-color relative after:absolute after:-right-0.5 after:top-2.5"
          >
            <h2>나의 여행 계획서</h2>
          </section>
          <section className="flex-1 py-3 hover:bg-gray-100 cursor-pointer">
            <h2>나의 여행 리뷰</h2>
          </section>
        </article>
      </section>
    </main>
  );
}
