"use client";

type BlogPost = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "ai-first-erp",
    title: "Why the next wave of ERPs is AI-first",
    description:
      "We break down the architectural shifts that make intelligence the new system of record.",
    videoSrc: "/videos/blog1.mp4",
  },
  {
    id: "customer-knowledge",
    title: "Scaling customer knowledge without chaos",
    description:
      "How ops teams centralize learnings so teams never go into meetings unprepared.",
    videoSrc: "/videos/blog2.mp4",
  },
  {
    id: "reliable-automations",
    title: "Designing reliable automations",
    description:
      "Our framework for building playbooks that operators actually trust day-to-day.",
    videoSrc: "/videos/blog3.mp4",
  },
];

function BlogVisual({ videoSrc }: { videoSrc: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.playbackRate = 0.5;
    video.play();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#f6efe4] aspect-[6/5]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

export default function BlogSection() {
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
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
              Blog
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="flex h-full flex-col overflow-hidden rounded-[28px] border border-waygent-light-blue/40 bg-white text-waygent-text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <BlogVisual videoSrc={post.videoSrc} />
                <div className="flex flex-1 flex-col gap-2.5 border-t border-waygent-light-blue/30 px-5 py-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-waygent-text-primary leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-waygent-text-secondary/90">
                      {post.description}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-waygent-blue transition hover:text-waygent-blue-hover"
                  >
                    Read article →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
