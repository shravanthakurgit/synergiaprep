"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendOTP, verifyOTP } from "@/lib/otp";
import { createUser, getUserByEmail } from "@/app/actions/data";
import { redirect } from "next/navigation";
import { login } from "../actions/login";
import bcrypt from "bcryptjs";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState("");
  const [verificationOtp, setVerificationOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerificationOtpSent, setIsVerificationOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetOtpSent, setIsResetOtpSent] = useState(false);
  const [isResetOtpVerified, setIsResetOtpVerified] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const redirectNext = params.get("next") || "/examprep";

  const handleRequestVerificationOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await getUserByEmail(email);
      if (!!user) {
        setError("Account already exists. Please sign in");
        setIsSignUp(false);
        return;
      }
      const result = await sendOTP(email, "email_verification");
      if (result) setIsVerificationOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVerificationOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const verified = await verifyOTP(
      email,
      verificationOtp,
      "email_verification"
    );
    const user = await getUserByEmail(email);
    if (!verified) {
      setError("OTP is incorrect");
      setLoading(false);
      return;
    }
    if (verified && !user) {
      createUser({
        name: "",
        email: email.toLowerCase(),
        ph_no: phone,
        emailVerified: new Date(Date.now()),
      });
      redirect(`/signup/?email=${email}&phone=${phone}&next=${redirectNext}`);
    }
    if (verified && user) {
      setError("Account already exists..Login directly");
      setIsSignUp(false);
    }
  };

  const handleRequestResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        setError("No account found with this email.");
        return;
      }
      const result = await sendOTP(email, "forgot_password");
      if (result) setIsResetOtpSent(true);
    } catch (err) {
      setError("Failed to send reset OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: resetOtp, type: "forgot_password" }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "OTP verification failed. Try again.");
        return;
      }

      setResetToken(data.token); // store token for reset
      setIsResetOtpVerified(true);
    } catch (err) {
      setError("OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (resetPassword !== resetConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!resetToken) {
      setError("Missing token. Please retry the process.");
      return;
    }

    setLoading(true);
    const hashedPassword = (await bcrypt.hash(resetPassword, 10)) as string;
    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          newPassword: hashedPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Password reset failed. Try again.");
        return;
      }

      setIsForgotPassword(false);
      setIsResetOtpSent(false);
      setIsResetOtpVerified(false);
      setResetToken(null);
      setResetOtp("");
      setResetPassword("");
      setResetConfirmPassword("");
      setError("Password reset successful! Please sign in.");
    } catch (err) {
      setError("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const [isPending, startTransition] = useTransition();

  const signInHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    startTransition(() => {
      interface LoginResponse {
        error?: string;
      }
      login({ email, password, redirectNext })
        .then(async (data: LoginResponse | undefined) => {
          if (data?.error) {
            setError(data.error);
          } else {

            await router.refresh();
            router.push(redirectNext);
          }
        })
        .finally(() => {
          
          setLoading(false);
        });
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl relative rounded-3xl overflow-hidden shadow-xl h-auto md:h-[40rem] flex flex-col md:flex-row">
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-white z-10"
          onClick={() => router.push("/")}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image Section - Shows First on Mobile */}
        <div className="w-full h-64 md:h-auto md:w-1/2 bg-gradient-to-br from-blue-300 to-blue-800 flex flex-col items-center justify-center p-6 order-1">
          <CardHeader>
            <CardTitle className="text-2xl md:text-4xl font-extrabold text-white text-center">
              Welcome to SynergiaPrep!
            </CardTitle>
            <p className="text-white mt-2 text-center text-sm md:text-lg">
              India&apos;s most trusted education platform
            </p>
          </CardHeader>
          <CardContent>
            <Image
              src="/assets/images/Logomark.png"
              alt="Logo"
              width={80}
              height={80}
              className="opacity-70 mt-4 md:mt-6 object-contain"
              priority
            />
          </CardContent>
        </div>

        {/* Form Section - Shows Second on Mobile */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-8 flex flex-col justify-center shadow-lg order-2">
          <Label className="font-semibold text-gray-800 text-xl md:text-2xl mb-4 md:mb-6">
            {isSignUp
              ? "Sign Up"
              : isForgotPassword
                ? "Reset Password"
                : "Sign In"}
          </Label>

          <div className="space-y-4 md:space-y-6">
            {isSignUp ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-light text-gray-800 text-sm md:text-base">
                    Mobile number
                  </Label>
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-light text-gray-800 text-sm md:text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isVerificationOtpSent || loading}
                    required
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                {isVerificationOtpSent && (
                  <div className="space-y-4">
                    <Label
                      htmlFor="otp"
                      className="font-semibold text-gray-700 text-base md:text-lg"
                    >
                      Enter OTP sent to your EMAIL
                    </Label>
                    <Input
                      id="otp"
                      type="number"
                      placeholder="Enter 6-digit OTP"
                      value={verificationOtp}
                      onChange={(e) => setVerificationOtp(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-3 md:py-2"
                  disabled={loading}
                  onClick={
                    isVerificationOtpSent
                      ? handleVerifyVerificationOTP
                      : handleRequestVerificationOTP
                  }
                >
                  {loading
                    ? "Processing..."
                    : !isVerificationOtpSent
                      ? "Request OTP"
                      : "Sign In"}
                </Button>
              </div>
            ) : isForgotPassword ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-light text-gray-800 text-sm md:text-base">
                    Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                    disabled={loading || isResetOtpVerified}
                  />
                </div>

                {!isResetOtpSent && (
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-3 md:py-2"
                    disabled={loading}
                    onClick={handleRequestResetOTP}
                  >
                    {loading ? "Processing..." : "Request Reset OTP"}
                  </Button>
                )}

                {isResetOtpSent && !isResetOtpVerified && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="reset-otp"
                        className="font-light text-gray-800 text-sm md:text-base"
                      >
                        OTP
                      </Label>
                      <Input
                        id="reset-otp"
                        type="number"
                        placeholder="Enter OTP"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-3 md:py-2"
                      disabled={loading}
                      onClick={handleVerifyResetOTP}
                    >
                      {loading ? "Processing..." : "Verify OTP"}
                    </Button>
                  </>
                )}

                {isResetOtpVerified && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="reset-password"
                        className="font-light text-gray-800 text-sm md:text-base"
                      >
                        New Password
                      </Label>
                      <Input
                        id="reset-password"
                        type="password"
                        placeholder="Enter new password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="reset-confirm"
                        className="font-light text-gray-800 text-sm md:text-base"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="reset-confirm"
                        type="password"
                        placeholder="Confirm new password"
                        value={resetConfirmPassword}
                        onChange={(e) =>
                          setResetConfirmPassword(e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-3 md:py-2"
                      disabled={loading}
                      onClick={handleResetPassword}
                    >
                      {loading ? "Processing..." : "Reset Password"}
                    </Button>
                  </>
                )}

                <p className="text-xs md:text-sm text-gray-600 mt-4 text-center">
                  Remembered your password?{" "}
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsResetOtpSent(false);
                      setIsResetOtpVerified(false);
                      setResetOtp("");
                      setResetPassword("");
                      setResetConfirmPassword("");
                      setError("");
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-light text-gray-800 text-sm md:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-light text-gray-800 text-sm md:text-base"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                    disabled={isPending}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-3 md:py-2"
                  disabled={isPending}
                  onClick={signInHandler}
                >
                  {isPending ? "Processing..." : "Sign In"}
                </Button>
                <p
                  className="text-xs md:text-sm text-blue-500 hover:underline text-center mt-2 cursor-pointer"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </p>
              </>
            )}

            {error && (
              <p className="text-xs md:text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-4 text-center">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;