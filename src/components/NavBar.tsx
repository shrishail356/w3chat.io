"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { handleSectionNavigation } from "@/utils/navigation";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#whatis" },

    { name: "Built with", href: "#builtwith" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    handleSectionNavigation(e, href, isHomePage);
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0A192F]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="block">
          <Image
            src="/logo.png"
            alt="W3Chat.io"
            width={160}
            height={45}
            className="h-8 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Menu toggle button (visible on mobile) */}
        <button
          className="md:hidden text-cyan-400 focus:outline-none p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#footer"
            onClick={(e) => handleNavClick(e, "#footer")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 px-5 py-2.5 rounded-lg transition-all text-white text-sm font-medium"
          >
            Contact us
          </a>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-gradient-to-br from-[#0A192F] to-[#0a1930] shadow-lg border-t border-white/10">
          <div className="flex flex-col py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium px-6 py-3 hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="px-6 pt-4">
              <a
                href="#footer"
                onClick={(e) => handleNavClick(e, "#footer")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 px-5 py-2.5 rounded-lg transition-all text-white text-sm font-medium w-full block text-center"
              >
                Partner with us
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
