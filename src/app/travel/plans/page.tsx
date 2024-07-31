import React from "react";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import { recommandPlans } from "@/data/temporary";
import Category from "@/components/Category";
import { apiClient } from "@/service/interceptor";

async function getPlans() {
  const headers = {
    "Content-Type": "application/json",
  };
  const options = {};
  const { data, accessToken } = await apiClient.get(
    `/api/post`,
    options,
    headers
  );
  const dataList = data.data;
  return { dataList, accessToken };
}

export default async function TravelPlansPage() {
  const { dataList, accessToken } = await getPlans();
  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <SearchBar />
        <Category />
        <section>
          <TripCard list={dataList} accessToken={accessToken} />
        </section>
      </section>
    </main>
  );
}
