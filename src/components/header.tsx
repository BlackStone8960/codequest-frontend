"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Hamburger menu items */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 z-50 shadow-lg transform transition-transform duration-300">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-xl"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <nav className="flex flex-col gap-4 p-4">
              <Link href="/dashboard" className="bg-gray-700 p-2 rounded">
                Dashboard
              </Link>
              <Link href="/tasks" className="bg-gray-700 p-2 rounded">
                Tasks
              </Link>
              <Link
                href="/github-contributions"
                className="bg-gray-700 p-2 rounded"
              >
                Github Contributions
              </Link>
              <Link href="/profile" className="bg-gray-700 p-2 rounded">
                Profile
              </Link>
              <Link href="/settings" className="bg-gray-700 p-2 rounded">
                Settings
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
