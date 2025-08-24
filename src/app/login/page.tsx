"use client";

import { useUserStore } from "@/store/userStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;
      console.log("Login successful:", user, token);

      // Store user data in Zustand store
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

      // Store token in local storage
      localStorage.setItem("token", token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      // TODO: Add error handling (e.g., show a notification)
    }
  };

  const handleGitHubLogin = () => {
    // Redirect to GitHub OAuth endpoint
    window.location.href = "http://localhost:8080/api/auth/github";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm bg-[#0B0F19] p-8 rounded-xl shadow space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>

        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-center text-white">
          Don’t have an account?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Create account
          </Link>
        </p>

        <div className="mt-6">
          <button 
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center border border-white text-white py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
