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
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Sena ("we," "our," or "us"). We respect your privacy
              and are committed to protecting your personal data. This privacy
              policy will inform you about how we look after your personal data
              when you visit our website, use our services, or communicate with
              us via WhatsApp Business API, and tell you about your privacy
              rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of
              personal data about you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Identity Data:</strong> First name, last name, username
                or similar identifier
              </li>
              <li>
                <strong>Contact Data:</strong> Email address, telephone number,
                WhatsApp number
              </li>
              <li>
                <strong>Technical Data:</strong> Internet protocol (IP) address,
                browser type and version, time zone setting, browser plug-in
                types and versions, operating system and platform
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                website, products and services
              </li>
              <li>
                <strong>Marketing and Communications Data:</strong> Your
                preferences in receiving marketing from us and your
                communication preferences
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. WhatsApp Business API - Specific Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you communicate with us via WhatsApp Business API:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Consent:</strong> By providing us your mobile phone
                number and opting in to receive messages, you explicitly consent
                to receive messages from Sena via WhatsApp
              </li>
              <li>
                <strong>Opt-in Requirement:</strong> We will only contact you on
                WhatsApp if you have provided your phone number and given us
                clear opt-in permission confirming you wish to receive messages
                from us
              </li>
              <li>
                <strong>Data Usage:</strong> We will only use data obtained from
                WhatsApp (other than message content) as reasonably necessary to
                support messaging with you
              </li>
              <li>
                <strong>Message Content:</strong> Messages you send to us via
                WhatsApp are stored securely and used only for the purpose of
                responding to your inquiries and providing our services
              </li>
              <li>
                <strong>Opt-out:</strong> You can opt-out of receiving WhatsApp
                messages from us at any time by sending "STOP" or by contacting
                us directly
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>To provide and maintain our services to you</li>
              <li>
                To notify you about changes to our services or important updates
              </li>
              <li>
                To provide customer support and respond to your inquiries
              </li>
              <li>
                To send you marketing communications (only with your explicit
                consent)
              </li>
              <li>To analyze usage and improve our services</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your personal data with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who
                provide services on our behalf (e.g., WhatsApp Business
                Solution Providers, cloud hosting, analytics)
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with any
                merger, sale of company assets, financing, or acquisition
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do NOT sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We have implemented appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. We limit access to your
              personal data to those employees, agents, contractors and other
              third parties who have a business need to know.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We will only retain your personal data for as long as necessary to
              fulfill the purposes we collected it for, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements. When we no longer need your personal data, we will
              securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Your Legal Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may transfer your personal data outside of your country of
              residence. Whenever we transfer your personal data out of your
              jurisdiction, we ensure a similar degree of protection is afforded
              to it by implementing appropriate safeguards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our services are not directed to individuals under the age of 16.
              We do not knowingly collect personal data from children under 16.
              If you become aware that a child has provided us with personal
              data, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                <strong>Email:</strong> it@sena.services
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Address:</strong> 4th Floor, No 25, SSPDL, Alpha City It Park, Rajiv Gandhi Salai, Navalur, Chennai, Tamil Nadu 600130
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Phone:</strong> 9841797623
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Compliance with WhatsApp Business Policies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We comply with WhatsApp Business Terms of Service and Commerce
              Policy. Our use of WhatsApp Business API is in accordance with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                WhatsApp Business Terms of Service:{" "}
                <a
                  href="https://www.whatsapp.com/legal/business-terms"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.whatsapp.com/legal/business-terms
                </a>
              </li>
              <li>
                WhatsApp Business Policy:{" "}
                <a
                  href="https://business.whatsapp.com/policy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://business.whatsapp.com/policy
                </a>
              </li>
            </ul>
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
