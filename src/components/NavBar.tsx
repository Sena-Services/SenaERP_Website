"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { checkAuth, type User } from "@/lib/auth";
import { Database, Home } from "lucide-react";
import EarlyAccessModal from "./EarlyAccessModal";
import Toast from "./Toast";

const links: { href: string; label: string }[] = [
  // { href: "#features", label: "Features" },
  // { href: "#about", label: "About Us" },
];

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "how-it-works", label: "How it Works" },
  { id: "builder", label: "Builder" },
  { id: "integrations", label: "Integrations" },
  { id: "environments", label: "Environments" },
  { id: "blog", label: "Blog" },
  { id: "join-us", label: "Join Us" },
];

type NavBarProps = {
  showHowItWorks?: boolean;
  showBuilder?: boolean;
  showIntegrations?: boolean;
  showEnvironments?: boolean;
  showBlog?: boolean;
  showJoinUs?: boolean;
};

export default function NavBar({ showHowItWorks = false, showBuilder = false, showIntegrations = false, showEnvironments = false, showBlog = false, showJoinUs = false }: NavBarProps) {
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
    { id: "ui", label: "UI", subtitle: "Build beautiful interfaces" },
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
  }, []);

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
    logoGap: "gap-[.005rem]", // Space between logo and text: 'gap-1', 'gap-4', etc.
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
          className={`flex flex-col bg-white/10 border-2 border-white/20 border-t-0 backdrop-blur-md max-w-7xl mx-auto overflow-hidden`}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
        }}
      >
        {/* Top Row - Logo and Buttons */}
        <div className={`flex items-center justify-between ${NAVBAR_CONTROLS.navbarPadding} pl-2 pr-2`}>
        {/* LEFT SIDE - Logo */}
        <div className={`flex items-center ${NAVBAR_CONTROLS.logoGap} pl-2 sm:pl-3 py-1.5`}>
          <Image src="/logo.png" width={28} height={28} alt="Sena logo" className="sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]" />
          <span
            className={`text-base sm:${NAVBAR_CONTROLS.logoTextSize}  font-rockwell text-waygent-text-primary`}
          >
            Sena
          </span>
        </div>

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
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FAF9F5', color: '#6B7280' }}
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

                {/* Get Early Access Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-9 transition-all duration-300 ease-out whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer outline-none leading-none focus-visible:outline-none"
                  style={{
                    background: '#8FB7C5',
                    border: '1px solid #7AA5B5',
                    borderRadius: '1.5rem',
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
                  <span className="leading-none">Get Early Access</span>
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
                    className="grid grid-cols-4 rounded-xl overflow-hidden"
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
                          // Dispatch event for BuilderTabbed component to listen
                          window.dispatchEvent(new CustomEvent('builderTabChange', { detail: { tabId: tab.id } }));
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

            {showEnvironments && (
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
                  Environments
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

        {/* Mobile Dropdown Menu - INSIDE THE NAV - PART OF THE SAME COMPONENT */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full px-4 pt-3 pb-3 border-t border-white/20">
            <ul className="space-y-1.5">
              {sections.map((section, index) => {
                const isActive = section.id === activeSection;
                const step = (index + 1).toString().padStart(2, "0");

                return (
                  <li key={section.id}>
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ease-out cursor-pointer border ${
                        !isActive && 'hover:bg-white/50 hover:border-white/40'
                      } ${
                        isActive ? 'bg-waygent-orange shadow-lg border-waygent-orange' : 'bg-white/30 backdrop-blur-sm border-white/30'
                      }`}
                    >
                      <span
                        className="text-xs font-bold tracking-wide transition-colors duration-200 w-7 h-7 flex-shrink-0 flex items-center justify-center font-space-grotesk rounded-lg"
                        style={{
                          color: isActive ? 'white' : '#1F2937',
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                          lineHeight: '1',
                        }}
                      >
                        {step}
                      </span>
                      <span
                        className={`flex-1 text-sm font-bold transition-all duration-200 flex items-center whitespace-nowrap font-space-grotesk ${
                          !isActive && 'group-hover:text-waygent-orange'
                        }`}
                        style={{
                          color: isActive ? 'white' : '#1F2937',
                          transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                          lineHeight: '1.4',
                        }}
                      >
                        {section.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        </nav>

        {/* Backdrop when menu is open */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: `${navbarHeight}px`, zIndex: -1 }}
          />
        )}

        {/* Early Access Modal */}
        <EarlyAccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
