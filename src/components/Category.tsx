"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/store/store";

export default function Category() {
  const locationList = [
    {
      id: 1,
      nation: "전체",
    },
    {
      id: 2,
      nation: "국내",
    },
    {
      id: 3,
      nation: "동남아",
    },
    {
      id: 4,
      nation: "일본",
    },
    {
      id: 5,
      nation: "중국",
    },
    {
      id: 6,
      nation: "유럽",
    },
    {
      id: 7,
      nation: "미주",
    },
    {
      id: 8,
      nation: "대양주",
    },
    {
      id: 9,
      nation: "중동",
    },
    {
      id: 10,
      nation: "중남미",
    },
    {
      id: 11,
      nation: "아프리카",
    },
  ];

  const setPlans = useStore((state) => state.setPlans);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const searchKeyword = useStore((state) => state.searchKeyword);

  const handleClick = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const handleCategory = async () => {
      if (selectedCategory) {
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
      }
    };
    handleCategory();
  }, [selectedCategory]);

  return (
    <article>
      <ul className="flex flex-wrap md:flex-nowrap items-center justify-around py-10">
        {locationList.map((value, index) => (
          <li
            className={`cursor-pointer text-center w-1/2 md:w-1/8 
            ${index === 0 ? "w-full" : ""} box-border`}
            key={index}
          >
            <button
              className={`border w-full py-2 hover:bg-gray-100 hover:text-black
              ${selectedCategory === value.nation && "bg-blue-500 text-white"}
                ${index === 10 ? "md:border-r-1" : "md:border-r-0"} 
                ${index % 2 === 1 ? "sm-max:border-r-0" : "sm-max:border-r-1"}
                ${
                  index === 8 || index === 9 || index === 10
                    ? "sm-max:border-b-1"
                    : "sm-max:border-b-0"
                }
                ${index === 10 ? "sm-max:border-t-0" : "sm-max:border-t-1"}
              `}
              onClick={() => handleClick(value.nation)}
            >
              {value.nation}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
