"use client";

import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { href: "/dashboard", name: "Dashboard", Icon: FaTachometerAlt },
  { href: "/tasks", name: "Tasks", Icon: FaList },
  { href: "/github-contributions", name: "GitHub Activity", Icon: FaGithub },
  { href: "/profile", name: "Profile", Icon: FaUser },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-xl font-bold text-teal-400 tracking-widest">
          CODEQUEST
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-gray-700">
        <Image
          src="/default-avatar.png"
          alt="User avatar"
          width={36}
          height={36}
          className="rounded-full flex-shrink-0"
        />
        <span className="text-sm text-gray-300 font-medium truncate">
          {user?.username || "User"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2">
        {navItems.map(({ href, name, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-teal-600/20 text-teal-400"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="text-base flex-shrink-0" />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-700">
        <LogoutButton />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-gray-900 border-r border-gray-700 min-h-screen flex-shrink-0 sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile: fixed top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-gray-900 border-b border-gray-700 px-4 h-14">
        <span className="text-lg font-bold text-teal-400 tracking-widest">
          CODEQUEST
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-1"
          aria-label="Open menu"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 shadow-xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
