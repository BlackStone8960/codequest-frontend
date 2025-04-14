"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";

export default function Profile() {
  const user = useUserStore((state) => state.user);

  return (
    <ProtectedRoute>
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
              <span>{user?.username || "Username"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span>{user?.email || "Email"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Password</span>
              <span>•••••</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md">
            <div className="flex justify-between">
              <span className="text-gray-400">Level</span>
              <span>{user?.level || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">HP</span>
              <span>
                {user?.currentHP || 100} / {user?.maxHP || 100}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Experience</span>
              <span>{user?.totalExperience || 0} XP</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md flex justify-between">
            <span className="font-semibold">Tasks Completed</span>
            <span>{user?.tasksCompleted?.length || 0}</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
