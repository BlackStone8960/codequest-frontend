"use client";

import AddTaskModal from "@/components/AddTaskModal";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  userId: string;
}

// Format date for display
const formatDate = (date: string) => {
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
};

// Validate due date to prevent past dates
const isValidDueDate = (date: string) => {
  try {
    const inputDate = parseISO(date);
    const today = startOfDay(new Date());
    return !isBefore(inputDate, today);
  } catch (error) {
    console.error("Error validating date:", error);
    return false;
  }
};

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  // Separate tasks into completed and incomplete
  const { completedTasks, incompleteTasks } = useMemo(() => {
    const completed = tasks.filter((task) => task.completed);
    const incomplete = tasks.filter((task) => !task.completed);
    return {
      completedTasks: completed,
      incompleteTasks: incomplete,
    };
  }, [tasks]);

  // Fetch all tasks from the API
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8080/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort tasks by due date
      const sortedTasks = response.data.sort((a: Task, b: Task) => {
        return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
      });

      setTasks(sortedTasks);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        // Clear user data and redirect to login page on authentication error
        clearUser();
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setError("Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = async (
    task: Omit<Task, "_id" | "completed" | "userId">
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      // Validate due date before submission
      if (!isValidDueDate(task.dueDate)) {
        setError("Due date cannot be in the past");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      setError(null);
    } catch (err: any) {
      console.error("Error adding task:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        clearUser();
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setError("Failed to add task.");
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8080/api/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user data in Zustand store
      const { user } = response.data;
      setUser({
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        githubId: user.githubId,
        displayName: user.displayName,
        totalExperience: user.totalExperience,
        currentHP: user.currentHP,
        maxHP: user.maxHP,
        currentLevelXP: user.currentLevelXP,
        levelUpXP: user.levelUpXP,
        rank: user.rank,
        level: user.level,
        tasksCompleted: user.tasksCompleted || [],
        streak: user.streak,
      });

      // Refresh tasks to get updated state
      await fetchTasks();
      setError(null);
    } catch (err: any) {
      console.error("Error updating task:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        clearUser();
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setError("Failed to update task.");
    }
  };

  // Fetch tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  // Render individual task card
  const renderTaskCard = (task: Task) => (
    <div
      key={task._id}
      className="bg-[#1e293b] rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleToggleComplete(task._id)}
          className="mt-1.5 h-5 w-5 rounded border-gray-600 bg-gray-700 checked:bg-blue-600"
        />
        <div className="flex-1">
          <h3
            className={`text-xl font-semibold mb-2 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>
          <div className="space-y-1 text-gray-400">
            <p>Due: {formatDate(task.dueDate)}</p>
            <p>
              Difficulty:{" "}
              <span
                className={
                  task.difficulty === "hard"
                    ? "text-red-400"
                    : task.difficulty === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }
              >
                {task.difficulty
                  ? task.difficulty.charAt(0).toUpperCase() +
                    task.difficulty.slice(1)
                  : "Medium"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f172a] text-white px-4 py-2">
        <Header />

        {/* Tasks Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Tasks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span> Add Task
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Incomplete Tasks */}
            <div className="space-y-4">
              {incompleteTasks.map(renderTaskCard)}
            </div>

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <button
                  onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                  {showCompletedTasks ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                  Completed Tasks ({completedTasks.length})
                </button>

                {showCompletedTasks && (
                  <div className="space-y-4 opacity-75">
                    {completedTasks.map(renderTaskCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTask}
        />
      </div>
    </ProtectedRoute>
  );
}
