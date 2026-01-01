"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: { email: string; password: string; redirectNext?: string }) => {
  const { email, password, redirectNext } = values;
  if (!email || !password) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectNext || "/examprep",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "An error occurred" };
      }
    }
    throw error;
  }
};