"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import io from "socket.io-client";
import useStore from "@/store/store";
import LocalStorage from "@/service/localstorage";
import thumbnail from "./../../../../../../public/thumbnail-img.webp";
import deleteButton from "./../../../../../../public/delete.png";
import editButton from "./../../../../../../public/edit.png";
import { apiClient } from "@/service/interceptor";
import { useRouter, useSearchParams } from "next/navigation";
import MarkdownRender from "@/components/MarkdownRender";
import { refreshAccessToken } from "@/service/interceptor";
import DOMPurify from "dompurify";

interface TabContent {
  budget: "11,111,111";
  id: 20241101;
  lodging: "리조트";
  markdown: "";
}

interface Info {
  budget: string;
  content: TabContent[];
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
  const setAccessToken = useStore((state) => state.setAccessToken);

  const [content, setContent] = useState({
    budget: "",
    id: 0,
    lodging: "",
    markdown: "",
  });
  const [tabList, setTabList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();

  const params = searchParams.get("page");

  useEffect(() => {
    if (access) {
      const connectSocket = async () => {
        const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
          transports: ["websocket"],
          auth: {
            Authorization: `Bearer ${access}`,
          },
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
        });

        socketInstance.emit("setInit");
        socketInstance.emit("joinRoom", { postId: id });
        socketInstance.on("postUpdate", (post) => {
          setInfo(post[0]);
        });

        socketInstance.on("error", async (error) => {
          if (error.message === "Invalid Token") {
            console.error("Socket encountered error: ", error);

            try {
              const newAccessToken = await refreshAccessToken(
                process.env.NEXT_PUBLIC_API_URL
              );
              setAccessToken(newAccessToken);

              socketInstance.disconnect();

              const newSocketInstance = io(
                `${process.env.NEXT_PUBLIC_API_URL}/post`,
                {
                  transports: ["websocket"],
                  auth: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }
              );

              newSocketInstance.on("connect", () => {
                setIsConnected(true);
              });

              newSocketInstance.emit("setInit");
              newSocketInstance.emit("joinRoom", { postId: id });
              newSocketInstance.on("postUpdate", (post) => {
                setInfo(post[0]);
              });
            } catch (err) {
              console.error("Failed to refresh token:", err);
            }
          } else {
            console.error("Socket encountered error: ", error);
          }
        });

        return () => {
          socketInstance.emit("leaveRoom", { postId: id });
          socketInstance.disconnect();
        };
      };

      connectSocket();
    }

    // Initial data fetch
    const fetchData = async () => {
      const initialData = await getDetailInfo();
      setInfo(initialData);
    };
    fetchData();
  }, [access, id]);

  async function getDetailInfo() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
        {
          cache: "no-store",
        }
      );
      const json = await response.json();
      const data = json.data[0];
      const parseContent = JSON.parse(data.content);
      const resultTapList = parseContent.map((value: any) => {
        const dateId = value.id.toString();
        const year = dateId.substr(0, 4);
        const month = dateId.substr(4, 2);
        const day = dateId.substr(6, 2);
        const date = `${year}-${month}-${day}`;
        return { tabName: date, id: value.id };
      });
      setTabList(resultTapList);
      setSelectedTab(resultTapList[0].id);

      return {
        ...data,
        title: data.title || "제목없음",
        content: parseContent || "내용없음",
        travelArea: data.travelArea || "지역없음",
        travelerCount: data.travelerCount || 0,
        // budget: data.budget || "0",
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
    const day = newDate.getDate();

    return (
      year +
      "." +
      (+month < 9 ? "0" + (month + 1) : month + 1) +
      "." +
      (day < 10 ? "0" + day : day)
    );
  };

  const deletePost = async () => {
    if (confirm("삭제하시겠습니까?") === true) {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {};
      const { data, accessToken } = await apiClient.delete(
        `/api/post/${id}`,
        options,
        headers
      );
      if (accessToken !== "null") {
        setAccessToken(accessToken);
      }
      if (data.success) {
        alert("삭제되었습니다.");
        router.replace("/mypage"); // 이전 페이지 URL로 대체
      }
    } else {
      return;
    }
  };

  const editPost = async () => {
    router.push(`/travel/plans/edit/${id}`);
  };

  useEffect(() => {
    if (info) {
      const selectTabContent = info.content.filter((value) => {
        return selectedTab === value.id;
      });
      setContent(selectTabContent[0]);
    }
  }, [selectedTab]);

  console.log(content);

  return (
    <main>
      {/* <p>Status: {isConnected ? "connected" : "disconnected"}</p> */}
      <div className="max-w-5xl mx-auto px-10 py-14 box-border">
        <section className="relative">
          {info && (
            <>
              <h2
                className="lg:w-9/12 text-3xl font-bold pb-3 flex items-center
       xs-max:text-2xl"
              >
                {info.title ? info.title : "제목없음"}
                <span
                  className={`ml-2  text-xs

              rounded-full px-3 py-1 ${
                info.visibilityStatus === "Public"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-red-100 text-red-500"
              }`}
                >
                  {info.visibilityStatus}
                </span>
              </h2>
              <article className="xs-max:text-sm mb-20">
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
                  {formatingDate(info.startDate)} ~{" "}
                  {formatingDate(info.endDate)}
                </p>
                {/* <p className="pb-2">
                  <span>총 예산: </span>
                  {`${info.budget}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                </p> */}
                <p></p>
                {/* <div className="flex items-center space-x-2 pb-2">
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
                </div> */}
                <div className="">
                  <span className="">대표이미지</span>
                  <Image
                    src={info.thumbnail || thumbnail}
                    width={300}
                    height={300}
                    alt={info.thumbnail}
                    className="mx-auto lg:mx-0"
                    style={{ width: "auto", height: "auto" }}
                    priority={true} // 우선 로드 설정
                  />
                </div>
              </article>
              <div>
                <ul className="flex border-b overflow-x-auto max-w-full border-gray-400">
                  {tabList.map((value: any) => (
                    <li
                      key={value.id}
                      className={`box-border flex-1 ${
                        selectedTab === value.id
                          ? "border border-b-0 border-gray-400 rounded-tr-sm rounded-tl-sm"
                          : ""
                      }`}
                    >
                      <button
                        className="text-sm block w-full p-2 text-center whitespace-nowrap"
                        type="button"
                        onClick={() => setSelectedTab(value.id)}
                      >
                        {value.tabName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <article className="preview mb-8 xs-max:text-sm mx-auto border-solid border-b py-8">
                {/* <MarkdownRender markdown={info.content} /> */}
                <div className="mb-10 border-b pb-8">
                  <p className="mb-2">
                    예산: {content.budget ? content.budget : 0}원
                  </p>
                  <p>숙소: {content.lodging ? content.lodging : "없음"}</p>
                </div>

                {process && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(String(content.markdown)),
                    }}
                  />
                )}
              </article>
              {params === "my" ? (
                <div className="lg:absolute lg:top-0 lg:right-0 flex justify-end">
                  <button
                    onClick={editPost}
                    className="lg:px-0 lg:py-3 lg:mr-6

         lg:rounded-none lg:bg-transparent lg:text-black
         px-8 py-3 mr-3 rounded bg-blue-500 text-white
         flex items-center text-sm"
                  >
                    <Image
                      src={editButton}
                      width={21}
                      height={21}
                      alt="edit"
                      className="mr-1 hidden lg:block"
                    />
                    수정하기
                  </button>
                  <button
                    onClick={deletePost}
                    className="lg:px-0 lg:py-3 lg:mr-0
           lg:rounded-none lg:bg-transparent lg:text-black
           px-8 py-3 rounded bg-zinc-400 text-white
          flex items-center text-sm"
                  >
                    <Image
                      src={deleteButton}
                      width={20}
                      height={20}
                      alt="delete"
                      className="mr-1 hidden lg:block"
                    />
                    삭제하기
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
