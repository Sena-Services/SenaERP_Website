"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { storePlatformToken } from "@/lib/auth";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  googlePrefill?: { name: string; email: string } | null;
  initialView?: "signin" | "signup" | "pitch_deck";
}

/* ── Shared Google button ── */
function GoogleSSOButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const redirectTo = encodeURIComponent(window.location.href.split("?")[0]);
        window.location.href =
          getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_SSO_LOGIN) + `?redirect_to=${redirectTo}`;
      }}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full bg-white text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-all font-space-grotesk cursor-pointer"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" className="flex-shrink-0">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[13px] text-gray-500 font-space-grotesk">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export default function SignupModal({ isOpen, onClose, onSuccess, googlePrefill, initialView }: SignupModalProps) {
  const isGoogle = !!googlePrefill;
  const defaultView = initialView === "pitch_deck" ? "pitch_deck" : (isGoogle ? "signup" : "signin");
  const [view, setView] = useState<"signin" | "signup" | "pitch_deck" | "verify">(defaultView);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sign-in fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Verification fields
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [resending, setResending] = useState(false);

  // Sign-up fields
  const [signupName, setSignupName] = useState(googlePrefill?.name || "");
  const [signupEmail, setSignupEmail] = useState(googlePrefill?.email || "");
  const [signupSiteName, setSignupSiteName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [pitchDeckMessage, setPitchDeckMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // When googlePrefill changes (e.g. returning from SSO), update fields and view
  useEffect(() => {
    if (googlePrefill) {
      setSignupName(googlePrefill.name);
      setSignupEmail(googlePrefill.email);
      setView("signup");
    }
  }, [googlePrefill]);

  // Sync view when initialView or isOpen changes
  useEffect(() => {
    if (isOpen && initialView) {
      setView(initialView === "pitch_deck" ? "pitch_deck" : (isGoogle ? "signup" : initialView));
    }
  }, [isOpen, initialView, isGoogle]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoginEmail("");
      setLoginPassword("");
      if (!isGoogle) {
        setView(initialView === "pitch_deck" ? "pitch_deck" : "signin");
        setSignupName("");
        setSignupEmail("");
      }
      setSignupSiteName("");
      setSignupPassword("");
      setPitchDeckMessage("");
    }
  }, [isOpen, isGoogle, initialView]);

  useLockBodyScroll(isOpen);

  if (!isOpen || !mounted) return null;

  const switchView = (v: "signin" | "signup" | "pitch_deck") => {
    setError(null);
    setView(v);
  };

  /* ── Sign In handler ── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await resp.json();
      const result = data.message;

      if (result?.success && result?.site_url) {
        // User has a provisioned site — store token, stay on marketing site
        if (result.platform_token) {
          storePlatformToken(result.platform_token);
        }
        onSuccess(`Welcome back, ${result.full_name || ""}!`);
        onClose();
      } else if (result?.success && result?.no_site) {
        // Signed in but no site yet (waitlisted)
        if (result.platform_token) {
          storePlatformToken(result.platform_token);
        }
        onSuccess("Welcome back! Your workspace is being set up. We\u2019ll notify you when it\u2019s ready.");
        onClose();
      } else {
        setError(result?.error || "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Sign Up handler ── */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!isGoogle && (!signupPassword || signupPassword.length < 8)) {
      setError("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
        method: "POST",
        body: JSON.stringify({
          full_name: signupName,
          email: signupEmail,
          company_name: signupSiteName,
          auth_method: isGoogle ? "Google" : "Password",
          user_password: isGoogle ? undefined : signupPassword,
          access_type: "Product",
        }),
      });
      const data = await resp.json();
      const result = data.message;

      if (result?.success && result?.needs_verification) {
        // Password signup — needs email verification
        setVerifyEmail(result.email || signupEmail);
        setVerifyCode("");
        setError(null);
        setView("verify");
      } else if (result?.success) {
        if (result.platform_token) {
          storePlatformToken(result.platform_token);
        }
        onSuccess(result.message || "You have been added to the Waitlist!");
        onClose();
      } else {
        setError(result?.message || result?.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Pitch Deck Request handler ── */
  const handlePitchDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_WAITLIST), {
        method: "POST",
        body: JSON.stringify({
          full_name: signupName,
          email: signupEmail,
          access_type: "Pitch Deck",
          message: pitchDeckMessage || undefined,
        }),
      });
      const data = await resp.json();
      const result = data.message;

      if (result?.success) {
        onSuccess(result.message || "We'll send the pitch deck to your email shortly!");
        onClose();
      } else {
        setError(result?.message || result?.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Verify Email handler ── */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_EMAIL), {
        method: "POST",
        body: JSON.stringify({ email: verifyEmail, code: verifyCode }),
      });
      const data = await resp.json();
      const result = data.message;

      if (result?.success) {
        if (result.platform_token) {
          storePlatformToken(result.platform_token);
        }
        onSuccess(result.message || "Email verified! Your account has been created.");
        onClose();
      } else {
        setError(result?.error || "Verification failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.RESEND_VERIFICATION), {
        method: "POST",
        body: JSON.stringify({ email: verifyEmail }),
      });
      const data = await resp.json();
      const result = data.message;
      if (result?.success) {
        setError(null);
      } else {
        setError(result?.error || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-[32px] shadow-2xl max-w-4xl w-full z-10 max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid lg:grid-cols-2 gap-0 flex-1 min-h-0">
          {/* Left side — Image */}
          <div className="relative hidden lg:block bg-gradient-to-br from-[#EBE5D9] to-[#f5f2e9] h-full min-h-[480px]">
            <Image
              src="/screenshots/early-access.png"
              alt="Get Started"
              fill
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Right side — Form */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col overflow-y-auto modal-scroll">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ─── SIGN IN VIEW ─── */}
            {view === "signin" && (
              <div className="my-auto">
                <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 font-futura mb-2">
                  Sign in
                </h2>
                <p className="text-sm text-gray-500 font-space-grotesk mb-6">
                  Access your SenaERP workspace
                </p>

                <GoogleSSOButton label="Sign in with Google" />
                <Divider />

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-space-grotesk">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="sr-only">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="sr-only">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#8FB7C5] text-white text-[15px] font-bold rounded-full hover:bg-[#7AA5B5] transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <p className="text-sm text-gray-500 font-space-grotesk text-center mt-6">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-sena-orange font-semibold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}

            {/* ─── SIGN UP VIEW ─── */}
            {view === "signup" && (
              <div className="my-auto">
                <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 font-futura mb-2">
                  Create your account
                </h2>
                <p className="text-sm text-gray-500 font-space-grotesk mb-6">
                  Set up your own SenaERP workspace
                </p>

                {!isGoogle && (
                  <>
                    <GoogleSSOButton label="Sign up with Google" />
                    <Divider />
                  </>
                )}

                {isGoogle && (
                  <div className="mb-5 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm text-green-700 font-space-grotesk">
                      Signed in as <strong>{signupEmail}</strong>
                    </span>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-space-grotesk">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      readOnly={isGoogle}
                      className={`w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk ${isGoogle ? "bg-gray-50 text-gray-500" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="john@example.com"
                      readOnly={isGoogle}
                      className={`w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk ${isGoogle ? "bg-gray-50 text-gray-500" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Site name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={signupSiteName}
                      onChange={(e) => setSignupSiteName(e.target.value)}
                      placeholder="e.g. acme, john"
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                    />
                    <p className="text-xs text-gray-400 mt-1.5 ml-1 font-space-grotesk leading-relaxed">
                      This is your workspace URL:{" "}
                      <strong>{signupSiteName ? signupSiteName.toLowerCase() : "yoursite"}.senaerp.com</strong>
                      <br />
                      Pick a short, memorable name — you can&apos;t change it later.
                    </p>
                  </div>
                  {!isGoogle && (
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        autoComplete="new-password"
                        className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                      />
                      {signupPassword && (
                        <span className={`text-xs font-space-grotesk mt-1.5 ml-1 block ${signupPassword.length >= 8 ? "text-green-500" : "text-red-500"}`}>
                          {signupPassword.length >= 8 ? "\u2713" : "\u2717"} At least 8 characters
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#8FB7C5] text-white text-[15px] font-bold rounded-full hover:bg-[#7AA5B5] transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <p className="text-sm text-gray-500 font-space-grotesk text-center mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("signin")}
                    className="text-sena-orange font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* ─── VERIFY EMAIL VIEW ─── */}
            {view === "verify" && (
              <div className="my-auto">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#8FB7C5]/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 font-futura mb-2 text-center">
                  Check your email
                </h2>
                <p className="text-sm text-gray-500 font-space-grotesk mb-6 text-center">
                  We sent a 6-digit code to{" "}
                  <strong className="text-gray-700">{verifyEmail}</strong>
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-space-grotesk">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Verification code
                    </label>
                    <input
                      type="text"
                      required
                      value={verifyCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setVerifyCode(val);
                      }}
                      placeholder="000000"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || verifyCode.length !== 6}
                    className="w-full py-3 bg-[#8FB7C5] text-white text-[15px] font-bold rounded-full hover:bg-[#7AA5B5] transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Verifying..." : "Verify"}
                  </button>
                </form>

                <p className="text-sm text-gray-500 font-space-grotesk text-center mt-6">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-sena-orange font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </p>
              </div>
            )}

            {/* ─── PITCH DECK VIEW ─── */}
            {view === "pitch_deck" && (
              <div className="my-auto">
                <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 font-futura mb-2">
                  Request Pitch Deck
                </h2>
                <p className="text-sm text-gray-500 font-space-grotesk mb-6">
                  We&apos;ll send our pitch deck to your email
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-space-grotesk">{error}</p>
                  </div>
                )}

                <form onSubmit={handlePitchDeck} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1 font-space-grotesk">
                      Message
                    </label>
                    <textarea
                      value={pitchDeckMessage}
                      onChange={(e) => setPitchDeckMessage(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={3}
                      className="w-full px-4 py-3 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none transition-all font-space-grotesk resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#8FB7C5] text-white text-[15px] font-bold rounded-full hover:bg-[#7AA5B5] transition-all font-space-grotesk cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Request Pitch Deck"}
                  </button>
                </form>

                <p className="text-sm text-gray-500 font-space-grotesk text-center mt-6">
                  Want to get started instead?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-sena-orange font-semibold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
