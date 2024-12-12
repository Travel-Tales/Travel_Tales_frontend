"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { apiClient } from "@/service/interceptor";
import loadingStore from "@/store/loadingStore";

interface DefaultPlanData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  visibilityStatus: string;
}

interface DefaultReviewData {
  postId: number;
  title: string;
  content: string;
  thumbnail: string;
}

type Page = { page: string };

export default function CreatePostButton({ page }: Page) {
  const access = useStore((state) => state.accessToken);
  const setPlanId = useStore((state) => state.setPlanId);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setIsLoading = loadingStore((state) => state.setIsLoading);

  const [buttonText, setButtonText] = useState({
    style1: "",
    style2: "",
    text: "",
    clickFunc: () => {},
  });

  let planId: number;
  let reviewId: number;

  const defaultPlanData = {
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: "1",
    thumbnail: "",
    startDate: new Date(),
    endDate: new Date(),
    visibilityStatus: "Public",
  };

  const defaultReviewData = {
    postId: 0,
    title: "",
    content: "",
    thumbnail: "",
  };

  const createPost = async (
    defaultData: DefaultReviewData | DefaultPlanData
  ) => {
    setIsLoading(true);
    let apiPath = "";
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = { body: JSON.stringify(defaultData) };
      if (page === "main" || page === "plan") {
        apiPath = "/api/post";
      } else if (page === "review") {
        apiPath = "/api/review";
      }
      const { data, accessToken } = await apiClient.post(
        apiPath,
        options,
        headers
      );
      if (page === "main" || page === "plan") {
        setPlanId(data.data.id);
        planId = data.data.id;
      } else if (page === "review") {
        setPlanId(data.data.id);
        reviewId = data.data.id;
      }
      if (accessToken !== "null") {
        setAccessToken(accessToken);
      }

      return { error: null, statusExpressText: "success" };
    } catch (error) {
      if (error) {
        setIsLoading(false);
        return { error, statusExpressText: "fail" };
      } else {
        setIsLoading(false);
        return { error, statusExpressText: "fail" };
      }
    }
  };

  const router = useRouter();

  const createPlanPost = async () => {
    const { error, statusExpressText } = await createPost(defaultPlanData);
    if (statusExpressText === "success" && planId) {
      router.push(`/travel/plans/edit/${planId}`);
      setIsLoading(false);
    } else {
      if (error instanceof Response) {
        if (error.status === 401) {
          alert("로그인이 필요한 서비스 입니다.");
          setIsLoading(false);
        } else {
          alert(`${error.status}에러:${error.statusText}`);
          setIsLoading(false);
        }
      }
    }
  };

  const createReviewPost = async () => {
    const { error, statusExpressText } = await createPost(defaultReviewData);
    if (statusExpressText === "success" && reviewId) {
      router.push(`/travel/reviews/edit/${reviewId}`);
      setIsLoading(false);
    } else {
      if (error instanceof Response) {
        if (error.status === 401) {
          alert("로그인이 필요한 서비스 입니다.");
          setIsLoading(false);
        } else {
          alert(`${error.status}에러:${error.statusText}`);
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (page === "main") {
      setButtonText({
        style1: "justify-center",
        style2: "custom-button",
        text: "새로운 여행 계획 작성하기",
        clickFunc: createPlanPost,
      });
    } else if (page === "plan") {
      setButtonText({
        style1: "justify-end mb-4",
        style2: "custom-button2",
        text: "게시물 작성",
        clickFunc: createPlanPost,
      });
    } else if (page === "review") {
      setButtonText({
        style1: "justify-end mb-4",
        style2: "custom-button2",
        text: "게시물 작성",
        clickFunc: createReviewPost,
      });
    }
  }, []);

  return (
    // <div
    //   className={`flex ${
    //     page === "main" ? "justify-center" : "justify-end mb-4"
    //   }`}
    // >
    //   <button
    //     onClick={createPlanPost}
    //     className={`${
    //       page === "main" ? "custom-button" : "custom-button2"
    //     } xs:text-xs`}
    //   >
    //     {page === "main" ? "새로운 여행 계획 작성하기" : "게시물 작성"}
    //   </button>
    // </div>
    <div className={`flex ${buttonText.style1}`}>
      <button
        onClick={buttonText.clickFunc}
        className={`${buttonText.style2} xs:text-xs`}
      >
        {buttonText.text}
      </button>
    </div>
  );
}
