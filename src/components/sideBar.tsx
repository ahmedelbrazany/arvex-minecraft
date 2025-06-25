"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAlert } from "@/context/AlertContext";
import LottieHover from "@/components/LottieHover";
import AuthButton from './AuthButton';

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [generalOpen, setGeneralOpen] = useState(false);
  const { showAlert } = useAlert();

  const sidebarVariants = {
    open: { x: 0, width: "280px" },
    closed: { x: "-100%", width: "64px" },
  };


  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full bg-gray-800 text-white p-4 z-50 shadow-xl overflow-y-auto flex flex-col"
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between mb-8 pb-2 border-b border-gray-700">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl tracking-tight"
          >
            Select
          </motion.div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-600 transition-all p-2 rounded-lg hover:bg-gray-700"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Auth Button */}
      <div className="mb-4">
        <AuthButton />
      </div>

      {/* Section header */}
      <div className="mb-6">
        <button
          onClick={() => setGeneralOpen(!generalOpen)}
          className="flex justify-between items-center w-full py-2 text-lg font-semibold text-indigo-200 hover:text-white transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>Dashboards</span>
          </div>
          <span className="transform transition-transform duration-200 group-hover:translate-x-1">
            {generalOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </span>
        </button>
        <div className="border-b border-gray-500/40 my-2"></div>
      </div>

      {/* Menu items */}
      <motion.ul
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: generalOpen ? 1 : 0,
          height: generalOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="flex flex-col space-y-1 overflow-hidden"
      >
        {/* Hosting Item */}
        <li className="rounded-lg overflow-hidden">
          <Link href="/dashboard">
            <div className="flex items-center text-lg w-full text-left py-3 px-3 hover:bg-gray-700/50 transition-all group">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Image
                  src="/database.png"
                  alt="Hosting Icon"
                  width={20}
                  height={20}
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-gray-200 group-hover:text-white transition-colors">
                Hosting
              </span>
              <span className="ml-auto text-xs py-1 px-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium">
                OFFERS
              </span>
            </div>
          </Link>
        </li>

        {/* Minecraft Item */}
        <li className="rounded-lg overflow-hidden">
          <Link href="/memberships">
            <div className="flex items-center text-lg w-full text-left py-3 px-3 hover:bg-gray-700/50 transition-all group">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <Image
                  src="/minecraft.png"
                  alt="Minecraft Icon"
                  width={20}
                  height={20}
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-gray-200 group-hover:text-white transition-colors">
                Minecraft
              </span>
              <span className="ml-auto bg-red-500 text-white text-xs py-1 px-2 rounded-full font-medium">
                NEW
              </span>
            </div>
          </Link>
        </li>

        {/* Bots Item */}
        <li className="rounded-lg overflow-hidden">
          <button
            className="w-full text-left"
            onClick={() =>
              showAlert({
                message: "الموقع تحت الصيانة حاليا",
                type: "primary", // يمكنك اختيار 'primary', 'danger', 'warning'
                duration: 3000, // 10 seconds
                icon: <LottieHover />,
              })
            }
          >
            <div className="flex items-center text-lg w-full text-left py-3 px-3 hover:bg-gray-700/50 transition-all group">
              <div className="bg-purple-600 p-2 rounded-lg mr-3">
                <Image
                  src="/bot.png"
                  alt="Bots Icon"
                  width={20}
                  height={20}
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-gray-200 group-hover:text-white transition-colors">
                Bots
              </span>
              <span className="ml-auto bg-blue-500 text-white text-xs py-1 px-2 rounded-full font-medium">
                SOON
              </span>
            </div>
          </button>
        </li>
      </motion.ul>

      {/* Footer with branding - only visible when sidebar is open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-auto pt-4 border-t border-gray-700/40 text-xs text-gray-300"
        >
          <div className="flex items-center justify-center py-2">
            <span>© 2025 Arvex</span>
          </div>
        </motion.div>
      )}

      
    </motion.div>
  );
}
