"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiUrl, API_CONFIG } from "@/lib/config";
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
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current article
        const articleResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_BLOG_BY_ID), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        const blogsResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_BLOGS), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const blogsResult = await blogsResponse.json();

        if (blogsResult.message?.success && blogsResult.message?.data) {
          setAllBlogs(blogsResult.message.data);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
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
        <main className="min-h-screen bg-waygent-cream pt-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
            <div className="flex items-center justify-center py-12 min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-waygent-orange border-t-transparent rounded-full animate-spin"></div>
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
        <main className="min-h-screen bg-waygent-cream pt-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 font-futura mb-4">
                {error || "Article not found"}
              </h1>
              <button
                onClick={handleBackClick}
                className="text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk cursor-pointer"
              >
                ← Go back
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Determine if attachment is a video
  // const isVideo = article.attachment
  //   ? [".mp4", ".webm", ".ogg", ".mov"].some((ext) =>
  //       article.attachment!.toLowerCase().endsWith(ext)
  //     )
  //   : false;

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
      <main className="min-h-screen bg-waygent-cream pt-16 relative">
        {/* Left Sidebar: Blog List - Positioned to the left of content */}
        <div className="hidden xl:block fixed top-24 z-10" style={{
          left: 'calc(50% - 640px - 300px)',
          width: '280px'
        }}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200/40" style={{ background: 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' }}>
              <h2 className="text-sm font-bold text-white font-futura uppercase tracking-wide">
                All Blogs
              </h2>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {allBlogs.map((blog) => {
                const isActive = blog.blog_id === article?.blog_id || blog.name === article?.name;
                return (
                  <Link
                    key={blog.blog_id || blog.name}
                    href={`/blog/${blog.blog_id || blog.name}`}
                    className={`block p-4 border-b border-gray-100/50 transition-all ${
                      isActive
                        ? 'bg-waygent-blue/10 border-l-4 border-l-waygent-blue'
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <h3 className={`text-sm font-semibold font-space-grotesk mb-1 ${
                      isActive ? 'text-waygent-blue' : 'text-gray-800'
                    }`}>
                      {blog.title}
                    </h3>
                    {blog.published_date && (
                      <p className="text-xs text-gray-500">
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
            </div>
          </div>
        </div>

        {/* Main Content - Original positioning, full width */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <article>
              <div className="mb-6 px-8 sm:px-10 lg:px-12">
              {/* Date and Author */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400 font-space-grotesk mb-3">
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-futura mb-3 leading-tight">
                {article.title}
              </h1>

              {/* Description */}
              {article.description && (
                <p className="text-base text-gray-500 font-space-grotesk leading-relaxed italic">
                  {article.description}
                </p>
              )}
            </div>

            {/* Content Card */}
            <div
              className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/40 shadow-lg px-8 sm:px-10 lg:px-12 pt-6 pb-8 sm:pb-10 lg:pb-12"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* Content */}
              {article.content && (
                <div
                  className="prose prose-lg max-w-none font-space-grotesk blog-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
