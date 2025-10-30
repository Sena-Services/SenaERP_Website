"use client";

type Integration = {
  id: string;
  name: string;
  iconUrl: string;
  useColor?: boolean;
};

const integrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png", useColor: true },
  { id: "instagram", name: "Instagram", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", useColor: true },
  { id: "gmail", name: "Gmail", iconUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", useColor: true },
  { id: "sheets", name: "Sheets", iconUrl: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico", useColor: true },
  { id: "docs", name: "Docs", iconUrl: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico", useColor: true },
  { id: "calendar", name: "Calendar", iconUrl: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico", useColor: true },
  { id: "slack", name: "Slack", iconUrl: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", useColor: true },
  { id: "github", name: "GitHub", iconUrl: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", useColor: true },
  { id: "tally", name: "Tally", iconUrl: "/icons/Tally.png", useColor: true },
];

export default function IntegrationsSection() {

  return (
    <section id="integrations" className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
            Integrations
          </h2>
        </div>

        <div className="max-w-7xl">
          <div className="flex flex-wrap gap-4">
            {integrations.map((integration) => {
              return (
                <div
                  key={integration.id}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <div
                    className="relative flex items-center justify-center w-14 h-14 rounded-[14px] backdrop-blur-sm bg-transparent border border-gray-300/40 transition-all duration-200 ease-out hover:bg-white/10 hover:border-waygent-blue/40 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md"
                  >
                    <img
                      src={integration.iconUrl}
                      alt={integration.name}
                      className={`transition-all duration-200 object-contain ${
                        integration.id === 'tally'
                          ? 'w-14 h-14 group-hover:w-11 group-hover:h-11'
                          : integration.id === 'github'
                          ? 'w-9 h-9 group-hover:w-10 group-hover:h-10'
                          : integration.id === 'whatsapp'
                          ? 'w-8 h-8 group-hover:w-9 group-hover:h-9'
                          : 'w-7 h-7 group-hover:w-8 group-hover:h-8'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-waygent-text-secondary text-center leading-tight">
                    {integration.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-waygent-text-secondary/80 font-medium">
            and much more on the way
          </p>
        </div>
      </div>
    </section>
  );
}
