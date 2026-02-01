"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl, getFileUrl, API_CONFIG, frappeAPI } from "@/lib/config";

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
  const [hasError, setHasError] = React.useState(false);

  // Determine if attachment is a video based on file extension
  const isVideo = React.useMemo(() => {
    if (!attachment) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => attachment.toLowerCase().endsWith(ext));
  }, [attachment]);

  // Debug logging
  React.useEffect(() => {
    if (attachment) {
      console.log('BlogVisual attachment:', attachment, 'isVideo:', isVideo);
    }
  }, [attachment, isVideo]);

  React.useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    // Play video if hovered (desktop) or active (mobile)
    const shouldPlay = isHovered || isActive;

    if (shouldPlay) {
      // Wait for video to be ready before playing
      const playWhenReady = () => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          video.playbackRate = 0.5;
          video.play().catch((err) => {
            console.error('Video play failed:', err);
          });
        } else {
          // If not ready, wait for loadeddata event
          video.addEventListener('loadeddata', () => {
            video.playbackRate = 0.5;
            video.play().catch((err) => {
              console.error('Video play failed:', err);
            });
          }, { once: true });
        }
      };
      playWhenReady();
    } else if (video.readyState > 0) {
      // Only pause if video has actually loaded some data
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, isActive, isVideo]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f6efe4]">
      {attachment && !hasError ? (
        isVideo ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered || isActive ? "opacity-100" : "opacity-70"
            }`}
            loop
            muted
            playsInline
            preload="metadata"
            onLoadStart={() => console.log('Video load started:', attachment)}
            onLoadedMetadata={() => console.log('Video metadata loaded:', attachment)}
            onLoadedData={() => console.log('Video data loaded successfully:', attachment)}
            onCanPlay={() => console.log('Video can play:', attachment)}
            onError={(e) => {
              const video = e.currentTarget;
              console.error('Video error:', {
                attachment,
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState
              });
              setHasError(true);
            }}
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
              console.error('Image failed to load:', attachment, e);
              setHasError(true);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', attachment);
            }}
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          {hasError ? (
            <div className="text-center px-4">
              <div className="text-red-400 mb-1">Media failed to load</div>
              <div className="text-xs text-gray-500 break-all">{attachment}</div>
            </div>
          ) : (
            'No media'
          )}
        </div>
      )}
    </div>
  );
}

const BlogSection = forwardRef<HTMLElement>(function BlogSection(props, ref) {
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
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
        const response = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_BLOGS), {
          method: 'POST',
          body: JSON.stringify({
            limit: 10
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const result = await response.json();

        if (result.message?.success && result.message?.data) {
          const blogs = result.message.data.map((blog: any) => {
            const attachmentUrl = getFileUrl(blog.attachment);
            console.log('Blog attachment mapping:', {
              originalPath: blog.attachment,
              generatedUrl: attachmentUrl,
              title: blog.title
            });
            return {
              id: blog.blog_id || blog.name,
              name: blog.name,
              title: blog.title,
              description: blog.description || '',
              attachment: attachmentUrl,
              author: blog.author || blog.owner || 'Sena Team',
              published_date: blog.published_date || blog.creation || new Date().toISOString().split('T')[0],
            };
          });
          setBlogPosts(blogs);

          // Preload video attachments for faster loading
          blogs.forEach((blog: BlogPost) => {
            if (blog.attachment) {
              const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
              const attachment = blog.attachment;
              const isVideo = videoExtensions.some(ext => attachment.toLowerCase().endsWith(ext));

              if (isVideo) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'fetch';
                link.href = attachment;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
              }
            }
          });
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
    <section ref={ref} id="blog" className="scroll-mt-24 pb-4" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      <style jsx>{`
        .blog-carousel::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .blog-carousel {
            padding-left: max(2rem, calc(50% - 200px));
            padding-right: max(2rem, calc(50% - 200px));
            gap: 2rem;
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
          <div className="mt-4 mb-6 md:mb-8 text-center px-4 md:px-0">
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: isMobile ? '32px' : '40px',
                marginBottom: '12px',
              }}
            >
              Blog
            </h2>
            <p
              className="text-waygent-text-secondary font-space-grotesk"
              style={{
                fontSize: isMobile ? '14px' : '16px',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Insights, updates, and stories from our team
            </p>
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
            {/* Mobile: Horizontal swipe carousel */}
            {isMobile ? (
              <div className="relative" style={{ zIndex: 10 }}>
                <div
                  ref={carouselRef}
                  className="overflow-x-auto pb-4 hide-scrollbar"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div
                    className="flex gap-4"
                    style={{
                      width: 'max-content',
                      paddingLeft: 'max(1rem, calc(50vw - 140px))',
                      paddingRight: 'max(1rem, calc(50vw - 140px))',
                    }}
                  >
                    {blogPosts.map((post, index) => {
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
                          className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white text-waygent-text-primary transition-all duration-300 cursor-pointer w-[280px] flex-shrink-0 ${
                            isActive
                              ? 'border-[#9CA3AF] shadow-xl'
                              : 'border-[#9CA3AF]/60 shadow-md'
                          }`}
                          style={{ scrollSnapAlign: 'center' }}
                          onMouseEnter={() => setHoveredCardId(post.id)}
                          onMouseLeave={() => setHoveredCardId(null)}
                        >
                          <div className="relative w-full aspect-square">
                            <BlogVisual
                              attachment={post.attachment}
                              isHovered={hoveredCardId === post.id}
                              isActive={isActive}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
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
                              <div className="relative z-10">
                                <h3
                                  className="text-white font-bold leading-tight mb-1.5 line-clamp-2"
                                  style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                    fontSize: '14px',
                                    letterSpacing: '-0.01em',
                                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8)',
                                  }}
                                >
                                  {post.title}
                                </h3>
                                <div
                                  className="flex items-center gap-2 text-white font-space-grotesk font-medium"
                                  style={{ fontSize: '11px', textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)' }}
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
                </div>

                {/* Mobile dot indicators */}
                {blogPosts.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {blogPosts.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeCardIndex
                            ? 'bg-[#2C1810] scale-125'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop: Page-based carousel */
              <div
                ref={carouselRef}
                className="blog-carousel overflow-hidden py-8 md:py-4 relative"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  marginBottom: '1.5rem',
                  zIndex: 10,
                }}
              >
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {Array.from({ length: Math.ceil(Math.max(blogPosts.length, 3) / 3) }).map((_, pageIndex) => {
                    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
                    const postsInPage = blogPosts.slice(pageIndex * 3, (pageIndex * 3) + 3);
                    const itemsToShow = [...postsInPage];
                    while (itemsToShow.length < 3 && pageIndex === 0 && !isTablet) {
                      itemsToShow.push({ isPlaceholder: true, id: `placeholder-${itemsToShow.length}` } as any);
                    }
                    const displayItems = isTablet ? itemsToShow.slice(0, 2) : itemsToShow;

                    return (
                      <div
                        key={pageIndex}
                        className="flex-shrink-0 w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto px-4 md:px-8"
                        style={{
                          maxWidth: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '800px' : '600px'
                        }}
                      >
                        {displayItems.map((post, index) => {
                          if ((post as any).isPlaceholder) {
                            return (
                              <div
                                key={(post as any).id}
                                className="relative flex-col overflow-hidden rounded-3xl border-2 border-[#9CA3AF] bg-[#f6efe4] shadow-sm cursor-default hidden md:flex"
                              >
                                <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
                                  <div className="relative z-10 text-center px-6">
                                    <div className="relative w-20 h-20 mx-auto mb-4">
                                      <div
                                        className="absolute inset-0 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'rgba(44, 24, 16, 0.08)' }}
                                      >
                                        <svg className="w-10 h-10" style={{ color: '#2C1810' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="font-space-grotesk font-bold mb-1" style={{ fontSize: '16px', letterSpacing: '-0.02em', color: '#2C1810' }}>
                                      Coming Soon
                                    </div>
                                    <div className="font-space-grotesk text-gray-500" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                      More insights on the way
                                    </div>
                                    <div className="flex items-center justify-center gap-1.5 mt-4">
                                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#2C1810', animationDelay: '0ms', animationDuration: '1500ms' }} />
                                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#2C1810', animationDelay: '150ms', animationDuration: '1500ms' }} />
                                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#2C1810', animationDelay: '300ms', animationDuration: '1500ms' }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          const actualPost = post as BlogPost;
                          const formattedDate = actualPost.published_date
                            ? new Date(actualPost.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '';

                          return (
                            <Link
                              key={actualPost.id}
                              href={`/blog/${actualPost.id}`}
                              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white text-waygent-text-primary shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border-[#9CA3AF] hover:border-[#6B7280]"
                              onMouseEnter={() => setHoveredCardId(actualPost.id)}
                              onMouseLeave={() => setHoveredCardId(null)}
                            >
                              <div className="relative w-full aspect-square">
                                <BlogVisual
                                  attachment={actualPost.attachment}
                                  isHovered={hoveredCardId === actualPost.id}
                                  isActive={false}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-3">
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
                                  <div className="relative z-10">
                                    <h3
                                      className="text-white font-bold leading-tight mb-1.5 transition-all duration-300 group-hover:text-waygent-cream line-clamp-2"
                                      style={{
                                        fontFamily: "Georgia, 'Times New Roman', serif",
                                        fontSize: '13px',
                                        letterSpacing: '-0.01em',
                                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.8)',
                                      }}
                                    >
                                      {actualPost.title}
                                    </h3>
                                    <div
                                      className="flex items-center gap-2 text-white font-space-grotesk font-medium"
                                      style={{ fontSize: '11px', textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)' }}
                                    >
                                      <span className="truncate">{actualPost.author}</span>
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
                    );
                  })}
                </div>
              </div>
            )}

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
