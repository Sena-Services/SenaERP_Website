"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";
import NavBar from "@/components/NavBar";
import Link from "next/link";

type BlogArticle = {
  name: string;
  title: string;
  description: string;
  content: string;
  attachment?: string;
  blog_id: string;
  published_date: string;
  author?: string;
};

type BlogListItem = {
  name: string;
  title: string;
  blog_id: string;
  published_date: string;
};

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const blogId = decodeURIComponent(params.id as string);

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    router.push('/?section=how-it-works');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current article
        const articleResponse = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GET_BLOG_BY_ID), {
          method: "POST",
          body: JSON.stringify({
            blog_id: blogId,
            name: blogId,
          }),
        });

        const articleResult = await articleResponse.json();

        if (articleResult.message?.success && articleResult.message?.data) {
          setArticle(articleResult.message.data);
        } else {
          setError("Blog post not found");
        }

        // Fetch all blogs for the sidebar
        const blogsResponse = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_BLOGS), {
          method: "POST",
        });

        const blogsResult = await blogsResponse.json();

        if (blogsResult.message?.success && blogsResult.message?.data) {
          setAllBlogs(blogsResult.message.data);
        }
      } catch {
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchData();
    }
  }, [blogId]);

  if (loading) {
    return (
      <>
        <div className="fixed left-0 right-0 top-0 z-[200] flex justify-center">
          <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
            <NavBar
              showBackButton={true}
              onBackClick={handleBackClick}
              blogPageTitle="Blogs"
            />
          </div>
        </div>
        <main className="min-h-screen bg-sena-cream pt-20 sm:pt-16">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-16">
            <div className="flex items-center justify-center py-12 min-h-[300px] sm:min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-sena-orange border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-space-grotesk text-sm">Loading article...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <div className="fixed left-0 right-0 top-0 z-[200] flex justify-center">
          <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
            <NavBar
              showBackButton={true}
              onBackClick={handleBackClick}
              blogPageTitle="Blogs"
            />
          </div>
        </div>
        <main className="min-h-screen bg-sena-cream pt-20 sm:pt-16">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-16">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-futura mb-4">
                {error || "Article not found"}
              </h1>
              <button
                onClick={handleBackClick}
                className="text-sena-blue hover:text-sena-blue-hover font-space-grotesk cursor-pointer"
              >
                ← Go back
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[200] flex justify-center">
        <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
          <NavBar
            showBackButton={true}
            onBackClick={handleBackClick}
            blogPageTitle="Blogs"
          />
        </div>
      </div>
      <main className="min-h-screen bg-sena-cream pt-20 sm:pt-16 relative">
        {/* Left Sidebar: Blog List - Positioned to the left of content */}
        <div className="hidden xl:block fixed top-24 z-10" style={{
          left: 'max(10px, calc(50% - 640px - 200px))',
          width: 'clamp(180px, calc((100vw - 1350px) * 999), 240px)'
        }}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200/40" style={{ background: 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' }}>
              <h2 className="text-sm font-bold text-white font-futura uppercase tracking-wide">
                All Blogs
              </h2>
            </div>
            <nav className="p-2 max-h-[500px] overflow-y-auto">
              {allBlogs.map((blog) => {
                const isActive = blog.blog_id === article?.blog_id || blog.name === article?.name;
                return (
                  <Link
                    key={blog.blog_id || blog.name}
                    href={`/blog/${blog.blog_id || blog.name}`}
                    className="block px-4 py-3 rounded-lg transition-all duration-300 ease-out font-space-grotesk mb-1 border"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' : 'transparent',
                      border: isActive ? '1px solid #7AA5B5' : '1px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(143, 183, 197, 0.4)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(143, 183, 197, 0.12)';
                        e.currentTarget.style.border = '1px solid rgba(143, 183, 197, 0.25)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 183, 197, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.border = '1px solid transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <h3 className="text-sm font-semibold mb-1" style={{ color: isActive ? '#FFFFFF' : '#374151' }}>
                      {blog.title}
                    </h3>
                    {blog.published_date && (
                      <p className="text-xs" style={{ color: isActive ? 'rgba(255, 255, 255, 0.9)' : '#6B7280' }}>
                        {new Date(blog.published_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content - Original positioning, full width */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-8">
          <article>
            {/* Combined Card with Header and Content */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/40 shadow-lg overflow-hidden"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* Header Section with Blue Background */}
              <div className="px-4 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6" style={{ backgroundColor: '#80AAB9' }}>
                {/* Date and Author */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-wide font-space-grotesk mb-2 sm:mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {article.published_date && (
                    <span>
                      {new Date(article.published_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {article.author && article.published_date && (
                    <span>•</span>
                  )}
                  {article.author && (
                    <span>{article.author}</span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-futura mb-2 sm:mb-3 leading-tight text-white">
                  {article.title}
                </h1>

                {/* Description */}
                {article.description && (
                  <p className="text-sm sm:text-base font-space-grotesk leading-relaxed italic text-white/90">
                    {article.description}
                  </p>
                )}
              </div>

              {/* Content Section */}
              <div className="px-4 sm:px-8 md:px-10 lg:px-12 pt-4 sm:pt-6 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
                {/* Content */}
                {article.content && (
                  <div
                    className="prose prose-sm sm:prose-lg max-w-none font-space-grotesk blog-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                  />
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
