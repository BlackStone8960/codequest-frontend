"use client";

import GitHubCalendar from "@/components/GitHubCalendar";
import GitHubCommitHistory from "@/components/GitHubCommitHistory";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function GitHubContributionsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0f172a] text-white">
        <Sidebar />
        <main className="flex-1 pt-16 md:pt-10 px-4 py-4 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">GitHub Activity</h1>
          </div>
          <div className="flex flex-col gap-4">
            <GitHubCalendar />
            <GitHubCommitHistory />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
