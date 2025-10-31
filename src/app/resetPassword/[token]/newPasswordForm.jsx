"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Lock, RefreshCw } from "lucide-react";
import { redirect } from "next/navigation";

export default function NewPasswordForm({ token }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();

  if (!token) {
    redirect("/");
  }
  useEffect(() => {
    if (password.length > 0 && password.length < 6) {
      setError("Password must be at least 6 characters long");
    } else {
      setError("");
    }
  }, [password]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/resetPassword/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(data.error || "Failed to update password. Please try again.");
      }
    } catch (err) {
        setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all hover:shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter a strong password to secure your account
            </p>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <div className="pl-3">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword? "text":"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-3 text-gray-900 placeholder-gray-400 outline-none rounded-lg"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <Image src={showPassword? '/image/show.png': '/image/hide.png'} alt="icon" height={24} width={24} onClick={togglePassword} className="mx-2"/>
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || password.length < 6}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white transition-all transform active:scale-95 ${
              isLoading || password.length < 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>

          {/* Success Message */}
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center animate-pulse">
              {message}
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Remember to use a strong, unique password.
        </p>
      </div>
    </div>
  );
}