"use client";

import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import noImg from "./../../../../../../public/no-img.jpg";

import useStore from "@/store/store";
import { apiClient } from "@/service/interceptor";
import ReactQuill from "react-quill";
import QuillNoSSRWrapper from "@/components/quillMarkdown";

interface DefaultData {
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  startDate: Date;
  endDate: Date;
  imageUrl: string[];
  thumbnail: string;
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
    imageUrl: [],
    thumbnail: "",
    visibilityStatus: "Public",
  });
  const [markdown, setMarkdown] = useState<string>("");
  const [fileObj, setFileObj] = useState<File | null>(null);

  const imageRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setAccessToken = useStore((state) => state.setAccessToken);
  const quillInstance = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const locationList = [
    { id: 1, location: "전체" },
    { id: 2, location: "국내" },
    { id: 3, location: "동남아" },
    { id: 4, location: "일본" },
    { id: 5, location: "중국" },
    { id: 6, location: "유럽" },
    { id: 7, location: "미주" },
    { id: 8, location: "대양주" },
    { id: 9, location: "중동" },
    { id: 10, location: "중남미" },
    { id: 11, location: "아프리카" },
  ];

  const markdownImageExtraction = (content: string) => {
    if (content) {
      let str = content;

      let matchUrlArray: string[] = [];

      //* 정규식을 통해 공통 패턴의 문자열 추출
      // const regex =
      //   /https:\/\/traveltales\.s3\.ap-northeast-2\.amazonaws\.com\/images\/[^\s]+?.jpeg/g;
      const regex =
        /https:\/\/traveltales\.s3\.ap-northeast-2\.amazonaws\.com\/images\/[^\s]+?\.(jpeg|jpg|png|webp|gif)/g;

      //* 해당 패턴을 모두 찾기
      const matches = str.match(regex);
      if (matches) {
        matches.forEach((match) => {
          matchUrlArray = [...matchUrlArray, match];
        });
        return matchUrlArray;
      } else {
        console.log("No matches found");
      }
    }
  };

  const saveChanges = async () => {
    const matchUrlArray = markdownImageExtraction(markdown);
    const body = {
      title: data.title,
      content: markdown,
      travelArea: data.travelArea,
      travelerCount: Number(data.travelerCount),
      budget: data.budget.replace(/,/g, ""),
      thumbnailFile: data.thumbnail,
      imageUrl: JSON.stringify(matchUrlArray) || JSON.stringify([]),
      startDate: data.startDate,
      endDate: data.endDate,
      visibilityStatus: data.visibilityStatus,
    };

    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (typeof value === "number" || value instanceof Date) {
        formData.append(key, value.toString());
      } else if (key === "thumbnailFile") {
        fileObj && formData.append(key, fileObj);
        //* !fileObj && formData.append(key, "");
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
        thumbnail: fetchedData.thumbnail || "",
        imageUrl: fetchedData.imageUrl || "",
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

  const hanedleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //: 이미지를 교체했을 때
    const files = e.target.files;
    if (files && files.length > 0) {
      //: 파일 정보를 받아서 obj 와 url을 저장
      const file = files[0];
      setFileObj(file);
      const objectURL = URL.createObjectURL(file);
      setData({ ...data, thumbnail: objectURL });
    }
  };

  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const formattedValue = formatNumberWithCommas(value);
    setData({ ...data, budget: formattedValue });
  };

  const formatNumberWithCommas = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const uploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // file input을 프로그래밍적으로 클릭
    }
  };

  const handleFileChange = async (e: { target: { files: any } }) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("imageFile", file);
      const headers = {};
      const options = {
        body: formData,
      };
      try {
        const { data } = await apiClient.post(
          `/api/post/upload-image/${id}`,
          options,
          headers
        );
        const fetchData = data;
        console.log(fetchData);
        const IMG_URL = fetchData.data;

        if (quillInstance.current) {
          const editor = quillInstance.current.getEditor(); // 에디터 객체 가져오기

          const range = editor.getSelection();
          if (range) {
            editor.insertEmbed(range.index, "image", IMG_URL);

            // editor.container.querySelectorAll("img").forEach((img) => {
            //   if (img.src === IMG_URL) {
            //     img.style.maxWidth = "400px"; // 최대 너비 설정
            //     img.style.width = "auto";
            //   }
            // });

            const imgElement = editor.root.querySelector(
              `img[src="${IMG_URL}"]`
            );

            if (imgElement) {
              imgElement.setAttribute("alt", `${id}게시물${range.index}`);
            }
          }
        }
      } catch (error) {
        console.log("이미지 업로드 실패", error);
      }
    }
  };

  const deleteThumbnail = () => {
    setData({ ...data, thumbnail: "" });
    setFileObj(null);
  };

  const selectOption = (e: any) => {
    setData({ ...data, travelArea: e.target.value });
  };

  useEffect(() => {
    const quill = document.querySelector(".ql-container");

    if (quill) {
      // DOMNodeInserted 리스너 제거
      quill.removeEventListener("DOMNodeInserted", () => {});
    }

    return () => {
      if (quill) {
        quill.removeEventListener("DOMNodeInserted", () => {});
      }
    };
  }, []);

  const colors = [
    "transparent",
    "white",
    "red",
    "yellow",
    "green",
    "blue",
    "purple",
    "gray",
    "black",
  ];

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "color",
    "image",
    "align",
  ];

  // // 이미지 처리를 하는 핸들러
  // const imageHandler = () => {
  //   console.log("에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!");

  //   // 1. 이미지를 저장할 input type=file DOM을 만든다.
  //   const input = document.createElement("input");
  //   // 속성 써주기
  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
  //   // input이 클릭되면 파일 선택창이 나타난다.

  //   // input에 변화가 생긴다면 = 이미지를 선택
  //   input.addEventListener("change", async () => {
  //     console.log("온체인지");
  //     if (input.files && input.files.length > 0) {
  //       const file = input.files[0];
  //       // multer에 맞는 형식으로 데이터 만들어준다.
  //       const formData = new FormData();
  //       formData.append("imageFile", file); // formData는 키-밸류 구조
  //       const headers = {};
  //       const options = {
  //         body: formData,
  //       };
  //       // 백엔드 multer라우터에 이미지를 보낸다.
  //       try {
  //         const { data } = await apiClient.post(
  //           `/api/post/upload-image/${id}`,
  //           options,
  //           headers
  //         );
  //         const fetchData = data;

  //         console.log("성공 시, 백엔드가 보내주는 데이터", fetchData.data);
  //         const IMG_URL = fetchData.data;
  //         // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
  //         // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
  //         // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

  //         // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
  //         if (quillInstance.current) {
  //           const editor = quillInstance.current.getEditor(); // 에디터 객체 가져오기
  //           // 1. 에디터 root의 innerHTML을 수정해주기
  //           // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
  //           // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
  //           // editor.root.innerHTML =
  //           //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

  //           // 2. 현재 에디터 커서 위치값을 가져온다
  //           const range = editor.getSelection();
  //           // 가져온 위치에 이미지를 삽입한다
  //           if (range) {
  //             editor.insertEmbed(range.index, "image", IMG_URL);
  //           }
  //         }
  //       } catch (error) {
  //         console.log("실패했어요ㅠ");
  //       }
  //     }
  //   });
  // };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ align: ["right", "center", "justify"] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: colors }],
          ["image"],
        ],
        handlers: {
          image: uploadImage,
        },
      },
    }),
    []
  );

  //! 여행 지역 input select 로 변경해야 한다. (지역을 선택할 수 있도록)

  return (
    <main>
      <section className="w-3/4 my-10 mx-auto xs-max:text-sm">
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
          <div className="flex flex-col mb-2 xs-max:w-full">
            {/* <label htmlFor="location">여행 지역</label>
            <input
              type="text"
              id="location"
              value={data.travelArea}
              onChange={(e) => setData({ ...data, travelArea: e.target.value })}
              required
              className="input-border py-1 px-3"
            /> */}
            <label htmlFor="lang">여행 지역</label>
            <select
              name="location"
              id="lo"
              className="input-border py-1 px-3 s:max-w-52 w-full"
              onChange={selectOption}
            >
              {locationList.map((value) => (
                <option key={value.id} value={value.location}>
                  {value.location}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row flex-wrap justify-start items-center">
            <div className="flex flex-col mb-2 s:mr-6 s:max-w-52 w-full">
              <label htmlFor="members">여행 인원</label>
              <input
                type="number"
                id="members"
                value={data.travelerCount.toString()}
                required
                onChange={(e) =>
                  setData({ ...data, travelerCount: +e.target.value })
                }
                min={1}
                className="input-border py-1 px-3"
              />
            </div>
            <div className="flex flex-col mb-2 s:max-w-52 w-full">
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
              <div className="s:flex s:flex-row items-center mb-2">
                <p className="mr-2 xs-max:mb-1">여행 시작일: </p>
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
              <div className="s:flex s:flex-row items-center">
                <p className="mr-2 xs-max:mb-1">여행 종료일: </p>
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
          <div>
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
            <div className="max-w-xs relative w-80 h-60">
              {/* 320px 고정 */}
              <Image
                src={data.thumbnail || noImg}
                alt="대표사진 미리보기"
                fill
                priority={true}
                className="object-contain" // 비율 유지하며 잘라내기
                sizes="320px" // 고정 너비
              />
            </div>
          </div>
          <>
            <QuillNoSSRWrapper
              forwardedRef={quillInstance}
              value={markdown}
              onChange={setMarkdown}
              modules={modules}
              theme="snow"
              placeholder="내용을 입력해주세요."
              formats={formats}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-blue-500 px-6 py-1
             text-white rounded-md mt-3"
              onClick={saveChanges}
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
