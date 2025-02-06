"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function Home() {
  const router = useRouter();

  const handlePlayNow = () => {
    router.push("/game");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar 
        sidebarOpen={false} 
        setSidebarOpen={() => {}} 
        botType="default" 
      />
      <div className="flex-1 flex items-center justify-center">
        <button onClick={handlePlayNow}>Play Now</button>
      </div>
    </div>
  );
}
