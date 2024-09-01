"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProfileImg from "@/components/ProfileImg";
import useStore from "@/store/store";
import { apiClient } from "@/service/interceptor";
import Image from "next/image";
import TripCard from "@/components/TripCard";

export interface Profile {
  id: number;
  nickname: string;
  email: string;
  loginType: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function Mypage() {
  const access = useStore((state) => state.accessToken);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setPlanId = useStore((state) => state.setPlanId);
  const [list, setList] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tab, setTab] = useState("나의 여행 계획서");

  //: 파일을 append하기 위한 obj
  const [fileObj, setFileObj] = useState<File | null>(null);
  //: 원본 프로필 전체 저장
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    nickname: "",
    email: "",
    loginType: "",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  });
  //: 클라이언트 이미지 변경을 위한 단순 변환 url 저장
  const [imgUrl, setImgUrl] = useState<string>("");

  const tabList = [
    { id: 0, tabName: "나의 여행 계획서" },
    { id: 1, tabName: "나의 여행 리뷰" },
  ];

  async function getMyPlans() {
    // 서버 컴포넌트에서 패치를 실행한다면 패치된 url을 캐싱시켜준다.
    // 하지만 최신 데이터가 필요한 순간들이 있기 때문에 그 부분은 따로 공부하자.
    // 캐싱이나, revalidation
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {};
    const { data, accessToken } = await apiClient.get(
      `/api/post/my-post`,
      options,
      headers
    );
    setList(data.data);
    if (accessToken !== "null") {
      setAccessToken(accessToken);
    }
  }

  async function myProfile() {
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {};
    const { data, accessToken } = await apiClient.get(
      `/api/user/profile`,
      options,
      headers
    );
    setImgUrl(data.data.imageUrl);
    setProfile(data.data);
    if (accessToken !== "null") {
      setAccessToken(accessToken);
    }
  }

  async function getMyReviews() {
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {};
    const { data, accessToken } = await apiClient.get(
      `/api/post/my-post`,
      options,
      headers
    );
    setList(data.data);
    if (accessToken !== "null") {
      setAccessToken(accessToken);
    }
  }

  useEffect(() => {
    getMyPlans();
    myProfile();
  }, []);

  useEffect(() => {
    if (tab === "나의 여행 계획서") {
      getMyPlans();
    } else {
      getMyReviews();
    }
  }, [tab]);

  const onChangeUserProfile = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const UserProfileInput: React.FC<{ keyName: keyof Profile }> = ({
    keyName,
  }) => {
    return (
      <input
        value={profile[keyName]}
        onChange={(e) => {
          onChangeUserProfile(keyName, e.target.value);
        }}
        autoFocus={isEdit}
        className="block py-1 px-2 w-full"
      />
    );
  };

  const updateUserProfile = async () => {
    //: 가공된 formData를 body로 보냄

    const formData = new FormData();
    if (fileObj) {
      formData.append("file", fileObj);
    }
    formData.append("nickname", profile.nickname);

    const headers = {};
    const options = { body: formData };
    const json = await apiClient.patch(`/api/user/profile`, options, headers);
    setImgUrl(json.data.data.imageUrl);
    setProfile(json.data.data);
    setIsEdit(false);
    if (json.accessToken !== "null") {
      setAccessToken(json.accessToken);
    }
  };

  const handleTabChange = (tabName: string) => {
    setTab(tabName);
  };

  return (
    <main>
      <section className="page-section">
        <article
          className="s:flex s:flex-row s:justify-between s:items-center 
       sm:px-0 md:px-24 lg:px-44 pt-5"
        >
          <div className="xs:block flex flex-1 s:mr-10">
            <ProfileImg
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
              fileObj={fileObj}
              setFileObj={setFileObj}
              isEdit={isEdit}
            />
            {isEdit ? (
              <section className="ml-4 mt-3 flex-1">
                <p className="py-1 px-2 w-full">{profile && profile.email}</p>
                <UserProfileInput keyName="nickname" />
              </section>
            ) : (
              <section className="ml-2 mt-3 sm:ml-4 sm:mt-3 flex-1">
                <p className="text-sm sm:text-base sm:py-1 sm:px-2 w-full">
                  {profile && profile.email}
                </p>
                <p className="text-sm sm:text-base sm:py-1 sm:px-2 w-full">
                  {profile && profile.nickname}
                </p>
              </section>
            )}
          </div>
          <button
            className={`${
              isEdit ? "bg-blue-700" : "bg-gray-900"
            } text-white rounded-md block sm:w-40 sm:py-2 sm:text-base 
           s:w-28 s:py-1.5 s:mt-0 mt-3 text-sm w-full py-1.5`}
            onClick={() => {
              isEdit ? updateUserProfile() : setIsEdit(true);
            }}
          >
            {isEdit ? "SAVE" : "EDIT"}
          </button>
        </article>
        <article className="w-full flex flex-row text-center border-y mt-5 sm:text-sm text-xs">
          {tabList.map((value) => (
            <button
              key={value.id}
              className={`flex-1 py-3 hover:bg-gray-100 cursor-pointer ${
                value.id === 0
                  ? "after:content-['|'] after:text-border-color relative after:absolute after:-right-0.5 after:top-2.5"
                  : ""
              } ${tab === value.tabName ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange(value.tabName)}
            >
              <h2>{value.tabName}</h2>
            </button>
          ))}
        </article>
        <article className="my-5">
          <TripCard list={list} />
        </article>
      </section>
    </main>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import ProfileImg from "@/components/ProfileImg";
// import useStore from "@/store/store";
// import { apiClient } from "@/service/interceptor";
// import Image from "next/image";
// import TripCard from "@/components/TripCard";

// export interface Profile {
//   id: number;
//   nickname: string;
//   email: string;
//   loginType: string;
//   imageUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function Mypage() {
//   const [list, setList] = useState<any>([]);
//   const [isEdit, setIsEdit] = useState(false);
//   const [tab, setTab] = useState("나의 여행 계획서");

//   //: 파일을 append하기 위한 obj
//   const [fileObj, setFileObj] = useState<File | null>(null);
//   //: 원본 프로필 전체 저장
//   const [profile, setProfile] = useState<Profile>({
//     id: 0,
//     nickname: "",
//     email: "",
//     loginType: "",
//     imageUrl: "",
//     createdAt: "",
//     updatedAt: "",
//   });
//   //: 클라이언트 이미지 변경을 위한 단순 변환 url 저장
//   const [imgUrl, setImgUrl] = useState<string>("");

//   const tabList = [
//     { id: 0, tabName: "나의 여행 계획서" },
//     { id: 1, tabName: "나의 여행 리뷰" },
//   ];

//   const UserProfileInput: React.FC<{ keyName: keyof Profile }> = ({
//     keyName,
//   }) => {
//     return (
//       <input
//         value={profile[keyName]}
//         autoFocus={isEdit}
//         className="block py-1 px-2 w-full"
//       />
//     );
//   };

//   return (
//     <main>
//       <section className="page-section">
//         <article
//           className="s:flex s:flex-row s:justify-between s:items-center
//         sm:px-0 md:px-24 lg:px-44 pt-5"
//         >
//           <div className="xs:block flex flex-1 s:mr-10">
//             <ProfileImg />
//             {isEdit ? (
//               <section className="ml-4 mt-3 flex-1">
//                 <p className="py-1 px-2 w-full">wlgus_57@naver.com</p>
//                 <UserProfileInput keyName="nickname" />
//               </section>
//             ) : (
//               <section className="ml-2 mt-3 sm:ml-4 sm:mt-3 flex-1">
//                 <p className="text-sm sm:text-base sm:py-1 sm:px-2 w-full">
//                   wlgus_57@naver.com
//                 </p>
//                 <p className="text-sm sm:text-base sm:py-1 sm:px-2 w-full">
//                   wusiddldlqslek.
//                 </p>
//               </section>
//             )}
//           </div>
//           <button
//             className={`${
//               isEdit ? "bg-blue-700" : "bg-gray-900"
//             } text-white rounded-md block sm:w-40 sm:py-2 sm:text-base
//             s:w-28 s:py-1.5 s:mt-0 mt-3 text-sm w-full py-1.5`}
//           >
//             {isEdit ? "SAVE" : "EDIT"}
//           </button>
//         </article>
//         <article className="w-full flex flex-row text-center border-y mt-5 sm:text-sm text-xs">
//           {tabList.map((value) => (
//             <button
//               key={value.id}
//               className={`flex-1 py-3 hover:bg-gray-100 cursor-pointer ${
//                 value.id === 0
//                   ? "after:content-['|'] after:text-border-color relative after:absolute after:-right-0.5 after:top-2.5"
//                   : ""
//               } ${tab === value.tabName ? "bg-gray-100" : ""}`}
//             >
//               <p>{value.tabName}</p>
//             </button>
//           ))}
//         </article>
//         <article className="my-5">
//           <TripCard list={list} />
//         </article>
//       </section>
//     </main>
//   );
// }
