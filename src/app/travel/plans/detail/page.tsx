import React from "react";
import Image from "next/image";
import thumbnail from "../../../../../public/main-banner.jpg";

export default function TravelPlansDetailPage() {
  return (
    <main>
      <section className="page-section py-14">
        <h2 className="text-3xl font-bold pb-3 flex items-center">
          당일치기 당진 여행 계획서!{" "}
          <span className="ml-2 bg-gray-100 text-xs text-gray-500 rounded-full px-3 py-1">
            Public
          </span>
        </h2>
        <article className="">
          <p className="pb-2">
            <span>지역: </span>국내
          </p>
          <p className="pb-2">
            <span>인원: </span>4명
          </p>
          <p className="pb-2">
            <span>날짜: </span>2024.05.12 ~ 2024.05.12
          </p>
          <p className="pb-2">
            <span>총 예산: </span>340,000원
          </p>
          <p></p>
          <div className="flex items-center space-x-2 pb-2">
            <span className="">키워드:</span>
            <div className="flex space-x-2">
              <span
                className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
                aria-label="당진 해시태그"
              >
                #당진
              </span>
              <span
                className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
                aria-label="당일치기 해시태그"
              >
                #당일치기
              </span>
            </div>
          </div>
        </article>
        <article className="text-center">본문내용</article>
      </section>
    </main>
  );
}
