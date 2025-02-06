"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Playground from "./playground";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {/* Embedded Playground check board */}
      <Playground />
    </div>
  );
}
