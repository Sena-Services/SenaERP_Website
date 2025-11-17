"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl, getFileUrl, API_CONFIG } from "@/lib/config";

type BlogPost = {
  id: string;
  name: string;
  title: string;
  description: string;
  attachment?: string;
  blog_id?: string;
  author?: string;
  published_date?: string;
};

// Fallback data in case API fails
const fallbackBlogPosts: BlogPost[] = [
  {
    id: "ai-first-erp",
    name: "Why the next wave of ERPs is AI-first",
    title: "Why the next wave of ERPs is AI-first",
    description:
      "We break down the architectural shifts that make intelligence the new system of record.",
    author: "Sena Team",
    published_date: "2024-01-15",
  },
  {
    id: "customer-knowledge",
    name: "Scaling customer knowledge without chaos",
    title: "Scaling customer knowledge without chaos",
    description:
      "How ops teams centralize learnings so teams never go into meetings unprepared.",
    author: "Sena Team",
    published_date: "2024-01-10",
  },
  {
    id: "reliable-automations",
    name: "Designing reliable automations",
    title: "Designing reliable automations",
    description:
      "Our framework for building playbooks that operators actually trust day-to-day.",
    author: "Sena Team",
    published_date: "2024-01-05",
  },
];

function BlogVisual({
  attachment,
  isHovered,
  isActive = false
}: {
  attachment?: string;
  isHovered: boolean;
  isActive?: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Determine if attachment is a video based on file extension
  const isVideo = React.useMemo(() => {
    if (!attachment) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => attachment.toLowerCase().endsWith(ext));
  }, [attachment]);

  React.useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    // Play video if hovered (desktop) or active (mobile)
    const shouldPlay = isHovered || isActive;

    if (shouldPlay) {
      video.playbackRate = 0.5;
      video.play().catch(() => {
        // Ignore play errors (e.g., if user hasn't interacted yet)
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, isActive, isVideo]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f6efe4]">
      {attachment ? (
        isVideo ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered || isActive ? "opacity-100" : "opacity-70"
            }`}
            loop
            muted
            playsInline
          >
            <source src={attachment} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={attachment}
            alt="Blog visual"
            fill
            quality={85}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-opacity duration-300 ${
              isHovered || isActive ? "opacity-100" : "opacity-70"
            }`}
            onError={(e) => {
              // If image fails to load, hide it
              e.currentTarget.style.display = 'none';
            }}
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No media
        </div>
      )}
    </div>
  );
}

