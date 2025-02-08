"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  MessageCircle,
  Mail,
  Github,
  Brain,
  ArrowUpRight,
  Handshake,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { handleSectionNavigation } from "@/utils/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const sectionLinks = [
    { name: "About", href: "#whatis" },
    { name: "Features", href: "#features" },
    { name: "Supported Chains", href: "#chains" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "Partners", href: "#builtwith" },
    { name: "FAQ", href: "#faq" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/w3chat_io",
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: "Telegram",
      href: "https://t.me/w3chat_io",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      name: "GitHub",
      href: "https://github.com/w3chat-io",
      icon: <Brain className="w-5 h-5" />,
    },
  ];

  const handleFooterNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    handleSectionNavigation(e, href, isHomePage);
  };

  return (
    <footer className="relative mt-32">
      {/* Main Footer with Enhanced Background */}
      <div className="relative mt-32 bg-gradient-to-b from-[#060d1a] to-[#0a1930] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-70" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="space-y-6">
                <Link href="/" className="block">
                  <Image
                    src="/logo.png"
                    alt="W3Chat.io"
                    width={160}
                    height={45}
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    First AI-powered Web3 assistant, making blockchain
                    interactions simple through natural conversations.
                  </p>
                </div>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <h4 className="text-white font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {sectionLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleFooterNavClick(e, link.href)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                {/* Contact Section */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Contact</h4>
                  <a
                    href="mailto:contact@w3chat.io"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 text-sm group"
                  >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>contact@w3chat.io</span>
                  </a>
                </div>

                {/* Support Button
                <div>
                  <a
                    href="/donation"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 text-pink-400 hover:text-pink-300 transition-all duration-300 group"
                  >
                    <Heart className="w-4 h-4 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium">Support W3Chat</span>
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} W3Chat.io. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
