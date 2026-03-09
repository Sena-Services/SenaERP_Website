"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type SectionId = 'how-it-works' | 'builder' | 'contracts' | 'registry' | 'get-access' | 'join-us' | 'other';

interface UseHomeScrollSnapOptions {
  introRef: RefObject<HTMLDivElement | null>;
  registryRef: RefObject<HTMLElement | null>;
  builderRef: RefObject<HTMLDivElement | null>;
}

interface UseHomeScrollSnapReturn {
  showNavigation: boolean;
  currentSection: SectionId;
}

export function useHomeScrollSnap({
  introRef,
  registryRef,
  builderRef,
}: UseHomeScrollSnapOptions): UseHomeScrollSnapReturn {
  const [showNavigation, setShowNavigation] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionId>('other');
  const touchStartYRef = useRef<number>(0);

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
        const contractsEl = document.getElementById('contracts');
        const registryEl = document.getElementById('registry');
        const getAccessEl = document.getElementById('get-access');
        const joinUsEl = document.getElementById('join-us');

        // Get all section positions
        const sections = [
          { id: 'join-us' as SectionId, el: joinUsEl },
          { id: 'get-access' as SectionId, el: getAccessEl },
          { id: 'registry' as SectionId, el: registryEl },
          { id: 'contracts' as SectionId, el: contractsEl },
          { id: 'builder' as SectionId, el: builderEl },
          { id: 'how-it-works' as SectionId, el: howItWorksEl },
        ];

        // Find which section we're in (check from bottom to top)
        let foundSection: SectionId = 'how-it-works';
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

        setCurrentSection(foundSection);
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
    let hasLeftHome = false;
    let lastWheelTime = 0;
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
        autoTriggerPoint: introTop + 900 + 400 * 0.8,
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
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

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
          hasLeftHome = true;
          setShowNavigation(true);
          window.dispatchEvent(new CustomEvent('homeLeft'));
        });
      });
    };

    const playReverseSequence = (points: ReturnType<typeof getSnapPoints>) => {
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

      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 10) {
        blockScroll();
        return;
      }

      if (currentScrollY > points.rotated + 10) {
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

      if (inSplitZone) {
        if (direction === 'up') {
          if (!hasLeftHome) {
            blockScroll();
            playReverseSequence(points);
          }
          return;
        }

        if (manualScrollEnabled) {
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

      if (isAnimating) {
        blockScroll();
        return;
      }

      if (currentScrollY <= points.unitedCard + 50) {
        if (direction === 'down') {
          if (!introSequencePlayed) {
            blockScroll();
            playIntroSequence(points);
          } else {
            blockScroll();
            lockDirection('down');
            animateToPosition(points.unitedCard, 1200, () => {
              manualScrollEnabled = true;
            });
          }
        } else if (direction === 'up' && currentScrollY > points.initial + 50 && !hasLeftHome) {
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        if (direction === 'down') {
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        if (direction === 'down') {
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          blockScroll();
          playReverseSequence(points);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;

      const touch = e.changedTouches[0];
      const touchStartY = touchStartYRef.current;
      const deltaY = touchStartY - touch.clientY;

      if (Math.abs(deltaY) < 30) return;

      const direction = deltaY > 0 ? 'down' : 'up';
      const currentScrollY = window.scrollY;
      const points = getSnapPoints();

      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 200) {
        return;
      }

      if (currentScrollY > points.rotated + 50) {
        return;
      }

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
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        if (direction === 'down') {
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        if (direction === 'down') {
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          playReverseSequence(points);
        }
      }
    };

    // Scrollbar drag detection
    const handleScroll = () => {
      if (isAnimating) return;
      if (performance.now() - lastWheelTime < 150) return;

      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      scrollEndTimeout = setTimeout(() => {
        if (isAnimating) return;

        const currentScrollY = window.scrollY;
        const points = getSnapPoints();

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Custom event: jump directly to "how it works"
    const handleTriggerIntro = () => {
      const points = getSnapPoints();
      introSequencePlayed = true;
      manualScrollEnabled = true;
      autoRotateTriggered = false;
      hasLeftHome = true;
      window.scrollTo({ top: points.rotated, behavior: 'auto' });
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new CustomEvent('homeLeft'));
    };

    window.addEventListener('triggerIntroSequence', handleTriggerIntro);

    // Custom event: scroll animation from arrow button
    const handleScrollAnimation = () => {
      const points = getSnapPoints();
      if (window.scrollY < points.unitedCard) {
        playIntroSequence(points, true);
      }
    };

    window.addEventListener('triggerScrollAnimation', handleScrollAnimation);

    // Custom event: reset home from sidebar/button
    const handleResetHome = () => {
      hasLeftHome = false;
      setShowNavigation(false);
      window.dispatchEvent(new CustomEvent('homeUnlocked'));

      const points = getSnapPoints();
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

    const clampScrollPosition = () => {
      if (hasLeftHome) {
        const points = getSnapPoints();
        const minScroll = points.rotated;
        const currentScroll = window.scrollY;

        if (currentScroll < minScroll) {
          const overscroll = minScroll - currentScroll;

          if (!isBouncing) {
            isBouncing = true;
            bounceVelocity = Math.min(overscroll * 0.15, 8);
          }

          const springForce = overscroll * 0.12;
          const damping = 0.85;

          bounceVelocity = (bounceVelocity + springForce) * damping;

          const newScroll = currentScroll + bounceVelocity;

          if (Math.abs(minScroll - newScroll) < 1 && Math.abs(bounceVelocity) < 0.5) {
            window.scrollTo(0, minScroll);
            isBouncing = false;
            bounceVelocity = 0;
          } else {
            window.scrollTo(0, Math.min(newScroll, minScroll));
          }
        } else {
          isBouncing = false;
          bounceVelocity = 0;
        }
      }
      if (hasLeftHome) {
        clampAnimationFrame = requestAnimationFrame(clampScrollPosition);
      }
    };

    // Only start the clamping loop when hasLeftHome is true via a scroll listener
    const startClampIfNeeded = () => {
      if (hasLeftHome && clampAnimationFrame === null) {
        clampAnimationFrame = requestAnimationFrame(clampScrollPosition);
      }
    };
    window.addEventListener('scroll', startClampIfNeeded, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('triggerIntroSequence', handleTriggerIntro);
      window.removeEventListener('triggerScrollAnimation', handleScrollAnimation);
      window.removeEventListener('resetHome', handleResetHome);
      window.removeEventListener('scroll', startClampIfNeeded);
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
  }, [introRef, registryRef, builderRef]);

  return { showNavigation, currentSection };
}
