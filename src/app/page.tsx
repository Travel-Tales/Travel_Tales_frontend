"use client";

import Image from "next/image";
import useStore from "@/store/store";

export default function Home() {
  const { bears, increase } = useStore();

  return <main>{bears}</main>;
}
