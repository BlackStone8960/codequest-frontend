"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      // Redirect to login page if user is not authenticated
      router.push("/login");
    }
  }, [hasHydrated, user, router]);

  if (!user) {
    // Render nothing when user is not authenticated
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
