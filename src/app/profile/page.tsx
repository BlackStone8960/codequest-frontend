"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { FaCheckCircle, FaGithub, FaTimesCircle } from "react-icons/fa";

export default function Profile() {
  const user = useUserStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0f172a] text-white">
        <Sidebar />
        <main className="flex-1 pt-14 md:pt-0 px-4 py-4 min-w-0">
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

            {/* GitHub Connection Status */}
            <div className="bg-gray-800 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <FaGithub className="text-xl" />
                <span className="font-semibold">GitHub</span>
              </div>
              {user?.githubId ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-400">
                    <FaCheckCircle />
                    <span className="text-sm">Connected</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    @{user.username}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaTimesCircle />
                    <span className="text-sm">Not Connected</span>
                  </div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/auth/github`}
                    className="text-sm text-teal-400 hover:text-teal-300"
                  >
                    Connect GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
