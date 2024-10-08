import React from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "./../../public/main-logo.png";

export default function Footer() {
  return (
    <footer
      className="flex flex-col px-6 border-t
    md:flex-row justify-center md:justify-between md:items-center"
    >
      <div className="footer-logo mb-2 s:pl-3 s:mb-0 md:pl-0">
        <Image
          src={mainLogo}
          alt="Website Logo"
          width={120}
          height={100}
          priority={true}
          style={{ width: "auto", height: "auto" }}
        />
        <p className="text-sm text-neutral-700">
          © 2024 Travel Tales. All rights reserved.
        </p>
      </div>
      <nav className="footer-nav" aria-label="Footer">
        <ul className="s:flex s:flex-row text-sm text-neutral-700">
          <li className="footer-menu">
            <Link href="/">About Us</Link>
          </li>
          <li className="footer-menu">
            <Link href="/">Contact</Link>
          </li>
          <li className="footer-menu">
            <Link href="/">Privacy Policy</Link>
          </li>
          <li className="footer-menu">
            <Link href="/">Terms of Service</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
