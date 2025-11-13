"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Integration = {
  id: string;
  name: string;
  iconUrl: string;
  useColor?: boolean;
  screenshot: string;
  disabled?: boolean;
};

const nativeIntegrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png", useColor: true, screenshot: "/images/whatsapp-img.png" },
  { id: "instagram", name: "Instagram", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", useColor: true, screenshot: "/images/instagram-img.png" },
  { id: "gmail", name: "Gmail", iconUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", useColor: true, screenshot: "/images/email-img.png" },
];

const thirdPartyIntegrations: Integration[] = [
  { id: "sheets", name: "Sheets", iconUrl: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico", useColor: true, screenshot: "/screenshots/preview.png" },
  { id: "docs", name: "Docs", iconUrl: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico", useColor: true, screenshot: "/screenshots/workflow.png" },
  { id: "calendar", name: "Calendar", iconUrl: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico", useColor: true, screenshot: "/screenshots/agent.png" },
  { id: "slack", name: "Slack", iconUrl: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", useColor: true, screenshot: "/screenshots/data.png" },
  { id: "github", name: "GitHub", iconUrl: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", useColor: true, screenshot: "/screenshots/environment.png" },
];

const integrations: Integration[] = [...nativeIntegrations, ...thirdPartyIntegrations];

const IntegrationsSection = forwardRef<HTMLElement>(function IntegrationsSection(props, ref) {
  const enabledNativeIntegrations = nativeIntegrations.filter(int => !int.disabled);
  const [activeId, setActiveId] = useState<string>(enabledNativeIntegrations[0].id);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const activeIntegration = integrations.find((int) => int.id === activeId && !int.disabled);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-cycle through ONLY native integrations (excluding disabled ones)
  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = enabledNativeIntegrations.findIndex((int) => int.id === currentId);
        const nextIndex = (currentIndex + 1) % enabledNativeIntegrations.length;
        return enabledNativeIntegrations[nextIndex].id;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling, enabledNativeIntegrations]);

  const handleIntegrationClick = (id: string) => {
    setActiveId(id);
    setIsAutoCycling(false); // Stop auto-cycling when user clicks
  };

  return (
    <section ref={ref} id="integrations" className="scroll-mt-24 mt-32 sm:mt-48 pb-16">
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="mb-8 md:mb-12 text-center px-4 md:px-0">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? '32px' : '60px',
            }}
          >
            Integrations
          </h2>
          <p
            className="text-sm md:text-xl md:text-2xl text-gray-700 mt-2 md:mt-4 mx-auto max-w-3xl font-futura"
            style={{
              letterSpacing: "-0.01em",
            }}
          >
            Connect your favorite tools and platforms. Native integrations built-in, or bring your own via API.
          </p>
        </div>

        <div className={`flex flex-col gap-8 md:gap-12 ${isMobile ? 'px-4' : ''}`}>
          {/* Native Integrations */}
          <div className="md:px-0">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
              <h3 className="text-sm md:text-base font-futura tracking-wide text-waygent-blue uppercase">Native Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center items-center">
              {nativeIntegrations.map((integration) => {
                const isActive = activeId === integration.id;

                return (
                  <div key={integration.id} className="relative">
                    <button
                      onClick={() => handleIntegrationClick(integration.id)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-sm border-2 transition-all duration-200 ease-out ${
                          isActive
                            ? 'bg-white border-waygent-blue shadow-xl scale-110'
                            : 'bg-white/90 border-gray-200 hover:bg-white hover:border-waygent-blue/40 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={integration.iconUrl}
                          alt={integration.name}
                          className={`transition-all duration-200 object-contain ${
                            integration.id === 'whatsapp'
                              ? 'w-9 h-9 md:w-11 md:h-11'
                              : 'w-8 h-8 md:w-10 md:h-10'
                          }`}
                        />
                      </div>
                    </button>
                    {isActive && !isAutoCycling && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoCycling(true);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-waygent-blue rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition z-10"
                        title="Resume auto-play"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                        >
                          <path
                            d="M8 5v14l11-7z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom - Screenshot preview with description */}
          <div className={isMobile ? '' : 'mt-4'}>
            {/* Description header */}
            <AnimatePresence mode="wait">
              {activeIntegration && (
                <motion.div
                  key={`desc-${activeIntegration.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center">
                      <img
                        src={activeIntegration.iconUrl}
                        alt={activeIntegration.name}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 font-futura">
                      {activeIntegration.name} Integration
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-futura">
                    {activeIntegration.id === 'whatsapp' && (
                      "AI agents handle customer conversations on WhatsApp automatically. Respond to inquiries, provide product information, process orders, and escalate to humans when needed—all in real-time, 24/7."
                    )}
                    {activeIntegration.id === 'instagram' && (
                      "Connect your Instagram to automate responses to DMs and comments. AI agents engage with followers, answer questions about products, share links, and maintain your brand voice across all interactions."
                    )}
                    {activeIntegration.id === 'gmail' && (
                      "AI agents read, understand, and reply to emails on your behalf. Draft responses, schedule meetings, triage messages by priority, and handle routine correspondence while you focus on what matters."
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Screenshot container */}
            <div
              className={`relative w-full overflow-hidden bg-white ${isMobile ? '-mx-4 px-4' : ''}`}
              style={{
                border: isMobile ? 'none' : '2px solid #9CA3AF',
                borderRadius: isMobile ? '0' : '1.5rem',
                boxShadow: isMobile ? 'none' : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <AnimatePresence mode="wait">
                {activeIntegration && (
                  <motion.div
                    key={activeIntegration.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full flex items-center justify-center"
                  >
                    <img
                      src={activeIntegration.screenshot}
                      alt={`${activeIntegration.name} integration example`}
                      className="w-full h-auto"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                        maxWidth: '100%',
                        display: 'block',
                        objectFit: 'contain',
                        margin: '0 auto'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features list below screenshot */}
            <AnimatePresence mode="wait">
              {activeIntegration && (
                <motion.div
                  key={`features-${activeIntegration.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  {activeIntegration.id === 'whatsapp' && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Auto-Reply</p>
                          <p className="text-xs text-gray-600 font-futura">Instant responses to customer messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Order Processing</p>
                          <p className="text-xs text-gray-600 font-futura">Take orders directly via chat</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">24/7 Support</p>
                          <p className="text-xs text-gray-600 font-futura">Never miss a customer inquiry</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'instagram' && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">DM Automation</p>
                          <p className="text-xs text-gray-600 font-futura">Reply to messages instantly</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Comment Responses</p>
                          <p className="text-xs text-gray-600 font-futura">Engage with every comment</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Brand Voice</p>
                          <p className="text-xs text-gray-600 font-futura">Maintain consistent tone</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'gmail' && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Smart Replies</p>
                          <p className="text-xs text-gray-600 font-futura">AI drafts context-aware responses</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Email Triage</p>
                          <p className="text-xs text-gray-600 font-futura">Prioritize urgent messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-futura">Meeting Scheduling</p>
                          <p className="text-xs text-gray-600 font-futura">Coordinate calendars automatically</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3rd Party Integrations - Below everything, smaller */}
          <div className="md:px-0 mt-8 md:mt-12">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <h3 className="text-xs md:text-sm font-futura tracking-wide text-gray-500 uppercase">3rd Party Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
              {thirdPartyIntegrations.map((integration) => (
                <div key={integration.id} className="relative">
                  <div className="group flex flex-col items-center gap-1 cursor-default">
                    <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl backdrop-blur-sm border border-gray-200 bg-white/90 transition-all duration-200 ease-out hover:shadow-md">
                      <img
                        src={integration.iconUrl}
                        alt={integration.name}
                        className={`transition-all duration-200 object-contain ${
                          integration.id === 'github'
                            ? 'w-7 h-7 md:w-8 md:h-8'
                            : 'w-6 h-6 md:w-7 md:h-7'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default IntegrationsSection;
