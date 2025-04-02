"use client";

import Header from "@/components/header";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-2">
      <Header />

      <div className="flex flex-col items-center gap-4 mt-4">
        <Image
          src="/default-avatar.png"
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover"
          width={96}
          height={96}
        />
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span>John Doe</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span>johndoe@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Password</span>
            <span>•••••</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span>5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">HP</span>
            <span>1200 / 1510</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Experience</span>
            <span>8200 XP</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-md flex justify-between">
          <span className="font-semibold">Tasks Completed</span>
          <span>42</span>
        </div>
      </div>
    </div>
  );
}
