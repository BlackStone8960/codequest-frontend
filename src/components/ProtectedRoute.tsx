"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not authenticated
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    // Render nothing when user is not authenticated
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
