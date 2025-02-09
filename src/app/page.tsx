"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  } from "react";
import NavBar from "@/components/Navbar";
import Title from "@/components/Landingpage/Title";
import WhatIs from "@/components/Landingpage/Whatis";

import { motion } from "framer-motion";
import BuiltWith from "@/components/Landingpage/BuiltWith";

import Footer from "@/components/Landingpage/Footer";

const Web3AssistanceLanding: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0A192F] text-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Star-like Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "w-1.5 h-1.5 bg-cyan-400/20"
                : i % 2 === 0
                ? "w-1 h-1 bg-blue-400/20"
                : "w-0.5 h-0.5 bg-white/20"
            }`}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-[500px] h-[500px] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? "rgba(34,211,238,0.1)" : "rgba(37,99,235,0.1)"
              } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}

        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        <NavBar />
        <div id="home">
          <Title />
        </div>

        <div id="whatis">
          <WhatIs />
        </div>

        <div id="builtwith">
          <BuiltWith />
        </div>

        <div id="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Web3AssistanceLanding;
