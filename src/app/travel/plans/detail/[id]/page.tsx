"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import io, { Socket } from "socket.io-client";
import useStore from "@/store/store";
import LocalStorage from "@/service/localstorage";
import thumbnail from "/public/main-banner.jpg";
import deleteButton from "/public/delete.png";
import { apiClient } from "@/service/interceptor";

interface Info {
  budget: number;
  content: string;
  createdAt: string;
  endDate: string;
  id: number;
  startDate: string;
  thumbnail: string;
  title: string;
  travelArea: string;
  travelerCount: number;
  updatedAt: string;
  visibilityStatus: string;
}

export default function TravelPlansDetailPage({
  params: { id },
}: {
  params: { id: number };
}) {
  // const info = await getDetailInfo();
  const [info, setInfo] = useState<Info | null>(null);
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
      setInfo(post.data[0]);
    });
  }, []);

  async function getDetailInfo() {
    try {
      const response = await fetch(`http://localhost:9502/api/post/${id}`, {
        cache: "no-store",
      });
      const json = await response.json();
      const data = json.data[0];
      return {
        ...data,
        title: data.title || "제목없음",
        content: data.content || "내용없음",
        travelArea: data.travelArea || "지역없음",
        travelerCount: data.travelerCount || 0,
        budget: data.budget || 0,
        thumbnail: data.thumbnail || thumbnail,
      };
    } catch (error) {
      console.log(error);
    }
  }

  const formatingDate = (date: string) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const day = newDate.getDay();

    return year + "." + month + "." + day;
  };

  const deletePost = async () => {};

  return (
    <main>
      <section className="page-section py-14">
        {info && (
          <>
            <h2 className="text-3xl font-bold pb-3 flex items-center">
              {info.title ? info.title : "제목없음"}
              <span className="ml-2 bg-gray-100 text-xs text-gray-500 rounded-full px-3 py-1">
                {info.visibilityStatus}
              </span>
            </h2>
            <article className="">
              <p className="pb-2">
                <span>지역: </span>
                {info.travelArea ? info.travelArea : "지역없음"}
              </p>
              <p className="pb-2">
                <span>인원: </span>
                {info.travelerCount}명
              </p>
              <p className="pb-2">
                <span>날짜: </span>
                {formatingDate(info.startDate)} ~ {formatingDate(info.endDate)}
              </p>
              <p className="pb-2">
                <span>총 예산: </span>
                {info.budget}원
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
              <div className="">
                <Image src={info.thumbnail} width={400} height={400} alt="" />
              </div>
            </article>
            <article className="text-center">{info.content}</article>
            <button
              onClick={deletePost}
              className="absolute top-14 my-74 right-0 mx-10 sm:mx-12 lg:mx-20"
            >
              <Image src={deleteButton} width={20} height={20} alt="delete" />
            </button>
          </>
        )}
      </section>
    </main>
  );
}
