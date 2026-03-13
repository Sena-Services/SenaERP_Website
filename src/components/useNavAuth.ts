"use client";

import { useEffect, useRef, useState } from "react";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { storePlatformToken, clearPlatformToken, verifyPlatformToken, goToSite, isSafeRedirectUrl, type PlatformUser } from "@/lib/auth";

export type NavAuthState = {
  platformUser: PlatformUser | null;
  googlePrefill: { name: string; email: string } | null;
  showToast: boolean;
  toastMessage: string;
  toastDuration: number;
  toastActionUrl: string | undefined;
  toastActionLabel: string | undefined;
  goingToSite: boolean;
  showProfileMenu: boolean;
  setShowProfileMenu: (v: boolean) => void;
  setGooglePrefill: (v: { name: string; email: string } | null) => void;
  setShowToast: (v: boolean) => void;
  setToastActionUrl: (v: string | undefined) => void;
  setToastActionLabel: (v: string | undefined) => void;
  handleGoToSite: () => Promise<void>;
  handleLogout: () => void;
  handleWaitlistSuccess: (message: string, email?: string) => void;
  startProvisioningPoll: (email: string) => void;
};

export function useNavAuth(): NavAuthState {
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [googlePrefill, setGooglePrefill] = useState<{ name: string; email: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDuration, setToastDuration] = useState(3000);
  const [toastActionUrl, setToastActionUrl] = useState<string | undefined>();
  const [toastActionLabel, setToastActionLabel] = useState<string | undefined>();
  const [goingToSite, setGoingToSite] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pollProvisioningRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle return from Google SSO + check existing auth
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    // Case 1: Returning known user — platform_token in URL
    const platformToken = params.get("platform_token");
    if (platformToken) {
      storePlatformToken(platformToken);
      window.history.replaceState({}, "", window.location.pathname);
      (async () => {
        try {
          const { authenticated, user } = await verifyPlatformToken();
          if (authenticated && user) {
            setPlatformUser(user);
            setToastMessage(`Welcome back, ${user.full_name || ""}!`);
            setShowToast(true);
          }
        } catch { /* silent */ }
      })();
      return;
    }

    // Case 2: New user from Google SSO — validate token and open signup modal
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, "", window.location.pathname);
      (async () => {
        try {
          const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.VALIDATE_SSO_TOKEN), {
            method: "POST",
            body: JSON.stringify({ token }),
          });
          const data = await resp.json();
          const result = data.message;
          if (result?.success) {
            setGooglePrefill({ name: result.google_name || "", email: result.email });
            // Signal caller to open modal — caller listens to googlePrefill becoming non-null
          } else {
            setToastMessage("Authentication failed. Please try again.");
            setShowToast(true);
          }
        } catch {
          setToastMessage("Authentication failed. Please try again.");
          setShowToast(true);
        }
      })();
      return;
    }

    // Case 3: No URL params — check localStorage for existing platform token
    (async () => {
      try {
        const { authenticated, user } = await verifyPlatformToken();
        if (authenticated && user) setPlatformUser(user);
      } catch { /* silent */ }
    })();
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollProvisioningRef.current) clearInterval(pollProvisioningRef.current);
    };
  }, []);

  const startProvisioningPoll = (email: string) => {
    if (pollProvisioningRef.current) clearInterval(pollProvisioningRef.current);

    let elapsed = 0;
    const INTERVAL = 5000;
    const TIMEOUT = 120000;

    pollProvisioningRef.current = setInterval(async () => {
      elapsed += INTERVAL;
      if (elapsed > TIMEOUT) {
        if (pollProvisioningRef.current) clearInterval(pollProvisioningRef.current);
        pollProvisioningRef.current = null;
        setToastDuration(6000);
        setToastMessage("Setup is taking longer than expected. We\u2019ll email you when your workspace is ready.");
        setShowToast(true);
        return;
      }

      try {
        const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.CHECK_PROVISIONING), {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        const data = await resp.json();
        const result = data.message;

        if (result?.status === "ready") {
          if (pollProvisioningRef.current) clearInterval(pollProvisioningRef.current);
          pollProvisioningRef.current = null;
          setToastDuration(10000);
          setToastMessage("Your workspace is ready!");
          setToastActionUrl(result.site_url || undefined);
          setToastActionLabel(result.site_url ? "Go to workspace" : undefined);
          setShowToast(true);
          verifyPlatformToken().then(({ authenticated, user }) => {
            if (authenticated && user) setPlatformUser(user);
          });
        } else if (result?.status === "failed") {
          if (pollProvisioningRef.current) clearInterval(pollProvisioningRef.current);
          pollProvisioningRef.current = null;
          setToastDuration(6000);
          setToastMessage("Something went wrong setting up your workspace. Please contact support.");
          setShowToast(true);
        }
      } catch { /* silently retry */ }
    }, INTERVAL);
  };

  const handleWaitlistSuccess = (message: string, email?: string) => {
    setToastDuration(email ? 6000 : 3000);
    setToastMessage(message);
    setShowToast(true);
    verifyPlatformToken().then(({ authenticated, user }) => {
      if (authenticated && user) setPlatformUser(user);
    });
    if (email) startProvisioningPoll(email);
  };

  const handleGoToSite = async () => {
    setGoingToSite(true);
    const result = await goToSite();
    if (result && isSafeRedirectUrl(result.site_url)) {
      window.location.href = `${result.site_url}/login?token=${result.token}`;
    } else {
      setToastMessage("Could not access your workspace. Please try again.");
      setShowToast(true);
      setGoingToSite(false);
    }
  };

  const handleLogout = () => {
    clearPlatformToken();
    setPlatformUser(null);
    setShowProfileMenu(false);
    setToastMessage("Signed out successfully.");
    setShowToast(true);
  };

  return {
    platformUser,
    googlePrefill,
    showToast,
    toastMessage,
    toastDuration,
    toastActionUrl,
    toastActionLabel,
    goingToSite,
    showProfileMenu,
    setShowProfileMenu,
    setGooglePrefill,
    setShowToast,
    setToastActionUrl,
    setToastActionLabel,
    handleGoToSite,
    handleLogout,
    handleWaitlistSuccess,
    startProvisioningPoll,
  };
}
