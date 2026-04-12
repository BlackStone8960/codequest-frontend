"use client";

import { GitHubCommit, GitHubService } from "@/services/githubService";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface CalendarDay {
  date: string;
  count: number;
  commits: GitHubCommit[];
}

export default function GitHubCalendar() {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const fetchCalendarData = async () => {
    if (!user?.githubId) {
      setError("GitHub account not linked");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const commits = await GitHubService.getUserCommits();

      // コミットを日付別にグループ化
      const commitsByDate = new Map<string, GitHubCommit[]>();

      commits.forEach((commit) => {
        const date = new Date(commit.date).toISOString().split("T")[0];

        if (!commitsByDate.has(date)) {
          commitsByDate.set(date, []);
        }
        commitsByDate.get(date)!.push(commit);
      });

      // 過去365日間のカレンダーデータを生成
      const calendar: CalendarDay[] = [];
      const today = new Date();

      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        const dayCommits = commitsByDate.get(dateString) || [];
        calendar.push({
          date: dateString,
          count: dayCommits.length,
          commits: dayCommits,
        });
      }

      setCalendarData(calendar);
    } catch (err: unknown) {
      console.error("Failed to fetch calendar data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.githubId) {
      fetchCalendarData();
    }
  }, [user?.githubId]);

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-700";
    if (count <= 3) return "bg-green-600";
    if (count <= 6) return "bg-green-500";
    if (count <= 9) return "bg-green-400";
    return "bg-green-300";
  };

  const getTooltipText = (day: CalendarDay) => {
    if (day.count === 0) {
      return `${day.date}: No pushes`;
    }
    return `${day.date}: ${day.count} pushes`;
  };

  const CELL_SIZE = 12; // w-3 = 12px
  const GAP = 4; // space-x-1 = 4px
  const WEEK_WIDTH = CELL_SIZE + GAP; // 16px per week column

  // 月のラベルを生成
  const getMonthLabels = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // 開始日を週の最初の日（日曜日）に調整
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const labels: { name: string; weeks: number }[] = [];
    let lastMonth = -1;

    for (let week = 0; week < 53; week++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + week * 7);
      const month = weekDate.getMonth();

      if (month !== lastMonth) {
        labels.push({ name: monthNames[month], weeks: 1 });
        lastMonth = month;
      } else if (labels.length > 0) {
        labels[labels.length - 1].weeks++;
      }
    }

    // Hide labels with fewer than 2 weeks to prevent overlap with next label
    return labels.map((label) => ({
      ...label,
      hidden: label.weeks < 2,
    }));
  };

  // 週ごとの行を生成（GitHub風の横長レイアウト）
  const getWeekRows = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // 開始日を週の最初の日（日曜日）に調整
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        // 今日より未来の日付は表示しない
        if (currentDate > today) {
          weekDays.push(null);
          continue;
        }

        const dateString = currentDate.toISOString().split("T")[0];
        const dayData = calendarData.find((d) => d.date === dateString);

        weekDays.push(dayData || null);
      }
      weeks.push(weekDays);
    }

    return weeks;
  };

  if (!user?.githubId) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FaGithub className="text-4xl mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">
          GitHub Integration Required
        </h3>
        <p className="text-gray-400 text-sm">
          Link your GitHub account to view the calendar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaGithub className="text-xl" />
          Push Calendar
        </h3>
        <button
          onClick={fetchCalendarData}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Update
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Fetching calendar data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <FaGithub className="text-4xl mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchCalendarData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {/* GitHub風コントリビューションカレンダー */}
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex flex-col space-y-2 min-w-max pb-2">
              {/* 月のラベル */}
              <div className="flex ml-8">
                {getMonthLabels().map((month, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-400 whitespace-nowrap"
                    style={{ width: `${month.weeks * WEEK_WIDTH}px` }}
                  >
                    {month.hidden ? "" : month.name}
                  </div>
                ))}
              </div>

              {/* カレンダーグリッド（GitHub風の横長レイアウト） */}
              <div className="flex">
                {/* 曜日のラベル */}
                <div className="flex flex-col space-y-1 mr-2">
                  {["Sun", "", "Mon", "", "Wed", "", "Fri"].map((day, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-400 h-3 flex items-center"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* カレンダーグリッド（横長） */}
                <div className="flex space-x-1">
                  {getWeekRows().map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col space-y-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={day ? day.date : `empty-${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${
                            day ? getIntensityColor(day.count) : "bg-transparent"
                          } hover:scale-125 transition-transform cursor-pointer`}
                          data-tooltip-id="calendar-tooltip"
                          data-tooltip-content={day ? getTooltipText(day) : undefined}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Tooltip id="calendar-tooltip" />

          {/* 凡例 */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Push history for the past year</span>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-xl font-bold text-green-400">
                {calendarData.filter((day) => day.count > 0).length}
              </div>
              <div className="text-gray-400">Active Days</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-xl font-bold text-blue-400">
                {calendarData.reduce((sum, day) => sum + day.count, 0)}
              </div>
              <div className="text-gray-400">Total Pushes</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-xl font-bold text-yellow-400">
                {Math.max(...calendarData.map((day) => day.count))}
              </div>
              <div className="text-gray-400">Max Daily Pushes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
