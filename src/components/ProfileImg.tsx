"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import profilePicture from "../../public/profile_picture.png";
import cameraIcon from "../../public/camera_icon.svg";
import { Profile } from "@/app/mypage/page";
import useStore from "@/store/store";

interface ImgUrl {
  imgUrl: string;
  setImgUrl: (url: string) => void;
}
export default function ProfileImg({ imgUrl, setImgUrl }: ImgUrl) {
  const [fileObj, setFileObj] = useState<File | null>(null);
  const imageRef = useRef(null);
  const ProfileImgUrl = "http://localhost:9502/api/user/profile/upload";
  const access = useStore((state) => state.accessToken);

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

  const handleUpload = async () => {
    if (!fileObj) {
      console.error("No file selected");
      return;
    }
    //: fileObj가 있을 때 formData에 file obj를 넘겨준다.
    //: 가공된 formData를 body로 보냄
    const formData = new FormData();
    formData.append("file", fileObj);
    const response = await fetch(ProfileImgUrl, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access}`,
      },
      body: formData,
    });
    const json = await response.json();
  };

  return (
    <div className="flex-shrink-0">
      <h2 className="a11y-hidden">Upload Profile Image</h2>
      <div className="user-image-wrapper">
        <div
          className="user-image-box w-24 h-24 relative 
        overflow-hidden border rounded-full border-gray-300"
        >
          <label
            htmlFor="file_upload"
            className="custom-thumbnail-label w-full h-full"
          >
            <input
              id="file_upload"
              onChange={hanedleImgChange}
              ref={imageRef}
              type="file"
              alt="profile-image"
              aria-label="프로필사진교체"
              accept="image/*"
              required
              className="h-0 invisible"
            />
            <Image
              src={imgUrl ? imgUrl : profilePicture}
              alt="프로필 이미지"
              width={96}
              height={96}
              className="absolute top-0 left-0 cursor-pointer"
            />
            <div
              className="absolute top-0 left-0 bg-gray-100/50 
            rounded-full w-full h-full opacity-0 hover:opacity-100 cursor-pointer"
            >
              <Image
                src={cameraIcon}
                alt=""
                width={20}
                height={20}
                className="absolute top-1/2	left-1/2 
                -translate-x-2/4 -translate-y-2/4"
              />
            </div>
          </label>
        </div>
        <button
          onClick={handleUpload}
          className={` text-white p-2 rounded-md 
          text-xs mt-2 mx-auto block ${
            fileObj
              ? "bg-blue-500 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!fileObj}
        >
          Img Upload
        </button>
      </div>
    </div>
  );
}
