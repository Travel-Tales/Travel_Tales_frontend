import React from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "../../public/main-logo.jpg";

export default function Header() {
  return (
    <header className="custom-flex">
      <h1 className="main-logo">
        {/* <Link href={"/"}>Travel Tales</Link> */}
        <Image src={mainLogo} alt="Website Logo" width={180} />
      </h1>
      <nav>
        <ul className="nav">
          <li className="menu">
            <Link href={"/reviews"}>Reviews</Link>
          </li>
          <li className="menu">
            <Link href={"/travel/plans"}>Travel Plans</Link>
          </li>
          <li className="menu">
            <Link href={"/login"}>Login</Link>
          </li>
          {/* {token ? (
            <li>
              <Link href={"/mypage"}>MyPage</Link>
            </li>
          ) : (
            <li>
              <Link href={"/login"}>Login</Link>
            </li>
          )} */}
        </ul>
      </nav>
    </header>
  );
}
