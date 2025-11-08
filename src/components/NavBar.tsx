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
  { id: "environments", label: "Environments" },
  { id: "integrations", label: "Integrations" },
  { id: "builder", label: "Builder" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
  { id: "join-us", label: "Join Us" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [navbarHeight, setNavbarHeight] = useState(60);

  const isOnEnvironmentSelector = pathname === "/environment-selector";

  const handleWaitlistSuccess = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSectionClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
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
      <header className="w-full px-4 sm:px-6 lg:px-8 pb-2 pt-2">
        <nav
          className={`flex items-center justify-between ${NAVBAR_CONTROLS.navbarPadding} px-3 sm:px-6 lg:px-8 bg-white/10 border-2 border-white/20 backdrop-blur-md max-w-7xl mx-auto`}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '40px',
        }}
      >
        {/* LEFT SIDE - Logo */}
        <div className={`flex items-center ${NAVBAR_CONTROLS.logoGap} px-2 sm:px-3 py-1.5`}>
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
                  className="px-3 py-1.5 rounded-lg transition-all duration-300 ease-out hover:text-waygent-orange hover:bg-orange-50 hover:shadow-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons or Logged In Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isCheckingAuth && !user && (
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
                  className="get-early-access-btn inline-flex items-center justify-center px-2 py-1.5 sm:px-4 sm:py-2 h-7 sm:h-8 rounded-md transition-all duration-300 ease-out whitespace-nowrap text-xs sm:text-sm font-semibold border-2 border-waygent-orange text-white cursor-pointer outline-none shadow-sm leading-none font-space-grotesk hover:shadow-md focus-visible:outline-none"
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

            {!isCheckingAuth && user && (
              <>
                {/* Environment/Home Button */}
                <Link
                  href={isOnEnvironmentSelector ? "/" : "/environment-selector"}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ease-out whitespace-nowrap cursor-pointer outline-none leading-none font-space-grotesk focus-visible:outline-none bg-white/70 border border-gray-200 hover:bg-white/90 hover:shadow-sm hover:border-gray-300"
                  style={{
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {isOnEnvironmentSelector ? (
                    <>
                      <Home className="w-4 h-4 text-gray-500 transition-colors duration-300 group-hover:text-waygent-orange" />
                      <span className="text-sm font-semibold text-waygent-text-primary transition-colors duration-300 group-hover:text-waygent-orange">Home</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-gray-500 transition-colors duration-300 group-hover:text-waygent-orange" />
                      <span className="text-sm font-semibold text-waygent-text-primary transition-colors duration-300 group-hover:text-waygent-orange">ERP Environment</span>
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
        </nav>

        {/* Backdrop when menu is open */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: `${navbarHeight}px` }}
          />
        )}

        {/* Mobile Dropdown Menu - Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed left-0 right-0 z-40 px-4 sm:px-6 lg:px-8"
            style={{
              top: `${navbarHeight - 15}px`,
            }}
          >
            <div className="bg-waygent-light-blue border-2 border-waygent-light-blue border-t-0 backdrop-blur-sm max-w-xs mx-auto px-4 sm:px-6 relative animate-slideDown"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                paddingTop: '20px',
              }}
            >
              <ul className="py-2 space-y-0.5">
              {sections.map((section, index) => {
                const isActive = section.id === activeSection;
                const step = (index + 1).toString().padStart(2, "0");

                return (
                  <li key={section.id}>
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className={`group relative flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left transition-all duration-300 ease-out cursor-pointer ${
                        !isActive && 'hover:bg-white/60 hover:shadow-sm'
                      } ${
                        isActive ? 'bg-waygent-orange' : ''
                      }`}
                    >
                      <span
                        className="text-[9px] font-semibold tracking-wider transition-colors duration-300 w-5 flex-shrink-0 flex items-center justify-center font-space-grotesk"
                        style={{
                          color: isActive ? 'white' : 'rgb(107, 114, 128)',
                          transitionDelay: isActive ? '500ms' : '0ms',
                          lineHeight: '1',
                        }}
                      >
                        {step}
                      </span>
                      <span
                        className={`flex-1 text-[10.5px] sm:text-[11px] font-semibold transition-all duration-300 flex items-center whitespace-nowrap font-space-grotesk ${
                          !isActive && 'group-hover:text-waygent-orange'
                        }`}
                        style={{
                          color: isActive ? 'white' : 'rgb(31, 41, 55)',
                          transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                          transitionDelay: isActive ? '500ms' : '0ms',
                          lineHeight: '1.3',
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
          </div>
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
