"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";

export default function LogoutButton() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser(); // Clear user data from Zustand store
    localStorage.removeItem("token"); // Remove token from local storage
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-500 hover:text-red-600 gap-2"
    >
      <FaPowerOff />
      <span>Log out</span>
    </button>
  );
}
