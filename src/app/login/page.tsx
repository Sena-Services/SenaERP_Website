"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call websitecms login API
      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";

      // Step 1: Get CSRF token first
      const csrfResponse = await fetch(
        `${frappeUrl}/api/method/websitecms.api.user_auth.get_csrf_token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.message?.csrf_token;

      if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
      }

      // Step 2: Make login request with CSRF token
      const response = await fetch(
        `${frappeUrl}/api/method/websitecms.api.user_auth.login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Frappe-CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.message?.success) {
        // Get site URL and token from response
        const { site_url, token } = data.message;

        // Redirect to provisioned site with auto-login token
        window.location.href = `${site_url}/api/method/sentra_core.api.user_auth.auto_login?token=${token}`;
      } else {
        setError(data.message?.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-waygent-light-blue to-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Back Button */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                width={64}
                height={64}
                alt="Sena logo"
                className="mx-auto mb-4"
              />
            </Link>
            <h1 className="text-3xl font-rockwell text-waygent-text-primary">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waygent-orange focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-waygent-orange text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <Link
            href="/signup"
            className="block w-full text-center py-3 border-2 border-waygent-orange text-waygent-orange rounded-lg font-medium hover:bg-orange-50 transition duration-200"
          >
            Create Account
          </Link> */}
        </div>
      </div>
    </div>
  );
}