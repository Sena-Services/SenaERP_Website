"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { storePlatformToken, verifyPlatformToken, isSafeRedirectUrl } from "@/lib/auth";
import PinwheelLogo from "@/components/PinwheelLogo";

/** Validate an invite token via the centralized API client. */
async function validateInvite(token: string) {
  const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.VALIDATE_INVITE), {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  const data = await resp.json();
  return data.message;
}

/** Accept an invite. Returns { success, site_url, token } or { error }. */
async function acceptInvite(token: string, email: string) {
  const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.ACCEPT_INVITE), {
    method: "POST",
    body: JSON.stringify({ token, email }),
  });
  const data = await resp.json();
  return data.message;
}

/** Mask an email for display: "ak***@sena.services" */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5EF]" />}>
      <InvitePageContent />
    </Suspense>
  );
}

function InvitePageContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token") || "";

  const [invite, setInvite] = useState<{
    email: string;
    site: string;
    site_name: string;
    invited_by: string;
  } | null>(null);
  const [view, setView] = useState<"loading" | "signin" | "signup" | "error">("loading");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign-in fields
  const [password, setPassword] = useState("");

  // Sign-up fields
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [ssoRedirecting, setSsoRedirecting] = useState(false);

  // Handle platform_token return from Google SSO
  useEffect(() => {
    const platformToken = searchParams.get("platform_token");
    if (!platformToken || !inviteToken) return;

    storePlatformToken(platformToken);

    // Clean URL — remove platform_token but keep invite token
    window.history.replaceState({}, "", `/invite?token=${inviteToken}`);

    setSsoRedirecting(true);
    setView("loading");

    (async () => {
      try {
        // Verify the SSO token to get the authenticated email
        const authState = await verifyPlatformToken();
        if (!authState.authenticated || !authState.user) {
          setError("Google sign-in failed. Please try again.");
          setView("error");
          setSsoRedirecting(false);
          return;
        }

        const ssoEmail = authState.user.email.toLowerCase();

        // Validate the invite to get the expected email
        const validateResult = await validateInvite(inviteToken);

        if (!validateResult?.success) {
          setError(validateResult?.error || "Invalid or expired invite.");
          setView("error");
          setSsoRedirecting(false);
          return;
        }

        const inviteEmail = validateResult.email.toLowerCase();

        // Check email match
        if (ssoEmail !== inviteEmail) {
          setInvite(validateResult);
          setError(
            `You signed in as ${maskEmail(ssoEmail)}, but this invite is for ${maskEmail(inviteEmail)}. Please sign in with the correct Google account.`
          );
          setView("signup");
          setSsoRedirecting(false);
          return;
        }

        // Emails match — accept the invite
        const acceptResult = await acceptInvite(inviteToken, inviteEmail);

        if (acceptResult?.success && acceptResult?.site_url && acceptResult?.token && isSafeRedirectUrl(acceptResult.site_url)) {
          window.location.href = `${acceptResult.site_url}/login?token=${acceptResult.token}`;
          return;
        } else {
          setInvite(validateResult);
          setError(acceptResult?.error || "Failed to accept invite.");
          setView("signup");
          setSsoRedirecting(false);
        }
      } catch {
        setError("Something went wrong. Please try again.");
        setView("error");
        setSsoRedirecting(false);
      }
    })();
  }, [searchParams, inviteToken]);

  // Validate the invite token on mount (skip if SSO return is being handled)
  useEffect(() => {
    if (searchParams.get("platform_token")) return; // SSO handler will take over
    if (!inviteToken) {
      setError("No invite token provided.");
      setView("error");
      return;
    }

    (async () => {
      try {
        const result = await validateInvite(inviteToken);

        if (result?.success) {
          setInvite(result);
          // Default to signup — most invited users won't have an account yet
          setView("signup");
        } else {
          setError(result?.error || "Invalid or expired invite.");
          setView("error");
        }
      } catch {
        setError("Failed to validate invite.");
        setView("error");
      }
    })();
  }, [inviteToken, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;
    setError("");
    setLoading(true);

    try {
      // Authenticate against platform
      const loginResp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: "POST",
        body: JSON.stringify({ email: invite.email, password }),
      });
      const loginData = await loginResp.json();
      const loginResult = loginData.message;

      if (!loginResult?.success) {
        setError(loginResult?.error || "Invalid password.");
        setLoading(false);
        return;
      }

      if (loginResult.platform_token) {
        storePlatformToken(loginResult.platform_token);
      }

      // Accept the invite
      const acceptResult = await acceptInvite(inviteToken, invite.email);

      if (acceptResult?.success && acceptResult?.site_url && acceptResult?.token && isSafeRedirectUrl(acceptResult.site_url)) {
        window.location.href = `${acceptResult.site_url}/login?token=${acceptResult.token}`;
      } else {
        setError(acceptResult?.error || "Failed to accept invite.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;
    setError("");

    if (!signupPassword || signupPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create Platform User account via invite-specific signup endpoint
      const signupResp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP_FOR_INVITE), {
        method: "POST",
        body: JSON.stringify({
          full_name: signupName,
          email: invite.email,
          password: signupPassword,
        }),
      });
      const signupData = await signupResp.json();
      const signupResult = signupData.message;

      if (!signupResult?.success) {
        setError(signupResult?.error || "Signup failed.");
        setLoading(false);
        return;
      }

      if (signupResult.platform_token) {
        storePlatformToken(signupResult.platform_token);
      }

      // Accept the invite
      const acceptResult = await acceptInvite(inviteToken, invite.email);

      if (acceptResult?.success && acceptResult?.site_url && acceptResult?.token && isSafeRedirectUrl(acceptResult.site_url)) {
        window.location.href = `${acceptResult.site_url}/login?token=${acceptResult.token}`;
      } else {
        setError(acceptResult?.error || "Failed to accept invite.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    // After Google SSO, we need to come back here to accept the invite
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href =
      getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_SSO_LOGIN) + `?redirect_to=${returnUrl}`;
  };

  return (
    <div className="login-page">
      <Image src="/login-bg.png" alt="" fill className="login-bg" priority />
      <div className="login-overlay" />

      <div className="login-card">
        <div className="login-logo">
          <PinwheelLogo size={40} animationDuration={10} showStick filter="saturate(50%) brightness(90%)" />
          <Image src="/sena-wordmark.png" alt="Sena" width={140} height={32} style={{ height: 28, width: "auto" }} />
        </div>

        {view === "loading" && <p className="login-status">{ssoRedirecting ? "Accepting invite..." : "Validating invite..."}</p>}

        {view === "error" && (
          <div className="login-error">
            <p className="login-error__text">{error}</p>
          </div>
        )}

        {(view === "signin" || view === "signup") && invite && (
          <>
            <div className="invite-badge">
              You&apos;ve been invited to join <strong>{invite.site_name}</strong>
            </div>

            <div className="invite-email">
              Invite for: <strong>{maskEmail(invite.email)}</strong>
            </div>

            {error && (
              <div className="login-error">
                <p className="login-error__text">{error}</p>
              </div>
            )}

            {view === "signin" && (
              <>
                <p className="login-subtitle">Sign in to accept your invite</p>

                <button type="button" onClick={handleGoogleSSO} className="login-google-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>

                <div className="login-divider">
                  <span className="login-divider__line" />
                  <span className="login-divider__text">or</span>
                  <span className="login-divider__line" />
                </div>

                <form onSubmit={handleSignIn} className="login-form">
                  <label htmlFor="invite-signin-email" className="sr-only">Email</label>
                  <input id="invite-signin-email" type="email" value={invite.email} disabled className="login-input login-input--disabled" />
                  <label htmlFor="invite-signin-password" className="sr-only">Password</label>
                  <input
                    id="invite-signin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="login-input"
                  />
                  <button type="submit" disabled={loading} className="login-submit-btn">
                    {loading ? "Signing in..." : "Sign in & join"}
                  </button>
                </form>

                <p className="login-switch">
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => { setError(""); setView("signup"); }} className="login-switch__link">
                    Sign up
                  </button>
                </p>
              </>
            )}

            {view === "signup" && (
              <>
                <p className="login-subtitle">Create an account to join</p>

                <button type="button" onClick={handleGoogleSSO} className="login-google-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>

                <div className="login-divider">
                  <span className="login-divider__line" />
                  <span className="login-divider__text">or</span>
                  <span className="login-divider__line" />
                </div>

                <form onSubmit={handleSignUp} className="login-form">
                  <label htmlFor="invite-signup-name" className="sr-only">Full name</label>
                  <input
                    id="invite-signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Full name"
                    disabled={loading}
                    className="login-input"
                  />
                  <label htmlFor="invite-signup-email" className="sr-only">Email</label>
                  <input id="invite-signup-email" type="email" value={invite.email} disabled className="login-input login-input--disabled" />
                  <label htmlFor="invite-signup-site" className="sr-only">Site name</label>
                  <input
                    id="invite-signup-site"
                    type="text"
                    value={invite.site_name}
                    disabled
                    className="login-input login-input--disabled"
                  />
                  <label htmlFor="invite-signup-password" className="sr-only">Password</label>
                  <input
                    id="invite-signup-password"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Password (min 8 characters)"
                    autoComplete="new-password"
                    disabled={loading}
                    className="login-input"
                  />
                  <button type="submit" disabled={loading} className="login-submit-btn">
                    {loading ? "Creating account..." : "Create account & join"}
                  </button>
                </form>

                <p className="login-switch">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setError(""); setView("signin"); }} className="login-switch__link">
                    Sign in
                  </button>
                </p>
              </>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .login-page :global(.login-bg) {
          object-fit: cover;
          z-index: 0;
        }
        .login-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          z-index: 1;
        }
        .login-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          margin-bottom: 12px;
        }
        .login-status {
          text-align: center;
          color: #6b7280;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          padding: 20px 0;
          margin: 0;
        }
        .invite-badge {
          text-align: center;
          padding: 10px 16px;
          margin-bottom: 8px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 10px;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          color: #0c4a6e;
        }
        .invite-email {
          text-align: center;
          font-family: "Space Grotesk", sans-serif;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }
        .login-subtitle {
          text-align: center;
          color: #6b7280;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          margin: 0 0 20px 0;
        }
        .login-error {
          margin-bottom: 16px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }
        .login-error__text {
          color: #dc2626;
          font-family: "Space Grotesk", sans-serif;
          font-size: 13px;
          margin: 0;
        }
        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 24px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          color: #374151;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login-google-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
        }
        .login-divider__line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .login-divider__text {
          font-family: "Space Grotesk", sans-serif;
          font-size: 12px;
          color: #9ca3af;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .login-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          color: #374151;
          outline: none;
          transition: border-color 0.2s;
        }
        .login-input:focus {
          border-color: #8FB7C5;
          box-shadow: 0 0 0 2px rgba(143, 183, 197, 0.2);
        }
        .login-input::placeholder {
          color: #9ca3af;
        }
        .login-input:disabled {
          opacity: 0.7;
        }
        .login-input--disabled {
          background: #f3f4f6;
          color: #6b7280;
        }
        .login-submit-btn {
          width: 100%;
          padding: 10px 24px;
          margin-top: 4px;
          border: 2px solid #7AA5B5;
          border-radius: 8px;
          background: #8FB7C5;
          color: #fff;
          font-family: "Space Grotesk", sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login-submit-btn:hover:not(:disabled) {
          background: #7AA5B5;
        }
        .login-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .login-switch {
          text-align: center;
          font-family: "Space Grotesk", sans-serif;
          font-size: 13px;
          color: #6b7280;
          margin-top: 20px;
        }
        .login-switch__link {
          background: none;
          border: none;
          color: #8FB7C5;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          font-family: "Space Grotesk", sans-serif;
        }
        .login-switch__link:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}
