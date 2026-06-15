import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "About · Orion",
  description:
    "What Orion is, how it works, and our mission: AI agents whose decisions are verifiable and whose on-chain actions are safe.",
};

const STEPS = [
  {
    n: "1",
    t: "Build an agent",
    d: "Pick a template or start blank, then write a plain-language directive — the rules your agent reasons with. Choose a testnet and how it acts.",
  },
  {
    n: "2",
    t: "GenLayer decides",
    d: "When you run the agent, GenLayer's AI validators reach consensus on approve or reject — with confidence and reasoning. Not a single black-box API call.",
  },
  {
    n: "3",
    t: "It acts on-chain",
    d: "On approval the agent executes a real testnet transaction — your wallet signs it, or the agent's own wallet does. Every action is logged and auditable.",
  },
];

const FEATURES = [
  ["🧠", "Verifiable AI", "Decisions come from GenLayer validator consensus, with reasoning you can read — not an opaque model you have to trust blindly."],
  ["🔗", "Real on-chain actions", "Approved actions call a real contract (AgentActions) or send a transaction on testnet, with an explorer link for every one."],
  ["🛡️", "Bounded authority", "An agent can only take its one configured action. The contract coerces anything else to nothing, on-chain."],
  ["🤖", "Optional autonomy", "Give an agent its own testnet wallet and it signs its own transactions — opt-in, browser-held keys, zero-value by default."],
  ["☁️", "Yours, everywhere", "Sign in with your wallet (SIWE) and your agents sync across devices. No account, no password."],
  ["📝", "Audited & open", "The contracts ship with a written security review. Mock mode runs with zero setup; go live when you're ready."],
];

const FAQ = [
  [
    "Is this on mainnet?",
    "No — testnet only, by design, for now. It runs in a simulated 'mock' mode out of the box, and live mode targets test networks (Base Sepolia and friends). Don't put real funds behind it.",
  ],
  [
    "What makes GenLayer different from calling an LLM?",
    "GenLayer is a blockchain where 'Intelligent Contracts' run AI through multiple independent validators that must agree on the outcome. You get a decision that's reproducible and tamper-evident, recorded on-chain — instead of one server's word for it.",
  ],
  [
    "Do you hold my keys or funds?",
    "No. In Suggest mode your own wallet signs every transaction. In Autonomous mode the agent's testnet key is generated and kept in your browser only — never sent to us. It only ever sends zero-value, testnet transactions.",
  ],
  [
    "What can an agent actually do?",
    "Each agent makes a judgment (approve/reject) on an input you give it, then optionally performs one bounded testnet action — log a decision on-chain, send a memo transaction, etc. You decide its directive and its single allowed action.",
  ],
];

export default function AboutPage() {
  return (
    <div className="about-wrap">
      <div className="about-top">
        <span className="about-brand">
          <LogoMark size={30} />
          <span>
            Orion <span className="about-brand-tag">· GenLayer</span>
          </span>
        </span>
        <Link href="/" className="btn-primary">
          Open dashboard →
        </Link>
      </div>

      <header className="about-hero">
        <h1>Build AI agents you can actually trust.</h1>
        <p className="lead">
          Orion lets anyone create autonomous AI agents whose
          decisions are <strong>verifiable</strong> and whose on-chain actions
          are <strong>safe</strong>. You write the rules; GenLayer reaches
          consensus on every decision; approved actions run on a testnet.
        </p>
      </header>

      <section className="about-section">
        <h2>Our mission</h2>
        <p>
          AI is being handed real power — money, access, decisions — but most
          “AI agents” are a single model behind a single API, impossible to
          audit and easy to manipulate. We think autonomous agents should be
          <strong> accountable by construction</strong>: their reasoning should
          be inspectable, their decisions should come from{" "}
          <strong>consensus rather than one opaque call</strong>, and their
          authority on-chain should be <strong>narrow and bounded</strong>.
          Orion is a hands-on place to build agents that way — and to
          show that trustworthy autonomy is practical, not hypothetical.
        </p>
      </section>

      <section className="about-section">
        <h2>What it is</h2>
        <p>
          A dashboard for creating, running, and managing AI agents. Each agent
          pairs a directive you write with <strong>GenLayer</strong> as its
          decision engine and a <strong>testnet wallet</strong> as its hands.
          Spin one up from a template — a treasury controller, a content
          moderator, an airdrop screener — run it against real inputs, and watch
          it decide and act, with a full activity log per agent.
        </p>
      </section>

      <section className="about-section">
        <h2>How it works</h2>
        <div className="steps3">
          {STEPS.map((s) => (
            <div className="step3" key={s.n}>
              <div className="step3-n">{s.n}</div>
              <div className="step3-t">{s.t}</div>
              <div className="step3-d">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Why it&apos;s different</h2>
        <div className="feature-grid">
          {FEATURES.map(([icon, t, d]) => (
            <div className="feature" key={t}>
              <div className="feature-ic">{icon}</div>
              <div className="feature-t">{t}</div>
              <div className="feature-d">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Built for safety</h2>
        <p>
          Testnet only. No private-key custody in the default flow. Agent
          authority is bounded to a single allowlisted action, re-checked
          on-chain. Cloud sync is gated by a wallet signature (Sign-In With
          Ethereum), not a guessable address. The Intelligent Contract ships
          with a written security review in{" "}
          <code>AUDIT.md</code>. It is a pilot — keep it on testnet until an
          external audit.
        </p>
      </section>

      <section className="about-section">
        <h2>FAQ</h2>
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <div className="faq-item" key={q}>
              <div className="faq-q">{q}</div>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to build one?</h2>
        <p>It runs with zero setup — no wallet or keys needed to explore.</p>
        <Link href="/" className="btn-primary">
          Build your first agent →
        </Link>
      </section>

      <footer className="about-foot">
        Orion · verifiable AI decisions · testnet execution.
        Mock mode is simulated — see the README to wire real chains.
      </footer>
    </div>
  );
}
