"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Landingpage/Footer";
import {
  Mail,
  Send,
  ArrowLeftRight,
  SendHorizontal,
  Shield,
  Zap,
  Copy,
  ChevronRight,
} from "lucide-react";
import BackgroundParticles from "@/components/BackgroundParticles";
import Link from "next/link";

// Simplify features data
const features = [
  {
    id: 1,
    title: "Login & Setup",
    icon: Shield,
    description: "Quick 1-step setup process",
    content: {
      title: "Easy Onboarding",
      description: "Privy one-click wallet connection!",
      video: "/videos/login.mp4",
    },
  },
  {
    id: 2,
    title: "Get Testnet Faucet",
    icon: Zap,
    description: "Free tokens for testing",
    networkSupport: "Testnet only",
    content: {
      prompt: "Get Testnet Faucet to my wallet",
      description: "Copy, paste, and get free testnet tokens instantly",
      video: "/videos/faucet.mp4",
    },
  },
  {
    id: 3,
    title: "Send Tokens",
    icon: Send,
    description: "Transfer tokens easily",
    networkSupport: "Testnet / Mainnet",
    content: {
      examples: [
        {
          command:
            "send 0.01 ETH to 0xB7d4369AbFa74AED05d7db358dC3373d787B8997",
        },
        {
          command: "send 10 USDC to 0xbe7f6bBE7f0B5A93CdB4BD8E557896cE2ae695F1",
        },
      ],
      description: "Simple commands to send any tokens across wallets",
      video: "/videos/send.mp4",
    },
  },
  {
    id: 4,
    title: "Send to ENS Domains",
    icon: SendHorizontal,
    description: "Transfer to ENS domains easily",
    networkSupport: "Mainnet only",
    content: {
      examples: [
        { command: "send 0.01 ETH to 4li3n.base.eth" },
        { command: "send 10 USDC to 3loka.eth" },
      ],
      description: "Simple commands to send tokens to ENS domain names",
      video: "/videos/sns.mp4",
    },
  },
  {
    id: 5,
    title: "Token Swap",
    icon: ArrowLeftRight,
    description: "Swap between any tokens instantly",
    networkSupport: "Mainnet only",
    content: {
      examples: [
        { command: "swap 0.01 ETH to USDC" },
        { command: "swap 10 USDC to DEGEN" },
        { command: "swap 100 DEGEN to WETH" },
        { command: "swap 0.01 WETH to USDT" },
      ],
      video: "/videos/swap.mp4",
    },
  },
];

const BasePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);

    // Create toast element
    const toast = document.createElement("div");
    toast.className =
      "absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-400/90 text-black px-3 py-1 rounded text-sm font-medium transform transition-all duration-300";
    toast.textContent = "Copied!";

    // Find the button that was clicked and its parent code block
    const codeBlock = document.activeElement?.closest("code");
    if (codeBlock) {
      codeBlock.style.position = "relative";
      codeBlock.appendChild(toast);

      // Fade in
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translate(-50%, 0)";
      });

      // Fade out and remove
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%, -10px)";
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    }
  };

  const renderFeatureContent = (feature: (typeof features)[0]) => {
    return (
      <div className="h-[500px] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-400/10">
                <feature.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
            {feature.networkSupport && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-cyan-400/20 text-cyan-400 font-medium shadow-lg shadow-black/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                {feature.networkSupport}
              </span>
            )}
          </div>
        </div>

        {/* Feature specific content */}
        <div className="flex-1 space-y-6">
          {feature.content.prompt && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <code className="relative flex items-center justify-between p-2 rounded bg-black/30 text-cyan-400 font-mono text-sm">
                {feature.content.prompt}
                <button
                  onClick={() => handleCopy(feature.content.prompt || "")}
                  className="ml-2 p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </code>
            </div>
          )}

          {feature.content.examples && feature.content.examples.length > 0 && (
            <div
              className={`space-y-3 ${
                feature.id === 5 ? "grid grid-cols-2 gap-3 space-y-0" : ""
              }`}
            >
              {feature.content.examples?.map((example, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 w-full"
                >
                  <code className="relative flex items-center justify-between p-2 rounded bg-black/30 text-cyan-400 font-mono text-sm w-full">
                    <span className="truncate mr-2">{example.command}</span>
                    <button
                      onClick={() => handleCopy(example.command)}
                      className="ml-auto p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </code>
                </div>
              ))}
            </div>
          )}

          {/* Video Container - Improved */}
          <div className="relative w-full mt-6">
            <div className="relative h-[280px] rounded-xl overflow-hidden bg-gradient-to-br from-black/10 to-black/5 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 animate-gradient-shift" />

              <video
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={feature.content.video} type="video/mp4" />
              </video>

              {/* Subtle corner decorations */}
              <div className="absolute top-2 left-2 w-2 h-2 border-l-2 border-t-2 border-cyan-400/20" />
              <div className="absolute top-2 right-2 w-2 h-2 border-r-2 border-t-2 border-cyan-400/20" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-l-2 border-b-2 border-cyan-400/20" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-r-2 border-b-2 border-cyan-400/20" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <BackgroundParticles />
      <NavBar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Arbitrum{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient">
                Agent Features
              </span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg">
              Meet ArbiAgent — your on-chain assistant for effortless Arbitrum
              blockchain interactions. Send, swap, bridge, mint, and more with
              speed and efficiency!
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-20"
        >
          <div className="relative">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-gradient-shift" />

            {/* Interactive Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
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
          </div>

          {/* Features Content with enhanced styling */}
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Left Sidebar - Enhanced */}
            <div className="lg:w-1/3">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl shadow-black/5">
                {features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className={`p-4 cursor-pointer border-b border-white/10 last:border-0 transition-all duration-300 ${
                      selectedFeature.id === feature.id
                        ? "bg-gradient-to-r from-white/10 to-white/5"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            selectedFeature.id === feature.id
                              ? "bg-cyan-400/10"
                              : "bg-white/5 group-hover:bg-cyan-400/5"
                          }`}
                        >
                          <feature.icon
                            className={`w-5 h-5 transition-colors duration-300 ${
                              selectedFeature.id === feature.id
                                ? "text-cyan-400"
                                : "text-gray-400 group-hover:text-cyan-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ChevronRight
                          className={`w-5 h-5 transition-all duration-300 ${
                            selectedFeature.id === feature.id
                              ? "text-cyan-400 rotate-90"
                              : "text-gray-400 group-hover:text-cyan-400"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 h-full shadow-xl shadow-black/5 relative overflow-hidden"
                >
                  {renderFeatureContent(selectedFeature)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Button Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />

            <Link
              href="/chat/arbitrum"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300
                       bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                       hover:from-cyan-500/20 hover:to-blue-500/20
                       border border-cyan-400/20 rounded-xl
                       shadow-[0_0_20px_rgba(0,255,255,0.1)]
                       hover:shadow-[0_0_25px_rgba(0,255,255,0.2)]
                       backdrop-blur-sm"
            >
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Chat with me</span>
              <span className="absolute -top-px left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full" />
              <span className="absolute -bottom-px right-0 h-[2px] w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BasePage;
