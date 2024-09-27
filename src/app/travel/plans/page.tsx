import React from "react";
import SearchBar from "@/components/SearchBar";
import TripCard from "@/components/TripCard";
import Category from "@/components/Category";

async function getPlans() {
  // try {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch plans.");
  }
  const json = await response.json();
  return { jsonData: json.data, accessToken: "null" };
  // } catch (error) {
  //   console.error("API 요청 중 오류 발생:", error);
  //   return { jsonData: [], accessToken: "null" };
  // }
}

export default async function TravelPlansPage() {
  const { jsonData, accessToken } = await getPlans();
  return (
    <main>
      <section className="page-section pt-4 pb-16">
        <SearchBar />
        <Category />
        <section>
          <TripCard list={jsonData} accessToken={accessToken} page={"plans"} />
        </section>
      </section>
    </main>
  );
}
