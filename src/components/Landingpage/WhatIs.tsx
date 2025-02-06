import React from "react";
import { useRouter } from "next/navigation";
import { Code2, BookOpen, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const bots = [
  {
    name: "Eigen",
    role: "Bridge Agent",
    image: "/agents/eigen.png",
    icon: BookOpen,
    bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    accentColor: "cyan-400",

    description:
      "Your friendly bridge bot that effortlessly moves tokens between blockchains. No matter the asset, Eigen makes cross-chain transfers quick and easy!",
  },
  {
    name: "Base",
    role: "Onchain Agent",
    image: "/agents/base.png",
    icon: Code2,
    bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    accentColor: "blue-400",

    description:
      "An on-chain agent that helps you interact seamlessly with the Base blockchain. Whether it's sending, swapping, bridging, minting, or anything else, Base makes all your blockchain actions easy and efficient!",
  },
  {
    name: "Warden",
    role: "Warden Agent",
    image: "/agents/warden.png",
    icon: Zap,
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "cyan-400",

    description:
      "An AI agent that enables seamless Web3 interactions on the Warden Protocol chain. Whether it's interacting with smart contracts or creating new ones, Warden simplifies your blockchain experience.",
  },
];

const WhatIs: React.FC = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 py-24 relative"
    >
      {/* Section Title */}
      <motion.div
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
          What is{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            W3Chat.io?
          </span>
        </h2>
        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Your comprehensive Web3 assistant platform powered by specialized AI
          Agents, each designed to excel in specific blockchain interactions.
        </p>
      </motion.div>

      {/* Bots Grid */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {bots.map((bot, index) => (
          <div key={bot.name} className="relative cursor-pointer">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative h-full"
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
                className="relative backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-28 h-28 mb-6 rounded-full overflow-hidden ring-2 ring-${bot.accentColor} ring-offset-2 ring-offset-[#0A192F] transition-all duration-300 shadow-xl`}
                  >
                    <img
                      src={bot.image}
                      alt={`${bot.name} Bot`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {bot.name}
                    </h3>
                    <p
                      className={`text-${bot.accentColor} text-base font-semibold tracking-wide`}
                    >
                      {bot.role}
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-6 flex-grow flex flex-col justify-between">
                  <p className="text-gray-300 text-base leading-relaxed">
                    {bot.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/5"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WhatIs;
