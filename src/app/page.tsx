import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import IntroSection from "@/components/IntroSection";
import SidebarNav from "@/components/SidebarNav";
import ScrollShowcase from "@/components/ScrollShowcase";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "platform-story", label: "Story" },
  { id: "cofounder", label: "Cofounder" },
  { id: "use-cases", label: "Use Cases" },
  { id: "product", label: "Product" },
  { id: "agents", label: "Agents" },
  { id: "integrations", label: "Integrations" },
  { id: "results", label: "Results" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
];

const checklistItems = [
  { label: "Linear roadmap sync for 7/15", state: "done" as const },
  { label: "Slack messages sync", state: "processing" as const },
  { label: "Competitors research", state: "upcoming" as const },
  { label: "CRM Enrichment", state: "upcoming" as const },
  { label: "Notion roadmap update", state: "upcoming" as const },
] as const;

const useCases = [
  {
    title: "Revenue Ops",
    description:
      "Sync call notes, CRM updates, and renewal signals without manual input.",
  },
  {
    title: "Customer Success",
    description:
      "Trigger proactive playbooks when sentiment dips or usage changes.",
  },
  {
    title: "Founders",
    description:
      "See pipeline, hiring, and cash projections in one reliable dashboard.",
  },
] as const;

const productHighlights = [
  {
    title: "Shared workspace",
    description:
      "AI-generated briefs create the perfect hand-off between teams, keeping everyone aligned.",
  },
  {
    title: "Automated insights",
    description:
      "Daily digests summarize the signals that matter so you never miss an opportunity.",
  },
  {
    title: "Enterprise ready",
    description:
      "Granular permissions, audit trails, and SOC 2 compliance keep the whole org secure.",
  },
] as const;

const agents = [
  {
    title: "Knowledgebase agent",
    description:
      "Builds a living wiki by listening to meetings, documents, and customer conversations.",
  },
  {
    title: "Pipeline agent",
    description:
      "Surfaces risk, assigns follow-ups, and mirrors changes instantly inside your CRM.",
  },
  {
    title: "Finance agent",
    description:
      "Reconciles invoices, tracks vendor spend, and alerts when budgets drift.",
  },
] as const;

const integrationTools = [
  "Slack",
  "Salesforce",
  "Notion",
  "Linear",
  "Gmail",
  "Calendly",
  "QuickBooks",
  "Rippling",
  "Zendesk",
  "Snowflake",
] as const;

const resultStats = [
  {
    stat: "78%",
    description: "Reduction in duplicate data entry across revenue teams.",
  },
  {
    stat: "4.5x",
    description: "Increase in automated hand-offs between sales and success.",
  },
  {
    stat: "12 hrs",
    description: "Saved per manager every week through daily AI summaries.",
  },
] as const;

const pricingTiers = [
  {
    plan: "Starter",
    price: "$0",
    tagline: "for up to 3 teammates",
    features: ["Live knowledgebase", "Weekly digests", "Email support"],
  },
  {
    plan: "Growth",
    price: "$79",
    tagline: "per user / month",
    features: ["Automations", "CRM sync", "Priority support"],
  },
  {
    plan: "Enterprise",
    price: "Let's talk",
    tagline: "tailored for large teams",
    features: ["Dedicated agent", "Custom integrations", "White-glove onboarding"],
  },
] as const;

const blogPosts = [
  {
    title: "Why the next wave of ERPs is AI-first",
    description:
      "We break down the architectural shifts that make intelligence the new system of record.",
  },
  {
    title: "Scaling customer knowledge without chaos",
    description:
      "How ops teams centralize learnings so teams never go into meetings unprepared.",
  },
  {
    title: "Designing reliable automations",
    description:
      "Our framework for building playbooks that operators actually trust day-to-day.",
  },
] as const;

