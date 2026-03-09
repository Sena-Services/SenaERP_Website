"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SignupModal from "./SignupModal";
import Toast from "./Toast";
import Image from "next/image";
import PinwheelLogo from "./PinwheelLogo";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import { storePlatformToken, clearPlatformToken, verifyPlatformToken, goToSite, type PlatformUser } from "@/lib/auth";

const links: { href: string; label: string }[] = [];

const sections = [
  { id: "intro", label: "Home" },
  { id: "how-it-works", label: "How it Works" },
  { id: "builder", label: "Builder" },
  { id: "integrations", label: "Integrations" },
  { id: "registry", label: "Registry" },
  { id: "get-access", label: "Get Access" },
  { id: "blog", label: "Blog" },
  { id: "cofounders", label: "CoFounders" },
  { id: "join-us", label: "Join Us" },
];

type NavBarProps = {
  showHowItWorks?: boolean;
  showBuilder?: boolean;
  showIntegrations?: boolean;
  showRegistry?: boolean;
  showBlog?: boolean;
  showCoFounders?: boolean;
  showJoinUs?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  blogPageTitle?: string;
  blogPageAction?: string;
};

export default function NavBar({ showHowItWorks = false, showBuilder = false, showIntegrations = false, showRegistry = false, showBlog = false, showCoFounders = false, showJoinUs = false, showBackButton = false, onBackClick, blogPageTitle, blogPageAction }: NavBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googlePrefill, setGooglePrefill] = useState<{ name: string; email: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(true); // Default true to prevent flash
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [goingToSite, setGoingToSite] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Handle return from Google SSO + check existing auth
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    // Case 1: Returning known user (already signed up) — platform_token in URL
    const platformToken = params.get("platform_token");
    if (platformToken) {
      storePlatformToken(platformToken);
      window.history.replaceState({}, "", window.location.pathname);
      // Verify and load user info
      (async () => {
        try {
          const { authenticated, user } = await verifyPlatformToken();
          if (authenticated && user) {
            setPlatformUser(user);
            setToastMessage(`Welcome back, ${user.full_name || ""}!`);
            setShowToast(true);
          }
        } catch { /* token verification failed silently */ }
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
            setIsModalOpen(true);
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
        if (authenticated && user) {
          setPlatformUser(user);
        }
      } catch { /* silent — user stays logged out */ }
    })();
  }, []);

  // Initialize banner dismissed state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("bannerDismissed");
    if (dismissed !== "true") {
      setBannerDismissed(false);
    }
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClickOutside = () => setShowProfileMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  // Listen for openSignupModal events from other components (e.g. GetAccessSection)
  useEffect(() => {
    const handleOpenSignupModal = () => {
      setIsModalOpen(true);
    };
    window.addEventListener('openSignupModal', handleOpenSignupModal);
    return () => window.removeEventListener('openSignupModal', handleOpenSignupModal);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [navbarHeight, setNavbarHeight] = useState(60);
  const [activeBuilderTab, setActiveBuilderTab] = useState<string>("ui");

  // Listen for scroll-based tab updates from BuilderTabbed
  useEffect(() => {
    const handleUpdateBuilderTab = (e: CustomEvent) => {
      setActiveBuilderTab(e.detail.tabId);
    };

    window.addEventListener('updateBuilderTab', handleUpdateBuilderTab as EventListener);
    return () => window.removeEventListener('updateBuilderTab', handleUpdateBuilderTab as EventListener);
  }, []);

  const builderTabs = [
    { id: "data", label: "Data", subtitle: "Connect and transform" },
    { id: "workflows", label: "Workflows", subtitle: "Automate processes" },
    { id: "agents", label: "Agents", subtitle: "Deploy AI agents" },
  ];

  const handleWaitlistSuccess = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    // Refresh platform user state (token was stored by SignupModal)
    verifyPlatformToken().then(({ authenticated, user }) => {
      if (authenticated && user) {
        setPlatformUser(user);
      }
    });
  };

  const handleGoToSite = async () => {
    setGoingToSite(true);
    const result = await goToSite();
    if (result) {
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

  const handleSectionClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsModalOpen(false);

    // Special case: Introduction should scroll to the very top
    if (sectionId === "intro") {
      // Reset the internal content scroll in IntroSection
      window.dispatchEvent(new CustomEvent('resetIntroScroll'));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // Special case: Builder on mobile should scroll to the first mobile builder card
    if (sectionId === "builder") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const firstMobileCard = document.getElementById('mobile-builder-ui');
        if (firstMobileCard) {
          setTimeout(() => {
            const navbarHeight = 180; // Account for navbar + builder tabs
            const targetPosition = firstMobileCard.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }, 100);
          return;
        }
      }
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Track active section based on scroll position (rAF-throttled)
  useEffect(() => {
    let rafId: number | null = null;

    const updateActiveSection = () => {
      // Don't update sections when modal is open
      if (isModalOpen) {
        return;
      }

      const sectionIds = sections.map(s => s.id);
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;

          if (viewportCenter >= sectionTop) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    const throttledUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateActiveSection();
          rafId = null;
        });
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate);

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isModalOpen]);

  // Measure navbar height
  useEffect(() => {
    const measureNavbar = () => {
      const header = document.querySelector('header');
      if (header) {
        setNavbarHeight(header.offsetHeight);
      }
    };

    measureNavbar();
    window.addEventListener('resize', measureNavbar);
    return () => window.removeEventListener('resize', measureNavbar);
  }, []);
  // 🎯 NAVBAR MANUAL CONTROLS - Adjust these values to control navbar positioning and spacing
  const NAVBAR_CONTROLS = {
    // NAVBAR POSITIONING & SPACING
    navbarPadding: "py-0.5", // keep compact

    // LOGO CONTROLS
    logoGap: "gap-2", // Space between logo and text: 'gap-1', 'gap-4', etc.
    logoSize: "width={40} height={40}", // Logo image size (change both width and height)
    logoTextSize: "text-xl", // Logo text size: 'text-xl', 'text-3xl', etc.

    // NAVIGATION SPACING
    navLinksGap: "gap-6", // tighter on small screens
    navToButtonGap: "gap-4", // reduce button spacing

    // BUTTON STYLING
    buttonPadding: "py-1.5 px-4", // CTA button size: 'py-2 px-4' (smaller), 'py-3 px-8' (larger)
    buttonTextSize: "text-sm", // Button text size: 'text-sm', 'text-lg', etc.
  };

  return (
    <>
      <header className="w-full">
        <nav
          className={`flex flex-col bg-[#F5F1E8] border-2 border-[#9CA3AF] border-t-0 backdrop-blur-md max-w-7xl mx-auto`}
        style={{
          boxShadow: isMobileMenuOpen
            ? '0 8px 24px -4px rgba(139, 119, 89, 0.15)'
            : '0 4px 12px -2px rgba(139, 119, 89, 0.12), 0 2px 6px -1px rgba(139, 119, 89, 0.08)',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          overflow: 'hidden',
        }}
      >
        {/* Top Row - Logo/Back Button and Buttons */}
        <div className={`flex items-center justify-between ${NAVBAR_CONTROLS.navbarPadding} pl-2 pr-4`}>
        {/* LEFT SIDE - Logo or Back Button */}
        <div className={`flex items-center ${NAVBAR_CONTROLS.logoGap} pl-2 sm:pl-3 py-1.5`}>
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="inline-flex items-center gap-2 text-sena-blue hover:text-sena-blue-hover font-space-grotesk transition cursor-pointer text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Go back
            </button>
          ) : (
            <>
              <PinwheelLogo
                size={28}
                animationDuration={10}
                showStick={true}
                filter="saturate(50%) brightness(90%)"
                className="sm:scale-[1.14] md:scale-[1.29]"
              />
              <Image
                src="/sena-wordmark.png"
                alt="Sena"
                width={120}
                height={28}
                className="h-6 sm:h-7 w-auto"
              />
            </>
          )}
        </div>

        {/* CENTER - Blog Page Title (hidden on mobile to avoid overlap with Early Access) */}
        {blogPageTitle && (
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-semibold text-gray-700 font-space-grotesk uppercase tracking-wide">
              {blogPageTitle}
            </span>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className={`flex items-center ${NAVBAR_CONTROLS.navToButtonGap}`}>
          <ul
            className={`hidden md:flex items-center ${NAVBAR_CONTROLS.navLinksGap} text-sena-text-primary`}
          >
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="px-3 py-1.5 rounded-lg transition-all duration-300 ease-out hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons or Logged In Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <>
                {platformUser ? (
                  /* ── Logged-in state ── */
                  <>
                    <button
                      ref={profileBtnRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!showProfileMenu && profileBtnRef.current) {
                          const rect = profileBtnRef.current.getBoundingClientRect();
                          setDropdownPos({
                            top: rect.bottom + 8,
                            left: rect.left,
                          });
                        }
                        setShowProfileMenu(!showProfileMenu);
                      }}
                      className="inline-flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5]"
                      style={{
                        background: showProfileMenu ? '#E8E2D6' : 'transparent',
                        border: '1px solid #D1D5DB',
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: '#8FB7C5' }}
                      >
                        {(platformUser.full_name || platformUser.email || '').substring(0, 2).toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-gray-700 font-space-grotesk max-w-[120px] truncate">
                        {platformUser.full_name || platformUser.email}
                      </span>
                      <svg className="w-3.5 h-3.5 text-gray-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile dropdown — portal to body so nav overflow:hidden doesn't clip it */}
                    {showProfileMenu && typeof document !== "undefined" && createPortal(
                      <div
                        className="fixed w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                        style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 100 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 font-space-grotesk truncate">
                            {platformUser.full_name}
                          </p>
                          <p className="text-xs text-gray-500 font-space-grotesk truncate">
                            {platformUser.email}
                          </p>
                        </div>
                        {platformUser.site_url ? (
                          <button
                            onClick={handleGoToSite}
                            disabled={goingToSite}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-space-grotesk cursor-pointer disabled:opacity-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            {goingToSite ? "Redirecting..." : "Go to Workspace"}
                          </button>
                        ) : (
                          <div className="px-4 py-2.5 text-xs text-gray-400 font-space-grotesk">
                            Workspace is being set up...
                          </div>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-space-grotesk cursor-pointer flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>,
                      document.body
                    )}
                  </>
                ) : (
                  /* ── Not logged in — Login button ── */
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-9 transition-all duration-300 ease-out whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer outline-none leading-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:ring-offset-1"
                    style={{
                      background: '#8FB7C5',
                      border: '1px solid #7AA5B5',
                      borderRadius: '9999px',
                      color: '#FFFFFF',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: '0 2px 8px rgba(143, 183, 197, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#7AA5B5';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(143, 183, 197, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#8FB7C5';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 183, 197, 0.3)';
                    }}
                  >
                    <span className="leading-none">{blogPageAction || "Login"}</span>
                  </button>
                )}

                {/* Hamburger Menu Button - Mobile Only */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:rounded-md ml-2"
                  aria-label="Toggle menu"
                >
                  <span
                    className={`w-5 h-[2px] bg-sena-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-[2px] bg-sena-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                    }`}
                  />
                </button>
            </>
          </div>
        </div>
        </div>

        {/* Announcement Banner */}
        {!bannerDismissed && (
          <div
            className="w-full flex items-center justify-center relative"
            style={{
              borderTop: '1px solid rgba(156, 163, 175, 0.3)',
              background: 'linear-gradient(135deg, rgba(218, 185, 107, 0.15) 0%, rgba(245, 183, 77, 0.12) 100%)',
              padding: '6px 12px',
              minHeight: '28px',
            }}
          >
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="text-center cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:rounded-md"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '12px',
                color: '#5a4520',
                letterSpacing: '0.01em',
              }}
            >
              Sena Beta is now generally available —{' '}
              <span className="underline font-semibold">Login →</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBannerDismissed(true);
                localStorage.setItem("bannerDismissed", "true");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:rounded-full hover:opacity-70 transition-opacity"
              style={{ width: '18px', height: '18px' }}
              aria-label="Dismiss banner"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#5a4520" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l8 8M9 1l-8 8" />
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Section Header - Show different sections based on scroll */}
        {!isMobileMenuOpen && (
          <>
            {showHowItWorks && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  How it <span style={{ fontStyle: "italic" }}>works</span>?
                </h2>
              </div>
            )}

            {showBuilder && (
              <div className="md:hidden w-full border-t border-white/20">
                {/* Builder Title */}
                <div className="text-center px-3 pt-1.5 pb-1">
                  <h2
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "#2C1810",
                      fontSize: "16px",
                    }}
                  >
                    Builder
                  </h2>
                </div>

                {/* Compact Tab Selector - No Subtitles */}
                <div className="px-3 pb-2">
                  <div
                    className="grid grid-cols-3 rounded-xl overflow-hidden max-w-xs mx-auto"
                    style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {builderTabs.map((tab, index) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveBuilderTab(tab.id);
                          setIsModalOpen(false);

                          // Check if mobile or desktop
                          const isMobile = window.innerWidth < 768;

                          if (isMobile) {
                            // Scroll to the mobile builder card with proper offset
                            const mobileCardId = `mobile-builder-${tab.id}`;
                            const element = document.getElementById(mobileCardId);
                            if (element) {
                              // Small delay to let modal close
                              setTimeout(() => {
                                const navbarHeight = 180; // Account for navbar + builder tabs
                                const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
                                window.scrollTo({
                                  top: targetPosition,
                                  behavior: 'smooth',
                                });
                              }, 100);
                            }
                          } else {
                            // Desktop: dispatch event for BuilderTabbed component
                            window.dispatchEvent(new CustomEvent('builderTabChange', { detail: { tabId: tab.id } }));
                          }
                        }}
                        className={`px-2 py-2 transition-all duration-200 relative ${
                          index !== builderTabs.length - 1 ? 'border-r border-white/40' : ''
                        }`}
                        style={{
                          background: activeBuilderTab === tab.id
                            ? '#3B82F6'
                            : 'transparent',
                        }}
                      >
                        <div className="text-center">
                          <div
                            className={`text-[10px] font-bold transition-colors ${
                              activeBuilderTab === tab.id ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {tab.label}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showIntegrations && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  Integrations
                </h2>
              </div>
            )}

            {showRegistry && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  Registry
                </h2>
              </div>
            )}

            {showBlog && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  Blog
                </h2>
              </div>
            )}

            {showCoFounders && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  CoFounders
                </h2>
              </div>
            )}

            {showJoinUs && (
              <div className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#2C1810",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  Join Our Team
                </h2>
              </div>
            )}
          </>
        )}

        {/* Mobile Dropdown Menu - Redesigned with earthy theme */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden w-full px-3 pt-2 pb-3"
            style={{
              borderTop: '1px solid rgba(156, 163, 175, 0.3)',
            }}
          >
            {/* Two-column grid for compact layout */}
            <div className="grid grid-cols-2 gap-2">
              {sections.map((section, index) => {
                const isActive = section.id === activeSection;
                const step = (index + 1).toString().padStart(2, "0");

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className="group relative flex items-center gap-2 text-left transition-all duration-200 ease-out cursor-pointer"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: isActive ? '#8FB7C5' : '#F5F1E8',
                      border: isActive ? '2px solid #7AA5B5' : '2px solid #D1D5DB',
                    }}
                  >
                    {/* Number circle */}
                    <span
                      className="text-[10px] font-bold flex-shrink-0 flex items-center justify-center font-space-grotesk"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        color: isActive ? '#FFFFFF' : '#6B7280',
                        background: isActive ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                        border: isActive ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid #9CA3AF',
                      }}
                    >
                      {step}
                    </span>
                    {/* Label */}
                    <span
                      className="flex-1 text-xs font-semibold font-space-grotesk truncate"
                      style={{
                        color: isActive ? '#FFFFFF' : '#374151',
                      }}
                    >
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </nav>

        {/* Backdrop when menu is open */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              top: `${navbarHeight}px`,
              zIndex: -1,
              background: 'rgba(44, 24, 16, 0.15)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Signup Modal */}
        <SignupModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setGooglePrefill(null);
          }}
          onSuccess={(msg) => {
            setGooglePrefill(null);
            handleWaitlistSuccess(msg);
          }}
          googlePrefill={googlePrefill}
        />

        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </header>
    </>
  );
}
