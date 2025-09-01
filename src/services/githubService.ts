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
  repository?: {
    name: string;
    full_name: string;
  };
  branch?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  lastCommitDate: string | null;
  commitDates: string[];
}

export class GitHubService {
  /** Add days to a UTC date string "YYYY-MM-DD", return "YYYY-MM-DD" in UTC. */
  private static addDaysUTC(yyyyMMdd: string, delta: number): string {
    // Force UTC midnight to avoid TZ/DST issues
    const d = new Date(yyyyMMdd + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
  }

  /** Difference in whole days between two UTC date strings (b - a). */
  private static diffDaysUTC(aYYYYMMDD: string, bYYYYMMDD: string): number {
    const a = new Date(aYYYYMMDD + "T00:00:00Z").getTime();
    const b = new Date(bYYYYMMDD + "T00:00:00Z").getTime();
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
  }

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
      // より詳細なコミット情報を取得
      const response = await axios.get(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:>${
          since.toISOString().split("T")[0]
        }&sort=committer-date&order=desc`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.cloak-preview",
          },
        }
      );

      const commits = response.data.items || [];

      // 各コミットの詳細情報を取得
      const detailedCommits = await Promise.all(
        commits.slice(0, 50).map(async (commit: any) => {
          try {
            const commitResponse = await axios.get(commit.url, {
              headers: {
                Authorization: `token ${githubToken}`,
              },
            });

            return {
              ...commit,
              repository: commitResponse.data.repository,
              branch: commitResponse.data.branch,
            };
          } catch (error) {
            console.warn("Failed to fetch commit details:", error);
            return commit;
          }
        })
      );

      return detailedCommits;
    } catch (error) {
      console.error("Failed to fetch GitHub commits:", error);
      throw error;
    }
  }

  static calculateStreak(commits: GitHubCommit[]): StreakData {
    // --- Normalize commit dates to UTC "YYYY-MM-DD" and dedupe ---
    const datesSet = new Set<string>();
    for (const c of commits) {
      const day = new Date(c.commit.author.date).toISOString().slice(0, 10); // UTC day
      datesSet.add(day);
    }

    const daysAsc = [...datesSet].sort(); // ascending "YYYY-MM-DD"
    const lastCommitDate = daysAsc.length ? daysAsc[daysAsc.length - 1] : null;

    // --- Today/Yesterday in UTC to match normalization above ---
    const todayUTC = new Date().toISOString().slice(0, 10);
    const yesterdayUTC = this.addDaysUTC(todayUTC, -1);

    // --- 1) longestStreak over *all* history ---
    let longest = 0;
    let run = 0;
    for (let i = 0; i < daysAsc.length; i++) {
      if (i === 0) {
        run = 1;
      } else {
        // If consecutive (prev -> curr = +1 day), extend the run; otherwise reset
        const d = this.diffDaysUTC(daysAsc[i - 1], daysAsc[i]); // expected 1 for consecutive
        run = d === 1 ? run + 1 : 1;
      }
      if (run > longest) longest = run;
    }

    // --- 2) currentStreak starting from today or from yesterday ---
    let current = 0;
    let anchor: string | null = null;
    if (datesSet.has(todayUTC)) anchor = todayUTC;
    else if (datesSet.has(yesterdayUTC)) anchor = yesterdayUTC; // allow yesterday as active

    if (anchor) {
      current = 1; // anchor day counts as 1
      // Walk backwards while consecutive days exist in the set
      while (true) {
        const prev = this.addDaysUTC(anchor, -1);
        if (datesSet.has(prev)) {
          current++;
          anchor = prev;
        } else {
          break;
        }
      }
    }

    return {
      currentStreak: current,
      longestStreak: longest,
      totalContributions: datesSet.size,
      lastCommitDate,
      commitDates: [...datesSet],
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
