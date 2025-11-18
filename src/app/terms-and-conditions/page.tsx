"use client";

import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
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
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Sena's services, website, or
              communicating with us through any channel including WhatsApp
              Business API, you agree to be bound by these Terms and Conditions
              and all applicable laws and regulations. If you do not agree with
              any of these terms, you are prohibited from using or accessing our
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sena provides business software solutions including but not
              limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Enterprise Resource Planning (ERP) systems</li>
              <li>Customer Relationship Management (CRM) tools</li>
              <li>Workflow automation and management</li>
              <li>Data analytics and reporting</li>
              <li>Integration services with third-party platforms</li>
              <li>Customer support via multiple channels including WhatsApp</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify, suspend, or discontinue any
              aspect of our services at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. WhatsApp Business Communication Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you communicate with us via WhatsApp Business API:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Opt-in Consent:</strong> You explicitly consent to
                receive messages from Sena via WhatsApp by providing your
                phone number and opting in to our messaging service
              </li>
              <li>
                <strong>Message Types:</strong> You may receive transactional
                messages (order confirmations, support responses, account
                notifications) and, if you've opted in, promotional messages
              </li>
              <li>
                <strong>Opt-out:</strong> You can stop receiving WhatsApp
                messages at any time by sending "STOP" or contacting our support
                team
              </li>
              <li>
                <strong>Acceptable Use:</strong> You agree not to use WhatsApp
                communication for unlawful purposes, harassment, spam, or any
                activity that violates WhatsApp's terms of service
              </li>
              <li>
                <strong>Response Times:</strong> While we strive to respond
                promptly, we do not guarantee specific response times for
                WhatsApp messages
              </li>
              <li>
                <strong>Data Usage:</strong> Your WhatsApp communications are
                subject to our Privacy Policy and WhatsApp's privacy practices
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. User Account and Registration
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our services, you may be required to
              register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>
                Maintain and promptly update your account information to keep it
                accurate and complete
              </li>
              <li>
                Maintain the security of your account credentials and accept all
                responsibility for activities under your account
              </li>
              <li>
                Notify us immediately of any unauthorized access or security
                breach
              </li>
              <li>
                Not share your account credentials with any third party
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate
              these terms or are inactive for extended periods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Acceptable Use Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree NOT to use our services to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Violate any applicable laws, regulations, or third-party rights
              </li>
              <li>
                Transmit malware, viruses, or any harmful code
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or networks
              </li>
              <li>
                Interfere with or disrupt the services or servers
              </li>
              <li>
                Engage in any form of harassment, abuse, or harmful conduct
              </li>
              <li>
                Impersonate any person or entity or misrepresent your affiliation
              </li>
              <li>
                Collect or store personal data about other users without consent
              </li>
              <li>
                Use automated systems or scripts to access the services without
                permission
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Intellectual Property Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content, features, and functionality of our services,
              including but not limited to text, graphics, logos, icons,
              images, audio clips, data compilations, and software, are the
              exclusive property of Sena or its licensors and are protected by
              international copyright, trademark, patent, trade secret, and
              other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are granted a limited, non-exclusive, non-transferable license
              to access and use our services for their intended purpose. You may
              not reproduce, distribute, modify, create derivative works of,
              publicly display, or exploit any of our content without express
              written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Payment Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For paid services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                All fees are quoted in the currency specified at the time of
                purchase
              </li>
              <li>
                Payment is due according to the billing schedule agreed upon
                (monthly, annually, etc.)
              </li>
              <li>
                Failure to pay may result in suspension or termination of
                services
              </li>
              <li>
                Refunds are subject to our refund policy and applicable law
              </li>
              <li>
                We reserve the right to modify pricing with 30 days' notice
              </li>
              <li>
                You are responsible for all applicable taxes
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Data Protection and Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your use of our services is also governed by our Privacy Policy,
              which is incorporated into these Terms by reference. By using our
              services, you consent to the collection, use, and sharing of your
              information as described in our Privacy Policy.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your data, but we cannot guarantee absolute security. You
              acknowledge that you provide your data at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Disclaimers and Limitations of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Disclaimer of Warranties:</strong> Our services are
              provided "AS IS" and "AS AVAILABLE" without any warranties of any
              kind, either express or implied, including but not limited to
              warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Limitation of Liability:</strong> To the maximum extent
              permitted by law, Sena shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any
              loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other
              intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your use or inability to use our services</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of transmission</li>
              <li>Any bugs, viruses, or malware transmitted through our services</li>
              <li>Any errors or omissions in any content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to defend, indemnify, and hold harmless Sena, its
              officers, directors, employees, agents, and affiliates from and
              against any claims, liabilities, damages, losses, and expenses,
              including reasonable attorneys' fees, arising out of or in any way
              connected with your access to or use of our services, your
              violation of these Terms, or your violation of any third-party
              rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Third-Party Services and Links
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our services may contain links to third-party websites, services,
              or integrations (including WhatsApp) that are not owned or
              controlled by Sena. We have no control over and assume no
              responsibility for the content, privacy policies, or practices of
              any third-party services. You acknowledge and agree that we shall
              not be responsible or liable for any damage or loss caused by or
              in connection with the use of any such third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your access to our services
              immediately, without prior notice or liability, for any reason,
              including but not limited to breach of these Terms. Upon
              termination, your right to use our services will immediately
              cease.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time by contacting our
              support team. All provisions of these Terms which by their nature
              should survive termination shall survive, including ownership
              provisions, warranty disclaimers, indemnity, and limitations of
              liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any disputes arising out of or relating to these Terms or our
              services shall first be attempted to be resolved through good
              faith negotiations. If negotiations fail, disputes shall be
              resolved through binding arbitration in accordance with the rules
              of [Arbitration Association], except where prohibited by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time
              at our sole discretion. If a revision is material, we will provide
              at least 30 days' notice prior to any new terms taking effect.
              What constitutes a material change will be determined at our sole
              discretion.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By continuing to access or use our services after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you must stop using our
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Compliance with WhatsApp Policies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our WhatsApp Business services comply with:
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
              <li>
                WhatsApp Commerce Policy:{" "}
                <a
                  href="https://www.whatsapp.com/legal/commerce-policy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.whatsapp.com/legal/commerce-policy
                </a>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using our WhatsApp services, you also agree to comply with all
              applicable WhatsApp policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Severability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If any provision of these Terms is held to be unenforceable or
              invalid, such provision will be changed and interpreted to
              accomplish the objectives of such provision to the greatest extent
              possible under applicable law, and the remaining provisions will
              continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              17. Entire Agreement
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms, together with our Privacy Policy and any other legal
              notices published by us on our services, constitute the entire
              agreement between you and Sena concerning our services and
              supersede all prior or contemporaneous communications and
              proposals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              18. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                <strong>Company Name:</strong> Sena
              </p>
              <p className="text-gray-700 mt-2">
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

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-gray-700">
              <strong>Important Notice:</strong> By using Sena's services,
              including our WhatsApp Business communication channel, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and Conditions and our Privacy Policy.
            </p>
          </div>
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
    </div>
  );
}
