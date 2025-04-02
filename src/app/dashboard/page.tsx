"use client";

import CardSection from "@/app/components/CardSection";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-2">
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

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex justify-between gap-4">
          {/* Level & HP */}
          <CardSection
            title=""
            className="text-center w-1/2 flex items-center justify-center flex-col"
          >
            <div className="text-xl">Level</div>
            <div className="text-5xl font-bold my-2">5</div>
            <div className="text-sm">1200 / 1500 XP</div>
            <div className="mt-4 text-sm font-bold">HP: 70 / 80</div>
            {/* TODO: Replace with dynamic Level/HP data */}
          </CardSection>

          <div className="grid gap-4">
            {/* Streak */}
            <CardSection title="Streak">
              <div>
                <span className="text-5xl font-bold mt-2">7</span>
                <span className="text-sm">days</span>
              </div>
              {/* TODO: Replace with dynamic streak data */}
            </CardSection>

            {/* Statistics */}
            <CardSection title="Statistics">
              <p>
                Total XP: <span className="font-mono">8200</span>
              </p>
              <p>
                Tasks Completed: <span className="font-mono">42</span>
              </p>
              <p>
                Rank: <span className="font-mono">1280</span>
              </p>
              {/* TODO: Replace with actual statistics */}
            </CardSection>
          </div>
        </div>
        {/* Recent Activity */}
        <CardSection title="Recent Activity" />

        {/* Experience Gained */}
        <CardSection title="Experience Gained" />

        {/* Tasks Completed */}
        <CardSection title="Tasks Completed" />

        {/* Github Contributions */}
        <CardSection title="Github Contributions" />
      </div>
    </div>
  );
}
