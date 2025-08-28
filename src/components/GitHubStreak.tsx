"use client";

import { GitHubService, StreakData } from "@/services/githubService";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaGithub } from "react-icons/fa";

export default function GitHubStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();

  const fetchStreakData = async () => {
    if (!user?.githubId) {
      setError("GitHub account not linked");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await GitHubService.updateUserStreak();
      setStreakData(data);

      // Update streak information in user store
      if (user) {
        setUser({
          ...user,
          streak: data.currentStreak,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch streak data:", err);
      setError(err.message || "Failed to fetch streak information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.githubId) {
      fetchStreakData();
    }
  }, [user?.githubId]);

  if (!user?.githubId) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FaGithub className="text-4xl mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">
          GitHub Integration Required
        </h3>
        <p className="text-gray-400 text-sm">
          Link your GitHub account to start tracking your streak
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Fetching streak information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FaGithub className="text-4xl mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-semibold mb-2 text-red-400">Error</h3>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchStreakData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!streakData) {
    return null;
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-orange-400";
    if (streak >= 3) return "text-yellow-400";
    return "text-gray-400";
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "🔥";
    return "🔥";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaGithub className="text-xl" />
          GitHub Streak
        </h3>
        <button
          onClick={fetchStreakData}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Update
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">
              {getStreakIcon(streakData.currentStreak)}
            </span>
            <span
              className={`text-4xl font-bold ${getStreakColor(
                streakData.currentStreak
              )}`}
            >
              {streakData.currentStreak}
            </span>
            <span className="text-gray-400">days</span>
          </div>
          <p className="text-sm text-gray-400">Current Streak</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xl font-bold text-green-400">
              {streakData.longestStreak}
            </div>
            <div className="text-gray-400">Longest Streak</div>
          </div>
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xl font-bold text-blue-400">
              {streakData.totalContributions}
            </div>
            <div className="text-gray-400">Total Contributions</div>
          </div>
        </div>

        {/* Last Commit Date */}
        {streakData.lastCommitDate && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FaCalendarAlt />
            <span>
              Last Commit:{" "}
              {new Date(streakData.lastCommitDate).toLocaleDateString("en-US")}
            </span>
          </div>
        )}

        {/* Motivation Messages */}
        {streakData.currentStreak === 0 && (
          <div className="text-center p-3 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">
              Start coding today and build your streak!
            </p>
          </div>
        )}

        {streakData.currentStreak > 0 && streakData.currentStreak < 7 && (
          <div className="text-center p-3 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">
              {7 - streakData.currentStreak} more days to reach a week streak!
            </p>
          </div>
        )}

        {streakData.currentStreak >= 7 && (
          <div className="text-center p-3 bg-orange-900/20 rounded border border-orange-500/20">
            <p className="text-sm text-orange-300">
              Amazing! You're on a {streakData.currentStreak}-day streak 🔥
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
