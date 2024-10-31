"use client";

import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import loadingStore from "@/store/loadingStore";

export default function Blur() {
  const isLoading = loadingStore((state) => state.isLoading);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isLoading && (
      <div className={`blurBg`} style={{ top: scrollPosition }}>
        <div className="absolute top-1/2 left-1/2 z-20 translate-x-1/2 translate-y-1/2">
          <Loading />
        </div>
      </div>
    )
  );
}
