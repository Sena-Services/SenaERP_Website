"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { storePlatformToken, goToSite } from "@/lib/auth";
import PinwheelLogo from "@/components/PinwheelLogo";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5EF]" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const siteRedirect = searchParams.get("site") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssoRedirecting, setSsoRedirecting] = useState(false);

  // Handle return from Google SSO with platform_token
  useEffect(() => {
    const platformToken = searchParams.get("platform_token");
    if (!platformToken) return;

    storePlatformToken(platformToken);
    // Clean URL
    window.history.replaceState({}, "", window.location.pathname + (siteRedirect ? `?site=${encodeURIComponent(siteRedirect)}` : ""));

    if (siteRedirect) {
      // Tenant flow — get a login token and redirect back to tenant
      setSsoRedirecting(true);
      (async () => {
        try {
          const result = await goToSite();
          if (result) {
            window.location.href = `${result.site_url}/login?token=${result.token}`;
            return;
          }
        } catch { /* fall through */ }
        // Fallback — couldn't get login token, go to homepage
        window.location.href = "/";
      })();
    } else {
      // Marketing site flow — go to homepage
      window.location.href = "/";
    }
  }, [searchParams, siteRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      const result = data.message;

      if (result?.success) {
        if (result.platform_token) {
          storePlatformToken(result.platform_token);
        }

        if (siteRedirect && result.site_url && result.token) {
          // Tenant login flow — redirect back to tenant with login token
          window.location.href = `${result.site_url}/login?token=${result.token}`;
        } else if (result.no_site) {
          setError("Your workspace is being set up. We'll notify you when it's ready.");
        } else {
          // Marketing site login — go to homepage
          window.location.href = "/";
        }
      } else {
        setError(result?.error || "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    const redirectTo = siteRedirect
      ? encodeURIComponent(window.location.href)
      : encodeURIComponent(window.location.origin);
    window.location.href =
      getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_SSO_LOGIN) + `?redirect_to=${redirectTo}`;
  };

  return (
    <div className="login-page">
      <Image
        src="/login-bg.png"
        alt=""
        fill
        className="login-bg"
        priority
      />
      <div className="login-overlay" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <PinwheelLogo
            size={40}
            animationDuration={10}
            showStick={true}
            filter="saturate(50%) brightness(90%)"
          />
          <Image src="/sena-wordmark.png" alt="Sena" width={140} height={32} style={{ height: 28, width: 'auto' }} />
        </div>

        <p className="login-subtitle">Sign in to your workspace</p>

        {ssoRedirecting && (
          <p className="login-redirecting">Signing you in...</p>
        )}

        {!ssoRedirecting && error && (
          <div className="login-error">
            <p className="login-error__text">{error}</p>
          </div>
        )}

        {!ssoRedirecting && <>
        {/* Google SSO */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          className="login-google-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="login-divider">
          <span className="login-divider__line" />
          <span className="login-divider__text">or</span>
          <span className="login-divider__line" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
            className="login-input"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={loading}
            className="login-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        </>}
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
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          margin-bottom: 8px;
        }

        .login-subtitle {
          text-align: center;
          color: #6b7280;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          margin: 0 0 28px 0;
        }

        .login-redirecting {
          text-align: center;
          color: #6b7280;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          padding: 20px 0;
          margin: 0;
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
          opacity: 0.5;
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
