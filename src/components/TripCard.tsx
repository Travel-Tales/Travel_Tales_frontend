"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import thumbnail from "/public/main-banner.jpg";

export default function TripCard({ list }: any) {
  const path = usePathname();

  console.log(list);

  return (
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 
      ${path === "/" ? "md:grid-cols-2" : "md:grid-cols-3"}
    lg:grid-cols-4 gap-6`}
    >
      {list.map((value: any) => (
        <li
          key={value.id}
          className=" rounded overflow-hidden shadow-md 
          text-left"
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
            <p>{value.title}</p>
            <p className="font-semibold text-sm">{value.location}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
