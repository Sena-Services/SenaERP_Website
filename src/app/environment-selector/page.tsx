"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import EnvironmentSelector from "@/components/EnvironmentSelector";
import { checkAuth, type User } from "@/lib/auth";
import { getEnvironment, setEnvironment as saveEnvironment } from "@/lib/environmentStorage";

export default function EnvironmentSelectorPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentEnvironment, setCurrentEnvironment] = useState<string | undefined>(undefined);

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const authResult = await checkAuth();

      if (!authResult.authenticated) {
        // Not logged in - redirect to login
        router.push("/login");
        return;
      }

      // Don't load environment from localStorage - let user explicitly select
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, [router]);

  const handleEnvironmentSelect = async (environmentName: string) => {
    // Save environment to localStorage
    saveEnvironment(environmentName);
    setCurrentEnvironment(environmentName);

    try {
      // Get user's site URL from backend
      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";
      const response = await fetch(
        `${frappeUrl}/api/method/websitecms.api.user_auth.get_user_site_url`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get site URL");
      }

      const data = await response.json();

      if (data.message?.success && data.message?.site_url) {
        // Redirect to user's provisioned site
        window.location.href = data.message.site_url;
      } else {
        alert(`Failed to get site URL: ${data.message?.error || 'Unknown error'}`);
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error getting site URL:", error);
      alert(`Failed to connect to API: ${error}`);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F5F1E8]">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-sm text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F5F1E8",
      }}
    >
      <NavBar />
      <div className="relative" style={{ height: "calc(100vh - 60px)" }}>
        <EnvironmentSelector
          currentEnvironment={currentEnvironment}
          onEnvironmentSelect={handleEnvironmentSelect}
        />
      </div>
    </div>
  );
}
