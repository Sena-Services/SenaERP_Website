import NavBar from "@/components/NavBar";
import IntroSection from "@/components/IntroSection";
import SidebarNav from "@/components/SidebarNav";
// import Builder from "@/components/Builder";
import HowItWorksSection from "@/components/HowItWorksSection";
import LandingEnvironments from "@/components/LandingEnvironments";
import IntegrationsSection from "@/components/IntegrationsSection";
import PricingSection from "@/components/PricingSection";
import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "how-it-works", label: "How it Works" },
  { id: "environments", label: "Environments" },
  { id: "integrations", label: "Integrations" },
  { id: "builder", label: "Builder" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
  { id: "join-us", label: "Join Us" },
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


export default function Home() {
  return (
    <main className="relative min-h-screen bg-waygent-cream text-waygent-text-primary">
      <SidebarNav sections={sections} />

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream pl-0 lg:pl-[9rem]">
          <NavBar />
          <div className="flex-1 flex flex-col">
            <section id="intro" className="scroll-mt-32">
              <IntroSection />
            </section>
            <HowItWorksSection />
            <LandingEnvironments />
            <IntegrationsSection />
            {/* <Builder /> */}
          </div>

          <section id="builder" className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto w-full max-w-7xl">
              <div className="mb-8">
                <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
                  Builder
                </h2>
              </div>
            </div>
          </section>

          {/* <div className="mt-24 space-y-24 px-4 pb-20 sm:px-6 lg:px-10 xl:px-14">
            <section id="cofounder" className="scroll-mt-32">...</section>
            <section id="use-cases" className="scroll-mt-32">...</section>
            <section id="product" className="scroll-mt-32">...</section>
            <section id="agents" className="scroll-mt-32">...</section>
            <section id="results" className="scroll-mt-32">...</section>
          </div> */}

          <PricingSection />
          <BlogSection />
          <JoinUsSection />

        </div>
      </div>
    </main>
  );
}
