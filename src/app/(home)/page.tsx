"use client";

import Image from "next/image";
import useStore from "@/store/store";
import recommandPlan from "../../../public/recommand-plan.jpg";

export default function Home() {
  const { bears, increase } = useStore();

  const introduction = [
    {
      id: 1,
      title: "Travel Tales와 함께 계획을 작성해보세요",
      discription:
        "원하는 여행 일정과 활동을 쉽게 계획하여 공유해보세요! 친구들과 여행 일정을 공유하고 함께 수정할 수 있습니다.",
    },
    {
      id: 2,
      title: "실시간 후기 공유 및 생생한 경험을 나눠보세요",
      discription:
        "여행 후기를 실시간으로 공유하고 다른 사용자의 생생한 경험을 통해 여행을 더욱 풍부하게 즐길 수 있습니다.",
    },
    {
      id: 3,
      title: "다양한 여행지 정보와 유용한 팁 제공합니다",
      discription:
        "다양한 여행지에 대한 상세한 정보와 팁을 제공하여 더 나은 여행 계획을 세울 수 있도록 도와줍니다.",
    },
  ];

  const recommandPlans = [
    {
      id: 1,
      thumbnail: recommandPlan,
      title: "국내 당일치기 당진여행",
      location: "당진",
    },
    {
      id: 2,
      thumbnail: recommandPlan,
      title: "국내 당일치기 당진여행",
      location: "당진",
    },
    {
      id: 3,
      thumbnail: recommandPlan,
      title: "국내 당일치기 당진여행",
      location: "당진",
    },
    {
      id: 4,
      thumbnail: recommandPlan,
      title: "국내 당일치기 당진여행",
      location: "당진",
    },
  ];

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
