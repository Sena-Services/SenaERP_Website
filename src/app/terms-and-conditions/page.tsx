"use client";

import Link from "next/link";
import { PageTransition, BackButton } from "@/components/PageTransition";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <BackButton />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: March 2026
          </p>
          <p className="text-gray-700 text-lg mt-4 leading-relaxed">
            These are the rules of the road for using SenaERP. We&apos;ve tried to
            keep them clear and fair &mdash; no hidden gotchas, no walls of
            legalese designed to confuse you.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. What you&apos;re agreeing to
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using SenaERP &mdash; our website, our app, our APIs, or any of
              our communication channels including WhatsApp &mdash; you&apos;re
              agreeing to these terms. If something here doesn&apos;t sit right
              with you, please don&apos;t use the service. We&apos;d rather you
              make an informed choice than agree to something you&apos;re not
              comfortable with.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These terms are a contract between you and Sena Services, the
              company behind SenaERP. When we say &quot;Sena,&quot;
              &quot;we,&quot; or &quot;us&quot; in this document, that&apos;s who
              we mean.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. What SenaERP does
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SenaERP is a business software platform. Depending on your plan, you
              get access to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>ERP and CRM tools to run your business</li>
              <li>AI agents that automate workflows and handle tasks</li>
              <li>Integrations with third-party platforms</li>
              <li>Communication channels including WhatsApp for customer support</li>
              <li>Analytics and reporting</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We&apos;re constantly building and improving SenaERP. That means
              features may change, get added, or occasionally get retired. If we
              make a change that materially affects you, we&apos;ll give you
              notice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Your account
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account, we need you to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Give us accurate information. If your details change, update them.
              </li>
              <li>
                Keep your login credentials secure. Don&apos;t share them with
                anyone.
              </li>
              <li>
                Let us know immediately if you suspect someone else has accessed
                your account.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              You&apos;re responsible for everything that happens under your
              account. If someone else uses your credentials, you&apos;re on the
              hook for their actions &mdash; which is why keeping them private
              matters.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may suspend or close accounts that violate these terms or that
              have been inactive for a long time. We&apos;ll try to give you a
              heads-up first if we can.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. WhatsApp communication
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you interact with SenaERP through WhatsApp, here&apos;s how it
              works:
            </p>
            <div className="space-y-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">Opt-in only</p>
                <p className="text-gray-600 text-base">
                  We only message you on WhatsApp if you&apos;ve opted in. You
                  choose to start the conversation.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">What you&apos;ll receive</p>
                <p className="text-gray-600 text-base">
                  Transactional messages like order updates, support replies, and
                  account notifications. Promotional messages only if you&apos;ve
                  separately opted in.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">Opting out</p>
                <p className="text-gray-600 text-base">
                  Send &quot;STOP&quot; at any time, or just tell us. No hoops to
                  jump through.
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your WhatsApp messages are covered by our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              , and we comply with WhatsApp&apos;s{" "}
              <a
                href="https://www.whatsapp.com/legal/business-terms"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Business Terms
              </a>
              ,{" "}
              <a
                href="https://business.whatsapp.com/policy"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Business Policy
              </a>
              , and{" "}
              <a
                href="https://www.whatsapp.com/legal/commerce-policy"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Commerce Policy
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Things you shouldn&apos;t do
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This is the &quot;please be reasonable&quot; section. Don&apos;t use
              SenaERP to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Break the law or help others break the law</li>
              <li>Send malware, viruses, or anything designed to cause harm</li>
              <li>Try to hack into our systems or other users&apos; accounts</li>
              <li>Overload or disrupt the service</li>
              <li>Harass, threaten, or abuse other people</li>
              <li>Impersonate someone else</li>
              <li>Scrape data or use bots without our permission</li>
              <li>Collect other users&apos; personal information without their consent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              If we see activity that violates these rules, we&apos;ll take
              action &mdash; which may include suspending your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Your data and our data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Your data is yours.</strong> The business data you put into
              SenaERP &mdash; your records, messages, files &mdash; belongs to
              you. You can export it anytime. If you leave, you take your data
              with you.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Our stuff is ours.</strong> The SenaERP software, design,
              branding, documentation, and underlying technology belong to Sena
              Services. You get a license to use it while you&apos;re a customer,
              but that&apos;s not a transfer of ownership.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For the full picture on how we handle your data, read our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              . It&apos;s honest and worth your time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Payments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you&apos;re on a paid plan:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Prices are in the currency shown at checkout. All applicable taxes
                (including GST) are your responsibility.
              </li>
              <li>
                We bill on the schedule you chose &mdash; monthly, annually, or
                whatever your plan specifies.
              </li>
              <li>
                If a payment fails, we&apos;ll let you know and give you time to
                fix it before suspending access.
              </li>
              <li>
                If we change our pricing, we&apos;ll give you at least 30 days&apos;
                notice. No surprises.
              </li>
              <li>
                Refunds are handled on a case-by-case basis, in line with Indian
                consumer protection law.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. What we&apos;re responsible for (and what we&apos;re not)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We work hard to keep SenaERP reliable, secure, and useful. But we
              want to be upfront about the limits:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>No guarantees of perfection.</strong> Software breaks
                sometimes. We provide SenaERP &quot;as is&quot; &mdash; we
                don&apos;t promise it will be 100% error-free or available every
                second of every day.
              </li>
              <li>
                <strong>Indirect damages.</strong> If something goes wrong on our
                end, we&apos;re not liable for indirect losses like lost profits,
                lost data, or business interruption &mdash; to the extent
                permitted by Indian law.
              </li>
              <li>
                <strong>Liability cap.</strong> Our total liability to you for
                anything related to SenaERP is limited to the amount you&apos;ve
                paid us in the 12 months before the issue arose.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              This isn&apos;t about dodging responsibility. It&apos;s about
              setting realistic expectations so we can focus on building great
              software instead of managing unlimited risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Third-party services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SenaERP connects with other services &mdash; WhatsApp, payment
              gateways, LLM providers, and more. These are run by other
              companies with their own terms and policies. We integrate with
              them carefully, but we can&apos;t take responsibility for how they
              run their services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Ending the relationship
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>You can leave anytime.</strong> Cancel your account through
              the app or email us at{" "}
              <a
                href="mailto:hello@sena.services"
                className="text-blue-600 hover:underline"
              >
                hello@sena.services
              </a>
              . We&apos;ll give you time to export your data before we delete it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>We can end it too.</strong> If you violate these terms, we
              may suspend or terminate your access. For serious violations, this
              may happen immediately. For less serious ones, we&apos;ll typically
              warn you first and give you a chance to fix things.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some parts of these terms survive even after the relationship
              ends &mdash; things like intellectual property, liability
              limitations, and the dispute resolution process.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Disputes and governing law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These terms are governed by the laws of India.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              If we have a disagreement, let&apos;s try to sort it out directly
              first. Most issues can be resolved with a conversation. If
              that doesn&apos;t work, disputes will be resolved through binding
              arbitration under the Arbitration and Conciliation Act, 1996,
              with the seat of arbitration in Chennai, Tamil Nadu. Courts in
              Chennai will have exclusive jurisdiction for any matters that
              can&apos;t be arbitrated.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Changes to these terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update these terms from time to time. If we make meaningful
              changes, we&apos;ll update the date at the top and notify you in the
              app. We won&apos;t quietly change things and hope you don&apos;t
              notice.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Continuing to use SenaERP after changes means you accept the new
              terms. If you disagree with a change, you can stop using the
              service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. The fine print
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A few last things that matter legally:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Severability.</strong> If a court finds any part of these
                terms unenforceable, the rest still stands.
              </li>
              <li>
                <strong>Entire agreement.</strong> These terms, plus our Privacy
                Policy, are the full agreement between us. No side deals, no
                verbal promises &mdash; just what&apos;s written here.
              </li>
              <li>
                <strong>No waiver.</strong> If we don&apos;t enforce a rule once,
                that doesn&apos;t mean we&apos;ve given up the right to enforce
                it later.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Talk to us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Questions about these terms? Something unclear? Just ask. We
              actually read these messages.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                <strong>Company:</strong> Sena Services
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:hello@sena.services"
                  className="text-blue-600 hover:underline"
                >
                  hello@sena.services
                </a>
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
              href="/privacy-policy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
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
      </PageTransition>
    </div>
  );
}
