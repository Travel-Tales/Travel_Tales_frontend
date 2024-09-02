"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "/public/main-logo.png";
import LocalStorage from "@/service/localstorage";
import useStore from "@/store/store";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const access = useStore((state) => state.accessToken);
  const setAccessToken = useStore((state) => state.setAccessToken);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const logout = async () => {
    alert("로그아웃 하시겠습니까?");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        LocalStorage.removeItem("accessToken");
        setAccessToken("");
        alert("로그아웃 되었습니다.");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  const toggleMenu = (e: any) => {
    setIsToggle(e.target.checked);
  };

  const closedMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
      setIsToggle(false);
    }
  };

  return (
    <>
      <header
        className="w-full fixed top-0 left-0 
      custom-flex px-6 py-4 border-b border-gray-200 bg-white z-10
      xs:px-3
      "
        style={{ height: "70.84px" }}
      >
        <h1 className="main-logo xs:mr-6">
          <Link href="/">
            <Image src={mainLogo} alt="Website Logo" width={180} height={38} />
          </Link>
        </h1>
        <div className="custom-flex relative">
          <nav className="pc-menu hidden md:block">
            <ul className="nav">
              <li className="menu">
                <Link href={"/travel/reviews"}>Reviews</Link>
              </li>
              <li className="menu">
                <Link href={"/travel/plans"}>Travel Plans</Link>
              </li>
              {isClient && access ? (
                <>
                  <li className="menu">
                    <Link href={"/mypage"}>MyPage</Link>
                  </li>
                  <li className="menu">
                    <Link href={"/"} onClick={logout}>
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li className="menu">
                  <Link href={"/login"}>Login</Link>
                </li>
              )}
            </ul>
          </nav>
          <nav className="mb-menu block md:hidden">
            <div className="menuToggle">
              <input type="checkbox" onChange={toggleMenu} ref={checkboxRef} />

              <span className="mb-menu-bar"></span>
              <span className="mb-menu-bar"></span>
              <span className="mb-menu-bar"></span>

              <ul className="menu-wrapper">
                <li className="menu" onClick={closedMenu}>
                  <Link className="no-underline" href={"/travel/reviews"}>
                    Reviews
                  </Link>
                </li>
                <li className="menu" onClick={closedMenu}>
                  <Link className="no-underline" href={"/travel/plans"}>
                    Travel Plans
                  </Link>
                </li>
                {isClient && access ? (
                  <>
                    <li className="menu" onClick={closedMenu}>
                      <Link className="no-underline" href={"/mypage"}>
                        MyPage
                      </Link>
                    </li>
                    <li className="menu">
                      <Link
                        className="no-underline"
                        href={"/"}
                        onClick={logout}
                      >
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="menu" onClick={closedMenu}>
                    <Link href={"/login"}>Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <div
        className={`blur ${
          isToggle ? "block h-full" : "hidden"
        } absolute top-0 left-0 w-full bg-gray-950 opacity-25 md:hidden z-1`}
        onClick={closedMenu}
      ></div>
    </>
  );
}
