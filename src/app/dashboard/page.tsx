"use client";

import CardSection from "@/components/CardSection";
import Header from "@/components/header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-2">
      <Header />

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
