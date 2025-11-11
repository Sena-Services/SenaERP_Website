"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl, getFileUrl, API_CONFIG } from "@/lib/config";
import NavBar from "@/components/NavBar";

type BlogArticle = {
  name: string;
  title: string;
  description: string;
  content: string;
  attachment?: string;
  blog_id: string;
  published_date: string;
};

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const blogId = decodeURIComponent(params.id as string);

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Try fetching by blog_id first, if that fails, try by name
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_BLOG_BY_ID), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blog_id: blogId,
            name: blogId,
          }),
        });

        const result = await response.json();

        if (result.message?.success && result.message?.data) {
          setArticle(result.message.data);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Error fetching blog article:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchArticle();
    }
  }, [blogId]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-waygent-cream">
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-gray-600 font-space-grotesk">
              Loading article...
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-waygent-cream">
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 font-futura mb-4">
                {error || "Article not found"}
              </h1>
              <Link
                href="/"
                className="text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk"
              >
                ← Back to home
              </Link>
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
      <NavBar />
      <main className="min-h-screen bg-waygent-cream">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>

          {/* Article header */}
          <article>
            {/* Featured media */}
            {/* {article.attachment && (
              <div className="w-full mb-8">
                {isVideo ? (
                  <video
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                    controls
                    playsInline
                  >
                    <source src={getFileUrl(article.attachment)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={getFileUrl(article.attachment)}
                    alt={article.title}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                  />
                )}
              </div>
            )} */}

          {/* Article content */}
          <div>
            {/* Date */}
            {article.published_date && (
              <div className="text-sm text-gray-500 font-space-grotesk mb-4">
                {new Date(article.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-futura mb-6">
              {article.title}
            </h1>

            {/* Description */}
            {article.description && (
              <p className="text-xl text-gray-600 font-space-grotesk mb-8 leading-relaxed">
                {article.description}
              </p>
            )}

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
