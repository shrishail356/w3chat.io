import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

const partners = [
  {
    name: "Base Agent Kit",
    image: "/built/agentkit.png",
    url: "https://docs.cdp.coinbase.com/agentkit/docs/welcome",
  },

  {
    name: "Base Onchain Kit",
    image: "/built/onchainkit.png",
    url: "https://onchainkit.xyz/",
  },
  {
    name: "Arbitrum Stylus",
    image: "/built/style.png",
    url: "https://docs.arbitrum.io/stylus/gentle-introduction",
  },

  {
    name: "Hyperlane",
    image: "/built/hyperlane.png",
    url: "https://www.hyperlane.xyz/",
  },
  {
    name: "Warden Agent Kit",
    image: "/built/wardenkit.png",
    url: "https://docs.wardenprotocol.org/category/warden-agent-kit",
  },
];

const BuiltWith: React.FC = () => {
  const comingSoonChains = Array(3).fill("upcoming");

  const handlePartnerClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative"
    >
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-50"></div>

        {/* Subtle floating dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400/10 rounded-full"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + i * 10}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient">
              On and With
            </span>
          </h3>
          <p className="mt-4 text-gray-400 text-lg">
            Open for Partnerships, collaborations, and integrations
          </p>
        </motion.div>
      </div>

      {/* Chain Logos */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-center max-w-3xl mx-auto">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handlePartnerClick(partner.url)}
            className="relative flex flex-col items-center cursor-pointer group"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
              <Image
                src={partner.image}
                alt={partner.name}
                layout="fill"
                objectFit="contain"
                className="drop-shadow-lg transition-transform duration-300 group-hover:brightness-110"
              />
            </div>
            {/* Optional hover effect */}
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 " />
          </motion.div>
        ))}

        {/* Coming Soon Chainss */}
        {comingSoonChains.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * (index + 1) }}
            className="relative flex flex-col items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm flex items-center justify-center group hover:bg-white/10 transition-all duration-300">
              <HelpCircle className="w-8 h-8 text-gray-400/50 group-hover:text-cyan-400/70 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="mt-3 text-gray-400/50 font-medium text-sm">
              Coming Soon
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuiltWith;
