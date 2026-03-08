'use client';

import React from 'react';

/* ============================================================
   Shared styling helpers for all tab preview panels.
   Same warm cream / teal design language as ModelConfigDemo.
   ============================================================ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="uppercase font-bold text-[#B0ADA6] mb-1.5" style={{ fontSize: '8px', letterSpacing: '0.06em' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span
      className="px-1.5 py-0.5 rounded font-medium"
      style={{ fontSize: '9px', color: '#64748B', background: 'rgba(0,0,0,0.035)', border: '1px solid rgba(0,0,0,0.05)' }}
    >
      {children}
    </span>
  );
}

function Row({ name, detail, enabled }: { name: string; detail: string; enabled?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
      {enabled !== undefined && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: enabled ? '#10B981' : '#D1D5DB' }} />
      )}
      <span className="font-semibold text-[#2C1810] flex-shrink-0" style={{ fontSize: '11px' }}>{name}</span>
      <span className="text-[#94A3B8] truncate" style={{ fontSize: '10px' }}>{detail}</span>
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
      <div className="flex items-center gap-2.5 px-4 py-2" style={{ background: '#F5F1E8', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(143,183,197,0.18)' }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#5B8A8A" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-[#2C1810] block" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>{title}</span>
          <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>{subtitle}</span>
        </div>
        {counter && <span className="text-[#B0ADA6]" style={{ fontSize: '10px' }}>{counter}</span>}
      </div>
      <div className="flex-1 px-4 py-2.5 flex flex-col gap-2 overflow-y-auto">
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
      <Section title="Composio Integrations">
        <div className="space-y-0.5">
          <Row name="Gmail" detail="Send, read, draft, search emails" enabled />
          <Row name="Google Sheets" detail="Read, write, create spreadsheets" enabled />
          <Row name="Slack" detail="Send messages, read channels, manage threads" enabled />
          <Row name="GitHub" detail="Issues, PRs, commits, repos, actions" enabled={false} />
          <Row name="Notion" detail="Pages, databases, blocks, search" enabled />
          <Row name="Jira" detail="Issues, sprints, boards, projects" enabled={false} />
          <Row name="HubSpot" detail="Contacts, deals, tickets, pipelines" enabled />
        </div>
      </Section>

      <Section title="System Tools">
        <div className="space-y-0.5">
          <Row name="create_document" detail="Create any DocType record" enabled />
          <Row name="get_document" detail="Fetch document by name or filters" enabled />
          <Row name="run_report" detail="Execute saved reports with params" enabled />
          <Row name="send_email" detail="Compose and send via configured SMTP" enabled />
          <Row name="web_search" detail="Search the internet via API" enabled />
          <Row name="execute_code" detail="Run sandboxed Python scripts" enabled />
          <Row name="delegate_task" detail="Assign sub-task to another agent" enabled />
        </div>
      </Section>

      <Section title="Controls">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <KVSmall label="Approval Mode" value="Per-tool" />
          <KVSmall label="Auto-execute" value="System tools" />
          <KVSmall label="Rate Limit" value="100 calls/min" />
          <KVSmall label="Timeout" value="30s default" />
          <KVSmall label="Retry" value="3x with backoff" />
          <KVSmall label="Logging" value="Full audit trail" />
        </div>
      </Section>
    </PreviewShell>
  );
}

/* ============================================================
   SKILLS PREVIEW
   ============================================================ */
