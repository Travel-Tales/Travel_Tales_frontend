"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "../../public/main-logo.png";

import LocalStorage from "@/service/localstorage";
import useStore from "@/store/store";

export default function Header() {
  const access = useStore((state) => state.accessToken);

  return (
    <header
      className="w-full fixed top-0 left-0 
    custom-flex px-6 py-4 border-b bg-white z-10"
    >
      <h1 className="main-logo">
        <Link href="/">
          <Image src={mainLogo} alt="Website Logo" width={180} />
        </Link>
      </h1>
      <div className="custom-flex">
        <nav>
          <ul className="nav">
            <li className="menu">
              <Link href={"/travel/reviews"}>Reviews</Link>
            </li>
            <li className="menu">
              <Link href={"/travel/plans"}>Travel Plans</Link>
            </li>
            {access ? (
              <li className="menu">
                <Link href={"/mypage"}>MyPage</Link>
              </li>
            ) : (
              <li className="menu">
                <Link href={"/login"}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
