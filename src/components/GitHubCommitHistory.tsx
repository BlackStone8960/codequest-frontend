"use client";

import { GitHubCommit, GitHubService } from "@/services/githubService";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";

export default function GitHubCommitHistory() {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const user = useUserStore((state) => state.user);

  const fetchCommits = async () => {
    if (!user?.githubId) {
      setError("GitHub account not linked");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await GitHubService.getUserCommits(user.githubId, days);
      setCommits(data);
    } catch (err: any) {
      console.error("Failed to fetch commits:", err);
      setError(err.message || "Failed to fetch commit history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.githubId) {
      fetchCommits();
    }
  }, [user?.githubId, days]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  if (!user?.githubId) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FaGithub className="text-4xl mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">
          GitHub Integration Required
        </h3>
        <p className="text-gray-400 text-sm">
          Link your GitHub account to view push history
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaGithub className="text-xl" />
          Push History
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={fetchCommits}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Update
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Fetching push history...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <FaGithub className="text-4xl mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchCommits}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {commits.length === 0 ? (
            <div className="text-center py-8">
              <FaCode className="text-4xl mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">
                No push history in the last {days} days
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mb-4">
                {commits.length} pushes in the last {days} days
              </div>
              {commits.map((commit, index) => (
                <div
                  key={`${commit.sha}-${index}`}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCode className="text-green-400 text-sm" />
                        <p className="text-white text-sm font-medium">
                          {truncateMessage(commit.commit.message)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt />
                          <span>{formatDate(commit.commit.author.date)}</span>
                        </div>
                        <span>by {commit.commit.author.name}</span>
                        <span className="font-mono text-gray-500">
                          {commit.sha.substring(0, 7)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 ml-2"
                      title="View on GitHub"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
