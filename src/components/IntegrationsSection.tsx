"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
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
  { id: "whatsapp", name: "WhatsApp", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png", useColor: true, screenshot: "/images/whatsapp-img-3.png" },
  { id: "instagram", name: "Instagram", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", useColor: true, screenshot: "/images/instagram-img-3.png" },
  { id: "gmail", name: "Gmail", iconUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", useColor: true, screenshot: "/images/email-img-3.png" },
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
  const [activeId, setActiveId] = useState<string>("whatsapp");
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const activeIntegration = integrations.find((int) => int.id === activeId && !int.disabled);

  const imageRef = useRef<HTMLDivElement>(null);
  const [arrowPositions, setArrowPositions] = useState({
    arrow1: { top: '10%', right: '-350px' },
    arrow2: { top: '31%', right: '-350px' },
    arrow3: { top: '57%', right: '-350px' },
  });
  const [boxWidth, setBoxWidth] = useState(240);
  const [arrowLength, setArrowLength] = useState({ arrow1: 380, arrow2: 320, arrow3: 165 });

  const updateArrowPositions = () => {
    const imageContainer = imageRef.current;
    if (!imageContainer || isMobile || activeId !== 'whatsapp') {
      return;
    }

    const rect = imageContainer.getBoundingClientRect();
    const imageHeight = rect.height;
    const imageWidth = rect.width;
    const windowWidth = window.innerWidth;

    if (imageHeight === 0) return;

    // Hardcoded positions for different screen widths
    let arrow1Top, arrow2Top, arrow3Top, arrowRight;

    // Smooth scaling of arrow distance based on width
    let boxWidthValue;

    // Define anchor points in the image (as percentages of the original image dimensions)
    // These are the EXACT points in the image where chat bubbles are located
    // Measured from the original image at its natural size
    const imageAnchors = {
      bubble1: { topPercent: 0.12, leftPercent: 0.42 },  // First chat bubble "Hi! What activities..."
      bubble2: { topPercent: 0.335, leftPercent: 0.42 }, // AI command bubble "@travelbot..."
      bubble3: { topPercent: 0.60, leftPercent: 0.42 },  // Response bubble with activities list
    };

    // Calculate actual pixel positions of these anchors in the scaled image
    const anchor1Top = imageHeight * imageAnchors.bubble1.topPercent;
    const anchor2Top = imageHeight * imageAnchors.bubble2.topPercent;
    const anchor3Top = imageHeight * imageAnchors.bubble3.topPercent;

    // Position arrows to point at these anchors
    arrow1Top = anchor1Top;
    arrow2Top = anchor2Top;
    arrow3Top = anchor3Top;

    // Container position stays fixed at -350px so boxes don't move
    arrowRight = 350;
    boxWidthValue = 240;

    // Arrow lengths scale with image width to reach from boxes to image edge
    // At larger images, arrows need to be longer; at smaller images, shorter
    const baseImageWidth = 800; // Reference width where arrows are perfectly sized
    const widthScale = Math.min(imageWidth / baseImageWidth, 1);

    let arrow1Length, arrow2Length, arrow3Length;

    // Scale arrow lengths based on how much the image has scaled
    arrow1Length = 250 + (130 * widthScale); // 250-380px range
    arrow2Length = 200 + (120 * widthScale); // 200-320px range
    arrow3Length = 250 + (60 * widthScale);  // 250-310px range


    setArrowPositions({
      arrow1: {
        top: `${arrow1Top}px`,
        right: `-${arrowRight}px`
      },
      arrow2: {
        top: `${arrow2Top}px`,
        right: `-${arrowRight}px`
      },
      arrow3: {
        top: `${arrow3Top}px`,
        right: `-${arrowRight}px`
      },
    });

    setBoxWidth(boxWidthValue);
    setArrowLength({
      arrow1: arrow1Length,
      arrow2: arrow2Length,
      arrow3: arrow3Length
    });
  };

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate arrow positions on resize
  useEffect(() => {
    if (isMobile || activeId !== 'whatsapp') return;

    updateArrowPositions();
    window.addEventListener('resize', updateArrowPositions);

    return () => {
      window.removeEventListener('resize', updateArrowPositions);
    };
  }, [isMobile, activeId]);

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
                        className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg backdrop-blur-sm border transition-all duration-200 ease-out ${
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
                              ? 'w-7 h-7 md:w-8 md:h-8'
                              : 'w-6 h-6 md:w-7 md:h-7'
                          }`}
                        />
                      </div>
                    </button>
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
            <div className="flex flex-col md:flex-row gap-4 xl:gap-6 items-start" style={{ minHeight: isMobile ? 'auto' : '420px' }}>
              {/* Screenshot container - Left side */}
              <div className="flex justify-center md:w-2/3">
                <div
                  onClick={openGallery}
                  className={`relative group/screenshot cursor-pointer w-full ${isMobile ? '' : 'bg-white'}`}
                  style={{
                    border: isMobile ? 'none' : '2px solid #9CA3AF',
                    borderRadius: isMobile ? '0' : '1rem',
                    boxShadow: isMobile ? 'none' : '0 10px 30px -8px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)',
                    overflow: 'visible',
                    padding: isMobile ? '0' : '6px'
                  }}
                >
                {/* Subtle view hint */}
                <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/screenshot:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    <span className="text-xs text-gray-600 font-medium font-futura">Click to view full size</span>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {activeIntegration && (
                    <motion.div
                      ref={imageRef}
                      key={activeIntegration.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: isMobile ? 0.8 : 0.6, ease: "easeInOut" }}
                      className="relative w-full"
                    >
                      <Image
                        src={activeIntegration.screenshot}
                        alt={`${activeIntegration.name} integration example`}
                        width={1200}
                        height={800}
                        quality={85}
                        priority
                        className="w-full h-auto cursor-pointer"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          maxHeight: isMobile ? 'none' : 'min(600px, 60vh)',
                          objectFit: 'contain'
                        }}
                        onClick={openGallery}
                        onLoad={() => {
                          setTimeout(() => updateArrowPositions(), 50);
                        }}
                      />

                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>

              {/* Features list - Right side */}
              <AnimatePresence mode="wait">
                {activeIntegration && (
                  <motion.div
                    key={`features-${activeIntegration.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: isMobile ? 0.8 : 0.6, delay: 0.15, ease: "easeInOut" }}
                    className={`${isMobile ? 'mt-1.5 w-full' : 'md:w-1/3'} flex flex-col gap-2`}
                  >
                  {activeIntegration.id === 'whatsapp' && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-green-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">24/7 Automated Response</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">AI agents instantly understand customer queries in natural language and respond immediately, eliminating wait times.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">Real-time</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">NLP</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-green-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">ERP Data Integration</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Specialized bots pull live data from your ERP, CRM, and inventory systems to provide accurate, contextual responses.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">Live Data</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">Multi-Source</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-green-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">Smart Order Processing</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Handle complete transactions via chat - from product inquiries to payment processing and order confirmation, all automated.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">End-to-End</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">Payments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'instagram' && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-pink-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">DM & Comment Automation</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">AI responds to every DM and comment on your posts instantly, engaging followers 24/7 while maintaining your brand voice.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">Auto-Reply</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">Engagement</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-pink-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">Social Commerce</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Convert followers into customers with AI-powered product recommendations, links to your shop, and seamless checkout experiences.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">Shopping</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">Sales</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-pink-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">Lead Qualification</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">AI identifies high-intent users, captures contact information, and routes qualified leads to your sales team automatically.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">Lead Gen</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded-full">CRM Sync</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {activeIntegration.id === 'gmail' && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">AI-Powered Inbox Management</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Automatically categorize, prioritize, and route emails based on content, sender, and urgency using intelligent filters.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Smart Sort</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Auto-Tag</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">Context-Aware Auto-Replies</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Generate personalized email responses using templates and customer data, maintaining professional tone across all communications.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Templates</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Personalized</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-900 mb-1">CRM Integration & Tracking</h4>
                            <p className="text-[11px] text-gray-600 leading-snug mb-1.5">Every email interaction automatically syncs to your CRM, creating complete customer communication histories and touchpoint analytics.</p>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Auto-Sync</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">Analytics</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* 3rd Party Integrations - Below everything */}
          <div className="md:px-0 mt-4 md:mt-6">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
              <h3 className="text-[10px] md:text-xs font-futura tracking-wide text-waygent-blue uppercase">3rd Party Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center items-center">
              {thirdPartyIntegrations.map((integration) => (
                <div key={integration.id} className="relative">
                  <div className="group flex flex-col items-center gap-2 cursor-default">
                    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg backdrop-blur-sm border bg-white/90 border-gray-200 transition-all duration-200 ease-out hover:bg-white hover:border-waygent-blue/40 hover:scale-105 hover:shadow-md">
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
