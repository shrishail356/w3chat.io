"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Playground from "./playground";
import NavBar from "@/components/NavBar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col"> 
      <NavBar 
        sidebarOpen={false} 
        setSidebarOpen={() => {}} 
        botType="default" 
      />
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
    </div>
  );
}
