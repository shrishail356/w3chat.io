"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Zap, Send, Shield, Copy } from "lucide-react";
import NavBar from "@/components/Navbar";
import BackgroundParticles from "@/components/ui/BackgroundParticles";

const features = [
  {
    id: 1,
    title: "Login & Setup",
    icon: Shield,
    description: "Quick 1-step setup process",
    content: {
      title: "Easy Onboarding",
      description: "Google one-click login Base wallet",
      video: "/videos/test.mp4",
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
      video: "/videos/test.mp4",
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
          command: "send 0.1 eth to 0xB7d4369AbFa74AED05d7db358dC3373d787B8997",
        },
        {
          command: "send 10 USDC to 0xB7d4369AbFa74AED05d7db358dC3373d787B8997",
        },
      ],
      description: "Simple commands to send any tokens across wallets",
      video: "/videos/test.mp4",
    },
  },
];

const BasePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    // Add a simple toast notification here if needed
  };

  const renderFeatureContent = (feature: (typeof features)[0]) => {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-400/10">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-400">{feature.description}</p>
              </div>
            </div>
            {feature.networkSupport && (
              <span className="text-sm px-4 py-2 rounded-full bg-white/5 border border-cyan-400/20 text-cyan-400 font-medium">
                {feature.networkSupport}
              </span>
            )}
          </div>
        </div>

        {/* Feature Content */}
        <div className="space-y-8">
          {feature.content.prompt && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <code className="flex items-center justify-between p-3 rounded-lg bg-black/30 text-cyan-400 font-mono text-base">
                {feature.content.prompt!}
                <button
                  onClick={() => handleCopy(feature.content.prompt!)}
                  className="ml-3 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </code>
            </div>
          )}

          {feature.content.examples && (
            <div className="space-y-4">
              {feature.content.examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <code className="flex items-center justify-between p-3 rounded-lg bg-black/30 text-cyan-400 font-mono text-base">
                    <span className="truncate mr-3">{example.command}</span>
                    <button
                      onClick={() => handleCopy(example.command)}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </code>
                </div>
              ))}
            </div>
          )}

          {/* Video Container */}
          <div className="relative mt-8">
            <div className="relative h-[320px] rounded-xl overflow-hidden border border-white/10">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={feature.content.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#0A192F]">
      <BackgroundParticles />
      <NavBar />

      <main className="w-full px-6 py-24">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Eigen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Agent
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Your friendly bridge bot that effortlessly moves tokens between
            blockchains. No matter the asset, Eigen makes cross-chain transfers
            quick and easy!
          </p>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Feature Navigation */}
            <div className="lg:w-1/3">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                {features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className={`p-6 cursor-pointer border-b border-white/10 last:border-0 transition-all ${
                      selectedFeature.id === feature.id
                        ? "bg-gradient-to-r from-white/10 to-transparent"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-xl ${
                            selectedFeature.id === feature.id
                              ? "bg-cyan-400/10"
                              : "bg-white/5"
                          }`}
                        >
                          <feature.icon
                            className={`w-6 h-6 ${
                              selectedFeature.id === feature.id
                                ? "text-cyan-400"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          selectedFeature.id === feature.id
                            ? "text-cyan-400 rotate-90"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Feature Content */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 h-full"
                >
                  {renderFeatureContent(selectedFeature)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Chat Button */}
        <div className="text-center mt-12">
          <button className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:bg-cyan-600 transition duration-200 shadow-md">
            Chat with me
          </button>
        </div>
      </main>
    </div>
  );
};

export default BasePage;
