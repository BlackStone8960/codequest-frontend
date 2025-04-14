"use client";

import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useState } from "react";
import {
  FaBars,
  FaGithub,
  FaList,
  FaTachometerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import PageLink from "./PageLink";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400 tracking-widest">
          CODEQUEST
        </h1>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 bg-gray-800 rounded-md"
        >
          <FaBars className="text-white text-2xl" />
        </button>
      </div>

      {/* Slide-out menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 z-50 shadow-lg p-4">
            {/* Header row with avatar and name */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/default-avatar.png" // Replace with real avatar path
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-300 font-semibold">
                  {user?.username || "User"}
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-2xl"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <PageLink
                href={"/dashboard"}
                name="Dashboard"
                Icon={FaTachometerAlt}
              />
              <PageLink href={"/tasks"} name="Tasks" Icon={FaList} />
              <PageLink
                href={"/github-contributions"}
                name="GitHub Activity"
                Icon={FaGithub}
              />
              <PageLink href={"/profile"} name="Profile" Icon={FaUser} />

              <div className="border-t border-gray-700 my-2" />
              <LogoutButton />
            </nav>
          </div>
        </>
      )}
    </>
  );
}
