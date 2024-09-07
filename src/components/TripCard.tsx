"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import thumbnailImg from "/public/thumbnail-img.jpg";
import useStore from "@/store/store";

type List = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: number;
  thumbnail: string;
  startDate: string;
  endDate: string;
  visibilityStatus: string;
  travelPostImage?: [];
};

type TripCardProps = {
  list: List[];
  accessToken?: string;
};

export default function TripCard({ list, accessToken }: TripCardProps) {
  const path = usePathname();
  const router = useRouter();
  const setAccessToken = useStore((state) => state.setAccessToken);

  const [filteredData, setFilteredData] = useState<List[]>([]);

  // Access token 설정
  useEffect(() => {
    if (accessToken && accessToken !== "null") {
      setAccessToken(accessToken);
    }
  }, [accessToken, setAccessToken]);

  // 데이터 필터링
  useEffect(() => {
    const filterByVisibility = () => {
      if (path === "/mypage") {
        return list;
      }
      return list.filter((item) => item.visibilityStatus === "Public");
    };
    setFilteredData(filterByVisibility());
  }, [list, path]);

  // 상세 페이지로 이동하는 함수
  const handleDetailNavigation = (id: number) => {
    const targetPage =
      path === "/mypage"
        ? `/travel/plans/detail/${id}?page=my`
        : `/travel/plans/detail/${id}`;
    router.push(targetPage);
  };

  // 개별 카드 컴포넌트
  const TripCardItem = ({ item }: { item: any }) => (
    <li
      key={item.id}
      className="rounded overflow-hidden shadow-md text-left hover:cursor-pointer"
      onClick={() => handleDetailNavigation(item.id)}
    >
      <div className="relative card">
        <Image
          src={item.thumbnail || thumbnailImg}
          alt="계획 리스트 썸네일"
          fill
          className="object-fit"
        />
      </div>
      <div className="p-3">
        <p className="text-sm sm:text-base">{item.title || "제목없음"}</p>
        <p className="font-semibold text-xs sm:text-sm">
          {item.travelArea || "지역없음"}
        </p>
      </div>
    </li>
  );

  return (
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 
      ${path === "/" ? "md:grid-cols-2" : "md:grid-cols-3"}
      lg:grid-cols-4 gap-6`}
    >
      {filteredData.map((item) => (
        <TripCardItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
