"use client";

import React, {
  useState,
  ChangeEvent,
  useRef,
  useCallback,
  useEffect,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import testImg from "/public/camera_icon.svg";
import noImg from "/public/no-img.jpg";
import MarkdownEditor from "@/components/MarkdownEditor";
import Toolbar from "@/components/Toolbar";
import useStore from "store/store";
import { apiClient } from "service/interceptor";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  startDate: Date;
  endDate: Date;
  imageUrls: string[];
  thumbnailFile: string;
  visibilityStatus: string;
}

export default function TravelPlanCreatePage({
  params: { id },
}: {
  params: { id: number };
}) {
  const [data, setData] = useState<DefaultData>({
    title: "",
    content: "",
    travelArea: "",
    travelerCount: 1,
    budget: "0",
    startDate: new Date(),
    endDate: new Date(),
    imageUrls: [],
    thumbnailFile: "",
    visibilityStatus: "Public",
  });
  const [markdown, setMarkdown] = useState<string>("# Header");

  // const [fileObj, setFileObj] = useState<File | null>(null);
  const imageRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const planId = useStore((state) => state.planId);
  const access = useStore((state) => state.accessToken);
  const setAccessToken = useStore((state) => state.setAccessToken);

  const saveChanges = async () => {
    const body = {
      title: data.title,
      content: markdown,
      travelArea: data.travelArea,
      travelerCount: Number(data.travelerCount),
      budget: Number(data.budget.replace(/,/g, "")),
      thumbnailFile: data.thumbnailFile,
      imageUrls: JSON.stringify(data.imageUrls),
      startDate: data.startDate,
      endDate: data.endDate,
      visibilityStatus: data.visibilityStatus,
    };

    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (typeof value === "number" || value instanceof Date) {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (id) {
        const headers = {};
        const options = {
          body: formData,
        };
        const { data, accessToken } = await apiClient.patch(
          `/api/post/${id}`,
          options,
          headers
        );
        if (data.success) {
          alert("저장되었습니다.");
        }
        if (accessToken !== "null") {
          setAccessToken(accessToken);
        }
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  useEffect(() => {
    const handleSaveShortcut = (e: {
      ctrlKey: any;
      metaKey: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveChanges();
      }
    };

    window.addEventListener("keydown", handleSaveShortcut);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [id, data, markdown]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      console.error("Textarea element not found");
    }
  }, []);

  useEffect(() => {
    const getPostInfo = async () => {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {};
      const { data, accessToken } = await apiClient.get(
        `/api/post/${id}`,
        options,
        headers
      );
      const fetchedData = data.data[0];

      setData({
        ...fetchedData,
        thumbnailFile: fetchedData.thumbnailFile || "",
        imageUrls: fetchedData.imageUrls || "",
        content: fetchedData.content || "",
        title: fetchedData.title || "",
        travelArea: fetchedData.travelArea || "",
        travelerCount: fetchedData.travelerCount || 1,
        budget: fetchedData.budget
          ? formatNumberWithCommas(`${fetchedData.budget}`)
          : "1",
        startDate: fetchedData.startDate
          ? new Date(fetchedData.startDate)
          : new Date(),
        endDate: fetchedData.endDate
          ? new Date(fetchedData.endDate)
          : new Date(),
        visibilityStatus: fetchedData.visibilityStatus || "Public",
      });
      if (fetchedData.content) {
        setMarkdown(fetchedData.content);
      }
      if (accessToken !== "null") {
        setAccessToken(accessToken);
      }
    };
    getPostInfo();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (markdown) {
      const length = markdown.length;
      textareaRef.current.setSelectionRange(length, length);
    }
    // 포커스 주기
    textareaRef.current.focus();

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    setMarkdown(
      (prev) =>
        prev.substring(0, startPos) + text + prev.substring(endPos, prev.length)
    );
  };

  const hanedleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //: 이미지를 교체했을 때
    const files = e.target.files;
    if (files && files.length > 0) {
      //: 파일 정보를 받아서 obj 와 url을 저장
      const file = files[0];
      const objectURL = URL.createObjectURL(file);
      setData({ ...data, thumbnailFile: objectURL });
    }
  };

  const handleChange = (event: any) => {
    setMarkdown(event.target.value);
  };

  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const formattedValue = formatNumberWithCommas(value);
    setData({ ...data, budget: formattedValue });
  };

  const formatNumberWithCommas = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      //: 파일 정보를 받아서 obj 와 url을 저장
      const file = files[0];
      // const objectURL = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("imageFile", file);

      const headers = {};
      const options = {
        body: formData,
      };
      const { data } = await apiClient.post(
        `/api/post/upload-image`,
        options,
        headers
      );
      const fetchData = data;
      // setData({ ...data, imageUrls: [...data.imageUrls, fetchData.data] });

      const markdownImg = `![](${fetchData.data})`;
      insertAtCursor(markdownImg);
    }
  };

  return (
    <main>
      <section className="w-3/4 my-10 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="toggle-switch mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <span>공개 여부</span>
              <input
                role="switch"
                type="checkbox"
                checked={data.visibilityStatus === "Public" ? false : true}
                onChange={() => {
                  setData({
                    ...data,
                    visibilityStatus:
                      data.visibilityStatus === "Public" ? "Private" : "Public",
                  });
                }}
              />
            </label>
          </div>
          <div className="mb-2 flex flex-col ">
            <label htmlFor="title">계획 제목</label>
            <input
              type="text"
              id="title"
              value={data.title}
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
              }}
              // required
              className="input-border py-1 px-3"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="location">여행 지역</label>
            <input
              type="text"
              id="location"
              value={data.travelArea}
              onChange={(e) => setData({ ...data, travelArea: e.target.value })}
              required
              className="input-border py-1 px-3"
            />
          </div>
          <div className="flex flex-row flex-wrap: wrap justify-start items-center">
            <div className="flex flex-col mb-2 mr-6">
              <label htmlFor="members">여행 인원</label>
              <input
                type="number"
                id="members"
                value={data.travelerCount}
                onChange={(e) =>
                  setData({ ...data, travelerCount: +e.target.value })
                }
                required
                className="input-border py-1 px-3"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="budget">여행 예산</label>
              <input
                type="text"
                id="budget"
                value={data.budget}
                onChange={handleBudgetChange}
                required
                className="input-border py-1 px-3"
              />
            </div>
          </div>

          <div className="flex flex-col my-6 border-y py-6">
            {data.startDate && data.endDate && (
              <div className="flex flex-row items-center mb-2">
                <p className="mr-2">여행 시작일: </p>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={data.startDate}
                  onChange={(date) =>
                    date && setData({ ...data, startDate: date })
                  }
                  selectsStart
                  startDate={data.startDate}
                  endDate={data.endDate}
                  className="input-border px-2 py-1"
                />
              </div>
            )}
            {data.startDate && data.endDate && (
              <div className="flex flex-row items-center">
                <p className="mr-2">여행 종료일: </p>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={data.endDate}
                  onChange={(date) =>
                    date && setData({ ...data, endDate: date })
                  }
                  selectsEnd
                  startDate={data.startDate}
                  endDate={data.endDate}
                  minDate={data.startDate}
                  className="input-border px-2 py-1"
                />
              </div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="file_upload" className="inline-block mb-2">
              대표사진 선택 (썸네일)
              <input
                id="file_upload"
                onChange={hanedleImgChange}
                ref={imageRef}
                type="file"
                alt="profile-image"
                aria-label="프로필사진교체"
                accept="image/*"
                required
                className="block text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:border-0 file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100 mt-2 w-52"
              />
            </label>
            <Image
              src={data.thumbnailFile ? data.thumbnailFile : noImg}
              alt="대표사진 미리보기"
              width={200}
              height={100}
            />
          </div>
          <>
            <Toolbar
              onBold={() => insertAtCursor("**bold text**")}
              onItalic={() => insertAtCursor("*italic text*")}
              onHeading={() => insertAtCursor("# Heading")}
              onBlockquote={() => insertAtCursor("> Blockquote")}
              onOrderedList={() => insertAtCursor("1. Item")}
              onUnorderedList={() => insertAtCursor("- Item")}
              onLink={() => insertAtCursor("[link](url)")}
              onImage={(e) => uploadImage(e)}
            />
            <div className="preview flex flex-row w-full border">
              <textarea
                ref={textareaRef}
                className="editor min-h-48 w-1/2 border-r p-2"
                value={markdown}
                onChange={handleChange}
                placeholder="계획이나 후기를 작성해주세요!"
              />
              <MarkdownEditor markdown={markdown} />
            </div>
          </>

          {/* <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-300 px-6 py-1
             text-white rounded-md mt-3"
            >
              저장
            </button>
          </div> */}
        </form>
      </section>
    </main>
  );
}