export default function Home() {
  return (
    <main className="relative min-h-screen bg-waygent-cream text-waygent-text-primary">
      <SidebarNav sections={sections} />

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream pl-0 sm:pl-[9.5rem]">
          <NavBar />
          <div className="flex-1 flex flex-col">
            <section id="intro" className="scroll-mt-32">
              <IntroSection />
            </section>
            <section id="platform-story" className="scroll-mt-32 mt-24">
              <ScrollShowcase />
            </section>
          </div>

          <div className="mt-24 space-y-24 px-4 pb-20 sm:px-6 lg:px-10 xl:px-14">
            <section id="cofounder" className="scroll-mt-32">
              <div className="overflow-hidden rounded-3xl border border-waygent-light-blue bg-waygent-light-blue shadow-xl">
                <div className="grid gap-0 lg:grid-cols-[3fr,2fr]">
                  <div className="relative h-[320px] sm:h-[420px] lg:h-full">
                    <Image
                      src="/hero4.png"
                      alt="Product hero"
                      fill
                      className="object-cover"
                      priority
                    />

                    <div className="absolute left-1/2 top-1/2 w-[85%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-waygent-cream bg-waygent-cream/90 p-6 shadow-2xl backdrop-blur-sm">
                      <span className="text-xs uppercase tracking-wide text-waygent-text-secondary">
                        Day Planner
                      </span>
                      <ul className="mt-4 space-y-3">
                        {checklistItems.map((item) => (
                          <li
                            key={item.label}
                            className="flex items-center justify-between gap-3 rounded-xl bg-waygent-cream px-4 py-3 shadow-sm ring-1 ring-waygent-light-blue/60"
                          >
                            <span
                              className={`text-sm font-medium ${
                                item.state === "upcoming"
                                  ? "text-waygent-text-muted"
                                  : "text-waygent-text-primary"
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.state === "done" && (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                                ✓
                              </span>
                            )}
                            {item.state === "processing" && (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-waygent-blue text-waygent-blue text-xs">
                                →
                              </span>
                            )}
                            {item.state === "upcoming" && (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-waygent-light-blue text-waygent-text-muted text-xs">
                                •
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-6 px-8 py-12">
                    <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                      Knowledgebase Agent
                    </span>
                    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                      Connect your CRM, calendar, and communication tools to build a live memory for your business.
                    </h1>
                    <p className="text-lg text-waygent-text-secondary">
                      Sena keeps your teams aligned with unified knowledge, synchronized tasks, and contextual insights that automatically refresh every minute.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/signup"
                        className="rounded-full bg-waygent-blue px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-waygent-blue-hover"
                      >
                        Start free trial
                      </Link>
                      <Link
                        href="#agents"
                        className="rounded-full border border-waygent-blue/40 bg-waygent-cream px-5 py-3 text-sm font-semibold text-waygent-text-secondary transition hover:border-waygent-blue hover:text-waygent-blue"
                      >
                        Explore agents
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="use-cases" className="scroll-mt-32">
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                  Use cases
                </span>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Built for the operators who run ambitious teams
                </h2>
                <p className="mt-4 text-lg text-waygent-text-secondary">
                  Automate onboarding, synchronize sales and success motions, and give finance real-time confidence in the numbers—all from a single workspace.
                </p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {useCases.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-waygent-light-blue/60 bg-waygent-cream p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-waygent-text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm text-waygent-text-secondary">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="product" className="scroll-mt-32">
              <div className="rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-10 shadow-xl">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
                  <div className="lg:w-1/2">
                    <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                      Product
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight">
                      Give every workflow a system that understands context.
                    </h2>
                    <p className="mt-4 text-lg text-waygent-text-secondary">
                      Sena listens to your tools, learns your processes, and suggests the next best action. No more copying data between apps—your command center lives here.
                    </p>
                  </div>
                  <div className="grid gap-4 lg:w-1/2">
                    {productHighlights.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-waygent-light-blue/70 bg-waygent-cream p-6 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-waygent-text-secondary">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="agents" className="scroll-mt-32">
              <div className="flex flex-col gap-8 rounded-3xl border border-waygent-light-blue bg-gradient-to-br from-waygent-light-blue to-waygent-cream p-10 shadow-lg">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                      Agents
                    </span>
                    <h2 className="mt-2 text-3xl font-semibold leading-tight">
                      Specialists you can deploy instantly.
                    </h2>
                  </div>
                  <Link
                    href="/signup"
                    className="self-start rounded-full border-2 border-waygent-blue bg-waygent-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-waygent-blue-hover"
                  >
                    Talk to an expert
                  </Link>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.title}
                      className="rounded-2xl border border-waygent-light-blue/70 bg-waygent-cream p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold">{agent.title}</h3>
                      <p className="mt-2 text-sm text-waygent-text-secondary">
                        {agent.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="integrations" className="scroll-mt-32">
              <div className="rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-10 shadow-lg">
                <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                  Integrations
                </span>
                <h2 className="mt-3 text-3xl font-semibold">
                  Connect the tools you already use.
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-waygent-text-secondary">
                  Plug Sena into your existing stack—Slack, Salesforce, Notion, Google Workspace, HubSpot, and 30+ others. Data flows bi-directionally so updates never go stale.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm text-waygent-text-secondary">
                  {integrationTools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-waygent-light-blue/70 bg-waygent-cream px-4 py-2 shadow-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section id="results" className="scroll-mt-32">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-8 text-waygent-text-primary shadow-xl">
                  <h3 className="text-2xl font-semibold">Results</h3>
                  <p className="mt-4 text-sm text-waygent-text-secondary">
                    Teams running on Sena ship faster and react sooner. See how operators measure their impact.
                  </p>
                  <Link
                    href="#"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-waygent-blue transition hover:text-waygent-blue-hover"
                  >
                    Download full report →
                  </Link>
                </div>
                {resultStats.map((result) => (
                  <div
                    key={result.stat}
                    className="rounded-3xl border border-waygent-light-blue/70 bg-waygent-cream p-8 shadow-sm"
                  >
                    <span className="text-4xl font-semibold text-waygent-blue">
                      {result.stat}
                    </span>
                    <p className="mt-4 text-sm text-waygent-text-secondary">
                      {result.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="pricing" className="scroll-mt-32">
              <div className="rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-10 shadow-lg">
                <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                  Pricing
                </span>
                <h2 className="mt-3 text-3xl font-semibold">
                  Simple plans that scale with your team.
                </h2>
                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.plan}
                      className="rounded-2xl border border-waygent-light-blue/70 bg-waygent-cream p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-semibold">{tier.plan}</h3>
                      <p className="mt-2 text-3xl font-semibold text-waygent-blue">
                        {tier.price}
                      </p>
                      <p className="text-sm text-waygent-text-secondary">{tier.tagline}</p>
                      <ul className="mt-4 space-y-2 text-sm text-waygent-text-secondary">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <span className="text-waygent-blue">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="blog" className="scroll-mt-32">
              <div className="flex flex-col gap-8 rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-10 shadow-lg">
                <div className="flex flex-col gap-2">
                  <span className="text-sm uppercase tracking-[0.3em] text-waygent-text-secondary">
                    Blog
                  </span>
                  <h2 className="text-3xl font-semibold">Latest thinking from the Sena team.</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {blogPosts.map((post) => (
                    <article
                      key={post.title}
                      className="flex flex-col justify-between rounded-2xl border border-waygent-light-blue/70 bg-waygent-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-waygent-text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-waygent-text-secondary">
                          {post.description}
                        </p>
                      </div>
                      <Link
                        href="#"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-waygent-blue transition hover:text-waygent-blue-hover"
                      >
                        Read article →
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
