"use client";

import { useUserStore } from "@/store/userStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { setUser } = useUserStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit to backend
    console.log("Submitting form", form);

    try {
      const { username, displayName, email, password, confirmPassword } = form;

      // If password and confirm password do not match, show an alert
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password,
        displayName,
      });

      const { user, token } = res.data;
      console.log("Registration successful:", user, token);

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
        "Registration error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="displayName"
            type="text"
            placeholder="Display name"
            value={form.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-white">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>

        <button className="w-full flex items-center justify-center border border-white text-white py-2 rounded-md hover:bg-white hover:text-black transition">
          <FaGithub className="mr-2" />
          Sign up with GitHub
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
