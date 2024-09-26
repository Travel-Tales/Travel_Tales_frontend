"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "./../../public/search-white.png";
import { usePathname } from "next/navigation";
import useStore from "@/store/store";

export default function SearchBar() {
  const path = usePathname();
  const setPlans = useStore((state) => state.setPlans);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const searchKeyword = useStore((state) => state.searchKeyword);
  const setSearchKeyword = useStore((state) => state.setSearchKeyword);

  const getValueByPath = (pathName: string) => {
    return pathName === "/travel/plans" ? "여행 계획" : "여행 후기";
  };

  const handleSearchInputChange = async (params: string) => {
    setSearchKeyword(params);
  };

  const handleSearchSubmit = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/post?title=${searchKeyword}&travelArea=${
        selectedCategory === "전체" ? "" : selectedCategory
      }`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch plans.");
    }
    const json = await response.json();
    setPlans(json.data);
    // return { jsonData: json.data, accessToken: "null" };
  };

  return (
    <div className="mt-4 sm:mt-0">
      <form
        // onSubmit={handleSubmit}
        className="flex mx-auto justify-between border 
        text-xs pr-2 pl-2 py-2
        sm:pr-2.5 sm:pl-4 sm:py-2.5 w-full md:w-3/5 
        rounded-full overflow-hidden"
      >
        <input
          type="text"
          aria-label={`${getValueByPath(path)}검색 창`}
          className="w-4/5 sm:flex-1 mr-2 px-2 box-border"
          placeholder={`${getValueByPath(path)}검색`}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchKeyword}
        />
        <button
          type="button"
          aria-label={`${getValueByPath(path)}검색 버튼`}
          className="bg-blue-700 text-white px-2 py-2
          sm:px-2.5 sm:py-2.5 rounded-full"
          onClick={handleSearchSubmit}
        >
          <div style={{ minWidth: "15px" }}>
            <Image
              src={searchIcon}
              alt="search button icon"
              width={22}
              height={22}
            />
          </div>
        </button>
      </form>
    </div>
  );
}
