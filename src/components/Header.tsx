"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "/public/main-logo.png";
import LocalStorage from "@/service/localstorage";
import useStore from "@/store/store";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = (e: any) => {
    console.log(e.target.value);
    // setIsToggle()
  };

  return (
    <>
      <header
        className="w-full fixed top-0 left-0 
      custom-flex px-6 py-4 border-b border-gray-200 bg-white z-10
      "
      >
        <h1 className="main-logo">
          <Link href="/">
            <Image src={mainLogo} alt="Website Logo" width={180} />
          </Link>
        </h1>
        <div className="custom-flex relative">
          {/* <nav>
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
        </nav> */}
          <nav>
            <div className="menuToggle">
              <input type="checkbox" onChange={toggleMenu} />

              <span className="mb-menu-bar"></span>
              <span className="mb-menu-bar"></span>
              <span className="mb-menu-bar"></span>

              <ul className="menu-wrapper">
                <li className="menu">
                  <Link className="no-underline" href={"/travel/reviews"}>
                    Reviews
                  </Link>
                </li>
                <li className="menu">
                  <Link className="no-underline" href={"/travel/plans"}>
                    Travel Plans
                  </Link>
                </li>
                {isClient && access ? (
                  <>
                    <li className="menu">
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
                  <li className="menu">
                    <Link href={"/login"}>Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <div
        className={`blur hidden absolute top-0 left-0 w-full h-full bg-gray-950 opacity-25`}
      ></div>
    </>
  );
}
