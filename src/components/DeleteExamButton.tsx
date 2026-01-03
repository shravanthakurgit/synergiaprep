"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { RoleType } from "@prisma/client";
import { Trash2 } from "lucide-react";

interface DeleteExamButtonProps {
  examId: string;
  onDeleted?: () => void; // optional callback (refresh, redirect, etc.)
  variant?: "default" | "destructive" | "outline";
  size?: "sm" | "default" | "lg" | "icon";
}

export default function DeleteExamButton({
  examId,
  onDeleted,
  variant = "destructive",
  size = "sm",
}: DeleteExamButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const role = session?.user?.role;

  // hide button if not admin
  if (
    role !== RoleType.ADMIN &&
    role !== RoleType.SUPERADMIN
  ) {
    return null;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/v1/exams/${examId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete exam");
      }

      alert("Exam deleted successfully");

      onDeleted?.();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDelete}
      disabled={loading}
      className="gap-2 w-full text-sm"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete Exam"}
    </Button>
  );
}
