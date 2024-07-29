"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProfileImg from "@/components/ProfileImg";
import useStore from "@/store/store";
import { apiClient } from "@/service/interceptor";

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
  const postUrl = "http://localhost:9502/api/post/my-post";
  const myProfileUrl = "http://localhost:9502/api/user/profile";
  const access = useStore((state) => state.accessToken);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setPlanId = useStore((state) => state.setPlanId);
  const [plans, setPlans] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);

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

  useEffect(() => {
    async function getMyPlans() {
      // 서버 컴포넌트에서 패치를 실행한다면 패치된 url을 캐싱시켜준다.
      // 하지만 최신 데이터가 필요한 순간들이 있기 때문에 그 부분은 따로 공부하자.
      // 캐싱이나, revalidation
      const headers = {
        "Content-Type": "application/json",
      };
      const options = { cache: "no-store" };
      const json = await apiClient.get(`/api/post/my-post`, options, headers);
      setPlans(json.data.data);
      if (json.accessToken !== "null") {
        setAccessToken(json.accessToken);
      }
    }
    async function myProfile() {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {};
      const json = await apiClient.get(`/api/user/profile`, options, headers);
      setImgUrl(json.data.data.imageUrl);
      setProfile(json.data.data);
      if (json.accessToken !== "null") {
        setAccessToken(json.accessToken);
      }
    }
    getMyPlans();
    myProfile();
  }, []);

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
    const options = {};
    const json = await apiClient.patch(`/api/user/profile`, options, headers);
    setImgUrl(json.data.data.imageUrl);
    setProfile(json.data.data);
    setIsEdit(false);
    if (json.accessToken !== "null") {
      setAccessToken(json.accessToken);
    }
  };

  return (
    <main>
      <section className="page-section">
        <article
          className="flex flex-row justify-between items-center 
        sm:px-0 md:px-24 lg:px-44 pt-5"
        >
          <div className="flex flex-1 mr-10">
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
              <section className="ml-4 mt-3 flex-1">
                <p className="py-1 px-2 w-full">{profile && profile.email}</p>
                <p className="py-1 px-2 w-full">
                  {profile && profile.nickname}
                </p>
              </section>
            )}
          </div>
          <button
            className={`${
              isEdit
                ? "bg-blue-700 text-white rounded-md block w-40 py-2"
                : "bg-gray-900 text-white rounded-md block w-40 py-2"
            }`}
            onClick={() => {
              isEdit ? updateUserProfile() : setIsEdit(true);
            }}
          >
            {isEdit ? "SAVE" : "EDIT"}
          </button>
        </article>
        <article className="w-full flex flex-row text-center border-y mt-5 text-sm">
          <section
            className="flex-1 py-3 hover:bg-gray-100 cursor-pointer after:content-['|']
          after:text-border-color relative after:absolute after:-right-0.5 after:top-2.5"
          >
            <h2>나의 여행 계획서</h2>
          </section>
          <section className="flex-1 py-3 hover:bg-gray-100 cursor-pointer">
            <h2>나의 여행 리뷰</h2>
          </section>
        </article>
        <div>
          <ul>
            {plans.map((value: any) => (
              <li key={value.id}>
                <Link
                  href={`travel/plans/detail/${value.id}`}
                  onClick={() => setPlanId(value.id)}
                >
                  {value.id}
                </Link>
                {""}
                <Link
                  href={`travel/plans/edit/${value.id}`}
                  style={{ marginLeft: "100px" }}
                  onClick={() => setPlanId(value.id)}
                >
                  {value.id} edit
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
