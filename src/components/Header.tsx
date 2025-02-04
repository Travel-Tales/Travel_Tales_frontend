"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "./../../public/main-logo.png";
import whiteLogo from "./../../public/logo-white.png";
import LocalStorage from "@/service/localstorage";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const access = useStore((state) => state.accessToken);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setIsLogin = useStore((state) => state.setIsLogin);
  const router = useRouter();
  const segment = usePathname();
  // const headerRef = useRef<HTMLDivElement | null>(null);

  let throttle = false;
  const [isThrottle, setIsThrottle] = useState<boolean | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (segment === "/") {
      setIsThrottle(false);
    } else {
      setIsThrottle(true);
    }
  }, [segment]);

  const logout = async () => {
    if (confirm("로그아웃 하시겠습니까?") === true) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.ok) {
          localStorage.removeItem("accessToken");
          setAccessToken("");
          setIsLogin("false");
          alert("로그아웃 되었습니다.");
          router.replace("/"); // 이전 페이지 URL로 대체
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    } else {
      return;
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

  const handlerScroll = () => {
    if (throttle === false && window.location.pathname === "/") {
      throttle = true;
      setTimeout(() => {
        if (100 < window.scrollY) {
          setIsThrottle(true);
        } else {
          setIsThrottle(false);
        }
        throttle = false;
      }, 300);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handlerScroll);
    return () => {
      window.removeEventListener("scroll", handlerScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 
      custom-flex px-6 py-4 transition-all duration-200 ${
        isThrottle || isToggle ? " bg-white" : "bg-transparent"
      } z-10 ${isThrottle && segment === "/" ? "shadow-md" : ""}
      xs:px-3`}
        style={{ height: "70.84px" }}
        // ref={headerRef}
      >
        <h1 className="main-logo xs:mr-6">
          <Link href="/">
            <Image
              src={isThrottle || isToggle ? mainLogo : whiteLogo}
              // src={whiteLogo}
              alt="Website Logo"
              width={180}
              height={38}
              priority={true}
              style={{ width: "auto", height: "auto", maxWidth: "80%" }}
            />
          </Link>
        </h1>
        <div className="custom-flex relative">
          <nav className="pc-menu hidden md:block">
            <ul className={`${isThrottle ? "nav-throttle" : "nav"} `}>
              <li>
                <Link href={"/travel/plans"} className="menu">
                  여행 계획
                </Link>
              </li>
              <li>
                <Link href={"/travel/reviews"} className="menu">
                  여행 리뷰
                </Link>
              </li>
              {isClient && access ? (
                <>
                  <li>
                    <Link href={"/mypage"} className="menu">
                      마이페이지
                    </Link>
                  </li>
                  <li
                    className={`${
                      isThrottle ? "border-black" : "border-white"
                    } border rounded-md ml-3`}
                  >
                    <Link href={"#"} onClick={logout} className="menu">
                      로그아웃
                    </Link>
                  </li>
                </>
              ) : (
                <li
                  className={`${
                    isThrottle ? "border-black" : "border-white"
                  } border rounded-md ml-3`}
                >
                  <Link href={"/login"} className="menu">
                    로그인
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <nav className="mb-menu block md:hidden">
            <div className="menuToggle">
              <input type="checkbox" onChange={toggleMenu} ref={checkboxRef} />

              <span
                className={`mb-menu-bar ${
                  isThrottle || isToggle ? "is-open" : ""
                }`}
              ></span>
              <span
                className={`mb-menu-bar ${
                  isThrottle || isToggle ? "is-open" : ""
                }`}
              ></span>
              <span
                className={`mb-menu-bar ${
                  isThrottle || isToggle ? "is-open" : ""
                }`}
              ></span>

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
