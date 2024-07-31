"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import thumbnail from "/public/main-banner.jpg";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";

export default function TripCard({ list, accessToken }: any) {
  const path = usePathname();
  const setAccessToken = useStore((state) => state.setAccessToken);
  const router = useRouter();

  useEffect(() => {
    if (accessToken !== "null" && accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  const handleDetailNavigation = (id: number) => {
    router.push(`/travel/plans/detail/${id}`);
  };

  return (
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 
      ${path === "/" ? "md:grid-cols-2" : "md:grid-cols-3"}
    lg:grid-cols-4 gap-6`}
    >
      {list.map((value: any) =>
        value.visibilityStatus === "Public" ? (
          <li
            key={value.id}
            className=" rounded overflow-hidden shadow-md 
          text-left hover:cursor-pointer"
            onClick={() => handleDetailNavigation(value.id)}
          >
            <div className="relative card">
              <Image
                src={value.thumbnail ? value.thumbnail : thumbnail}
                alt="계획 리스트 썸네일"
                fill
                className="object-fit"
              />
            </div>
            <div className="p-3">
              <p>{value.title ? value.title : "제목없음"}</p>
              <p className="font-semibold text-sm">
                {value.travelArea ? value.travelArea : "지역없음"}
              </p>
            </div>
          </li>
        ) : (
          <></>
        )
      )}
    </ul>
  );
}
