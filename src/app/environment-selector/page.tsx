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
      console.log('[EnvironmentSelector] Verifying authentication...');
      const authResult = await checkAuth();
      console.log('[EnvironmentSelector] Auth result:', authResult);

      if (!authResult.authenticated) {
        // Not logged in - redirect to login
        console.log('[EnvironmentSelector] Not authenticated, redirecting to login');
        router.push("/login");
        return;
      }

      console.log('[EnvironmentSelector] User authenticated');
      // Don't load environment from localStorage - let user explicitly select
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, [router]);

  const handleEnvironmentSelect = (environmentName: string) => {
    // Save environment to localStorage
    saveEnvironment(environmentName);
    setCurrentEnvironment(environmentName);

    console.log('[EnvironmentSelector] Environment selected and saved:', environmentName);

    // Redirect to Frappe site
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://senatest2.localhost:8080";
    window.location.href = frappeUrl;
  };

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FAF9F5]">
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
        background: "#FAF9F5",
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
