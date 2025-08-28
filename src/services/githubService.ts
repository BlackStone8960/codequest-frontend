import axios from "axios";

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  lastCommitDate: string | null;
  commitDates: string[];
}

export class GitHubService {
  private static async getGitHubToken(): Promise<string | null> {
    // Get GitHub token from backend
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await axios.get(
        "http://localhost:8080/api/github/token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.githubToken;
    } catch (error) {
      console.error("Failed to get GitHub token:", error);
      return null;
    }
  }

  static async getUserCommits(
    username: string,
    days: number = 365
  ): Promise<GitHubCommit[]> {
    const githubToken = await this.getGitHubToken();
    if (!githubToken) {
      throw new Error("GitHub token not available");
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    try {
      const response = await axios.get(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:>${
          since.toISOString().split("T")[0]
        }`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.cloak-preview",
          },
        }
      );

      return response.data.items || [];
    } catch (error) {
      console.error("Failed to fetch GitHub commits:", error);
      throw error;
    }
  }

  static calculateStreak(commits: GitHubCommit[]): StreakData {
    const commitDates = new Set<string>();

    // Collect commit dates
    commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date)
        .toISOString()
        .split("T")[0];
      commitDates.add(date);
    });

    const sortedDates = Array.from(commitDates).sort();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: string | null = null;

    // Process dates in reverse order
    const dates = sortedDates.reverse();

    for (let i = 0; i < dates.length; i++) {
      const currentDate = dates[i];

      if (i === 0) {
        // First date
        if (currentDate === today || currentDate === yesterday) {
          currentStreak = 1;
          tempStreak = 1;
        }
        lastDate = currentDate;
      } else {
        const prevDate = dates[i - 1];
        const currentDateObj = new Date(currentDate);
        const prevDateObj = new Date(prevDate);
        const diffDays = Math.floor(
          (prevDateObj.getTime() - currentDateObj.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          // Consecutive days
          tempStreak++;
          if (i === 1 && (currentDate === today || currentDate === yesterday)) {
            currentStreak = tempStreak;
          }
        } else {
          // Streak broken
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
        lastDate = currentDate;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      totalContributions: commitDates.size,
      lastCommitDate: lastDate,
      commitDates: Array.from(commitDates),
    };
  }

  static async updateUserStreak(): Promise<StreakData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await axios.post(
        "http://localhost:8080/api/github/update-streak",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to update streak:", error);
      throw error;
    }
  }
}
