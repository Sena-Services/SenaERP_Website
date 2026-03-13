'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MODELS = [
  {
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    desc: 'World-class coding, enterprise agents, and professional work. 128K output, adaptive thinking, compaction for infinite conversations.',
    caps: ['Thinking', 'Toggleable', 'Tools', 'Vision', 'Streaming', 'Computer Use'],
    ctx: 200000, out: 128000, price: '$5 / $25',
    temp: 1.00, turns: 25, think: 'Dynamic', budget: 'Auto',
    input: 'Text, Images', output: 'Text',
    arch: 'Dense Transformer',
    benchmarks: [
      { name: 'SWE-bench', score: '72.5%' },
      { name: 'GPQA Diamond', score: '74.1%' },
      { name: 'MMLU Pro', score: '85.7%' },
    ],
    bestFor: ['Complex agentic tasks', 'Multi-step coding', 'Enterprise workflows', 'Extended reasoning'],
    features: ['Adaptive thinking depth', '1M context (beta)', 'Compaction (infinite chat)', 'Tool search'],
  },
  {
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    desc: 'Near-Opus intelligence at accessible pricing. Exceptional at computer use, coding, design, and knowledge work.',
    caps: ['Thinking', 'Toggleable', 'Tools', 'Vision', 'Streaming', 'Computer Use'],
    ctx: 200000, out: 64000, price: '$3 / $15',
    temp: 1.00, turns: 25, think: 'Dynamic', budget: 'Auto',
    input: 'Text, Images', output: 'Text',
    arch: 'Dense Transformer',
    benchmarks: [
      { name: 'SWE-bench', score: '65.3%' },
      { name: 'GPQA Diamond', score: '68.2%' },
      { name: 'MMLU Pro', score: '82.1%' },
    ],
    bestFor: ['Everyday coding', 'Computer use', 'Design tasks', 'Analysis'],
    features: ['Best price-to-performance', '1M context (beta)', 'Computer use native', 'Fast response'],
  },
  {
    name: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    desc: '77.1% on ARC-AGI-2. 1M context handles entire code repos. Native multimodal: text, audio, images, video, PDFs.',
    caps: ['Thinking', 'Tools', 'Vision', 'Streaming', 'Audio', 'Video'],
    ctx: 1048576, out: 65536, price: '$2 / $18',
    temp: 0.50, turns: 30, think: 'Dynamic', budget: 'Auto',
    input: 'Text, Images, Audio, Video, PDF', output: 'Text',
    arch: 'MoE Transformer',
    benchmarks: [
      { name: 'ARC-AGI-2', score: '77.1%' },
      { name: 'MMLU Pro', score: '84.5%' },
      { name: 'HumanEval', score: '92.1%' },
    ],
    bestFor: ['Multimodal analysis', 'Code repositories', 'Video understanding', 'Long documents'],
    features: ['1M token context', '6 input modalities', 'Native PDF parsing', 'Code repo analysis'],
  },
  {
    name: 'GPT-5.4',
    provider: 'OpenAI',
    desc: 'Native computer use, tool search (47% fewer tokens), 33% fewer hallucinations. Matches professionals in 83% of knowledge work.',
    caps: ['Thinking', 'Tools', 'Vision', 'Streaming', 'Computer Use'],
    ctx: 1050000, out: 128000, price: '$2.50 / $15',
    temp: 0.80, turns: 20, think: 'Dynamic', budget: 'Auto',
    input: 'Text, Images', output: 'Text',
    arch: 'Dense Transformer',
    benchmarks: [
      { name: 'GDPval', score: '83%' },
      { name: 'SWE-bench', score: '69.8%' },
      { name: 'MMLU Pro', score: '86.2%' },
    ],
    bestFor: ['Knowledge work', 'Tool orchestration', 'Computer use', 'Low hallucination tasks'],
    features: ['Tool search (47% savings)', 'Native computer use', '128K output', 'Cached input $0.25'],
  },
  {
    name: 'Grok 4.1',
    provider: 'xAI',
    desc: '#1 LMArena Text Arena (1483 Elo). 65% fewer hallucinations. Fast variant offers 2M context, the largest of any frontier model.',
    caps: ['Thinking', 'Tools', 'Vision', 'Streaming', 'Video'],
    ctx: 256000, out: 128000, price: '$3 / $15',
    temp: 0.70, turns: 20, think: 'Dynamic', budget: 'Auto',
    input: 'Text, Images, Video', output: 'Text',
    arch: 'Dense Transformer',
    benchmarks: [
      { name: 'LMArena Elo', score: '1483' },
      { name: 'Hallucination', score: '4.2%' },
      { name: 'MMLU Pro', score: '84.8%' },
    ],
    bestFor: ['Creative writing', 'Emotional intelligence', 'Real-time data', 'Collaborative tasks'],
    features: ['#1 Arena ranking', '2M context (Fast)', '65% fewer hallucinations', 'Video understanding'],
  },
  {
    name: 'Llama 4 Scout',
    provider: 'Meta',
    desc: 'Open-weight with 10M context, the longest of any model. Runs on a single H100 GPU. 16-expert MoE, 17B active params.',
    caps: ['Tools', 'Vision', 'Streaming'],
    ctx: 10000000, out: 32000, price: 'Open Weight',
    temp: 0.60, turns: 15, think: 'Off', budget: 'N/A',
    input: 'Text, Images', output: 'Text',
    arch: 'MoE (16 experts, 17B active)',
    benchmarks: [
      { name: 'Context Length', score: '10M' },
      { name: 'MMLU Pro', score: '78.3%' },
      { name: 'HumanEval', score: '84.7%' },
    ],
    bestFor: ['Long document analysis', 'Self-hosted deployments', 'Cost-sensitive workloads', 'Privacy-first'],
    features: ['10M context window', 'Single H100 GPU', 'Apache 2.0 license', 'Natively multimodal'],
  },
  {
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    desc: '10x cheaper than Western frontier models. IMO gold medal math. 671B total, 37B active. Chat + Reasoner dual modes.',
    caps: ['Thinking', 'Tools', 'Streaming'],
    ctx: 128000, out: 64000, price: '$0.28 / $0.42',
    temp: 0.40, turns: 20, think: 'Dynamic', budget: 'Auto',
    input: 'Text', output: 'Text',
    arch: 'MoE (671B total, 37B active)',
    benchmarks: [
      { name: 'IMO 2025', score: 'Gold Medal' },
      { name: 'MMLU Pro', score: '82.6%' },
      { name: 'HumanEval', score: '89.4%' },
    ],
    bestFor: ['Math and logic', 'Budget workloads', 'Chain-of-thought', 'Code generation'],
    features: ['Chat + Reasoner modes', '90% cache savings', 'OpenAI-compatible API', '10x cost savings'],
  },
  {
    name: 'Mistral Large 3',
    provider: 'Mistral AI',
    desc: 'Apache 2.0 open source. 675B total, 41B active. Native function calling, 12+ languages. Best-in-class agentic capabilities.',
    caps: ['Tools', 'Vision', 'Streaming', 'Function Calling'],
    ctx: 256000, out: 64000, price: '$0.50 / $1.50',
    temp: 0.70, turns: 20, think: 'Off', budget: 'N/A',
    input: 'Text, Images', output: 'Text',
    arch: 'Sparse MoE (675B total, 41B active)',
    benchmarks: [
      { name: 'Function Call', score: '94.2%' },
      { name: 'MMLU Pro', score: '80.1%' },
      { name: 'Multilingual', score: '12+ langs' },
    ],
    bestFor: ['Agentic workflows', 'Function calling', 'Multilingual', 'Self-hosted enterprise'],
    features: ['Apache 2.0 license', 'Native JSON output', '3000 H200 training', 'CJK + 12 languages'],
  },
];

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

