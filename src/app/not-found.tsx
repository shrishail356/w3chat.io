"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-white flex flex-col items-center justify-center">
      <div className="flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg">Page not found. Redirecting to the homepage...</p>
    </div>
  );
};

export default NotFound;
