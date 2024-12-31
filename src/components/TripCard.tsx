"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageLoaderProps } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import thumbnailImg from "./../../public/thumbnail-img.webp";
import useStore from "@/store/store";
import plansStore from "@/store/plansStore";

type List = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  visibilityStatus: string;
  travelPostImage?: [];
};

type TripCardProps = {
  list: List[];
  accessToken?: string;
  page: string;
};

export default function TripCard({ list, accessToken, page }: TripCardProps) {
  const path = usePathname();
  const router = useRouter();
  const setAccessToken = useStore((state) => state.setAccessToken);
  const plans = plansStore((state) => state.plans);
  const setPlans = plansStore((state) => state.setPlans);
  const selectedCategory = plansStore((state) => state.selectedCategory);

  const [isOpen, setIsOpen] = useState(false);

  // Access token 설정
  useEffect(() => {
    if (accessToken && accessToken !== "null") {
      setAccessToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (page === "plans") {
      setPlans(list);
    } else if (page === "reviews") {
      setPlans(list);
    } else if (page === "mypage") {
      setPlans(list);
    }
  }, []);

  // 상세 페이지로 이동하는 함수
  const handleDetailNavigation = (e: any, id: number) => {
    if (page === "mypage") {
      router.push(`/travel/plans/detail/${id}?page=my`);
    } else {
      router.push(`/travel/${page}/detail/${id}`);
    }
  };

  const myLoader = ({ src, width, quality = 75 }: ImageLoaderProps) => {
    return `${src}?w=${width}&q=${quality}`;
  };

  const createReview = (id: number) => {
    router.push(`/travel/reviews/edit/${id}`);
  };

  // 개별 카드 컴포넌트
  const TripCardItem = ({ item }: { item: List }) => (
    <li
      key={item.id}
      className="rounded shadow-md text-left hover:cursor-pointer"
      onClick={(e) => handleDetailNavigation(e, item.id)}
    >
      <div className="relative card">
        <Image
          loader={item.thumbnail ? myLoader : undefined}
          src={item.thumbnail || thumbnailImg}
          // width={640}
          // height={428}
          fill
          alt="계획 리스트 썸네일"
          // placeholder="blur"
          // priority={true} // 우선 로드 설정
          // unoptimized={true}
          className="object-cover rounded-t"
        />
      </div>
      <div className="p-3 relative">
        <p className="text-sm sm:text-base">{item.title || "제목없음"}</p>
        <p className="font-semibold text-xs sm:text-sm">
          {item.travelArea || "지역없음"}
        </p>
        {page === "mypage" && (
          <>
            <nav
              aria-label="additional options"
              className={`additional-menu absolute top-0 right-0 p-4 ${
                isOpen ? "z-1" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev: boolean) => !prev);
              }}
            >
              <button
                id="menu-button"
                aria-controls="menu-options"
                className="flex flex-col"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </nav>
            {isOpen && (
              <ul
                id="menu-options"
                role="menu"
                className={`additional-menu-options absolute top-9 right-0 bg-white 
              rounded-md px-3 py-2 text-sm ${isOpen ? "z-10" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <li
                  role="menuitem"
                  className="hover:bg-slate-100 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    createReview(item.id);
                  }}
                >
                  <button type="button">여행 리뷰 쓰기</button>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </li>
  );

  return (
    <>
      {plans.length ? (
        <ul
          className={`grid grid-cols-1 sm:grid-cols-2 
      ${path === "/" ? "md:grid-cols-2" : "md:grid-cols-3"}
      lg:grid-cols-4 gap-6`}
        >
          {plans.map((item: List) => (
            <TripCardItem key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p>등록된 게시물이 없습니다.</p>
      )}
    </>
  );
}
