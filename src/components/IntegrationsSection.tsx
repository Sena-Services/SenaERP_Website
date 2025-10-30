"use client";

import { useState } from "react";
import {
  SiWhatsapp,
  SiInstagram,
  SiGmail,
  SiGooglesheets,
  SiGoogledocs,
  SiGooglecalendar,
  SiSlack,
  SiGithub,
  SiTypeform
} from "react-icons/si";
import { IconType } from "react-icons";

type Integration = {
  id: string;
  name: string;
  icon: IconType;
  color: string;
};

const integrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp", icon: SiWhatsapp, color: "#25D366" },
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "#E4405F" },
  { id: "gmail", name: "Gmail", icon: SiGmail, color: "#EA4335" },
  { id: "sheets", name: "Google Sheets", icon: SiGooglesheets, color: "#0F9D58" },
  { id: "docs", name: "Google Docs", icon: SiGoogledocs, color: "#4285F4" },
  { id: "calendar", name: "Google Calendar", icon: SiGooglecalendar, color: "#4285F4" },
  { id: "slack", name: "Slack", icon: SiSlack, color: "#4A154B" },
  { id: "github", name: "GitHub", icon: SiGithub, color: "#181717" },
  { id: "tally", name: "Tally", icon: SiTypeform, color: "#5A6BF5" },
];

export default function IntegrationsSection() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  return (
    <section id="integrations" className="scroll-mt-32">
      <div className="rounded-3xl border border-waygent-light-blue bg-waygent-light-blue p-10 shadow-lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-waygent-text-primary">
            Connect the tools you already use
          </h2>
        </div>

        <div className="mt-12 mx-auto max-w-4xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {integrations.map((integration) => {
              const isSelected = selectedIntegration === integration.id;

              const Icon = integration.icon;

              return (
                <button
                  key={integration.id}
                  onClick={() => setSelectedIntegration(integration.id)}
                  className={`
                    group relative flex flex-col items-center justify-center
                    rounded-2xl bg-white p-6
                    transition-all duration-200 ease-out
                    hover:shadow-lg hover:scale-105
                    ${isSelected
                      ? 'ring-2 ring-waygent-blue shadow-lg scale-105'
                      : 'shadow-sm hover:ring-2 hover:ring-waygent-blue/50'
                    }
                  `}
                  aria-label={`Connect ${integration.name}`}
                >
                  <Icon
                    className="w-10 h-10 transition-colors duration-200"
                    style={{ color: integration.color }}
                  />

                  {/* Show name on hover or when selected */}
                  <div
                    className={`
                      absolute -bottom-8 left-1/2 -translate-x-1/2
                      whitespace-nowrap text-xs font-semibold text-waygent-text-primary
                      bg-white px-3 py-1 rounded-full shadow-md
                      transition-all duration-200
                      ${isSelected
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                      }
                    `}
                  >
                    {integration.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-waygent-text-secondary">
            And 30+ more integrations to connect your entire stack
          </p>
        </div>
      </div>
    </section>
  );
}
