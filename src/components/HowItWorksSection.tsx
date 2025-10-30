"use client";

import Link from "next/link";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "discovery",
    title: "Discovery",
    subtitle: "Talk about your business requirements to the AI.",
    description:
      "Describe workflows, data sources, and the outcomes you care about. Sena's builder translates every natural language detail into the primitives it needs.",
  },
  {
    id: "preview",
    title: "Preview",
    subtitle:
      "Review the ERP it drafts for you and see every primitive it used.",
    description:
      "Explore the auto-generated environment, tweak tables, flows, and permissions, and iterate with natural language or manual edits until it feels right.",
  },
  {
    id: "publish",
    title: "Publish",
    subtitle:
      "Click publish and your tailored environment is ready instantly.",
    description:
      "Move straight from prototype to production. When you ship, the workspace is live for your team the next time they log in—no deployment queue required.",
  },
];

function StepVisual({ id }: { id: Step["id"] }) {
  if (id === "discovery") {
    return (
      <div className="relative h-52 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fde4ff] via-[#fff4fb] to-[#dbeafe] p-6">
        <div className="absolute -top-10 left-10 h-28 w-28 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute -right-10 bottom-6 h-32 w-32 rounded-full bg-[#c7d2fe]/40 blur-2xl" />
        <div className="relative flex h-full flex-col justify-end gap-3 text-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-waygent-blue shadow-md backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-waygent-blue" />
            <span className="font-medium">Discovery prompt</span>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-white/80 p-4 text-left text-waygent-text-secondary shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-waygent-blue/80">
              You
            </p>
            <p className="text-sm font-semibold text-waygent-text-primary">
              "We run onboarding, finance approvals, and partner ops in Notion.
              Help us automate the hand-offs."
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (id === "preview") {
    const previewTokens = [
      "CRM",
      "Billing",
      "Playbooks",
      "Slack",
      "Inventory",
      "Forecast",
      "Hub",
      "Audit",
    ];

    return (
      <div className="relative h-52 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#eef2ff] via-[#fff7ed] to-[#f5f3ff] p-6">
        <div className="absolute inset-x-8 top-6 h-8 rounded-full bg-white/60 blur-md" />
        <div className="relative grid h-full w-full grid-cols-4 gap-3">
          {previewTokens.map((token) => (
            <div
              key={token}
              className="flex items-center justify-center rounded-2xl bg-white/80 text-xs font-medium text-waygent-text-muted shadow-md backdrop-blur"
            >
              {token}
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-waygent-text-secondary shadow-xl backdrop-blur">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-waygent-text-muted">
            <span>Generated primitives</span>
            <span>Editable</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-waygent-blue">
            <span className="rounded-full bg-waygent-blue/10 px-2 py-1 font-semibold">
              Tables
            </span>
            <span className="rounded-full bg-waygent-blue/10 px-2 py-1 font-semibold">
              Workflows
            </span>
            <span className="rounded-full bg-waygent-blue/10 px-2 py-1 font-semibold">
              APIs
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f3e8ff] via-[#fde4ff] to-[#e0f2fe] p-6">
      <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#c7d2fe]/40 blur-2xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#fb7185]/30 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center gap-2 self-end rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold text-waygent-blue shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Live environment
        </div>
        <div className="space-y-3 rounded-3xl bg-white/90 p-4 text-sm text-waygent-text-secondary shadow-xl backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-waygent-text-muted">
              Publish summary
            </p>
            <p className="text-sm font-semibold text-waygent-text-primary">
              Environments deployed | Permissions synced | Workflows activated
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-waygent-blue">
            <span className="rounded-xl bg-waygent-blue/10 px-2 py-1 text-center font-semibold">
              CRM UI
            </span>
            <span className="rounded-xl bg-waygent-blue/10 px-2 py-1 text-center font-semibold">
              Data models
            </span>
            <span className="rounded-xl bg-waygent-blue/10 px-2 py-1 text-center font-semibold">
              Automations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[40px] border border-white/40 bg-white/70 shadow-xl backdrop-blur"
        style={{
          minHeight: "460px",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 45%), radial-gradient(circle at top right, rgba(245,158,11,0.18), transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,249,245,0.92))",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#dbeafe] blur-3xl opacity-70" />
          <div className="absolute -right-16 bottom-12 h-48 w-48 rounded-full bg-[#fde68a] blur-3xl opacity-60" />
        </div>

        <div className="relative flex flex-col gap-10 p-8 sm:p-10 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-waygent-text-muted">
                Easy as one, two, three.
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-waygent-text-primary sm:text-5xl">
                How it works
              </h2>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-waygent-blue px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-waygent-blue-hover"
            >
              Try for free →
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.id}
                className="flex flex-col rounded-[32px] border border-white/50 bg-waygent-cream/60 p-5 text-waygent-text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6"
              >
                <div>
                  <StepVisual id={step.id} />
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-waygent-text-muted">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-waygent-blue/30 bg-waygent-cream text-waygent-blue">
                      {index + 1}
                    </span>
                    {step.title}
                  </div>
                  <h3 className="text-xl font-semibold text-waygent-text-primary">
                    {step.subtitle}
                  </h3>
                  <p className="text-sm leading-relaxed text-waygent-text-secondary">
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
