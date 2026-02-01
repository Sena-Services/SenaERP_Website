"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { checkAuth, type User } from "@/lib/auth";
import { Database, Home } from "lucide-react";
import EarlyAccessModal from "./EarlyAccessModal";
import Toast from "./Toast";
import PinwheelLogo from "./PinwheelLogo";

const links: { href: string; label: string }[] = [
  // { href: "#features", label: "Features" },
  // { href: "#about", label: "About Us" },
];

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "how-it-works", label: "How it Works" },
  { id: "builder", label: "Builder" },
  { id: "integrations", label: "Integrations" },
  { id: "registry", label: "Registry" },
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
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [navbarHeight, setNavbarHeight] = useState(60);
  const [activeBuilderTab, setActiveBuilderTab] = useState<string>("ui");

  // Listen for scroll-based tab updates from BuilderTabbed
  useEffect(() => {
    const handleUpdateBuilderTab = (e: CustomEvent) => {
      setActiveBuilderTab(e.detail.tabId);
    };

    window.addEventListener('updateBuilderTab' as any, handleUpdateBuilderTab);
    return () => window.removeEventListener('updateBuilderTab' as any, handleUpdateBuilderTab);
  }, []);

  const isOnEnvironmentSelector = pathname === "/environment-selector";

  const builderTabs = [
    { id: "data", label: "Data", subtitle: "Connect and transform" },
    { id: "workflows", label: "Workflows", subtitle: "Automate processes" },
    { id: "agents", label: "Agents", subtitle: "Deploy AI agents" },
  ];

  const handleWaitlistSuccess = (message: string) => {
    setToastMessage(message);
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

  useEffect(() => {
    const verifyAuth = async () => {
      const authResult = await checkAuth();
      if (authResult.authenticated && authResult.user) {
        setUser(authResult.user);
      }
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, []);

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

  // Track active section based on scroll position
  useEffect(() => {
    const updateActiveSection = () => {
      // Don't update sections when modal is open
      if (isModalOpen) {
        console.log('⏸️ Skipping section update - modal is open');
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

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
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
              className="inline-flex items-center gap-2 text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk transition cursor-pointer text-sm"
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
              <span
                className={`text-base sm:${NAVBAR_CONTROLS.logoTextSize}  font-rockwell text-waygent-text-primary`}
              >
                Sena
              </span>
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
            className={`hidden md:flex items-center ${NAVBAR_CONTROLS.navLinksGap} text-waygent-text-primary`}
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
            {!user && (
              <>
                {/* Commented out Login and Sign Up buttons */}
                {/* <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-3 py-1.5 h-7 rounded-md transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold border cursor-pointer outline-none leading-none font-space-grotesk hover:border-waygent-orange/60 hover:text-waygent-orange focus-visible:outline-none"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#F5F1E8', color: '#6B7280' }}
                >
                  <span className="leading-none">Log In</span>
                </Link> */}

                {/* <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-3 py-1.5 h-7 rounded-md transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold border-2 border-waygent-orange bg-waygent-orange text-white cursor-pointer outline-none shadow-sm leading-none font-space-grotesk hover:bg-waygent-orange/90 hover:shadow-md focus-visible:outline-none"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 flex-shrink-0 transition-all duration-300 ease-out hidden xs:block sm:block">
                      <svg className="w-4 h-4 transition-all duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="leading-none">Sign Up</span>
                  </div>
                </Link> */}

                {/* Get Early Access Button or Custom Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🎯 Get Early Access button clicked - opening modal');
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-9 transition-all duration-300 ease-out whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer outline-none leading-none focus-visible:outline-none"
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
                  <span className="leading-none">{blogPageAction || "Get Early Access"}</span>
                </button>

                {/* Hamburger Menu Button - Mobile Only */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[3px] focus:outline-none ml-2"
                  aria-label="Toggle menu"
                >
                  <span
                    className={`w-5 h-[2px] bg-waygent-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-[2px] bg-waygent-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                    }`}
                  />
                </button>
              </>
            )}

            {user && (
              <>
                {/* Environment/Home Button */}
                <Link
                  href={isOnEnvironmentSelector ? "/" : "/environment-selector"}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ease-out whitespace-nowrap cursor-pointer outline-none leading-none font-space-grotesk focus-visible:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
                  }}
                >
                  {isOnEnvironmentSelector ? (
                    <>
                      <Home className="w-4 h-4 text-gray-600 transition-colors duration-300 group-hover:text-gray-900" />
                      <span className="text-sm font-semibold text-waygent-text-primary transition-colors duration-300 group-hover:text-gray-900">Home</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-gray-600 transition-colors duration-300 group-hover:text-gray-900" />
                      <span className="text-sm font-semibold text-waygent-text-primary transition-colors duration-300 group-hover:text-gray-900">ERP Environment</span>
                    </>
                  )}
                </Link>

                {/* User Avatar */}
                <UserAvatar user={user} />

                {/* Hamburger Menu Button - Mobile Only */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[3px] focus:outline-none ml-2"
                  aria-label="Toggle menu"
                >
                  <span
                    className={`w-5 h-[2px] bg-waygent-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-[2px] bg-waygent-text-primary transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                    }`}
                  />
                </button>
              </>
            )}
          </div>
        </div>
        </div>

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

        {/* Early Access Modal */}
        <EarlyAccessModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('🚪 NavBar - closing modal');
            setIsModalOpen(false);
          }}
          onSuccess={handleWaitlistSuccess}
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
