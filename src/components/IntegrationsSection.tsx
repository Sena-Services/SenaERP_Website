"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Integration = {
  id: string;
  name: string;
  iconUrl: string;
  useColor?: boolean;
  screenshot: string;
  disabled?: boolean;
};

const nativeIntegrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png", useColor: true, screenshot: "/images/whatsapp-img-2.png" },
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
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
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
    }, isMobile ? 6000 : 5000); // Slower transitions: 6s mobile, 5s desktop

    return () => clearInterval(interval);
  }, [isAutoCycling, enabledNativeIntegrations, isMobile]);

  const handleIntegrationClick = (id: string) => {
    setActiveId(id);
    setIsAutoCycling(false); // Stop auto-cycling when user clicks
  };

  const openGallery = () => {
    const currentIndex = integrations.findIndex(int => int.id === activeId);
    setGalleryIndex(currentIndex);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    setGalleryIndex((current) => {
      if (direction === 'prev') {
        return current === 0 ? integrations.length - 1 : current - 1;
      } else {
        return current === integrations.length - 1 ? 0 : current + 1;
      }
    });
  };

  return (
    <section ref={ref} id="integrations" className="scroll-mt-24 pb-8" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="mt-4 mb-2 md:mb-3 text-center px-4 md:px-0">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? '32px' : '40px',
            }}
          >
            Integrations
          </h2>
          <p
            className="text-gray-700 mt-1 mx-auto max-w-3xl font-futura"
            style={{
              letterSpacing: "-0.01em",
              fontSize: isMobile ? '14px' : '16px',
            }}
          >
            Connect your favorite tools and platforms. Native integrations built-in, or bring your own via API.
          </p>
        </div>

        <div className={`flex flex-col gap-2 md:gap-3 ${isMobile ? 'px-4' : ''}`}>
          {/* Native Integrations */}
          <div className="md:px-0">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
              <h3 className="text-[10px] md:text-xs font-futura tracking-wide text-waygent-blue uppercase">Native Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center items-center">
              {nativeIntegrations.map((integration) => {
                const isActive = activeId === integration.id;

                return (
                  <div key={integration.id} className="relative">
                    <button
                      onClick={() => handleIntegrationClick(integration.id)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg backdrop-blur-sm border transition-all duration-200 ease-out ${
                          isActive
                            ? 'bg-white border-waygent-blue shadow-xl scale-110'
                            : 'bg-white/90 border-gray-200 hover:bg-white hover:border-waygent-blue/40 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        <img
                          src={integration.iconUrl}
                          alt={integration.name}
                          className={`transition-all duration-200 object-contain ${
                            integration.id === 'whatsapp'
                              ? 'w-5 h-5 md:w-6 md:h-6'
                              : 'w-4 h-4 md:w-5 md:h-5'
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
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-waygent-blue rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition z-10"
                        title="Resume auto-play"
                      >
                        <svg
                          width="10"
                          height="10"
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
          <div className={isMobile ? '' : 'mt-1'}>
            {/* Description header */}
            <AnimatePresence mode="wait">
              {activeIntegration && (
                <motion.div
                  key={`desc-${activeIntegration.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: isMobile ? 0.8 : 0.6, ease: "easeInOut" }}
                  className={isMobile ? "mb-1.5" : "mb-2"}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center">
                      <img
                        src={activeIntegration.iconUrl}
                        alt={activeIntegration.name}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 font-futura">
                      {activeIntegration.name} Integration
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-futura">
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

            {/* Screenshot and Features side by side */}
            <div className="flex flex-col md:flex-row gap-4 xl:gap-6 items-center">
              {/* Screenshot container - Left side */}
              <div className="flex justify-center md:w-2/3">
                <div
                  className={`relative group/screenshot ${isMobile ? '' : 'bg-white'}`}
                  style={{
                    border: isMobile ? 'none' : '2px solid #9CA3AF',
                    borderRadius: isMobile ? '0' : '1rem',
                    boxShadow: isMobile ? 'none' : '0 10px 30px -8px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxHeight: isMobile ? 'none' : 'min(600px, 60vh)',
                    overflow: 'visible',
                    padding: isMobile ? '0' : '16px'
                  }}
                >
                {/* Expand icon overlay */}
                <button
                  onClick={openGallery}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover/screenshot:opacity-100"
                  title="View in gallery"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
                <AnimatePresence mode="wait">
                  {activeIntegration && (
                    <motion.div
                      key={activeIntegration.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: isMobile ? 0.8 : 0.6, ease: "easeInOut" }}
                      className="flex items-center justify-center relative"
                      style={{ maxHeight: isMobile ? 'none' : 'min(600px, 60vh)' }}
                    >
                      <Image
                        src={activeIntegration.screenshot}
                        alt={`${activeIntegration.name} integration example`}
                        width={1200}
                        height={800}
                        quality={85}
                        className="h-auto cursor-pointer"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          maxHeight: isMobile ? 'none' : 'min(600px, 60vh)',
                          width: 'auto',
                          display: 'block',
                          objectFit: 'contain'
                        }}
                        onClick={openGallery}
                      />

                      {/* Animated Arrow Annotations - Only for WhatsApp on desktop */}
                      {!isMobile && activeIntegration.id === 'whatsapp' && (
                        <>
                          {/* Arrow 1: Customer requirement (pointing to "Hi! What activities...") */}
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="absolute"
                            style={{ top: '10%', right: '-350px' }}
                          >
                            <svg width="380" height="60" className="absolute" style={{ left: '-385px', top: '0' }}>
                              <defs>
                                <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                  <polygon points="0 0, 10 3, 0 6" fill="#25D366" />
                                </marker>
                              </defs>
                              <motion.line
                                x1="380"
                                y1="30"
                                x2="5"
                                y2="30"
                                stroke="#25D366"
                                strokeWidth="2.5"
                                markerEnd="url(#arrowhead1)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="bg-green-50 border-2 border-green-500 rounded-lg px-3 py-2 shadow-lg" style={{ width: '240px' }}>
                              <p className="text-xs font-bold text-green-900 mb-0.5">Customer Requirement Captured</p>
                              <p className="text-[10px] text-green-700 leading-tight">Natural language query understood instantly</p>
                            </div>
                          </motion.div>

                          {/* Arrow 2: AI Agent triggered (pointing to @travelbot command) */}
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="absolute"
                            style={{ top: '31%', right: '-350px' }}
                          >
                            <svg width="320" height="60" className="absolute" style={{ left: '-325px', top: '0' }}>
                              <defs>
                                <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                  <polygon points="0 0, 10 3, 0 6" fill="#25D366" />
                                </marker>
                              </defs>
                              <motion.line
                                x1="320"
                                y1="30"
                                x2="5"
                                y2="30"
                                stroke="#25D366"
                                strokeWidth="2.5"
                                markerEnd="url(#arrowhead2)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 1.2, duration: 0.75, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="bg-green-50 border-2 border-green-500 rounded-lg px-3 py-2 shadow-lg" style={{ width: '240px' }}>
                              <p className="text-xs font-bold text-green-900 mb-0.5">AI Agent Triggered</p>
                              <p className="text-[10px] text-green-700 leading-tight">Specialized bot retrieves relevant data</p>
                            </div>
                          </motion.div>

                          {/* Arrow 3: Intelligent response (pointing to the detailed activities list) */}
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4, duration: 0.5 }}
                            className="absolute"
                            style={{ top: '57%', right: '-350px' }}
                          >
                            <svg width="165" height="60" className="absolute" style={{ left: '-145px', top: '0' }}>
                              <defs>
                                <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                  <polygon points="0 0, 10 3, 0 6" fill="#25D366" />
                                </marker>
                              </defs>
                              <motion.line
                                x1="140"
                                y1="30"
                                x2="5"
                                y2="30"
                                stroke="#25D366"
                                strokeWidth="2.5"
                                markerEnd="url(#arrowhead3)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 1.5, duration: 0.4, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="bg-green-50 border-2 border-green-500 rounded-lg px-3 py-2 shadow-lg" style={{ width: '240px' }}>
                              <p className="text-xs font-bold text-green-900 mb-0.5">Intelligent Response Generated</p>
                              <p className="text-[10px] text-green-700 leading-tight">Structured, comprehensive answer delivered</p>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>

              {/* Features list - Right side (hidden for WhatsApp on desktop since we use arrows) */}
              <AnimatePresence mode="wait">
                {activeIntegration && (
                  <motion.div
                    key={`features-${activeIntegration.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: isMobile ? 0.8 : 0.6, delay: 0.15, ease: "easeInOut" }}
                    className={`${isMobile ? 'mt-1.5 w-full' : 'md:w-1/3'} flex flex-col gap-1.5 ${!isMobile && activeIntegration.id === 'whatsapp' ? 'hidden' : ''}`}
                  >
                  {activeIntegration.id === 'whatsapp' && (
                    <>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Auto-Reply</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Instant responses to customer messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Order Processing</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Take orders directly via chat</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'instagram' && (
                    <>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">DM Automation</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Reply to messages instantly</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Comment Responses</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Engage with every comment</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Brand Voice</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Maintain consistent tone</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'gmail' && (
                    <>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Smart Replies</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">AI drafts context-aware responses</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Email Triage</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Prioritize urgent messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:gap-2.5">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-gray-900 font-futura">Meeting Scheduling</p>
                          <p className="text-[11px] md:text-xs text-gray-600 font-futura">Coordinate calendars automatically</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* 3rd Party Integrations - Below everything, smaller */}
          <div className="md:px-0 mt-2 md:mt-3">
            <div className="flex items-center gap-2 mb-1.5 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <h3 className="text-[9px] md:text-[10px] font-futura tracking-wide text-gray-500 uppercase">3rd Party Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center items-center">
              {thirdPartyIntegrations.map((integration) => (
                <div key={integration.id} className="relative">
                  <div className="group flex flex-col items-center gap-1 cursor-default">
                    <div className="relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg backdrop-blur-sm border border-gray-200 bg-white/90 transition-all duration-200 ease-out hover:shadow-md">
                      <img
                        src={integration.iconUrl}
                        alt={integration.name}
                        className={`transition-all duration-200 object-contain ${
                          integration.id === 'github'
                            ? 'w-4 h-4 md:w-5 md:h-5'
                            : 'w-3.5 h-3.5 md:w-4 md:h-4'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-2 font-futura">Many more to come</p>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeGallery}
          >
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
              title="Close gallery"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('prev');
              }}
              className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
              title="Previous image"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('next');
              }}
              className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
              title="Next image"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image container */}
            <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Image
                    src={integrations[galleryIndex].screenshot}
                    alt={`${integrations[galleryIndex].name} integration`}
                    width={1200}
                    height={800}
                    quality={85}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                      <img
                        src={integrations[galleryIndex].iconUrl}
                        alt={integrations[galleryIndex].name}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {integrations[galleryIndex].name}
                    </span>
                    <span className="text-white/60 text-xs">
                      {galleryIndex + 1} / {integrations.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default IntegrationsSection;
