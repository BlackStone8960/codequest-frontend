"use client";

import CardSection from "@/components/CardSection";
import GitHubCalendar from "@/components/GitHubCalendar";
import GitHubStreak from "@/components/GitHubStreak";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useUserStore } from "@/store/userStore";
import { Cell, Pie, PieChart } from "recharts";

export default function Dashboard() {
  const user = useUserStore((state) => state.user);

  const currentXP = user?.currentLevelXP || 0;
  const maxXP = user?.levelUpXP || 1500;
  const xpPercent = Math.min(currentXP / maxXP, 1);
  const currentHP = user?.currentHP ?? 100;
  const maxHP = user?.maxHP ?? 100;
  const hpPercent = Math.min(currentHP / maxHP, 1);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0f172a] text-white">
        <Sidebar />
        <main className="flex-1 pt-14 md:pt-0 px-4 py-4 min-w-0">
          {/* Main Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
              {/* Level & HP */}
              <CardSection
                title=""
                className="text-center w-full sm:w-1/2 sm:max-w-[320px] flex items-center justify-center flex-col py-8"
              >
                {/* XP Donut Chart */}
                <div className="relative flex items-center justify-center">
                  <PieChart width={190} height={190}>
                    {/* Background arc (no animation) */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx={90}
                      cy={90}
                      innerRadius={72}
                      outerRadius={84}
                      startAngle={225}
                      endAngle={-50}
                      dataKey="value"
                      strokeWidth={0}
                      cornerRadius={6}
                      isAnimationActive={false}
                    >
                      <Cell fill="#0f172a" />
                    </Pie>
                    {/* Filled arc (animated) */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx={90}
                      cy={90}
                      innerRadius={72}
                      outerRadius={84}
                      startAngle={225}
                      endAngle={225 - xpPercent * 275}
                      dataKey="value"
                      strokeWidth={0}
                      cornerRadius={6}
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      <Cell fill="#10b981" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-400">Level</div>
                    <div className="text-4xl font-bold leading-tight">
                      {user?.level || 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {maxXP - currentXP} XP to next
                    </div>
                  </div>
                </div>
                {/* HP Bar */}
                <div className="w-[160px] mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>HP</span>
                    <span>
                      {currentHP} / {maxHP}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${hpPercent * 100}%` }}
                    />
                  </div>
                </div>
              </CardSection>

              <div className="flex-1 grid gap-4">
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
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