const BlogSection = forwardRef<HTMLElement>(function BlogSection(props, ref) {
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>(fallbackBlogPosts);
  const [loading, setLoading] = React.useState(true);
  const [activeCardIndex, setActiveCardIndex] = React.useState<number>(1); // Start with second card active
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right'>('right');

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    // Fetch blog posts from the custom Website Blog API
    const fetchBlogs = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_BLOGS), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            limit: 10
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const result = await response.json();

        if (result.message?.success && result.message?.data) {
          const blogs = result.message.data.map((blog: any) => ({
            id: blog.blog_id || blog.name,
            name: blog.name,
            title: blog.title,
            description: blog.description || '',
            attachment: getFileUrl(blog.attachment),
            author: blog.author || blog.owner || 'Sena Team',
            published_date: blog.published_date || blog.creation || new Date().toISOString().split('T')[0],
          }));
          setBlogPosts(blogs.length > 0 ? blogs : fallbackBlogPosts);
        } else {
          // No blogs found, use fallback
          setBlogPosts(fallbackBlogPosts);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Keep using fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Scroll to center the second card on mount (mobile)
  React.useEffect(() => {
    if (!loading && carouselRef.current && blogPosts.length >= 2) {
      const carousel = carouselRef.current;

      // Small delay to ensure layout is complete
      const timeoutId = setTimeout(() => {
        // Only on mobile/tablet (not desktop)
        if (window.innerWidth < 768) {
          // Get the actual cards
          const cards = carousel.querySelectorAll('article');
          if (cards.length >= 2) {
            // Get the second card
            const secondCard = cards[1] as HTMLElement;

            // Calculate scroll position to center the second card
            // Use scrollLeft instead of scrollIntoView to avoid page scroll
            const cardLeft = secondCard.offsetLeft;
            const cardWidth = secondCard.offsetWidth;
            const carouselWidth = carousel.offsetWidth;
            const scrollPosition = cardLeft - (carouselWidth / 2) + (cardWidth / 2);

            // Scroll only the carousel horizontally, not the page
            carousel.scrollLeft = scrollPosition;
          }
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, blogPosts]);

  // Detect which card is centered on scroll and update scroll indicators
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      // Update scroll indicators for desktop
      if (window.innerWidth >= 768) {
        const scrollLeft = carousel.scrollLeft;
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;

        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        setScrollPosition(scrollLeft);
      } else {
        // Mobile card detection
        const cards = carousel.querySelectorAll('article');
        const carouselRect = carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - carouselCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveCardIndex(closestIndex);
      }
    };

    // Initial check
    handleScroll();

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading, blogPosts]);

  return (
    <section ref={ref} id="blog" className="scroll-mt-24 pb-12" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      <style jsx>{`
        .blog-carousel::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1023px) {
          .blog-carousel {
            padding-left: max(1rem, calc(50% - 140px));
            padding-right: max(1rem, calc(50% - 140px));
          }
        }
      `}</style>
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '16px' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '16px' : 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#ffe7f1] opacity-50 blur-3xl" />
          <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f6efe4] opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e5f0ff] opacity-45 blur-[110px]" />
        </div>

        <div className="relative flex flex-col">
          <div className="mt-4 mb-4 md:mb-6 text-center px-4 md:px-0">
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: isMobile ? '32px' : '40px',
              }}
            >
              Blog
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-waygent-orange border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-space-grotesk text-sm">Loading blog posts...</p>
              </div>
            </div>
          ) : (
            <>
            <div
              ref={carouselRef}
              className="blog-carousel overflow-hidden py-8 md:py-4 relative"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                marginBottom: '1.5rem',
              }}
            >
              {/* Real Carousel - All pages laid out horizontally */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {/* Create pages of 3 blogs each */}
                {Array.from({ length: Math.ceil(blogPosts.length / 3) }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="flex-shrink-0 w-full grid grid-cols-3 gap-4"
                  >
                    {blogPosts.slice(pageIndex * 3, (pageIndex * 3) + 3).map((post, index) => {
                      const isActive = index === activeCardIndex;
                      const formattedDate = post.published_date
                        ? new Date(post.published_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '';

                      return (
                        <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-waygent-text-primary shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                      isMobile
                        ? `w-[280px] flex-shrink-0 snap-center ${
                            isActive
                              ? 'border-waygent-orange scale-105 shadow-xl opacity-100'
                              : 'border-waygent-light-blue/40 opacity-60 scale-95'
                          }`
                        : 'border-waygent-light-blue/40 hover:border-waygent-blue/40'
                    }`}
                    onMouseEnter={() => setHoveredCardId(post.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    {/* Image/Video Container - Perfect Square */}
                    <div className="relative w-full aspect-square">
                      <BlogVisual
                        attachment={post.attachment}
                        isHovered={hoveredCardId === post.id}
                        isActive={isActive && typeof window !== 'undefined' && window.innerWidth < 768}
                      />

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Title and Metadata Overlay with Glassmorphic Effect */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {/* Glassmorphic background - translucent with blur */}
                        <div
                          className="absolute inset-0 backdrop-blur-lg"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            borderBottomLeftRadius: '16px',
                            borderBottomRightRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
                          }}
                        />

                        {/* Text content with shadow for readability */}
                        <div className="relative z-10">
                          <h3
                            className="text-white font-bold leading-tight mb-1.5 transition-all duration-300 group-hover:text-waygent-cream line-clamp-2"
                            style={{
                              fontFamily: "Georgia, 'Times New Roman', serif",
                              fontSize: isMobile ? '14px' : '13px',
                              letterSpacing: '-0.01em',
                              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8)',
                            }}
                          >
                            {post.title}
                          </h3>

                          {/* Author and Date - with text shadow */}
                          <div
                            className="flex items-center gap-2 text-white font-space-grotesk font-medium"
                            style={{
                              fontSize: '11px',
                              textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)'
                            }}
                          >
                            <span className="truncate">{post.author}</span>
                            <span className="opacity-70">•</span>
                            <span className="flex-shrink-0">{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows and Page Indicators */}
            {!isMobile && blogPosts.length > 3 && (() => {
              const blogsPerPage = 3; // 3 columns x 1 row
              const totalPages = Math.ceil(blogPosts.length / blogsPerPage);
              const hasPrevPage = currentPage > 0;
              const hasNextPage = currentPage < totalPages - 1;

              return (
                <div className="flex flex-col items-center gap-3 mt-6">
                  {/* Navigation Controls */}
                  <div className="flex items-center justify-center gap-4">
                    {/* Previous Arrow */}
                    <button
                      onClick={() => {
                        if (hasPrevPage) {
                          setCurrentPage(Math.max(0, currentPage - 1));
                        }
                      }}
                      disabled={!hasPrevPage}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        hasPrevPage
                          ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer'
                          : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
                      }`}
                      aria-label="Previous page"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Dots */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, pageIndex) => {
                        const isActive = pageIndex === currentPage;
                        return (
                          <button
                            key={pageIndex}
                            onClick={() => {
                              setCurrentPage(pageIndex);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isActive
                                ? 'bg-waygent-blue scale-125'
                                : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                            }`}
                            aria-label={`Go to page ${pageIndex + 1}`}
                          />
                        );
                      })}
                    </div>

                    {/* Next Arrow */}
                    <button
                      onClick={() => {
                        if (hasNextPage) {
                          setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
                        }
                      }}
                      disabled={!hasNextPage}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        hasNextPage
                          ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer'
                          : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
                      }`}
                      aria-label="Next page"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Page Counter */}
                  <div className="text-sm text-waygent-text-secondary font-space-grotesk">
                    Page <span className="font-semibold text-waygent-text-primary">{currentPage + 1}</span> of <span className="font-semibold text-waygent-text-primary">{totalPages}</span>
                  </div>
                </div>
              );
            })()}
            </>
          )}
        </div>
      </div>
    </section>
  );
});

export default BlogSection;
