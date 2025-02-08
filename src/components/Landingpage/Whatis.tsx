import React from "react";
import { Code2, BookOpen, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const bots = [
  {
    name: "Base",
    role: "Onchain Agent",
    image: "/agents/base.png",
    icon: BookOpen,
    bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    accentColor: "cyan-400",
    path: "/base",
    isComingSoon: false,
    description:
      "An on-chain agent for seamless Base blockchain interactions — send, swap, bridge, mint, and more with ease and efficiency!",
  },

  {
    name: "Arbitrum",
    role: "Arbi Agent",
    image: "/agents/arbi.png",
    icon: Zap,
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "cyan-400",
    path: "/arbitrum",
    isComingSoon: false,
    description:
      "Meet ArbiAgent — your on-chain assistant for effortless Arbitrum blockchain interactions. Send, swap, bridge, mint, and more with speed and efficiency!",
  },
  {
    name: "Eigen",
    role: "Bridge Agent",
    image: "/agents/eigen.png",
    icon: Zap,
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "cyan-400",
    path: "/eigen",
    isComingSoon: false,

    description:
      "Your friendly bridge bot that effortlessly moves tokens between blockchains. No matter the asset, Eigen makes cross-chain transfers quick and easy!",
  },
  {
    name: "Warden",
    role: "Warden Agent",
    image: "/agents/warden.png",
    icon: Zap,
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "cyan-400",
    path: "/warden",
    isComingSoon: false,

    description:
      "An AI agent that enables seamless Web3 interactions on the Warden Protocol chain. Whether it's interacting with smart contracts or creating new ones, Warden simplifies your blockchain experience.",
  },
  {
    name: "Scheduler",
    role: "Time Agent",
    image: "/agents/scheduler.png",
    icon: Zap,
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "cyan-400",
    path: "/scheduler",
    isComingSoon: false,

    description:
      "Automate your blockchain actions effortlessly! Schedule transactions, token swaps, and more—whether it's sending at a specific time or executing trades based on price conditions. Set it and let Scheduler handle the rest!",
  },
  {
    name: "Dev",
    role: "Developer Bot",
    image: "/img/devguru.png",
    icon: Code2,
    bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    accentColor: "blue-400",
    path: "",
    isComingSoon: true,
    description:
      "Dev is a developer's best friend, trained with code snippets, templates, SDKs, and APIs. Use it to fix errors, develop tools, or get programming help instantly.",
  },
];

const WhatIs: React.FC = () => {
  const handleLaunch = (path: string, isComingSoon: boolean) => {
    if (!isComingSoon && path) {
      window.open(path, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          What is{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            W3Chat.io?
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Your comprehensive Web3 assistant platform powered by specialized AI
          bots, each designed to excel in specific blockchain interactions.
        </p>
      </motion.div>

      {/* Bots Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
            }}
            onClick={() => handleLaunch(bot.path, bot.isComingSoon)}
            className={`group relative ${
              !bot.isComingSoon && "cursor-pointer"
            }`}
          >
            {/* Card Background with Mesh Gradient */}
            <div className="absolute inset-0 rounded-2xl">
              <div
                className={`absolute inset-0 bg-gradient-to-b ${bot.bgGradient} rounded-2xl`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30" />
            </div>

            {/* Card content */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-white/20"
            >
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-24 h-24 mb-4 rounded-full overflow-hidden ring-2 ring-${bot.accentColor} ring-offset-1 ring-offset-[#0A192F] transition-all duration-300`}
                >
                  <img
                    src={bot.image}
                    alt={`${bot.name} Bot`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {bot.name}
                  </h3>
                  <p className={`text-${bot.accentColor} text-sm font-medium`}>
                    {bot.role}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {bot.description}
                </p>

                {/* Launch Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                    bot.isComingSoon
                      ? "bg-white/5 text-gray-400 cursor-not-allowed border border-white/10"
                      : `bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-${bot.accentColor} text-${bot.accentColor} hover:bg-${bot.accentColor} hover:text-white backdrop-blur-sm`
                  }`}
                >
                  <span className="font-medium">
                    {bot.isComingSoon ? "Coming Soon" : `Launch ${bot.name}`}
                  </span>
                  {!bot.isComingSoon && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WhatIs;
