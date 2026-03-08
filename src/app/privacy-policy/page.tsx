"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy at Sena
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: March 2026
          </p>
          <p className="text-gray-700 text-lg mt-4 leading-relaxed">
            This isn&apos;t the kind of privacy policy you scroll past. We actually
            want you to read it. It&apos;s short, it&apos;s honest, and it tells you
            exactly what happens with your data.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What we collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use Sena, we store:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Your messages</strong> &mdash; everything you send through
                Sena, whether that&apos;s through our chat interface, WhatsApp, or
                any other channel your agents are connected to.
              </li>
              <li>
                <strong>AI responses</strong> &mdash; what your agents say back,
                including their reasoning and any tool calls they make.
              </li>
              <li>
                <strong>Account info</strong> &mdash; your name, email, phone
                number, and login credentials.
              </li>
              <li>
                <strong>Usage data</strong> &mdash; which features you use, when
                you&apos;re active, basic browser and device info. This helps us
                understand what&apos;s working and what isn&apos;t.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How we protect it
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your messages are encrypted at rest using AES-256-GCM &mdash; the
              same standard used by banks and governments. Here&apos;s how it works
              in plain terms:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Every user gets their own unique encryption key. Your messages
                are encrypted with your key before they hit the database.
              </li>
              <li>
                If someone got a copy of our database, they&apos;d see gibberish.
                Not your conversations. Not your data. Just ciphertext.
              </li>
              <li>
                Your encryption keys are themselves wrapped by a master key that
                lives outside the database, on the server infrastructure.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              This means that the most common attack vectors &mdash; database
              leaks, unauthorized access, casual browsing &mdash; are fully
              covered. Your data is protected at every layer we control.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the interest of full transparency: because your AI agents process
              messages on our servers, it is theoretically possible for someone at
              Sena to access your data. We take every step to safeguard against
              this &mdash; encryption at rest, per-user keys, strict access
              controls, and a full audit trail that you can review anytime. We
              believe honesty is the foundation of trust.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Who can see your data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Let&apos;s be specific:
            </p>
            <div className="space-y-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">Your AI agents</p>
                <p className="text-gray-600 text-base">
                  They need to read your messages to respond. While an agent is
                  processing your message, the plaintext exists in server memory.
                  That&apos;s how AI works &mdash; the model needs to see the text
                  to understand it.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">LLM providers</p>
                <p className="text-gray-600 text-base">
                  Your messages are sent to AI providers like OpenAI, Anthropic, or
                  Google for processing. This is the core of how Sena works. These
                  providers contractually agree not to train their models on data
                  sent through their APIs. We only use providers who make this
                  commitment.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">The Sena team</p>
                <p className="text-gray-600 text-base">
                  We will never access your data without your permission. If you
                  reach out for support and we need to look at your conversations
                  to help, every access is logged and auditable by you.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Audit trail &mdash; we log everything
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every time your data is accessed &mdash; whether by an agent
              processing your message, the Sena team debugging an issue, or an
              API call &mdash; it gets logged. Who accessed it, when, from where,
              and why.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This isn&apos;t just an internal thing. You can see your own audit
              trail. We built a transparency API specifically so you can verify
              that nobody is accessing your data without reason.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What we don&apos;t do
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some things we want to be clear about:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>We don&apos;t sell your data. Not to advertisers, not to data brokers, not to anyone.</li>
              <li>We don&apos;t use your data for advertising or ad targeting.</li>
              <li>We don&apos;t train our own AI models on your data.</li>
              <li>We don&apos;t share your data with third parties for their marketing purposes.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your privacy controls
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You&apos;re not just trusting us to do the right thing &mdash; you can
              verify it yourself. Inside the Sena app, under Settings, you can:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-0.5">1.</span>
                <div>
                  <p className="text-gray-800 font-medium">View your audit trail</p>
                  <p className="text-gray-600 text-base">
                    See exactly who accessed your data, when, and in what context.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg mt-0.5">2.</span>
                <div>
                  <p className="text-gray-800 font-medium">Export all your data</p>
                  <p className="text-gray-600 text-base">
                    Download everything we have on you as a JSON file, anytime.
                    No waiting period, no hoops to jump through. GDPR-style data
                    portability, because your data is yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              WhatsApp
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you interact with Sena through WhatsApp, a few extra things apply:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                We only message you on WhatsApp if you&apos;ve opted in. You can
                opt out anytime by sending &quot;STOP&quot; or contacting us.
              </li>
              <li>
                WhatsApp messages are stored and encrypted the same way as all
                other messages in Sena.
              </li>
              <li>
                We comply with WhatsApp&apos;s{" "}
                <a
                  href="https://www.whatsapp.com/legal/business-terms"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Business Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://business.whatsapp.com/policy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Business Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies and tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website uses basic analytics to understand traffic and usage
              patterns. We use cookies for authentication (keeping you logged in)
              and basic site functionality. We don&apos;t run third-party ad
              trackers on our site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We keep your data for as long as your account is active. If you
              delete your account, we delete your data. Audit logs are retained
              for at least one year for security purposes. If you want your data
              deleted sooner, just ask.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to access, correct, export, or delete your
              personal data. You can do most of this yourself through the app. For
              anything else, email us and we&apos;ll handle it within a few
              business days.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our services are not intended for children under 16. If you believe
              a child has provided us with personal data, please contact us and
              we&apos;ll remove it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to this policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If we make meaningful changes, we&apos;ll update the date at the top
              and notify you in the app. We won&apos;t quietly change things and
              hope you don&apos;t notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Talk to us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about your privacy, want to report a concern,
              or just want to understand something better &mdash; reach out. We
              actually read these.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                <strong>Email:</strong> it@sena.services
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Address:</strong> 4th Floor, No 25, SSPDL, Alpha City IT
                Park, Rajiv Gandhi Salai, Navalur, Chennai, Tamil Nadu 600130
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/terms-and-conditions"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