export function SkillsConfigPreview() {
  return (
    <PreviewShell title="Skill Library" subtitle="Context-injected knowledge" counter="Token-efficient">
      <Section title="Core Skills (Always Loaded)">
        <div className="space-y-0.5">
          <Row name="Identity" detail="Agent name, role, persona, voice, boundaries" enabled />
          <Row name="Company Policy" detail="HR handbook, leave rules, expense guidelines" enabled />
          <Row name="Product Knowledge" detail="Features, pricing, roadmap, FAQs" enabled />
          <Row name="Communication Style" detail="Tone, formality, language preferences" enabled />
        </div>
      </Section>

      <Section title="On-Demand Skills (Loaded When Needed)">
        <div className="space-y-0.5">
          <Row name="Tax Calculations" detail="GST, TDS, income tax rules by region" enabled />
          <Row name="Legal Templates" detail="NDA, MSA, SOW, employment contracts" enabled />
          <Row name="Onboarding Flow" detail="Step-by-step new employee checklist" enabled />
          <Row name="Troubleshooting" detail="Common issues, escalation paths, SLA rules" enabled />
          <Row name="Sales Playbook" detail="Objection handling, pricing negotiation, close flow" enabled />
        </div>
      </Section>

      <Section title="Skill Properties">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <KVSmall label="Format" value="Markdown" />
          <KVSmall label="Max Size" value="32K tokens" />
          <KVSmall label="Loading" value="Lazy / eager" />
          <KVSmall label="Versioning" value="Built-in" />
          <KVSmall label="Inheritance" value="Parent agents" />
          <KVSmall label="Scope" value="Global or per-agent" />
        </div>
      </Section>

      <Section title="Capabilities">
        <div className="flex flex-wrap gap-1">
          <Tag>Markdown</Tag>
          <Tag>Tool Guides</Tag>
          <Tag>Workflow Steps</Tag>
          <Tag>Decision Trees</Tag>
          <Tag>Templates</Tag>
          <Tag>Few-shot Examples</Tag>
        </div>
      </Section>
    </PreviewShell>
  );
}

/* ============================================================
   TRIGGERS PREVIEW
   ============================================================ */
export function TriggersConfigPreview() {
  return (
    <PreviewShell title="Trigger Configuration" subtitle="Wake conditions" counter="Event-driven">
      <Section title="Scheduled Triggers">
        <div className="space-y-0.5">
          <Row name="Daily Report" detail="Every day at 9:00 AM IST" enabled />
          <Row name="Weekly Sync" detail="Monday 10:00 AM, reconcile accounts" enabled />
          <Row name="Hourly Check" detail="Monitor stock levels every 60 min" enabled={false} />
        </div>
      </Section>

      <Section title="Document Event Triggers">
        <div className="space-y-0.5">
          <Row name="Sales Order" detail="On submit: validate stock, create delivery" enabled />
          <Row name="Leave Application" detail="On create: check balance, notify manager" enabled />
          <Row name="Purchase Invoice" detail="On submit: match PO, update ledger" enabled />
          <Row name="Customer" detail="On update: sync CRM, update segments" enabled />
        </div>
      </Section>

      <Section title="Channel Triggers">
        <div className="space-y-0.5">
          <Row name="WhatsApp" detail="Route by phone number, auto-respond" enabled />
          <Row name="Email" detail="Parse inbound, create tickets, classify" enabled />
          <Row name="Web Chat" detail="Widget on website, live support" enabled />
          <Row name="Agent-to-Agent" detail="Task delegation from other agents" enabled />
        </div>
      </Section>

      <Section title="Trigger Settings">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <KVSmall label="Conditions" value="Python expressions" />
          <KVSmall label="Debounce" value="Configurable" />
          <KVSmall label="Retry" value="On failure" />
          <KVSmall label="Logging" value="Full history" />
          <KVSmall label="Toggle" value="Enable/disable live" />
          <KVSmall label="Priority" value="High / Normal / Low" />
        </div>
      </Section>
    </PreviewShell>
  );
}

/* ============================================================
   UI PREVIEW
   ============================================================ */
