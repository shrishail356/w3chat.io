import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Title: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-20 overflow-hidden"
    >
      {/* Sophisticated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full animate-morph-slow blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full animate-morph-slow-reverse blur-2xl"></div>

        {/* Subtle particle effects */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300/30 rounded-full animate-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <div className="overflow-hidden">
            <h1 className="transform translate-y-full animate-slide-up">
              <span className="block text-2xl sm:text-3xl font-bold text-gray-200 font-medium mb-2 opacity-0 animate-fade-in delay-300">
                Meet Worlds First
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-gradient opacity-0 animate-fade-in delay-500">
                All-in-One AI-Agent
              </span>
              <span className="block text-2xl sm:text-3xl mt-3 text-gray-300 font-medium opacity-0 animate-fade-in delay-700">
                for Web3
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl opacity-0 animate-fade-in-up delay-900">
            Simplifying blockchain interactions with natural conversations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="relative w-full h-[280px] sm:h-[360px] group">
            {/* Animated border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

            <Image
              src="/image.png"
              alt="AI Dashboard Interface"
              fill
              className="object-contain p-4 rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Title;
