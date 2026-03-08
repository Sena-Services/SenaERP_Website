"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import IntroSection from "@/components/IntroSection";
import MobileHowItWorks from "@/components/MobileHowItWorks";
import BuilderTabbed from "@/components/BuilderTabbed";
import LandingRegistry from "@/components/LandingRegistry";
import IntegrationsSection from "@/components/IntegrationsSection";
import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";
import CoFoundersSection from "@/components/CoFoundersSection";
import GetAccessSection from "@/components/GetAccessSection";
import NavBar from "@/components/NavBar";
import SidebarNav from "@/components/SidebarNav";

// Wrapper component to handle searchParams with Suspense
function HomeContent() {
  const searchParams = useSearchParams();
  const introRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<HTMLElement>(null);
  const integrationsRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const getAccessRef = useRef<HTMLElement>(null);
  const cofoundersRef = useRef<HTMLElement>(null);
  const joinUsRef = useRef<HTMLElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const sidebarSections = [
    { id: "intro", label: "Home" },
    { id: "how-it-works", label: "How it works" },
    { id: "builder", label: "Builder" },
    { id: "integrations", label: "Integrations" },
    { id: "registry", label: "Registry" },
    { id: "get-access", label: "Get Access" },
    { id: "blog", label: "Blog" },
    { id: "cofounders", label: "CoFounders" },
    { id: "join-us", label: "Join Our Team" },
  ];

  // Scroll to top on page load/refresh, or skip intro if section param is present
  useEffect(() => {
    const section = searchParams.get('section');
    const hasToken = searchParams.has('token');
    if (section === 'how-it-works' || hasToken) {
      // Skip intro: go to "how it works" section, or show NavBar for SSO token handling
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('triggerIntroSequence'));
        setShowNavigation(true);
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  const [currentSection, setCurrentSection] = useState<'how-it-works' | 'builder' | 'integrations' | 'registry' | 'blog' | 'get-access' | 'cofounders' | 'join-us' | 'other'>('other');

  useEffect(() => {
    // On mobile, show navbar when scrolled 70% through intro AND detect current section
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const handleMobileScroll = () => {
        // Skip when body scroll is locked (e.g. modal open) — position:fixed resets scrollY to 0
        if (document.body.style.position === 'fixed') return;

        const introSection = introRef.current;
        if (!introSection) return;

        const introTop = introSection.offsetTop;
        const introHeight = introSection.offsetHeight;
        const scrollY = window.scrollY;

        // Show navbar when scrolled 70% through the intro section
        const seventyPercentPoint = introTop + (introHeight * 0.7);

        if (scrollY > seventyPercentPoint) {
          setShowNavigation(true);
        } else {
          setShowNavigation(false);
        }

        // Detect which section we're in based on scroll position
        const howItWorksEl = document.getElementById('how-it-works');
        const builderEl = document.getElementById('builder');
        const integrationsEl = document.getElementById('integrations');
        const registryEl = document.getElementById('registry');
        const blogEl = document.getElementById('blog');
        const getAccessEl = document.getElementById('get-access');
        const cofoundersEl = document.getElementById('cofounders');
        const joinUsEl = document.getElementById('join-us');

        // Get all section positions
        const sections = [
          { id: 'join-us', el: joinUsEl },
          { id: 'cofounders', el: cofoundersEl },
          { id: 'blog', el: blogEl },
          { id: 'get-access', el: getAccessEl },
          { id: 'registry', el: registryEl },
          { id: 'integrations', el: integrationsEl },
          { id: 'builder', el: builderEl },
          { id: 'how-it-works', el: howItWorksEl },
        ];

        // Find which section we're in (check from bottom to top)
        let foundSection = 'how-it-works';
        for (const section of sections) {
          if (section.el) {
            const rect = section.el.getBoundingClientRect();
            const sectionTop = scrollY + rect.top;

            // If we've scrolled past this section (with 300px threshold)
            if (scrollY >= sectionTop - 300) {
              foundSection = section.id;
              break;
            }
          }
        }

        setCurrentSection(foundSection as typeof currentSection);
      };

      handleMobileScroll();
      window.addEventListener('scroll', handleMobileScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleMobileScroll);
    }

    // IMPORTANT: Skip all desktop scroll snapping logic on mobile
    if (isMobile) return;

    let isAnimating = false;
    let animationFrameId: number;
    let directionLock: 'up' | 'down' | null = null;
    let directionLockTimeout: NodeJS.Timeout | null = null;
    let autoRotateTriggered = false;
    let manualScrollEnabled = false;
    let introSequencePlayed = false;
    let hasLeftHome = false; // Track if user has scrolled past home
    let lastWheelTime = 0; // Track wheel events to distinguish scrollbar drag
    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
    const lockDirection = (direction: 'up' | 'down', duration = 600) => {
      directionLock = direction;
      if (directionLockTimeout) {
        clearTimeout(directionLockTimeout);
      }
      directionLockTimeout = setTimeout(() => {
        directionLock = null;
        directionLockTimeout = null;
      }, duration);
    };

    // Define snap points and zones
    const getSnapPoints = () => {
      const introSection = introRef.current;
      const registrySection = registryRef.current;
      const builderSection = builderRef.current;

      if (!introSection || !registrySection) return {
        initial: 0,
        unitedCard: 0,
        splitZoneStart: 0,
        splitZoneEnd: 0,
        autoTriggerPoint: 0,
        rotated: 0,
        registry: 0,
        builder: 0,
      };

      const introTop = introSection.offsetTop;

      return {
        initial: 0,
        unitedCard: introTop + 900,
        splitZoneStart: introTop + 900,
        splitZoneEnd: introTop + 900 + 400,
        autoTriggerPoint: introTop + 900 + 400 * 0.8, // 80% through split
        rotated: introTop + 900 + 400 + 800,
        registry: registrySection.offsetTop,
        builder: builderSection?.offsetTop || 0,
      };
    };

    const isInSplitZone = (scrollY: number) => {
      const points = getSnapPoints();
      return scrollY >= points.splitZoneStart && scrollY <= points.splitZoneEnd;
    };

    // Smooth animation to target scroll position with FIXED duration
    const animateToPosition = (targetY: number, duration: number = 1200, onComplete?: () => void) => {
      // Cancel any existing animation first
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Capture start position immediately - no delay
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation (ease-in-out)
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentY = startY + distance * easeProgress;
        window.scrollTo(0, currentY);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          if (onComplete) onComplete();
        }
      };

      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
    };

    const playIntroSequence = (points: ReturnType<typeof getSnapPoints>, force = false) => {
      if (!force && (introSequencePlayed || isAnimating)) return;

      introSequencePlayed = true;
      manualScrollEnabled = false;
      autoRotateTriggered = true;
      lockDirection('down', 1800);

      animateToPosition(points.unitedCard, 600, () => {
        animateToPosition(points.rotated, 1200, () => {
          manualScrollEnabled = true;
          autoRotateTriggered = false;
          hasLeftHome = true; // Mark that user has left home section
          setShowNavigation(true); // Show navigation after leaving home
          // Dispatch event so sidebar knows home is locked
          window.dispatchEvent(new CustomEvent('homeLeft'));
        });
      });
    };

    const playReverseSequence = (points: ReturnType<typeof getSnapPoints>) => {
      // BLOCK: Once user has left home, they cannot go back
      if (hasLeftHome) return;
      if (isAnimating) return;

      manualScrollEnabled = false;
      autoRotateTriggered = false;
      lockDirection('up', 1800);

      const finishToIntro = () => {
        animateToPosition(points.initial, 1200, () => {
          introSequencePlayed = false;
          manualScrollEnabled = false;
          autoRotateTriggered = false;
        });
      };

      if (window.scrollY > points.unitedCard + 10) {
        animateToPosition(points.unitedCard, 600, finishToIntro);
      } else {
        finishToIntro();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Skip snap logic when body scroll is locked (e.g. modal open)
      if (document.body.style.position === 'fixed') return;

      lastWheelTime = performance.now();
      const currentScrollY = window.scrollY;
      const direction = e.deltaY > 0 ? 'down' : 'up';
      const points = getSnapPoints();
      const inSplitZone = isInSplitZone(currentScrollY);
      let blocked = false;
      const blockScroll = () => {
        if (!blocked) {
          e.preventDefault();
          blocked = true;
        }
      };

      // BLOCK ALL UPWARD SCROLL if user has left home AND at or approaching the boundary
      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 10) {
        blockScroll();
        return;
      }

      // IMPORTANT: Allow completely normal scrolling after rotated position (How It Works)
      if (currentScrollY > points.rotated + 10) {
        // Everything after How It Works is completely normal scrolling - no snapping at all
        return;
      }

      if (directionLock && direction !== directionLock) {
        if (!isAnimating) {
          directionLock = null;
          if (directionLockTimeout) {
            clearTimeout(directionLockTimeout);
            directionLockTimeout = null;
          }
        } else {
          blockScroll();
          return;
        }
      }

      // Manual split zone handling
      if (inSplitZone) {
        if (direction === 'up') {
          // Already blocked at top if hasLeftHome is true
          if (!hasLeftHome) {
            blockScroll();
            playReverseSequence(points);
          }
          return;
        }

        if (manualScrollEnabled) {
          // Allow natural downward scroll until we hit the trigger
          if (direction === 'down' && currentScrollY >= points.autoTriggerPoint && !autoRotateTriggered) {
            blockScroll();
            autoRotateTriggered = true;
            manualScrollEnabled = false;
            lockDirection('down');
            animateToPosition(points.rotated, 1200, () => {
              autoRotateTriggered = false;
            });
          }
          return;
        }
      }

      // Block during animation
      if (isAnimating) {
        blockScroll();
        return;
      }

      // Determine which zone we're in and where to go based on current position
      if (currentScrollY <= points.unitedCard + 50) {
        // At initial or united card position (with 50px tolerance)
        if (direction === 'down') {
          if (!introSequencePlayed) {
            blockScroll();
            playIntroSequence(points);
          } else {
            blockScroll();
            lockDirection('down');
            animateToPosition(points.unitedCard, 1200, () => {
              manualScrollEnabled = true; // Enable manual scroll in split zone
            });
          }
        } else if (direction === 'up' && currentScrollY > points.initial + 50 && !hasLeftHome) {
          // Scroll up from united card to initial (only if haven't left home yet)
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        // In split zone
        if (direction === 'down') {
          // Enable manual scrolling mode - don't auto-advance
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          // Scroll up from split zone goes back to initial (only if haven't left home yet)
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        // At rotated position (How It Works with 3 flipped cards)
        if (direction === 'down') {
          // Allow completely normal scroll to continue to the rest of the page
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow reverse if haven't left home yet
          blockScroll();
          playReverseSequence(points);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      (window as any).touchStartY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scroll on touch
      if (isAnimating) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;

      const touch = e.changedTouches[0];
      const touchStartY = (window as any).touchStartY || touch.clientY;
      const deltaY = touchStartY - touch.clientY;

      // Ignore tiny movements
      if (Math.abs(deltaY) < 30) return;

      const direction = deltaY > 0 ? 'down' : 'up';
      const currentScrollY = window.scrollY;
      const points = getSnapPoints();

      // BLOCK ALL UPWARD SCROLL if user has left home AND anywhere near intro section
      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 200) {
        return;
      }

      // IMPORTANT: Allow completely normal scrolling after rotated position (How It Works)
      if (currentScrollY > points.rotated + 50) {
        // Everything after How It Works is completely normal scrolling - no snapping at all
        return;
      }

      // Determine target position based on current scroll position and direction
      // Similar logic to handleWheel
      if (currentScrollY <= points.unitedCard + 50) {
        if (direction === 'down') {
          if (!introSequencePlayed) {
            playIntroSequence(points);
          } else {
            lockDirection('down');
            animateToPosition(points.unitedCard, 1200, () => {
              manualScrollEnabled = true;
            });
          }
        } else if (direction === 'up' && currentScrollY > points.initial + 50 && !hasLeftHome) {
          // Only allow going back if haven't left home yet
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        if (direction === 'down') {
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow going back if haven't left home yet
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        if (direction === 'down') {
          // Allow completely normal scroll to continue to the rest of the page
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow reverse if haven't left home yet
          playReverseSequence(points);
        }
      }
    };


    // Scrollbar drag detection: snap when user drags scrollbar into the intro zone
    // Wheel/touch events have their own snap logic, but scrollbar drag fires only 'scroll' events
    const handleScroll = () => {
      if (isAnimating) return;

      // If a wheel event happened recently, this scroll is from the wheel — skip
      if (performance.now() - lastWheelTime < 150) return;

      // Debounce: wait for scrollbar drag to stop
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      scrollEndTimeout = setTimeout(() => {
        if (isAnimating) return;

        const currentScrollY = window.scrollY;
        const points = getSnapPoints();

        // If stuck in the intro animation zone, snap to the rotated position
        if (currentScrollY > 50 && currentScrollY < points.rotated - 50) {
          introSequencePlayed = true;
          manualScrollEnabled = true;
          autoRotateTriggered = true;
          hasLeftHome = true;
          setShowNavigation(true);
          window.dispatchEvent(new CustomEvent('homeLeft'));
          animateToPosition(points.rotated, 800);
        }
      }, 200);
    };

    // Listen to wheel events with { passive: false } to allow preventDefault
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Listen for custom event from sidebar to jump directly to "how it works" (rotated cards)
    const handleTriggerIntro = () => {
      const points = getSnapPoints();
      // Set state as if sequence was already played
      introSequencePlayed = true;
      manualScrollEnabled = true;
      autoRotateTriggered = false;
      hasLeftHome = true; // Mark that user has left home section (prevents scrolling back up)
      // Jump directly to the rotated position (where 3 cards are visible)
      window.scrollTo({ top: points.rotated, behavior: 'auto' });
      // Trigger scroll event to update sidebar
      window.dispatchEvent(new Event('scroll'));
      // Dispatch event so sidebar knows home is locked
      window.dispatchEvent(new CustomEvent('homeLeft'));
    };

    window.addEventListener('triggerIntroSequence', handleTriggerIntro);

    // Listen for scroll animation trigger from arrow button
    const handleScrollAnimation = () => {
      const points = getSnapPoints();
      // Only trigger if we're at the initial position (home screen)
      if (window.scrollY < points.unitedCard) {
        playIntroSequence(points, true);
      }
    };

    window.addEventListener('triggerScrollAnimation', handleScrollAnimation);

    // Listen for resetHome event from sidebar/button to unlock home
    const handleResetHome = () => {
      // Unlock the animations first
      hasLeftHome = false;
      setShowNavigation(false); // Hide navigation when going back to home
      window.dispatchEvent(new CustomEvent('homeUnlocked'));

      // Get current position
      const points = getSnapPoints();

      // Play the reverse sequence animation
      if (isAnimating) return;

      manualScrollEnabled = false;
      autoRotateTriggered = false;
      lockDirection('up', 1800);

      const finishToIntro = () => {
        animateToPosition(points.initial, 1200, () => {
          introSequencePlayed = false;
          manualScrollEnabled = false;
          autoRotateTriggered = false;
        });
      };

      if (window.scrollY > points.unitedCard + 10) {
        animateToPosition(points.unitedCard, 600, finishToIntro);
      } else {
        finishToIntro();
      }
    };

    window.addEventListener('resetHome', handleResetHome);

    // Smooth bounce effect when scrolling past the boundary
    let clampAnimationFrame: number | null = null;
    let bounceVelocity = 0;
    let isBouncing = false;
    let lastScrollY = window.scrollY;

    const clampScrollPosition = () => {
      if (hasLeftHome) {
        const points = getSnapPoints();
        const minScroll = points.rotated;
        const currentScroll = window.scrollY;

        // Calculate scroll velocity
        const scrollDelta = currentScroll - lastScrollY;
        lastScrollY = currentScroll;

        // If below threshold, apply smooth bounce
        if (currentScroll < minScroll) {
          const overscroll = minScroll - currentScroll;

          if (!isBouncing) {
            // Start bounce - capture the velocity
            isBouncing = true;
            bounceVelocity = Math.min(overscroll * 0.15, 8); // Proportional to overscroll, capped
          }

          // Spring physics: accelerate back towards boundary
          const springForce = overscroll * 0.12; // Spring stiffness
          const damping = 0.85; // Damping factor

          bounceVelocity = (bounceVelocity + springForce) * damping;

          // Apply the bounce
          const newScroll = currentScroll + bounceVelocity;

          // If we're close enough and moving slowly, snap to final position
          if (Math.abs(minScroll - newScroll) < 1 && Math.abs(bounceVelocity) < 0.5) {
            window.scrollTo(0, minScroll);
            isBouncing = false;
            bounceVelocity = 0;
          } else {
            window.scrollTo(0, Math.min(newScroll, minScroll));
          }
        } else {
          // Reset bounce state when above threshold
          isBouncing = false;
          bounceVelocity = 0;
        }
      }
      clampAnimationFrame = requestAnimationFrame(clampScrollPosition);
    };

    // Start the clamping loop
    clampAnimationFrame = requestAnimationFrame(clampScrollPosition);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('triggerIntroSequence', handleTriggerIntro);
      window.removeEventListener('triggerScrollAnimation', handleScrollAnimation);
      window.removeEventListener('resetHome', handleResetHome);
      if (clampAnimationFrame) {
        cancelAnimationFrame(clampAnimationFrame);
      }
      if (directionLockTimeout) {
        clearTimeout(directionLockTimeout);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
    };
  }, []);

  return (
    <main className="relative text-sena-text-primary">
      {/* Base background color layer - at the very back */}
      <div
        className="fixed inset-0"
        style={{ zIndex: -2, backgroundColor: '#F5F1E8' }}
      />
      {/* Fixed NavBar at top - only show when not on home */}
      {showNavigation && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] transition-opacity duration-500"
          style={{
            width: "min(640px, 90vw)",
            opacity: showNavigation ? 1 : 0,
          }}
        >
          <NavBar
            showHowItWorks={currentSection === 'how-it-works'}
            showBuilder={currentSection === 'builder'}
            showIntegrations={currentSection === 'integrations'}
            showRegistry={currentSection === 'registry'}
            showBlog={currentSection === 'blog'}
            showCoFounders={currentSection === 'cofounders'}
            showJoinUs={currentSection === 'join-us'}
          />
        </div>
      )}

      {/* Sidebar - only show when not on home */}
      {showNavigation && (
        <div className="transition-opacity duration-500" style={{ opacity: showNavigation ? 1 : 0 }}>
          <SidebarNav sections={sidebarSections} />
        </div>
      )}

      <div ref={introRef} className="relative">
        <IntroSection />
      </div>

      {/* Mobile How It Works - only shows on mobile */}
      <MobileHowItWorks />

      {/* Section Divider between How It Works and Builder */}
      <div className="w-full relative" style={{
        background: `linear-gradient(to bottom, #F5F1E8 0%, #F5F1E8 50%, #EDE7DC 50%, #EDE7DC 100%)`,
        paddingTop: '8px',
        paddingBottom: '8px'
      }}>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/40"></div>
          </div>
          <div className="relative px-4">
            <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
          </div>
        </div>
      </div>

      <div className="w-full relative">
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex-1 flex flex-col relative">
            {/* Builder - Color 2 */}
            <div id="builder" style={{ backgroundColor: '#EDE7DC' }}>
              <BuilderTabbed />
            </div>

            {/* Section Divider & Color Transition */}
            <div className="w-full" style={{
              background: `linear-gradient(to bottom, #EDE7DC 0%, #EDE7DC 50%, #F5F1E8 50%, #F5F1E8 100%)`,
              paddingTop: '8px',
              paddingBottom: '8px'
            }}>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/40"></div>
                </div>
                <div className="relative px-4">
                  <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
                </div>
              </div>
            </div>

            {/* Integrations - Color 1 */}
            <div id="integrations" style={{ backgroundColor: '#F5F1E8' }}>
              <IntegrationsSection ref={integrationsRef} />
            </div>

            {/* Section Divider & Color Transition */}
            <div className="w-full" style={{
              background: `linear-gradient(to bottom, #F5F1E8 0%, #F5F1E8 50%, #EDE7DC 50%, #EDE7DC 100%)`,
              paddingTop: '8px',
              paddingBottom: '8px'
            }}>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/40"></div>
                </div>
                <div className="relative px-4">
                  <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
                </div>
              </div>
            </div>

            {/* Registry - Color 2 */}
            <div id="registry" style={{ backgroundColor: '#EDE7DC' }}>
              <LandingRegistry ref={registryRef} />
            </div>
          </div>

          {/* Section Divider & Color Transition */}
          <div className="w-full" style={{
            background: `linear-gradient(to bottom, #EDE7DC 0%, #EDE7DC 50%, #F5F1E8 50%, #F5F1E8 100%)`,
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative px-4">
                <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
              </div>
            </div>
          </div>

          {/* Get Access - Color 1 */}
          <div style={{ backgroundColor: '#F5F1E8' }}>
            <GetAccessSection ref={getAccessRef} />
          </div>

          {/* Section Divider & Color Transition */}
          <div className="w-full" style={{
            background: `linear-gradient(to bottom, #F5F1E8 0%, #F5F1E8 50%, #EDE7DC 50%, #EDE7DC 100%)`,
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative px-4">
                <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
              </div>
            </div>
          </div>

          {/* Blog - Color 2 */}
          <div id="blog" style={{ backgroundColor: '#EDE7DC' }}>
            <BlogSection ref={blogRef} />
          </div>

          {/* Section Divider & Color Transition */}
          <div className="w-full" style={{
            background: `linear-gradient(to bottom, #EDE7DC 0%, #EDE7DC 50%, #F5F1E8 50%, #F5F1E8 100%)`,
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative px-4">
                <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
              </div>
            </div>
          </div>

          {/* CoFounders - Color 1 */}
          <div id="cofounders" style={{ backgroundColor: '#F5F1E8' }}>
            <CoFoundersSection ref={cofoundersRef} />
          </div>

          {/* Section Divider & Color Transition */}
          <div className="w-full" style={{
            background: `linear-gradient(to bottom, #F5F1E8 0%, #F5F1E8 50%, #EDE7DC 50%, #EDE7DC 100%)`,
            paddingTop: '8px',
            paddingBottom: '8px'
          }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative px-4">
                <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
              </div>
            </div>
          </div>

          {/* Join Us - Color 2 */}
          <div id="join-us" style={{ backgroundColor: '#EDE7DC' }}>
            <JoinUsSection ref={joinUsRef} />
          </div>
        </div>
      </div>

      {/* ====== BACKGROUND TEXTURES - Rendered LAST to ensure they appear on top ====== */}

      {/* Grid pattern - subtle background grid (above section bg, below cards) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5, opacity: 0.04 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120, 100, 80, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120, 100, 80, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating orbs layer - soft color washes */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10, opacity: 0.35 }}
      >
        {/* Moving gradient orbs */}
        <div
          className="absolute rounded-full"
          style={{
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(143, 183, 197, 0.5) 0%, transparent 60%)',
            top: '-10%',
            left: '-15%',
            filter: 'blur(120px)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '1000px',
            height: '1000px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 60%)',
            top: '25%',
            right: '-20%',
            filter: 'blur(120px)',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
            bottom: '10%',
            left: '0%',
            filter: 'blur(120px)',
            animation: 'float3 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '850px',
            height: '850px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            bottom: '30%',
            right: '-5%',
            filter: 'blur(120px)',
            animation: 'float1 22s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Noise grain overlay - subtle texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 15, opacity: 0.08 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* CSS Keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -50px) scale(1.05); }
          50% { transform: translate(-50px, 60px) scale(0.95); }
          75% { transform: translate(50px, 50px) scale(1.02); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 50px) scale(1.05); }
          66% { transform: translate(60px, -60px) scale(0.95); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(55px, -55px) scale(1.08); }
        }
      `}</style>
    </main>
  );
}

// Default export wraps HomeContent in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sena-cream" />}>
      <HomeContent />
    </Suspense>
  );
}
