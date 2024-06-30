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
import testImg from "../../../../../public/camera_icon.svg";
import noImg from "../../../../../public/no-img.jpg";
import MarkdownEditor from "@/components/MarkdownEditor";
import Toolbar from "@/components/Toolbar";

export default function TravelPlanCreatePage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [members, setMembers] = useState("");
  const [budget, setBudget] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const imageRef = useRef(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [fileObj, setFileObj] = useState<File | null>(null);

  const [markdown, setMarkdown] = useState("# Header");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      console.error("Textarea element not found");
    }
  }, []);

  const hanedleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //: 이미지를 교체했을 때
    const files = e.target.files;
    if (files && files.length > 0) {
      //: 파일 정보를 받아서 obj 와 url을 저장
      const file = files[0];
      setFileObj(file);
      const objectURL = URL.createObjectURL(file);
      setImgUrl(objectURL);
    }
  };

  const handleChange = (event: any) => {
    setMarkdown(event.target.value);
  };

  return (
    <main>
      <section className="w-3/4 my-10 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="toggle-switch mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <span>공개 여부</span>
              <input role="switch" type="checkbox" />
            </label>
          </div>
          <div className="mb-2 flex flex-col ">
            <label htmlFor="title">계획 제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-border"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="location">여행 지역</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input-border"
            />
          </div>
          <div className="flex flex-row justify-start items-center">
            <div className="flex flex-col mb-2 mr-6">
              <label htmlFor="members">여행 인원</label>
              <input
                type="number"
                id="members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                required
                className="input-border"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="budget">여행 예산</label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="input-border"
              />
            </div>
          </div>

          <div className="flex flex-col my-6 border-y py-6">
            {startDate && endDate && (
              <div className="flex flex-row items-center mb-2">
                <p className="mr-2">여행 시작일: </p>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="input-border px-2 py-1"
                />
              </div>
            )}
            {startDate && endDate && (
              <div className="flex flex-row items-center">
                <p className="mr-2">여행 종료일: </p>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="input-border px-2 py-1"
                />
              </div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="file_upload" className="block mb-2">
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
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:border-0 file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100 mt-2"
              />
            </label>
            <Image
              src={imgUrl ? imgUrl : noImg}
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
              onImage={() => insertAtCursor("![alt text](url)")}
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-300 px-6 py-1
             text-white rounded-md mt-3"
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
