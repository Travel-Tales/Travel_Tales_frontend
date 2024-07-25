"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProfileImg from "@/components/ProfileImg";
import useStore from "@/store/store";

export interface Profile {
  id: number;
  nickname: string;
  email: string;
  loginType: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
  email: string;
  nickname: string;
}

export default function Mypage() {
  const postUrl = "http://localhost:9502/api/post/my-post";
  const myProfileUrl = "http://localhost:9502/api/user/profile";
  const access = useStore((state) => state.accessToken);
  const setPlanId = useStore((state) => state.setPlanId);

  const [plans, setPlans] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    nickname: "",
  });

  useEffect(() => {
    async function getMyPlans() {
      // 서버 컴포넌트에서 패치를 실행한다면 패치된 url을 캐싱시켜준다.
      // 하지만 최신 데이터가 필요한 순간들이 있기 때문에 그 부분은 따로 공부하자.
      // 캐싱이나, revalidation

      const response = await fetch(postUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        cache: "no-store",
      });
      const json = await response.json();
      setPlans(json.data);
    }
    async function myProfile() {
      const response = await fetch(myProfileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      const json = await response.json();
      setImgUrl(json.data.imageUrl);
      setUserInfo({ email: json.data.email, nickname: json.data.nickname });
      setProfile(json.data);
    }
    getMyPlans();
    myProfile();
  }, []);

  const updateUserProfile = (key: string, value: string) => {
    setUserInfo({ ...userInfo, [key]: value });
  };

  const UserProfileInput: React.FC<{ keyName: keyof UserInfo }> = ({
    keyName,
  }) => {
    return (
      <input
        value={userInfo[keyName]}
        onChange={(e) => {
          updateUserProfile(keyName, e.target.value);
        }}
        autoFocus={isEdit && keyName === "email"}
        className="block py-1 px-2 w-full"
      />
    );
  };

  return (
    <main>
      <section className="page-section">
        <article
          className="flex flex-row justify-between items-center 
        sm:px-0 md:px-24 lg:px-44 pt-5"
        >
          <div className="flex flex-1 mr-10">
            <ProfileImg imgUrl={imgUrl} setImgUrl={setImgUrl} />
            {isEdit ? (
              <section className="ml-4 mt-5 flex-1">
                <UserProfileInput keyName="email" />
                <UserProfileInput keyName="nickname" />
              </section>
            ) : (
              <section className="ml-4 mt-5 flex-1">
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
            onClick={() => setIsEdit(isEdit ? false : true)}
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