const AUTO_INTERVAL = 4500;

export default function ModelConfigDemo() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const m = MODELS[idx];

  const goTo = useCallback((next: number) => {
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
  }, [idx]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setIdx((i) => (i + 1) % MODELS.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 24 : -24 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -16 : 16 }),
  };

  return (
    <div
      className="h-full flex flex-col font-futura"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={idx}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-xl overflow-hidden flex flex-col"
          style={{
            background: '#FAFAF8',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 16px -4px rgba(139, 119, 89, 0.10)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 py-1"
            style={{ background: '#F5F1E8', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}
          >
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'rgba(143, 183, 197, 0.18)' }}>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#5B8A8A" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[#2C1810] truncate" style={{ fontSize: '10px', letterSpacing: '-0.01em' }}>
                {m.name}
              </span>
              <span className="text-[#94A3B8] ml-1.5" style={{ fontSize: '8px' }}>{m.provider}</span>
            </div>
            <span className="text-[#B0ADA6] tabular-nums" style={{ fontSize: '8px' }}>
              {idx + 1} / {MODELS.length}
            </span>
          </div>

          {/* Body - dense content, fills available space */}
          <div className="flex-1 px-3 py-2 flex flex-col justify-between overflow-hidden min-h-0">
            {/* Description */}
            <p className="text-[#64748B] leading-tight" style={{ fontSize: '10px' }}>
              {m.desc}
            </p>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-0.5">
              {m.caps.map((c) => (
                <span key={c} className="px-1 py-px rounded font-medium" style={{ fontSize: '7.5px', color: '#64748B', background: 'rgba(0,0,0,0.035)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  {c}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-x-2">
              <Stat label="Context" value={fmt(m.ctx)} />
              <Stat label="Max Output" value={fmt(m.out)} />
              <Stat label="Price/1M" value={m.price} small />
              <Stat label="Architecture" value={m.arch} small />
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }} />

            {/* Defaults */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-0">
              <KV label="Temperature" value={m.temp.toFixed(2)} />
              <KV label="Max Turns" value={String(m.turns)} />
              <KV label="Think Mode" value={m.think} />
              <KV label="Think Budget" value={m.budget} />
              <KV label="Input" value={m.input} />
              <KV label="Output" value={m.output} />
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }} />

            {/* Benchmarks */}
            <div>
              <div className="uppercase font-bold text-[#B0ADA6] mb-0.5" style={{ fontSize: '7px', letterSpacing: '0.06em' }}>Benchmarks</div>
              <div className="flex gap-2">
                {m.benchmarks.map((b) => (
                  <div key={b.name} className="flex-1">
                    <div className="text-[#94A3B8]" style={{ fontSize: '7.5px' }}>{b.name}</div>
                    <div className="font-bold text-[#2C1810]" style={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>{b.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }} />

            {/* Best For + Features side by side */}
            <div className="grid grid-cols-2 gap-x-3">
              <div>
                <div className="uppercase font-bold text-[#B0ADA6] mb-0" style={{ fontSize: '7px', letterSpacing: '0.06em' }}>Best For</div>
                {m.bestFor.map((b) => (
                  <div key={b} className="flex items-center gap-1" style={{ fontSize: '9px', color: '#64748B', lineHeight: '13px' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#8FB7C5' }} />
                    {b}
                  </div>
                ))}
              </div>
              <div>
                <div className="uppercase font-bold text-[#B0ADA6] mb-0" style={{ fontSize: '7px', letterSpacing: '0.06em' }}>Key Features</div>
                {m.features.map((f) => (
                  <div key={f} className="flex items-center gap-1" style={{ fontSize: '9px', color: '#64748B', lineHeight: '13px' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#10B981' }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer dots */}
          <div className="flex items-center justify-center gap-0 py-1" style={{ borderTop: '1px solid rgba(0,0,0,0.03)' }}>
            {MODELS.map((model, i) => (
              <button
                key={model.name}
                onClick={() => goTo(i)}
                aria-label={`Go to model ${i + 1}: ${MODELS[i].name}`}
                className="relative flex items-center justify-center transition-all duration-300"
                style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', padding: 0 }}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === idx ? 14 : 4,
                    height: 4,
                    background: i === idx ? '#8FB7C5' : 'rgba(0, 0, 0, 0.10)',
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="uppercase font-bold text-[#B0ADA6]" style={{ fontSize: '7px', letterSpacing: '0.06em', lineHeight: 1 }}>{label}</div>
      <div className="font-semibold text-[#2C1810] mt-px truncate" style={{ fontSize: small ? '9px' : '11px', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.025)', paddingBottom: '0px' }}>
      <span className="text-[#94A3B8] font-medium truncate" style={{ fontSize: '8.5px' }}>{label}</span>
      <span className="font-semibold text-[#2C1810] ml-1 truncate" style={{ fontSize: '8.5px', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}
