import React from "react";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import { recommandPlans } from "@/data/temporary";
import Category from "@/components/Category";

export default function TravelReviewList() {
  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <SearchBar />
        <Category page={"review"} />
        <section>
          {/* <TripCard list={recommandPlans} page={"review"} /> */}
          준비 중입니다.
        </section>
      </section>
    </main>
  );
}
