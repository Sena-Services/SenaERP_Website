'use client';

import React from 'react';

/* ============================================================
   Shared styling helpers for all tab preview panels.
   Two-column body layout — sections use flex justify-between
   to spread content and fill all available vertical space.
   ============================================================ */

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="uppercase font-bold text-[#B0ADA6] mb-0.5" style={{ fontSize: '7px', letterSpacing: '0.06em' }}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span
      className="px-1 py-px rounded font-medium"
      style={{ fontSize: '7px', color: '#64748B', background: 'rgba(0,0,0,0.035)', border: '1px solid rgba(0,0,0,0.05)' }}
    >
      {children}
    </span>
  );
}

function Row({ name, detail, enabled }: { name: string; detail: string; enabled?: boolean }) {
  return (
    <div className="flex items-center gap-1 py-px" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
      {enabled !== undefined && (
        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: enabled ? '#10B981' : '#D1D5DB' }} />
      )}
      <span className="font-semibold text-[#2C1810] flex-shrink-0" style={{ fontSize: '8.5px' }}>{name}</span>
      <span className="text-[#94A3B8] truncate" style={{ fontSize: '7.5px' }}>{detail}</span>
    </div>
  );
}

function KVSmall({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.025)', paddingBottom: '0px' }}>
      <span className="text-[#94A3B8] font-medium" style={{ fontSize: '7.5px' }}>{label}</span>
      <span className="font-semibold text-[#2C1810] ml-1" style={{ fontSize: '7.5px' }}>{value}</span>
    </div>
  );
}

