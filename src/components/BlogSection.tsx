"use client";

import React from "react";
import Link from "next/link";
import { getApiUrl, getFileUrl, API_CONFIG } from "@/lib/config";

type BlogPost = {
  id: string;
  name: string;
  title: string;
  description: string;
  attachment?: string;
  blog_id?: string;
};

// Fallback data in case API fails
const fallbackBlogPosts: BlogPost[] = [
  {
    id: "ai-first-erp",
    name: "Why the next wave of ERPs is AI-first",
    title: "Why the next wave of ERPs is AI-first",
    description:
      "We break down the architectural shifts that make intelligence the new system of record.",
  },
  {
    id: "customer-knowledge",
    name: "Scaling customer knowledge without chaos",
    title: "Scaling customer knowledge without chaos",
    description:
      "How ops teams centralize learnings so teams never go into meetings unprepared.",
  },
  {
    id: "reliable-automations",
    name: "Designing reliable automations",
    title: "Designing reliable automations",
    description:
      "Our framework for building playbooks that operators actually trust day-to-day.",
  },
];

function BlogVisual({
  attachment,
  isHovered
}: {
  attachment?: string;
  isHovered: boolean
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

    if (isHovered) {
      video.playbackRate = 0.5;
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, isVideo]);

  return (
    <div className="relative w-full overflow-hidden bg-[#f6efe4] aspect-[5/4]">
      {attachment ? (
        isVideo ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-50"
            }`}
            loop
            muted
            playsInline
          >
            <source src={attachment} type="video/mp4" />
          </video>
        ) : (
          <img
            src={attachment}
            alt="Blog visual"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-50"
            }`}
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No media
        </div>
      )}
    </div>
  );
}

export default function BlogSection() {
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>(fallbackBlogPosts);
  const [loading, setLoading] = React.useState(true);

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

  return (
    <section
      id="blog"
      className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-7xl font-space-grotesk">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#ffe7f1] opacity-50 blur-3xl" />
          <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f6efe4] opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e5f0ff] opacity-45 blur-[110px]" />
        </div>

        <div className="relative flex flex-col">
          <div className="mb-6">
            <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
              Blog
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-waygent-text-secondary">Loading blog posts...</div>
            </div>
          ) : (
            <div className="flex gap-4 items-stretch">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-[24px] border border-waygent-light-blue/40 bg-white text-waygent-text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl w-[280px] flex-shrink-0"
                  onMouseEnter={() => setHoveredCardId(post.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <BlogVisual
                    attachment={post.attachment}
                    isHovered={hoveredCardId === post.id}
                  />
                  <div className="flex flex-1 flex-col gap-2.5 border-t border-waygent-light-blue/30 px-4 py-3.5">
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="text-[15px] font-bold text-waygent-text-primary leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[12px] leading-relaxed text-waygent-text-secondary/90">
                        {post.description}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-waygent-blue transition hover:text-waygent-blue-hover mt-auto"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}

              {blogPosts.length > 4 && (
                <div className="flex items-center justify-center ml-8">
                  <a
                    href="#"
                    className="group flex flex-col items-center gap-3 transition"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-waygent-text-primary/20 bg-white transition hover:border-waygent-text-primary hover:bg-waygent-text-primary">
                      <svg
                        className="h-5 w-5 transition group-hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-waygent-text-secondary whitespace-nowrap">
                      See more
                    </span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