export function UIConfigPreview() {
  return (
    <PreviewShell title="UI Configuration" subtitle="Agent presentation layer" counter="4 modes">
      <Section title="Interface Modes">
        <div className="space-y-0.5">
          <Row name="Chat" detail="Conversational. Markdown, code blocks, rich cards" enabled />
          <Row name="Split View" detail="Chat left + custom workspace right. Resize handle" enabled />
          <Row name="Full Iframe" detail="Embed any web app. React, Vue, Svelte, vanilla" enabled />
          <Row name="No UI" detail="Background worker. API-only, no visual interface" enabled />
        </div>
      </Section>

      <Section title="Chat Capabilities">
        <div className="flex flex-wrap gap-1 mb-1">
          <Tag>Markdown</Tag>
          <Tag>Code Highlighting</Tag>
          <Tag>Tables</Tag>
          <Tag>File Upload</Tag>
          <Tag>Image Preview</Tag>
          <Tag>Action Buttons</Tag>
          <Tag>Forms</Tag>
          <Tag>Approval Cards</Tag>
        </div>
      </Section>

      <Section title="Iframe Frameworks">
        <div className="space-y-0.5">
          <Row name="React" detail="Next.js, Vite, CRA compatible" />
          <Row name="Vue" detail="Nuxt, Vite, Quasar compatible" />
          <Row name="Svelte" detail="SvelteKit, standalone" />
          <Row name="Vanilla" detail="Plain HTML/CSS/JS, any stack" />
        </div>
      </Section>

      <Section title="Settings">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <KVSmall label="Access Control" value="Role-based" />
          <KVSmall label="Theme" value="Light / Dark" />
          <KVSmall label="Branding" value="Custom logo, colors" />
          <KVSmall label="Embed" value="Widget / Full page" />
          <KVSmall label="Mobile" value="Responsive" />
          <KVSmall label="Offline" value="Queue messages" />
        </div>
      </Section>
    </PreviewShell>
  );
}

/* ============================================================
   LOGIC PREVIEW
   ============================================================ */
export function LogicConfigPreview() {
  return (
    <PreviewShell title="Logic Configuration" subtitle="Deterministic business code" counter="Version-controlled">
      <Section title="Code Modules">
        <div className="space-y-0.5">
          <Row name="tax_engine.py" detail="GST, TDS, income tax calc with slab lookup" enabled />
          <Row name="pricing_rules.py" detail="Discounts, margins, volume breaks, currency" enabled />
          <Row name="approval_matrix.py" detail="Hierarchy routing by amount, department, type" enabled />
          <Row name="payroll_calc.py" detail="Salary components, deductions, statutory compliance" enabled />
          <Row name="inventory_rules.py" detail="Reorder points, safety stock, batch expiry" enabled />
        </div>
      </Section>

      <Section title="API Endpoints">
        <div className="space-y-0.5">
          <Row name="/api/v1/calculate" detail="POST: Run any registered calculation module" enabled />
          <Row name="/api/v1/validate" detail="POST: Validate document against business rules" enabled />
          <Row name="/api/v1/transform" detail="POST: Data transformation pipelines" enabled />
        </div>
      </Section>

      <Section title="Background Jobs">
        <div className="space-y-0.5">
          <Row name="Daily Close" detail="End-of-day reconciliation, ledger balance" enabled />
          <Row name="Data Sync" detail="Pull from external ERPs, CRMs, banks" enabled />
          <Row name="Report Gen" detail="Scheduled PDF reports, email delivery" enabled />
        </div>
      </Section>

      <Section title="Properties">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <KVSmall label="Language" value="Python" />
          <KVSmall label="Framework" value="Frappe API" />
          <KVSmall label="Git" value="Full history" />
          <KVSmall label="Testing" value="Unit + integration" />
          <KVSmall label="Deploy" value="Hot reload" />
          <KVSmall label="Sandbox" value="Isolated exec" />
        </div>
      </Section>
    </PreviewShell>
  );
}

/* ============================================================
   Shared small KV row
   ============================================================ */
function KVSmall({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.025)', paddingBottom: '2px' }}>
      <span className="text-[#94A3B8] font-medium" style={{ fontSize: '10px' }}>{label}</span>
      <span className="font-semibold text-[#2C1810] ml-1" style={{ fontSize: '10px' }}>{value}</span>
    </div>
  );
}
