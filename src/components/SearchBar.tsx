"use client";

import React from "react";
import Image from "next/image";
import searchIcon from "/public/search-white.png";
import { usePathname } from "next/navigation";

export default function SearchBar() {
  const path = usePathname();

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const getValueByPath = (pathName: string) => {
    return pathName === "/travel/plans" ? "여행 계획" : "여행 후기";
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="flex mx-auto justify-between border text-xs pr-2.5 pl-4 py-2.5 w-3/5 
        rounded-full overflow-hidden"
      >
        <input
          type="text"
          aria-label={`${getValueByPath(path)}검색 창`}
          className="flex-1 mr-2 px-2"
          placeholder={`${getValueByPath(path)}검색`}
        />
        <button
          type="submit"
          aria-label={`${getValueByPath(path)}검색 버튼`}
          className="bg-blue-700 text-white px-2.5 py-2.5 rounded-full"
        >
          <Image src={searchIcon} alt="search button icon" width={22} />
        </button>
      </form>
    </div>
  );
}
