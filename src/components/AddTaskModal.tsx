"use client";

import { useState } from "react";
import { FaCalendar } from "react-icons/fa";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    dueDate: string;
    difficulty: "easy" | "medium" | "hard";
  }) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      dueDate,
      difficulty,
    });
    setTitle("");
    setDueDate("");
    setDifficulty("medium");
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-[#1e293b] rounded-xl p-6 z-50 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add Task</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <input
              type="text"
              placeholder="Task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Due Date */}
          <div className="relative">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <FaCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "easy" | "medium" | "hard")
              }
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy" className="bg-[#1e293b]">
                Easy
              </option>
              <option value="medium" className="bg-[#1e293b]">
                Medium
              </option>
              <option value="hard" className="bg-[#1e293b]">
                Hard
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
