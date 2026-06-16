import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Docs · Orion",
  description:
    "Orion documentation: how it works, the live GenLayer deployment, a demo script, and configuration.",
};

const CONTRACT = "0xAb08f32E9080930d143Fdea825978154E3030A11";
const EXPLORER = `https://explorer-studio.genlayer.com/address/${CONTRACT}`;
const REPO = "https://github.com/Starling-spell/ai-agent-kit";

export default function DocsPage() {
  return (
    <div className="about-wrap">
      <div className="about-top">
        <span className="about-brand">
          <LogoMark size={30} />
          <span>
            Orion <span className="about-brand-tag">· Docs</span>
          </span>
        </span>
        <Link href="/" className="btn-primary">
          Open dashboard →
        </Link>
      </div>

      <header className="about-hero">
        <h1>Orion — Documentation</h1>
        <p className="lead">
          Orion is a platform for building AI agents whose decisions run on{" "}
          <strong>GenLayer</strong> (verifiable validator consensus) and whose
          approved actions execute on <strong>testnet</strong>. This page is the
          quick reference + a demo script you can walk a team through.
        </p>
      </header>

      <section className="about-section">
        <h2>Live deployment</h2>
        <div className="kv-rows">
          <div className="kv-row">
            <span>GenLayer contract</span>
            <a className="mono" href={EXPLORER} target="_blank" rel="noreferrer">
              {CONTRACT}
            </a>
          </div>
          <div className="kv-row">
            <span>Network</span>
            <span className="mono">studionet</span>
          </div>
          <div className="kv-row">
            <span>Explorer</span>
            <a href="https://explorer-studio.genlayer.com" target="_blank" rel="noreferrer">
              explorer-studio.genlayer.com
            </a>
          </div>
          <div className="kv-row">
            <span>Source</span>
            <a href={REPO} target="_blank" rel="noreferrer">
              github.com/Starling-spell/ai-agent-kit
            </a>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>How a run works</h2>
        <ol className="doc-ol">
          <li>
            <strong>Connect a wallet</strong> — Rabby, MetaMask, Coinbase, any
            EIP-6963 / WalletConnect wallet.
          </li>
          <li>
            <strong>Authorize once</strong> — sign one message; Orion derives a
            per-user GenLayer signing key (so any wallet works, no MetaMask Snap
            required).
          </li>
          <li>
            <strong>Run the agent</strong> — each run submits a{" "}
            <span className="mono">decide()</span> transaction on GenLayer.
            Validators reach consensus and return a verdict: approve / reject,
            confidence, and reasoning.
          </li>
          <li>
            <strong>Act on testnet</strong> — if approved and the agent has an
            action, it sends a testnet transaction (your wallet, or the agent&apos;s
            own wallet in autonomous mode).
          </li>
          <li>
            <strong>Verify</strong> — every decision is on-chain; the activity log
            links each run to its GenLayer transaction on the explorer.
          </li>
        </ol>
      </section>

      <section className="about-section">
        <h2>Demo script (for a team walkthrough)</h2>
        <p>
          Use the <strong>Airdrop Screener</strong> template. It approves only
          genuine on-chain activity and rejects low-effort / off-topic input —
          which makes the AI&apos;s judgment easy to show live.
        </p>

        <div className="doc-step">
          <div className="doc-step-h">1 · A request it should REJECT</div>
          <pre className="doc-pre">create me a ranking for upcoming $base token</pre>
          <p className="doc-note">
            The agent holds — it&apos;s a content request, not on-chain activity to
            screen. You get a verdict like “✕ held · 95% · genlayer” with reasoning.
          </p>
        </div>

        <div className="doc-step">
          <div className="doc-step-h">2 · A request it should APPROVE</div>
          <pre className="doc-pre">
Wallet 0x9dDe... : 64 swaps over 9 months across Uniswap and Aerodrome,
bridged via CCTP twice, has held since 2023, ENS name set, no batched
or sybil-looking patterns. Meets the activity + longevity criteria.
          </pre>
          <p className="doc-note">
            The agent approves — genuine, sustained activity that meets the
            directive.
          </p>
        </div>

        <div className="doc-step">
          <div className="doc-step-h">3 · Show the proof</div>
          <p className="doc-note">
            After each run, click the <strong>GenLayer tx</strong> link in the
            activity log → it opens the transaction on the explorer. Talking point:
            <em>
              {" "}
              “The agent&apos;s verdict and reasoning are recorded on-chain — it&apos;s
              auditable, not a black box.”
            </em>
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>Configuration (environment)</h2>
        <div className="kv-rows">
          <div className="kv-row">
            <span className="mono">NEXT_PUBLIC_GENLAYER_CONTRACT / _CHAIN</span>
            <span>Per-user GenLayer signing (set = live)</span>
          </div>
          <div className="kv-row">
            <span className="mono">NEXT_PUBLIC_GENLAYER_EXPLORER</span>
            <span>Explorer for tx links</span>
          </div>
          <div className="kv-row">
            <span className="mono">AI_MODE / TX_MODE</span>
            <span>mock (default) · live (server signer / real testnet)</span>
          </div>
          <div className="kv-row">
            <span className="mono">KV_REST_API_* + SESSION_SECRET</span>
            <span>Cloud sync of agents (SIWE-gated)</span>
          </div>
          <div className="kv-row">
            <span className="mono">NEXT_PUBLIC_AGENT_ACTIONS</span>
            <span>On-chain AgentActions log (EVM testnet)</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>More</h2>
        <p>
          <Link href="/about">About &amp; mission</Link> ·{" "}
          <a href={REPO} target="_blank" rel="noreferrer">
            Source &amp; README
          </a>{" "}
          ·{" "}
          <a href={`${REPO}/blob/main/AUDIT.md`} target="_blank" rel="noreferrer">
            Security audit
          </a>{" "}
          ·{" "}
          <a href="https://docs.genlayer.com" target="_blank" rel="noreferrer">
            GenLayer docs
          </a>
        </p>
      </section>

      <section className="about-cta">
        <h2>Try it</h2>
        <p>Mock mode needs nothing; the live deployment is wired to GenLayer.</p>
        <Link href="/" className="btn-primary">
          Open the dashboard →
        </Link>
      </section>

      <footer className="about-foot">
        Orion · GenLayer-powered AI agents · testnet. Contract {CONTRACT} on studionet.
      </footer>
    </div>
  );
}
