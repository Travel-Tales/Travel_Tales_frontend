import React from "react";

export default function Category() {
  const locationList = [
    {
      img: "",
      nation: "국내",
    },
    {
      img: "",
      nation: "동남아",
    },
    {
      img: "",
      nation: "일본",
    },
    {
      img: "",
      nation: "중국",
    },
    {
      img: "",
      nation: "유럽",
    },
    {
      img: "",
      nation: "미주",
    },
    {
      img: "",
      nation: "대양주",
    },
    {
      img: "",
      nation: "중동",
    },
    {
      img: "",
      nation: "중남미",
    },
    {
      img: "",
      nation: "아프리카",
    },
  ];

  return (
    <article>
      <ul className="flex flex-wrap md:flex-nowrap items-center justify-around py-10">
        {locationList.map((value, index) => (
          <li
            className="cursor-pointer text-center w-1/2 md:w-1/8 box-border"
            key={index}
          >
            <button
              className={`border w-full py-2 hover:bg-gray-100
                ${index === 9 ? "md:border-r-1" : "md:border-r-0"} 
                ${index % 2 === 0 ? "sm-max:border-r-0" : "sm-max:border-r-1"}
                ${
                  index === 8 || index === 9
                    ? "sm-max:border-b-1"
                    : "sm-max:border-b-0"
                }

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
