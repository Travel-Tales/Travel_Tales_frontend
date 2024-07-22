"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import thumbnail from "../../../../../public/main-banner.jpg";
import io, { Socket } from "socket.io-client";
import useStore from "@/store/store";
import LocalStorage from "@/service/localstorage";

export default function TravelPlansDetailPage({
  params: { id },
}: {
  params: { id: number };
}) {
  // const info = await getDetailInfo();
  const [info, setInfo] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [transport, setTransport] = useState("N/A");
  const [socket, setSocket] = useState<any | null>(null);
  const access = LocalStorage.getItem("accessToken");

  useEffect(() => {
    const socketInstance = io(`http://localhost:9502/post`, {
      transports: ["websocket"],
      auth: {
        Authorization: `Bearer ${access}`,
      },
    });
    //: 처음 데이터를 받아오는 곳

    const fetchData = async () => {
      const initialData = await getDetailInfo();
      setInfo(initialData);
    };
    fetchData();

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("error", (error) => {
      console.error("Socket encountered error: ", error);
    });
    socketInstance.emit("setInit");
    socketInstance.emit("joinRoom", { postId: id });
    socketInstance.on("postUpdate", (post) => {
      setInfo(post);
    });
  }, []);

  async function getDetailInfo() {
    try {
      const response = await fetch(`http://localhost:9502/api/post/${id}`, {
        cache: "no-store",
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      {JSON.stringify(info)}
      {/* <section className="page-section py-14">
        <h2 className="text-3xl font-bold pb-3 flex items-center">
          당일치기 당진 여행 계획서!{" "}
          <span className="ml-2 bg-gray-100 text-xs text-gray-500 rounded-full px-3 py-1">
            Public
          </span>
        </h2>
        <article className="">
          <p className="pb-2">
            <span>지역: </span>국내
          </p>
          <p className="pb-2">
            <span>인원: </span>4명
          </p>
          <p className="pb-2">
            <span>날짜: </span>2024.05.12 ~ 2024.05.12
          </p>
          <p className="pb-2">
            <span>총 예산: </span>340,000원
          </p>
          <p></p>
          <div className="flex items-center space-x-2 pb-2">
            <span className="">키워드:</span>
            <div className="flex space-x-2">
              <span
                className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
                aria-label="당진 해시태그"
              >
                #당진
              </span>
              <span
                className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
                aria-label="당일치기 해시태그"
              >
                #당일치기
              </span>
            </div>
          </div>
        </article>
        <article className="text-center">본문내용</article>
      </section> */}
    </main>
  );
}
