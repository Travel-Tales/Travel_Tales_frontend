"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import io, { Socket } from "socket.io-client";
import useStore from "@/store/store";
import LocalStorage from "@/service/localstorage";
import thumbnail from "/public/main-banner.jpg";
import deleteButton from "/public/delete.png";
import editButton from "/public/edit.png";
import { apiClient } from "@/service/interceptor";
import { useRouter } from "next/navigation";
import MarkdownRender from "@/components/MarkdownRender";

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
  const setAccessToken = useStore((state) => state.setAccessToken);

  const router = useRouter();

  useEffect(() => {
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
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
      setInfo(post[0]);
    });

    // return () => {
    //   socketInstance.emit("leaveRoom", { postId: id });
    //   socketInstance.off("connect", () => {
    //     setIsConnected(false);
    //   });
    // };
  }, []);

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
    alert("삭제하시겠습니까?");
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
  };

  const editPost = async () => {
    router.push(`/travel/plans/edit/${id}`);
  };

  return (
    <main>
      {/* <p>Status: {isConnected ? "connected" : "disconnected"}</p> */}
      <section className="page-section py-14">
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
            <article className="xs-max:text-sm">
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
                {`${info.budget}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
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
                <span className="">대표이미지</span>
                <Image
                  src={info.thumbnail || thumbnail}
                  width={300}
                  height={300}
                  alt={info.thumbnail}
                  className="mx-auto lg:mx-0"
                />
              </div>
            </article>
            <article className="preview text-center my-8 xs-max:text-sm mx-auto border-solid border-y py-8">
              <MarkdownRender markdown={info.content} />
            </article>
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
          </>
        )}
      </section>
    </main>
  );
}

// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import Image from "next/image";
// import io, { Socket } from "socket.io-client";
// import useStore from "@/store/store";
// import LocalStorage from "@/service/localstorage";
// import thumbnail from "/public/main-banner.jpg";
// import deleteButton from "/public/delete.png";
// import editButton from "/public/edit.png";
// import { apiClient } from "@/service/interceptor";
// import { useRouter } from "next/navigation";

// interface Info {
//   budget: number;
//   content: string;
//   createdAt: string;
//   endDate: string;
//   id: number;
//   startDate: string;
//   thumbnail: string;
//   title: string;
//   travelArea: string;
//   travelerCount: number;
//   updatedAt: string;
//   visibilityStatus: string;
// }

// export default function TravelPlansDetailPage({
//   params: { id },
// }: {
//   params: { id: number };
// }) {
//   // const info = await getDetailInfo();
//   const [info, setInfo] = useState<Info | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   // const [transport, setTransport] = useState("N/A");
//   const [socket, setSocket] = useState<any | null>(null);
//   const access = LocalStorage.getItem("accessToken");
//   const setAccessToken = useStore((state) => state.setAccessToken);

//   const router = useRouter();

//   return (
//     <main>
//       {/* <p>Status: {isConnected ? "connected" : "disconnected"}</p> */}
//       <section className="page-section py-14">
//         <h2
//           className="lg:w-9/12 text-3xl font-bold pb-3 flex items-center
//         xs-max:text-2xl"
//         >
//           {"제목없음"}
//           <span
//             className={`ml-2 text-xs
//               rounded-full px-3 py-1 ${"bg-red-100 text-red-500"}`}
//           >
//             Private
//           </span>
//         </h2>
//         <article className="xs-max:text-sm">
//           <p className="pb-2">
//             <span>지역: </span>
//             {"지역없음"}
//           </p>
//           <p className="pb-2">
//             <span>인원: </span>
//             {2}명
//           </p>
//           <p className="pb-2">
//             <span>날짜: </span>
//             {"2020.02.04"} ~ {"2020.02.04"}
//           </p>
//           <p className="pb-2">
//             <span>총 예산: </span>
//             {"323,000"}원
//           </p>
//           <p></p>
//           <div className="flex items-center space-x-2 pb-2">
//             <span className="">키워드:</span>
//             <div className="flex space-x-2">
//               <span
//                 className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
//                 aria-label="당진 해시태그"
//               >
//                 #당진
//               </span>
//               <span
//                 className="bg-blue-100 text-xs text-blue-500 rounded-full px-3 py-1"
//                 aria-label="당일치기 해시태그"
//               >
//                 #당일치기
//               </span>
//             </div>
//           </div>
//           <div className="mt-10">
//             <Image
//               src={thumbnail}
//               width={400}
//               height={400}
//               alt=""
//               className="mx-auto lg:mx-0"
//             />
//           </div>
//         </article>
//         <article className="text-center mt-8 lg:text-left xs-max:text-sm">
//           {"우리들의 행복한 여행 "} Lorem ipsum dolor, sit amet consectetur
//           adipisicing elit. Nemo, eius itaque cum repellat voluptatibus ducimus?
//           Quaerat nostrum, nulla saepe facilis quae at in repellat aliquid,
//           commodi nesciunt unde tempore neque.Lorem ipsum dolor, sit amet
//           consectetur adipisicing elit. Nemo, eius itaque cum repellat
//           voluptatibus ducimus? Quaerat nostrum, nulla saepe facilis quae at in
//           repellat aliquid, commodi nesciunt unde tempore neque.
//         </article>
//         <div className="lg:absolute lg:top-20 lg:right-10 flex justify-end mt-10">
//           <button
//             className="lg:px-0 lg:py-3 lg:mr-6
//           lg:rounded-none lg:bg-transparent lg:text-black
//             px-8 py-3 mr-3 rounded bg-blue-500 text-white
//             flex items-center text-sm"
//           >
//             <Image
//               src={editButton}
//               width={21}
//               height={21}
//               alt="edit"
//               className="mr-1 hidden lg:block"
//             />
//             수정하기
//           </button>
//           <button
//             className="lg:px-0 lg:py-3 lg:mr-0
//             lg:rounded-none lg:bg-transparent lg:text-black
//             px-8 py-3 rounded bg-zinc-400 text-white
//            flex items-center text-sm"
//           >
//             <Image
//               src={deleteButton}
//               width={20}
//               height={20}
//               alt="delete"
//               className="mr-1 hidden lg:block"
//             />
//             삭제하기
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }
