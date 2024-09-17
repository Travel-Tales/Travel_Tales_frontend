import React from "react";

export default function Category() {
  const locationList = [
    {
      nation: "전체",
    },
    {
      nation: "국내",
    },
    {
      nation: "동남아",
    },
    {
      nation: "일본",
    },
    {
      nation: "중국",
    },
    {
      nation: "유럽",
    },
    {
      nation: "미주",
    },
    {
      nation: "대양주",
    },
    {
      nation: "중동",
    },
    {
      nation: "중남미",
    },
    {
      nation: "아프리카",
    },
  ];

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
              className={`border w-full py-2 hover:bg-gray-100
                ${index === 10 ? "md:border-r-1" : "md:border-r-0"} 
                ${index % 2 === 1 ? "sm-max:border-r-0" : "sm-max:border-r-1"}
                ${
                  index === 8 || index === 9 || index === 10
                    ? "sm-max:border-b-1"
                    : "sm-max:border-b-0"
                }
                ${index === 10 ? "sm-max:border-t-0" : "sm-max:border-t-1"}
              `}
            >
              {value.nation}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
