"use client";

import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setError("Authentication token not found");
          setIsLoading(false);
          return;
        }

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Fetch user data using the token
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;

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

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError("Authentication failed");
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, setUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
