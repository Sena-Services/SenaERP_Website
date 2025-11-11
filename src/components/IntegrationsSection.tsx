"use client";

import { useState, useEffect, forwardRef } from "react";

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
  { id: "tally", name: "Tally", iconUrl: "/icons/Tally.png", useColor: true, screenshot: "/screenshots/preview.png", disabled: true },
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
          maxWidth: isMobile ? '100%' : 'min(1600px, calc(100vw - 200px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="mb-8 md:mb-12 text-center px-4 md:px-0">
          <h2
            className="hidden md:block"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: '60px',
            }}
          >
            Integrations
          </h2>
          <p
            className="hidden md:block text-xl md:text-2xl text-gray-700 mt-4 mx-auto max-w-3xl font-futura"
            style={{
              letterSpacing: "-0.01em",
            }}
          >
            Connect your favorite tools and platforms. Native integrations built-in, or bring your own via API.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-12">
          {/* Native Integrations */}
          <div className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
              <h3 className="text-sm md:text-base font-futura tracking-wide text-waygent-blue uppercase">Native Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-waygent-blue/30 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center items-center">
              {nativeIntegrations.map((integration) => {
                const isActive = activeId === integration.id;
                const isDisabled = integration.disabled;

                return (
                  <div key={integration.id} className="relative">
                    <button
                      onClick={() => !isDisabled && handleIntegrationClick(integration.id)}
                      className={`group flex flex-col items-center gap-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={isDisabled}
                    >
                      <div
                        className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-sm border-2 transition-all duration-200 ease-out ${
                          isDisabled
                            ? 'bg-white/60 border-gray-200'
                            : isActive
                            ? 'bg-white border-waygent-blue shadow-xl scale-110'
                            : 'bg-white/90 border-gray-200 hover:bg-white hover:border-waygent-blue/40 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={integration.iconUrl}
                          alt={integration.name}
                          className={`transition-all duration-200 object-contain ${
                            integration.id === 'tally'
                              ? 'w-16 h-16 md:w-18 md:h-18'
                              : integration.id === 'whatsapp'
                              ? 'w-9 h-9 md:w-11 md:h-11'
                              : 'w-8 h-8 md:w-10 md:h-10'
                          } ${isDisabled ? 'grayscale' : ''}`}
                        />
                      </div>
                    </button>
                    {isActive && !isAutoCycling && !isDisabled && (
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

          {/* 3rd Party Integrations */}
          <div className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <h3 className="text-sm md:text-base font-futura tracking-wide text-gray-600 uppercase">3rd Party Integrations</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center items-center">
              {thirdPartyIntegrations.map((integration) => (
                <div key={integration.id} className="relative">
                  <div className="group flex flex-col items-center gap-2 cursor-default">
                    <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-sm border-2 bg-white/90 border-gray-200 transition-all duration-200 ease-out">
                      <img
                        src={integration.iconUrl}
                        alt={integration.name}
                        className={`transition-all duration-200 object-contain ${
                          integration.id === 'github'
                            ? 'w-10 h-10 md:w-12 md:h-12'
                            : 'w-8 h-8 md:w-10 md:h-10'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom - Full width screenshot preview */}
          <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white flex items-center justify-center mt-0 md:mt-4 h-auto min-h-[300px] md:min-h-[400px]" style={{
            border: '2px solid #9CA3AF',
            boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)'
          }}>
            {activeIntegration && (
              <img
                src={activeIntegration.screenshot}
                alt={`${activeIntegration.name} integration`}
                className="w-full h-auto rounded-2xl md:rounded-3xl object-contain"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default IntegrationsSection;