function PreviewShell({ title, subtitle, counter, children }: { title: string; subtitle: string; counter?: string; children: React.ReactNode }) {
  return (
    <div
      className="h-full rounded-xl overflow-hidden flex flex-col font-futura"
      style={{
        background: '#FAFAF8',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 16px -4px rgba(139,119,89,0.10)',
      }}
    >
      <div className="flex items-center gap-2 px-3 py-1" style={{ background: '#F5F1E8', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(143,183,197,0.18)' }}>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#5B8A8A" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-[#2C1810]" style={{ fontSize: '10px', letterSpacing: '-0.01em' }}>{title}</span>
          <span className="text-[#94A3B8] ml-1.5" style={{ fontSize: '8px' }}>{subtitle}</span>
        </div>
        {counter && <span className="text-[#B0ADA6] flex-shrink-0" style={{ fontSize: '8px' }}>{counter}</span>}
      </div>
      <div className="flex-1 px-3 py-2 overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   TOOLS PREVIEW
   ============================================================ */
export function ToolsConfigPreview() {
  return (
    <PreviewShell title="Tool Configuration" subtitle="350+ tools available" counter="Per-agent control">
      <div className="grid grid-cols-2 gap-x-3 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Composio Integrations</SectionLabel>
            <Row name="Gmail" detail="Send, read, draft, search emails" enabled />
            <Row name="Google Sheets" detail="Read, write, create spreadsheets" enabled />
            <Row name="Slack" detail="Send messages, read channels" enabled />
            <Row name="GitHub" detail="Issues, PRs, commits, repos" enabled={false} />
            <Row name="Notion" detail="Pages, databases, blocks, search" enabled />
            <Row name="Jira" detail="Issues, sprints, boards, projects" enabled={false} />
            <Row name="HubSpot" detail="Contacts, deals, tickets" enabled />
          </div>
          <div>
            <SectionLabel>Controls</SectionLabel>
            <div className="grid grid-cols-3 gap-x-3">
              <KVSmall label="Approval" value="Per-tool" />
              <KVSmall label="Auto-exec" value="System" />
              <KVSmall label="Rate Limit" value="100/min" />
              <KVSmall label="Timeout" value="30s" />
              <KVSmall label="Retry" value="3x" />
              <KVSmall label="Logging" value="Full audit" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>System Tools</SectionLabel>
            <Row name="create_document" detail="Create any DocType record" enabled />
            <Row name="get_document" detail="Fetch by name or filters" enabled />
            <Row name="run_report" detail="Execute saved reports" enabled />
            <Row name="send_email" detail="Compose and send via SMTP" enabled />
            <Row name="web_search" detail="Search the internet via API" enabled />
            <Row name="execute_code" detail="Run sandboxed Python" enabled />
            <Row name="delegate_task" detail="Assign to another agent" enabled />
          </div>
          <div>
            <SectionLabel>Capabilities</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Composio</Tag>
              <Tag>ERP Native</Tag>
              <Tag>Sandboxed</Tag>
              <Tag>Audit Trail</Tag>
              <Tag>Rate Limited</Tag>
              <Tag>Per-agent</Tag>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

/* ============================================================
   SKILLS PREVIEW
   ============================================================ */
export function SkillsConfigPreview() {
  return (
    <PreviewShell title="Skill Library" subtitle="Context-injected knowledge" counter="Token-efficient">
      <div className="grid grid-cols-2 gap-x-3 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Core Skills (Always Loaded)</SectionLabel>
            <Row name="Identity" detail="Name, role, persona, voice" enabled />
            <Row name="Company Policy" detail="HR handbook, leave, expenses" enabled />
            <Row name="Product Knowledge" detail="Features, pricing, roadmap" enabled />
            <Row name="Communication" detail="Tone, formality, language" enabled />
          </div>
          <div>
            <SectionLabel>On-Demand (Loaded When Needed)</SectionLabel>
            <Row name="Tax Calculations" detail="GST, TDS, income tax rules" enabled />
            <Row name="Legal Templates" detail="NDA, MSA, SOW, contracts" enabled />
            <Row name="Onboarding Flow" detail="New employee checklist" enabled />
            <Row name="Troubleshooting" detail="Issues, escalation, SLA" enabled />
            <Row name="Sales Playbook" detail="Objections, negotiation" enabled />
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Skill Properties</SectionLabel>
            <div className="grid grid-cols-2 gap-x-3">
              <KVSmall label="Format" value="Markdown" />
              <KVSmall label="Max Size" value="32K tokens" />
              <KVSmall label="Loading" value="Lazy / eager" />
              <KVSmall label="Versioning" value="Built-in" />
              <KVSmall label="Inheritance" value="Parent agents" />
              <KVSmall label="Scope" value="Global / per-agent" />
            </div>
          </div>
          <div>
            <SectionLabel>Skill Types</SectionLabel>
            <Row name="Identity" detail="Agent persona and role definition" />
            <Row name="Instructions" detail="Operating procedures" />
            <Row name="Domain" detail="Business knowledge base" />
            <Row name="Tool Guide" detail="How to use specific tools" />
            <Row name="Workflow" detail="Step-by-step processes" />
          </div>
          <div>
            <SectionLabel>Capabilities</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Markdown</Tag>
              <Tag>Tool Guides</Tag>
              <Tag>Workflows</Tag>
              <Tag>Decision Trees</Tag>
              <Tag>Templates</Tag>
              <Tag>Few-shot</Tag>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

/* ============================================================
   TRIGGERS PREVIEW
   ============================================================ */
export function TriggersConfigPreview() {
  return (
    <PreviewShell title="Trigger Configuration" subtitle="Wake conditions" counter="Event-driven">
      <div className="grid grid-cols-2 gap-x-3 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Scheduled Triggers</SectionLabel>
            <Row name="Daily Report" detail="Every day at 9:00 AM IST" enabled />
            <Row name="Weekly Sync" detail="Monday 10:00 AM, reconcile" enabled />
            <Row name="Hourly Check" detail="Monitor stock levels" enabled={false} />
          </div>
          <div>
            <SectionLabel>Document Event Triggers</SectionLabel>
            <Row name="Sales Order" detail="On submit: validate, deliver" enabled />
            <Row name="Leave Application" detail="On create: check balance" enabled />
            <Row name="Purchase Invoice" detail="On submit: match PO" enabled />
            <Row name="Customer" detail="On update: sync CRM" enabled />
          </div>
          <div>
            <SectionLabel>Features</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Cron</Tag>
              <Tag>Doc Events</Tag>
              <Tag>WhatsApp</Tag>
              <Tag>Email</Tag>
              <Tag>Webhooks</Tag>
              <Tag>A2A</Tag>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Channel Triggers</SectionLabel>
            <Row name="WhatsApp" detail="Route by phone, auto-respond" enabled />
            <Row name="Email" detail="Parse inbound, create tickets" enabled />
            <Row name="Web Chat" detail="Widget on website, live support" enabled />
            <Row name="Agent-to-Agent" detail="Task delegation" enabled />
          </div>
          <div>
            <SectionLabel>Trigger Settings</SectionLabel>
            <div className="grid grid-cols-2 gap-x-3">
              <KVSmall label="Conditions" value="Python expr" />
              <KVSmall label="Debounce" value="Configurable" />
              <KVSmall label="Retry" value="On failure" />
              <KVSmall label="Logging" value="Full history" />
              <KVSmall label="Toggle" value="Live enable" />
              <KVSmall label="Priority" value="High/Normal/Low" />
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

/* ============================================================
   UI PREVIEW
   ============================================================ */
export function UIConfigPreview() {
  return (
    <PreviewShell title="UI Configuration" subtitle="Agent presentation layer" counter="4 modes">
      <div className="grid grid-cols-2 gap-x-3 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Interface Modes</SectionLabel>
            <Row name="Chat" detail="Markdown, code blocks, rich cards" enabled />
            <Row name="Split View" detail="Chat left + workspace right" enabled />
            <Row name="Full Iframe" detail="React, Vue, Svelte, vanilla" enabled />
            <Row name="No UI" detail="Background worker, API-only" enabled />
          </div>
          <div>
            <SectionLabel>Iframe Frameworks</SectionLabel>
            <Row name="React" detail="Next.js, Vite, CRA" />
            <Row name="Vue" detail="Nuxt, Vite, Quasar" />
            <Row name="Svelte" detail="SvelteKit, standalone" />
            <Row name="Vanilla" detail="Plain HTML/CSS/JS" />
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Chat Capabilities</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Markdown</Tag>
              <Tag>Code Highlighting</Tag>
              <Tag>Tables</Tag>
              <Tag>File Upload</Tag>
              <Tag>Image Preview</Tag>
              <Tag>Action Buttons</Tag>
              <Tag>Forms</Tag>
              <Tag>Approval Cards</Tag>
            </div>
          </div>
          <div>
            <SectionLabel>Settings</SectionLabel>
            <div className="grid grid-cols-2 gap-x-3">
              <KVSmall label="Access" value="Role-based" />
              <KVSmall label="Theme" value="Light / Dark" />
              <KVSmall label="Branding" value="Custom logo" />
              <KVSmall label="Embed" value="Widget / Full" />
              <KVSmall label="Mobile" value="Responsive" />
              <KVSmall label="Offline" value="Queue msgs" />
            </div>
          </div>
          <div>
            <SectionLabel>Features</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Responsive</Tag>
              <Tag>Theming</Tag>
              <Tag>RBAC</Tag>
              <Tag>Embeddable</Tag>
              <Tag>Any Framework</Tag>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

/* ============================================================
   LOGIC PREVIEW
   ============================================================ */
export function LogicConfigPreview() {
  return (
    <PreviewShell title="Logic Configuration" subtitle="Deterministic business code" counter="Version-controlled">
      <div className="grid grid-cols-2 gap-x-3 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>Code Modules</SectionLabel>
            <Row name="tax_engine.py" detail="GST, TDS, income tax calc" enabled />
            <Row name="pricing_rules.py" detail="Discounts, margins, breaks" enabled />
            <Row name="approval_matrix.py" detail="Hierarchy routing" enabled />
            <Row name="payroll_calc.py" detail="Salary, deductions" enabled />
            <Row name="inventory_rules.py" detail="Reorder, safety stock" enabled />
          </div>
          <div>
            <SectionLabel>Background Jobs</SectionLabel>
            <Row name="Daily Close" detail="End-of-day reconciliation" enabled />
            <Row name="Data Sync" detail="Pull from ERPs, CRMs, banks" enabled />
            <Row name="Report Gen" detail="Scheduled PDFs, email" enabled />
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div>
            <SectionLabel>API Endpoints</SectionLabel>
            <Row name="/api/v1/calculate" detail="Run calculation module" enabled />
            <Row name="/api/v1/validate" detail="Validate against rules" enabled />
            <Row name="/api/v1/transform" detail="Data transformation" enabled />
          </div>
          <div>
            <SectionLabel>Properties</SectionLabel>
            <div className="grid grid-cols-2 gap-x-3">
              <KVSmall label="Language" value="Python" />
              <KVSmall label="Framework" value="Frappe API" />
              <KVSmall label="Git" value="Full history" />
              <KVSmall label="Testing" value="Unit + integ" />
              <KVSmall label="Deploy" value="Hot reload" />
              <KVSmall label="Sandbox" value="Isolated exec" />
            </div>
          </div>
          <div>
            <SectionLabel>Features</SectionLabel>
            <div className="flex flex-wrap gap-0.5">
              <Tag>Deterministic</Tag>
              <Tag>Versioned</Tag>
              <Tag>Testable</Tag>
              <Tag>Hot Reload</Tag>
              <Tag>Sandboxed</Tag>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}
