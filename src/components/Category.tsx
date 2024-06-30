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
      <ul className="flex flex-row items-center justify-around py-10">
        {locationList.map((value, index) => (
          <li className="cursor-pointer flex-1 text-center" key={index}>
            <button
              className={`border ${
                index === 9 ? "border-r-1" : "border-r-0"
              } w-full py-2
              hover:bg-gray-100`}
            >
              {value.nation}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
