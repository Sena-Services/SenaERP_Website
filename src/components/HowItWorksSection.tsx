"use client";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "discovery",
    title: "Talk to Sena",
    subtitle: "Describe your business in plain English",
    description: "Share your workflows, challenges, and goals. Sena asks the right questions to understand exactly what you need—no technical jargon required.",
  },
  {
    id: "preview",
    title: "Review & Refine",
    subtitle: "See your custom ERP before it goes live",
    description: "Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and ensure it's exactly right.",
  },
  {
    id: "publish",
    title: "Go Live",
    subtitle: "Deploy your tailored system instantly",
    description: "One click and your custom ERP is live. Your team can start using it immediately—no setup, no installation, no complexity.",
  },
];

function StepVisual({ id }: { id: Step["id"] }) {
  if (id === "discovery") {
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
      <div className="relative w-full overflow-hidden bg-[#f6efe4] aspect-[5/6]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <source src="/videos/card1.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (id === "preview") {
    const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      video.playbackRate = 0.75;
      video.play();
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      video.pause();
      video.currentTime = 0;
    };

    return (
      <div className="relative w-full overflow-hidden bg-[#f5f2e9] aspect-[5/6]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <source src="/videos/card2.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.currentTime = 3;
    video.playbackRate = 0.5;
    video.play();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.pause();
    video.currentTime = 3;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 6) {
      video.currentTime = 3;
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#f6f2fb] aspect-[5/6]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTimeUpdate={handleTimeUpdate}
        ref={(video) => {
          if (video) video.currentTime = 3;
        }}
      >
        <source src="/videos/card3.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-7xl font-space-grotesk">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#f6efe4] opacity-50 blur-3xl" />
          <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-[#e5f0ff] opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#ffe7f1] opacity-45 blur-[110px]" />
        </div>

        <div className="relative flex flex-col">
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
              How it works
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.id}
                className="flex h-full flex-col overflow-hidden rounded-[28px] border border-waygent-light-blue/40 bg-white text-waygent-text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <StepVisual id={step.id} />
                <div className="flex flex-1 flex-col gap-2.5 border-t border-waygent-light-blue/30 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-waygent-blue text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-base font-bold text-waygent-text-primary leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-sm font-medium text-waygent-text-secondary leading-relaxed">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-waygent-text-secondary/90 pl-10">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
