"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Integration = {
  id: string;
  name: string;
  iconUrl: string;
  useColor?: boolean;
  screenshot: string;
};

const nativeIntegrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png", useColor: true, screenshot: "/screenshots/agent.png" },
  { id: "instagram", name: "Instagram", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", useColor: true, screenshot: "/screenshots/data.png" },
  { id: "gmail", name: "Gmail", iconUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", useColor: true, screenshot: "/screenshots/environment.png" },
  { id: "tally", name: "Tally", iconUrl: "/icons/Tally.png", useColor: true, screenshot: "/screenshots/preview.png" },
];

const thirdPartyIntegrations: Integration[] = [
  { id: "sheets", name: "Sheets", iconUrl: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico", useColor: true, screenshot: "/screenshots/preview.png" },
  { id: "docs", name: "Docs", iconUrl: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico", useColor: true, screenshot: "/screenshots/workflow.png" },
  { id: "calendar", name: "Calendar", iconUrl: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico", useColor: true, screenshot: "/screenshots/agent.png" },
  { id: "slack", name: "Slack", iconUrl: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", useColor: true, screenshot: "/screenshots/data.png" },
  { id: "github", name: "GitHub", iconUrl: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", useColor: true, screenshot: "/screenshots/environment.png" },
];

const integrations: Integration[] = [...nativeIntegrations, ...thirdPartyIntegrations];

export default function IntegrationsSection() {
  const [activeId, setActiveId] = useState<string>(nativeIntegrations[0].id);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  const activeIntegration = integrations.find((int) => int.id === activeId);

  // Auto-cycle through ONLY native integrations
  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = nativeIntegrations.findIndex((int) => int.id === currentId);
        const nextIndex = (currentIndex + 1) % nativeIntegrations.length;
        return nativeIntegrations[nextIndex].id;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const handleIntegrationClick = (id: string) => {
    setActiveId(id);
    setIsAutoCycling(false); // Stop auto-cycling when user clicks
  };

  return (
    <section id="integrations" className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
            Integrations
          </h2>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-12">
          {/* Left side - Integrations grid */}
          <div className="flex flex-col gap-8">
            {/* Native Integrations */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-waygent-text-primary font-futura">
                Native Integration
              </h3>
              <div className="flex flex-wrap gap-4 max-w-md">
                {nativeIntegrations.map((integration) => {
                  const isActive = activeId === integration.id;
                  return (
                    <div key={integration.id} className="relative flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => handleIntegrationClick(integration.id)}
                        className="group flex flex-col items-center gap-1.5"
                      >
                        <div
                          className={`relative flex items-center justify-center w-14 h-14 rounded-[14px] backdrop-blur-sm border transition-all duration-200 ease-out ${
                            isActive
                              ? 'bg-white/20 border-waygent-blue shadow-md scale-105'
                              : 'bg-transparent border-gray-300/40 hover:bg-white/10 hover:border-waygent-blue/40 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md'
                          }`}
                        >
                          <img
                            src={integration.iconUrl}
                            alt={integration.name}
                            className={`transition-all duration-200 object-contain ${
                              integration.id === 'tally'
                                ? 'w-14 h-14 group-hover:w-11 group-hover:h-11'
                                : integration.id === 'whatsapp'
                                ? 'w-8 h-8 group-hover:w-9 group-hover:h-9'
                                : 'w-7 h-7 group-hover:w-8 group-hover:h-8'
                            }`}
                          />
                        </div>
                        <span className={`text-[10px] font-medium text-center leading-tight ${
                          isActive ? 'text-waygent-blue' : 'text-waygent-text-secondary'
                        }`}>
                          {integration.name}
                        </span>
                      </button>
                      {isActive && !isAutoCycling && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAutoCycling(true);
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-waygent-blue rounded-full flex items-center justify-center shadow-md hover:bg-waygent-blue-hover transition z-10"
                          title="Unpin to resume auto-play"
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
                              d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z"
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
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-waygent-text-primary font-futura">
                3rd Party Integrations
              </h3>
              <div className="flex flex-wrap gap-4 max-w-md">
                {thirdPartyIntegrations.map((integration) => {
                  return (
                    <div key={integration.id} className="relative flex flex-col items-center gap-1.5">
                      <div className="group flex flex-col items-center gap-1.5 cursor-default">
                        <div className="relative flex items-center justify-center w-14 h-14 rounded-[14px] backdrop-blur-sm border bg-transparent border-gray-300/40 hover:bg-white/10 hover:border-waygent-blue/40 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md transition-all duration-200 ease-out">
                          <img
                            src={integration.iconUrl}
                            alt={integration.name}
                            className={`transition-all duration-200 object-contain ${
                              integration.id === 'github'
                                ? 'w-9 h-9 group-hover:w-10 group-hover:h-10'
                                : 'w-7 h-7 group-hover:w-8 group-hover:h-8'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight text-waygent-text-secondary">
                          {integration.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm text-waygent-text-secondary/80 font-medium">
                and much more on the way
              </p>
            </div>
          </div>

          {/* Right side - Screenshot preview */}
          <div className="relative h-[460px] overflow-hidden rounded-[36px] border border-[#d4ddfa] bg-white/85 shadow-xl backdrop-blur flex items-center justify-center">
            {activeIntegration && (
              <Image
                src={activeIntegration.screenshot}
                alt={`${activeIntegration.name} integration`}
                fill
                className="object-cover rounded-[36px]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
