"use client";

import React from "react";

export default function NotFound() {
  return (
    <>
      <main className="relative">
        <section className="absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 md:w-6/12 w-10/12">
          <h2 className="text-center text-7xl font-bold mb-4">
            <span className="text-blue-600">404</span> ERROR
          </h2>
          <section className="text-center">
            <p>죄송합니다 페이지를 찾을 수 없습니다.</p>
            <p>존재하지 않는 주소를 입력하셨거나,</p>
            <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
          </section>
          <button className="custom-btn btn-6">
            <span>홈으로 이동</span>
          </button>
        </section>
      </main>
    </>
  );
}
