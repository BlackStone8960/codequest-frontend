"use client";

import CardSection from "@/components/CardSection";
import GitHubCalendar from "@/components/GitHubCalendar";
import GitHubCommitHistory from "@/components/GitHubCommitHistory";
import GitHubStreak from "@/components/GitHubStreak";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useUserStore } from "@/store/userStore";

export default function Dashboard() {
  const user = useUserStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0f172a] text-white">
        <Sidebar />
        <main className="flex-1 pt-14 md:pt-0 px-4 py-4 min-w-0">

        {/* Main Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex justify-between gap-4">
            {/* Level & HP */}
            <CardSection
              title=""
              className="text-center w-1/2 flex items-center justify-center flex-col"
            >
              <div className="text-xl">Level</div>
              <div className="text-5xl font-bold my-2">{user?.level || 0}</div>
              <div className="text-sm">
                {user?.currentLevelXP || 0} / {user?.levelUpXP || 1500} XP
              </div>
              <div className="mt-4 text-sm font-bold">
                HP: {user?.currentHP || 100} / {user?.maxHP || 100}
              </div>
            </CardSection>

            <div className="grid gap-4">
              {/* GitHub Streak */}
              <GitHubStreak />

              {/* Statistics */}
              <CardSection title="Statistics">
                <p>
                  Total XP:{" "}
                  <span className="font-mono">
                    {user?.totalExperience || 0}
                  </span>
                </p>
                <p>
                  Tasks Completed:{" "}
                  <span className="font-mono">
                    {user?.tasksCompleted?.length || 0}
                  </span>
                </p>
                <p>
                  Rank: <span className="font-mono">{user?.rank || 0}</span>
                </p>
              </CardSection>
            </div>
          </div>

          {/* GitHub Calendar */}
          <GitHubCalendar />

          {/* GitHub Commit History */}
          <GitHubCommitHistory />

          {/* Recent Activity */}
          <CardSection title="Recent Activity" />

          {/* Experience Gained */}
          <CardSection title="Experience Gained" />

          {/* Tasks Completed */}
          <CardSection title="Tasks Completed" />
        </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
