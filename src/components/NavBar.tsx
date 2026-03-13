"use client";

import { useEffect, useState } from "react";
import SignupModal from "./SignupModal";
import Toast from "./Toast";
import Image from "next/image";
import PinwheelLogo from "./PinwheelLogo";
import NavProfileDropdown from "./NavProfileDropdown";
import { useNavAuth } from "./useNavAuth";

const sections = [
  { id: "intro", label: "Home" },
  { id: "how-it-works", label: "How it Works" },
  { id: "builder", label: "AI Agent" },
  { id: "contracts", label: "Contracts" },
  { id: "registry", label: "Registry" },
  { id: "get-access", label: "Log In" },
  { id: "join-us", label: "Join Us" },
];

type NavBarProps = {
  showHowItWorks?: boolean;
  showBuilder?: boolean;
  showContracts?: boolean;
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

export default function NavBar({
  showHowItWorks = false,
  showBuilder = false,
  showContracts = false,
  showIntegrations = false,
  showRegistry = false,
  showBlog = false,
  showCoFounders = false,
  showJoinUs = false,
  showBackButton = false,
  onBackClick,
  blogPageTitle,
  blogPageAction,
}: NavBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialView, setModalInitialView] = useState<"signin" | "signup" | undefined>(undefined);
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [navbarHeight, setNavbarHeight] = useState(60);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const {
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
  } = useNavAuth();

  // Open signup modal when Google SSO prefill arrives
  useEffect(() => {
    if (googlePrefill) setIsModalOpen(true);
  }, [googlePrefill]);

  // Initialize banner dismissed state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("bannerDismissed");
    if (dismissed !== "true") setBannerDismissed(false);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClickOutside = () => setShowProfileMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, setShowProfileMenu]);

  // Listen for openSignupModal events from other components
  useEffect(() => {
    const handleOpenSignupModal = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.view) setModalInitialView(detail.view);
      else setModalInitialView(undefined);
      setIsModalOpen(true);
    };
    window.addEventListener('openSignupModal', handleOpenSignupModal);
    return () => window.removeEventListener('openSignupModal', handleOpenSignupModal);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Track active section (rAF-throttled)
  useEffect(() => {
    let rafId: number | null = null;

    const updateActiveSection = () => {
      if (isModalOpen) return;

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
    let rafId: number;
    const measureNavbar = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const header = document.querySelector('header');
        if (header) setNavbarHeight(header.offsetHeight);
      });
    };

    measureNavbar();
    window.addEventListener('resize', measureNavbar);
    return () => {
      window.removeEventListener('resize', measureNavbar);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsModalOpen(false);

    if (sectionId === "intro") {
      window.dispatchEvent(new CustomEvent('resetIntroScroll'));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (sectionId === "builder") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const firstMobileCard = document.getElementById('mobile-builder-ui');
        if (firstMobileCard) {
          setTimeout(() => {
            const navbarH = 180;
            const targetPosition = firstMobileCard.getBoundingClientRect().top + window.scrollY - navbarH;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }, 100);
          return;
        }
      }
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarH = 80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="w-full">
        <nav
          className="flex flex-col bg-[#F5F1E8] border-2 border-[#9CA3AF] border-t-0 backdrop-blur-md max-w-7xl mx-auto"
          style={{
            boxShadow: isMobileMenuOpen
              ? '0 8px 24px -4px rgba(139, 119, 89, 0.15)'
              : '0 4px 12px -2px rgba(139, 119, 89, 0.12), 0 2px 6px -1px rgba(139, 119, 89, 0.08)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            overflow: 'hidden',
          }}
        >
          {/* Top Row */}
          <div className="flex items-center justify-between py-0.5 pl-2 pr-4">
            {/* LEFT — Logo or Back Button */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 py-1.5">
              {showBackButton ? (
                <button
                  onClick={onBackClick}
                  className="inline-flex items-center gap-2 text-sena-blue hover:text-sena-blue-hover font-space-grotesk transition cursor-pointer text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  <Image src="/sena-wordmark.png" alt="Sena" width={120} height={28} className="h-6 sm:h-7 w-auto" />
                </>
              )}
            </div>

            {/* CENTER — Blog Page Title */}
            {blogPageTitle && (
              <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
                <span className="text-sm font-semibold text-gray-700 font-space-grotesk uppercase tracking-wide">
                  {blogPageTitle}
                </span>
              </div>
            )}

            {/* RIGHT — CTA or Profile + Hamburger */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                {platformUser ? (
                  <NavProfileDropdown
                    platformUser={platformUser}
                    showProfileMenu={showProfileMenu}
                    goingToSite={goingToSite}
                    dropdownPos={dropdownPos}
                    onToggleMenu={(open, pos) => {
                      setDropdownPos(pos);
                      setShowProfileMenu(open);
                    }}
                    onGoToSite={handleGoToSite}
                    onLogout={handleLogout}
                  />
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
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

                {/* Hamburger — Mobile Only */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:rounded-md ml-2"
                  aria-label="Toggle menu"
                >
                  <span className={`w-5 h-[2px] bg-sena-text-primary transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                  <span className={`w-5 h-[2px] bg-sena-text-primary transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
                </button>
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
                onClick={() => setIsModalOpen(true)}
                className="text-center cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:rounded-md"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '12px', color: '#5a4520', letterSpacing: '0.01em' }}
              >
                Sena Beta is now generally available:{' '}
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

          {/* Mobile Section Header */}
          {!isMobileMenuOpen && (
            <>
              {[
                { show: showHowItWorks, label: "How it works?" },
                { show: showBuilder, label: "AI Agent" },
                { show: showContracts, label: "Contracts" },
                { show: showIntegrations, label: "Integrations" },
                { show: showRegistry, label: "Registry" },
                { show: showBlog, label: "Blog" },
                { show: showCoFounders, label: "CoFounders" },
                { show: showJoinUs, label: "Join Our Team" },
              ].map(({ show, label }) =>
                show ? (
                  <div key={label} className="md:hidden w-full px-3 pb-1.5 pt-1 text-center border-t border-white/20">
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
                      {label.includes("works") ? (
                        <>How it <span style={{ fontStyle: "italic" }}>works</span>?</>
                      ) : label}
                    </h2>
                  </div>
                ) : null
              )}
            </>
          )}

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden w-full px-3 pt-2 pb-3" style={{ borderTop: '1px solid rgba(156, 163, 175, 0.3)' }}>
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
                      <span
                        className="text-[10px] font-bold flex-shrink-0 flex items-center justify-center font-space-grotesk"
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          color: isActive ? '#FFFFFF' : '#6B7280',
                          background: isActive ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                          border: isActive ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid #9CA3AF',
                        }}
                      >
                        {step}
                      </span>
                      <span className="flex-1 text-xs font-semibold font-space-grotesk truncate" style={{ color: isActive ? '#FFFFFF' : '#374151' }}>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Backdrop when mobile menu open */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0"
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsMobileMenuOpen(false); } }}
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
          initialView={modalInitialView}
          onClose={() => { setIsModalOpen(false); setModalInitialView(undefined); setGooglePrefill(null); }}
          onSuccess={(msg, email) => { setGooglePrefill(null); handleWaitlistSuccess(msg, email); }}
          googlePrefill={googlePrefill}
        />

        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => { setShowToast(false); setToastActionUrl(undefined); setToastActionLabel(undefined); }}
          duration={toastDuration}
          actionUrl={toastActionUrl}
          actionLabel={toastActionLabel}
        />
      </header>
    </>
  );
}
