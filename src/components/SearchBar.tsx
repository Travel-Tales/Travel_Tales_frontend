"use client";

import React, { useRef } from "react";
import Image from "next/image";
import searchIcon from "./../../public/search-white.png";
import close from "./../../public/close.png";
import { usePathname } from "next/navigation";
import plansStore from "@/store/plansStore";

export default function SearchBar() {
  const path = usePathname();
  const setPlans = plansStore((state) => state.setPlans);
  const selectedCategory = plansStore((state) => state.selectedCategory);
  const searchKeyword = plansStore((state) => state.searchKeyword);
  const setSearchKeyword = plansStore((state) => state.setSearchKeyword);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const getValueByPath = (pathName: string) => {
    return pathName === "/travel/plans" ? "여행 계획" : "여행 후기";
  };

  const enterSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
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
        onSubmit={(e) => handleSubmit(e)}
        className="flex mx-auto justify-between border 
        text-sm pr-2 pl-2 py-2
        sm:pr-2 sm:pl-4 sm:py-2 w-full md:w-3/5 
        rounded-full overflow-hidden"
      >
        <input
          type="text"
          aria-label={`${getValueByPath(path)}검색 창`}
          className="w-4/5 sm:flex-1 mr-2 px-2 box-border"
          placeholder={`${getValueByPath(path)}검색`}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onKeyDown={(e) => enterSearchSubmit(e)}
          ref={inputRef}
          value={searchKeyword}
        />
        {searchKeyword && (
          <button
            type="button"
            aria-label={"검색어 삭제 버튼"}
            className="mr-2"
            onClick={() => {
              setSearchKeyword("");
              inputRef.current && inputRef.current.focus();
            }}
          >
            <div style={{ minWidth: "15px" }}>
              <Image
                src={close}
                alt="close button icon"
                width={16}
                height={16}
              />
            </div>
          </button>
        )}
        <button
          type="button"
          aria-label={`${getValueByPath(path)}검색 버튼`}
          className="bg-blue-700 text-white
          rounded-full px-2 h-8	w-8"
          onClick={handleSearchSubmit}
        >
          <div style={{ minWidth: "15px" }}>
            <Image
              src={searchIcon}
              alt="search button icon"
              width={16}
              height={16}
            />
          </div>
        </button>
      </form>
    </div>
  );
}
