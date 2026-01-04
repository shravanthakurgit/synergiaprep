"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function StudyTracker({ children }: Props) {
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;

    function sendStudyMinutes() {
      fetch(`/api/v1/users/${userId}/study-hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, minutes: 2 }),
      }).catch(console.error);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        // Start interval when tab is active
        if (!intervalRef.current) {
          intervalRef.current = setInterval(sendStudyMinutes, 120 * 1000);
        }
      } else {
        // Stop interval when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }

    // Initialize based on current visibility
    handleVisibilityChange();

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Cleanup
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session?.user.id]);

  return <>{children}</>;
}
