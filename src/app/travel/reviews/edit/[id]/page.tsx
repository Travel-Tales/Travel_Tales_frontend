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
import { useSearchParams } from "next/navigation";
import reviewStore from "@/store/reviewStore";

interface DefaultData {
  id?: number;
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  startDate: Date;
  endDate: Date;
  thumbnail: string;
  visibilityStatus: string;
}

interface TabContent {
  id: number;
  budget: string;
  lodging: string;
  markdown: string;
}

interface TabList {
  id: number;
  tabName: string;
}

export default function TravelReviewCreatePage({
  params: { id },
}: {
  params: { id: number };
}) {
  const accommodations = [
    "호텔",
    "게스트하우스",
    "펜션",
    "리조트",
    "모텔",
    "캠핑장",
    "민박",
  ];

  // const initialEditer = (id: number) => {
  //   //* 만약 새로 작성하는 게시물이거나 작성된 게시물에 마크다운이 비었다면, 기본적으로 나타나게 될 내용
  //   return `<h1 class="ql-align-justify">
  //   <span style="color: blue;">여행 리뷰 작성${id}</span>
  //   </h1>
  //   <p class="ql-align-justify"><br></p>
  //   <p class="ql-align-justify">자유로운 여행 리뷰를 작성해보세요!</p>
  //   <p class="ql-align-justify"><br></p>
  //   <strong style="color:black;">교통수단 : </strong><span style="color:black;">대중교통/자차</span>
  //   </p>
  //   <p class="ql-align-justify"><br></p>
  //   <p class="ql-align-justify">
  //   <img src="https://traveltales.s3.ap-northeast-2.amazonaws.com/images/e7f82805aeaa91fbc6de073f313a9c78bbad955b6054931de28ca2990c138ede.jpg" alt="예시 사진" style="max-width: 400px; width: auto;">
  //   </p>`;
  // };

  const [data, setData] = useState<DefaultData>({
    id: 0,
    title: "",
    content: "",
    travelArea: "",
    thumbnail: "",
    travelerCount: 1,
    budget: "1",
    visibilityStatus: "Public",
    startDate: new Date(),
    endDate: new Date(),
  });

  const [fileObj, setFileObj] = useState<File | null>(null);
  //* 선택된 탭(클릭한 탭)
  const [selectedTab, setSelectedTab] = useState(1);
  //* 날짜별 탭 리스트
  const [tabList, setTabList] = useState<TabList[] | []>([]);

  const imageRef = useRef(null);
  const quillInstance = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setAccessToken = useStore((state) => state.setAccessToken);
  //* 탭별 콘텐트
  const [tabContent, setTabContent] = useState<TabContent[] | []>([]);
  const selectedTabRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const typeClass = searchParams.get("type");
  const review = reviewStore((state) => state.review);

  //* 게시물 내용 변경하는 함수
  const saveChanges = async () => {
    //* 마크다운에서 이미지 Array 추출해는 함수

    const body = {
      [typeClass === "new" ? "travelPostId" : "postId"]: id,
      title: data.title,
      content: JSON.stringify(tabContent),
      thumbnailFile: data.thumbnail,
    };

    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (key === "thumbnailFile") {
        fileObj && formData.append(key, fileObj);
        //* !fileObj && formData.append(key, "");
      } else {
        formData.append(key, value);
      }
    });

    try {
      const headers = {};
      const options = {
        body: formData,
      };
      if (typeClass !== "new") {
        const { data, accessToken } = await apiClient.patch(
          `/api/review/${id}`,
          options,
          headers
        );
        if (data.success) {
          alert("저장되었습니다.");
        }
        if (accessToken !== "null") {
          setAccessToken(accessToken);
        }
      } else {
        const { data, accessToken } = await apiClient.post(
          `/api/review`,
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
    //* ctrl + s 저장 버튼
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

    //* Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [id, data, tabContent]);

  const formatingReview = (content: any) => {
    const parseContent = JSON.parse(content);
    const markdownReset = parseContent.map((value: any) => {
      return { ...value, markdown: "" };
    });
    setTabContent(markdownReset);
    const tabLength = parseContent.map((value: any) => {
      const date = `${value.id}`;
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      return { id: value.id, tabName: `${year}-${month}-${day}` };
    });
    setTabList(tabLength);
    setSelectedTab(tabLength[0].id);
  };

  useEffect(() => {
    //* 페이지에 처음 들어온 후, 게시물 정보 가져오기
    const getPostInfo = async () => {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {};
      const { data, accessToken } = await apiClient.get(
        `/api/review/${id}`,
        options,
        headers
      );
      const travelPost = data.data.travelPost;
      const fetchedData = data.data;
      setData({
        ...travelPost,
        title: fetchedData.title || "",
        content: fetchedData.content || "",
        thumbnail: fetchedData.thumbnail || "",
        travelArea: travelPost.travelArea || "",
        travelerCount: travelPost.travelerCount || 1,
        startDate: travelPost.startDate
          ? new Date(travelPost.startDate)
          : new Date(),
        endDate: travelPost.endDate ? new Date(travelPost.endDate) : new Date(),
        visibilityStatus: travelPost.visibilityStatus || "Public",
      });
      if (travelPost.content) {
        formatingReview(travelPost.content);
      }
      if (accessToken !== "null") {
        setAccessToken(accessToken);
      }
    };
    if (typeClass === "new") {
      if (review) {
        review && formatingReview(review.content);
        setData({
          id: review.id,
          title: "",
          content: "",
          thumbnail: "",
          travelArea: review.travelArea || "",
          travelerCount: review.travelerCount || 1,
          visibilityStatus: review.visibilityStatus || "Public",
          budget: review.budget || "",
          startDate: review.startDate ? new Date(review.startDate) : new Date(),
          endDate: review.endDate ? new Date(review.endDate) : new Date(),
        });
      }
    } else {
      getPostInfo();
    }
  }, [review]);

  //* 이미지 변경하는 함수
  const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  //* 예산 변경하는 함수
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const budgetValue = e.target.value.replace(/,/g, "");
    const formattedBudget = formatNumberWithCommas(budgetValue);
    /**
     * [{ id: 1, budget: '', traffic: '', lodging: '', markdown: '<h1>...</h1>'}, ...]
     */
    const formattedTabContent = tabContent.map((value) => {
      if (value.id === id) {
        return { ...value, budget: formattedBudget };
      } else {
        return value;
      }
    });
    setTabContent(formattedTabContent);
  };

  //* 숙소 선택하는 함수
  const handleLodging = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const targetValue = e.target.value;
    const formattedTabContent = tabContent.map((value) => {
      if (value.id === id) {
        return { ...value, lodging: targetValue };
      } else {
        return value;
      }
    });
    setTabContent(formattedTabContent);
  };

  //* 예산 포멧 방식 변경하기
  const formatNumberWithCommas = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //* 파일 포멧 변경하기
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

  //* 여행 지역 선택하는 함수
  // const selectOption = (e: any) => {
  //   setData({ ...data, travelArea: e.target.value });
  // };

  //* 탭 콘텐트 선택하는 함수
  const selectTab = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    selectedTabRef.current = id;
    setSelectedTab(id);
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

  //* 에디터(마크다운)에서 이미지 추가하기
  const uploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // file input을 프로그래밍적으로 클릭
    }
  };

  //* quill 에디터 모듈 설정하기
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

  //* form 데이터 동작안하게 막기
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  //! 여기서 에러남
  //* 마크다운 컨트롤
  const handleMarkdown = (e: string) => {
    setTabContent((prevTabContent) =>
      prevTabContent.map((value) => {
        if (value.id === selectedTab && value.markdown !== e) {
          return { ...value, markdown: e };
        } else {
          return value;
        }
      })
    );
  };

  //! 여행 지역 input select 로 변경해야 한다. (지역을 선택할 수 있도록)

  return (
    <main>
      <section className="w-3/4 my-10 mx-auto xs-max:text-sm">
        <h2 className="h2 a11y-hidden">{id}번 계획 작성페이지</h2>

        <form onSubmit={handleSubmit}>
          <div className="toggle-switch mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <span>공개 여부</span>
              <span
                className={`ml-2  text-xs
              rounded-full px-3 py-1 font-bold ${
                data.visibilityStatus === "Public"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-red-100 text-red-500"
              }`}
              >
                {data.visibilityStatus}
              </span>
            </label>
          </div>
          <div className="mb-2 flex flex-col">
            <label htmlFor="title">계획 제목</label>
            <input
              type="text"
              id="title"
              value={data.title}
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
              }}
              placeholder="여행 제목을 입력해주세요."
              // required
              className="input-border py-1 px-3"
            />
          </div>
          <div className="flex flex-col mb-2 xs-max:w-full">
            <label htmlFor="lo">여행 지역</label>
            <select
              name="location"
              id="lo"
              className="input-border py-1 px-3 s:max-w-52 w-full"
              disabled
            >
              <option value={data.travelArea}>{data.travelArea}</option>
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
                disabled
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
                  selectsStart
                  startDate={data.startDate}
                  endDate={data.endDate}
                  className="input-border px-2 py-1"
                  disabled
                />
              </div>
            )}
            {data.startDate && data.endDate && (
              <div className="s:flex s:flex-row items-center">
                <p className="mr-2 xs-max:mb-1">여행 종료일: </p>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={data.endDate}
                  selectsEnd
                  startDate={data.startDate}
                  endDate={data.endDate}
                  minDate={data.startDate}
                  className="input-border px-2 py-1"
                  disabled
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="file_upload" className="inline-block mb-2">
              대표사진 선택 (썸네일)
              <input
                id="file_upload"
                onChange={handleImgChange}
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
                hover:file:bg-pink-100 mt-2 w-52 cursor-pointer hover:cursor-pointer"
              />
            </label>
            <div className="max-w-xs relative sm:w-80 h-60">
              {/* 320px 고정 */}
              <Image
                src={data.thumbnail || noImg}
                alt="대표사진 미리보기"
                fill
                priority={true}
                unoptimized={true}
                className="object-contain " // 비율 유지하며 잘라내기
                sizes="320px" // 고정 너비
              />
            </div>
          </div>
          <div className="tab-list">
            <ul className="flex border-b mt-4 mb-2 overflow-x-auto max-w-full border-gray-400">
              {tabList.map((value) => (
                <li
                  key={value.id}
                  className={`box-border w-fit ${
                    selectedTab === value.id
                      ? "border border-b-0 border-gray-400 rounded-tr-sm rounded-tl-sm"
                      : ""
                  }`}
                >
                  <button
                    className="text-sm block w-full p-2 text-center whitespace-nowrap"
                    type="button"
                    onClick={(e) => selectTab(e, value.id)}
                  >
                    {value.tabName}
                  </button>
                </li>
              ))}
            </ul>
            <div>
              {tabContent.length !== 0 && selectedTab !== null ? (
                <>
                  <div className="mb-2 flex flex-col">
                    <label htmlFor="budget">예산</label>
                    <input
                      type="text"
                      id="budget"
                      value={
                        tabContent.find((tab) => tab.id === selectedTab)
                          ?.budget || ""
                      }
                      onChange={(e) => handleBudgetChange(e, selectedTab)}
                      required
                      placeholder={`${selectedTab}일차 예산을 입력해주세요.`}
                      className="input-border py-1 px-3"
                    />
                  </div>
                  <div className="mb-2 flex flex-col">
                    <label htmlFor="lodging">숙소</label>
                    <select
                      value={
                        tabContent.find((tab) => tab.id === selectedTab)
                          ?.lodging || ""
                      }
                      onChange={(e) => handleLodging(e, selectedTab)}
                      className="input-border py-1 px-3 s:max-w-52 w-full"
                      id="lodging"
                    >
                      <option value="">숙소를 선택하세요</option>
                      {accommodations.map((accommodation) => (
                        <option key={accommodation} value={accommodation}>
                          {accommodation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <QuillNoSSRWrapper
                    forwardedRef={quillInstance}
                    value={
                      tabContent.find((tab) => tab.id === selectedTab)
                        ?.markdown || ""
                    }
                    onChange={(e) => {
                      if (
                        selectedTab !== null &&
                        selectedTab === selectedTabRef.current
                      ) {
                        handleMarkdown(e);
                      }
                    }}
                    modules={modules}
                    theme="snow"
                    placeholder="내용을 입력해주세요."
                    formats={formats}
                  />
                </>
              ) : (
                <p>선택된 탭이 없습니다.</p>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>

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
