"use client";

import { redirect, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";
import { dbUpdateUsingEmail, getUserByEmail } from "@/app/actions/data";
import bcrypt from "bcryptjs";
import { login } from "@/app/actions/login";
import { useTransition, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!searchParams.has("email") || !searchParams.has("phone"))
    redirect("/login");

  const email = searchParams.get("email")!;
  const phone = searchParams.get("phone")!;
  const redirectNext = searchParams.get("next") || "/examprep";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = await getUserByEmail(email as string);
    const verified = user?.emailVerified;

    if (!verified && !!user) {
      redirect("/login");
    }

    if (user) {
      const hashedPassword = (await bcrypt.hash(password, 10)) as string;
      const updated = await dbUpdateUsingEmail(email as string, {
        name,
        password: hashedPassword,
      });

      if (updated) {
        startTransition(() => {
          interface LoginResponse {
            error?: string;
          }
          login({ email, password, redirectNext })
            .then(async (data: LoginResponse | undefined) => {
              if (data?.error) setError(data.error);
              else {
                await router.refresh();
                router.push(redirectNext as string);
              }
            })
            .finally(() => {
              console.log("Login after signup");
            });
        });
      }
    } else {
      setError("User not found. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl relative rounded-3xl overflow-hidden shadow-xl h-[40rem] flex">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-white z-10"
          onClick={() => router.push("/")}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left Side (Branding) */}
        <div className="w-1/2 bg-gray-50">
          <div className="relative w-full bg-gradient-to-br from-blue-300 to-blue-800 flex flex-col items-center justify-center h-full">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-white text-center">
                Welcome to SynergiaPrep!
              </CardTitle>
              <p className="text-white mt-2 text-center text-lg">
                India&apos;s most trusted education platform
              </p>
            </CardHeader>
            <CardContent>
              <Image
                src="/assets/images/Logomark.png"
                alt="Logo"
                width={96}
                height={96}
                className="opacity-70 mt-6 object-contain"
              />
            </CardContent>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center shadow-lg">
          <Label className="font-semibold text-gray-800 text-2xl mb-4">
            Complete Your Profile
          </Label>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-light text-gray-800">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-light text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                className="w-full bg-white border-2 border-gray-300 text-gray-500 font-semibold rounded-lg shadow-md"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-light text-gray-800">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                className="w-full bg-white border-2 border-gray-300 text-gray-500 font-semibold rounded-lg shadow-md"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-light text-gray-800">
                Create Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Set a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-light text-gray-800">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={isPending}
              />
            </div>

            

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isPending}
              onClick={handleSignUp}
            >
              {isPending ? "Processing..." : "Complete Sign Up"}
            </Button>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already verified your account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

const SuspendedSignup = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignupForm />
  </Suspense>
);

export default SuspendedSignup;
