import Image from "next/image";
import useStore from "@/store/store";
import { recommandPlans } from "../../data/temporary.js";
import { introduction } from "../../data/fixed";

export default function Home() {
  return (
    <main>
      <section
        className="banner-section text-center bg-main-banner bg-cover 
      bg-bottom md:bg-bottom-1 p-20 text-white"
      >
        <h2 className="text-h2 font-bold">Your Travel Plans</h2>
        <p className="my-5">Plan your next adventure with ease</p>
        <button className="custom-button">Create New Travel Plan</button>
      </section>
      <section className="px-10 sm:px-12 lg:px-20 py-20">
        <h2 className="h2 a11y-hidden">페이지 소개</h2>
        <ul className="flex flex-row justify-between items-center">
          {introduction.map((value) => (
            <li key={value.id} className="introduce">
              <strong>{value.title}</strong>
              <p>{value.discription}</p>
            </li>
          ))}
        </ul>
      </section>
      <section
        aria-label="page introduction"
        className="px-10 sm:px-12 lg:px-20 pt-10 pb-20 text-center"
      >
        <h2 className="text-h2 font-semibold">추천 여행 계획</h2>
        <p className="py-6">We recommend necessary travel plans</p>
        <button className="custom-button">View Details</button>
        <ul className="flex flex-row flex-wrap justify-between py-10">
          {recommandPlans.map((value, index) => (
            <li
              key={value.id}
              className="recommand-list text-left border border-x-gray-300 rounded-md overflow-hidden"
            >
              <div className="relative card">
                <Image
                  src={value.thumbnail}
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
      </section>
    </main>
  );
}
