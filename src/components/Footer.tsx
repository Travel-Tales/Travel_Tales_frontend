import React from "react";
import Link from "next/link";
import Image from "next/image";
import mainLogo from "../../public/main-logo.jpg";

export default function Footer() {
  return (
    <footer className="custom-flex">
      <div className="footer-logo">
        <Image src={mainLogo} alt="Website Logo" width={120} />
        <p className="text-sm text-neutral-700">
          © 2024 Travel Tales. All rights reserved.
        </p>
      </div>
      <nav className="footer-nav" aria-label="Footer">
        <ul className="nav">
          <li className="menu">
            <Link href="/about">About Us</Link>
          </li>
          <li className="menu">
            <Link href="/contact">Contact</Link>
          </li>
          <li className="menu">
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li className="menu">
            <Link href="/terms">Terms of Service</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
