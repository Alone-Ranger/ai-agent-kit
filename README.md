# GenLayer Agent Studio

Build, customize, and manage **AI agents** from an elegant dashboard. Each agent's decisions are powered by **GenLayer** (AI-validator consensus, not a single opaque API call), and when an agent approves an action it **executes on a testnet** through your connected wallet.

- **Create agents** from templates (treasury controller, moderator, airdrop screener, analyst, support…) or from scratch — you write the directive, GenLayer reasons with it.
- **Run them** against any input; see the decision, confidence, and reasoning.
- **Act on-chain** — approved actions send a real **testnet** transaction (Base Sepolia & friends) signed by your wallet. No key custody, testnet only.
- **Manage** everything from a dashboard: status, activity, per-agent transaction history.

> **Runs out of the box in mock mode** — no chain credentials, no API keys, no wallet required to explore. It deploys to Vercel immediately; flip to live when ready.

---

## How it works

```
You ─ Dashboard (Vercel)
       │  create / edit agent (directive + template + testnet)
       ▼
   Run agent ──▶ POST /api/agents/respond ──▶ GenLayer: decide (approve? + action + reasoning)
       │                                         (mock heuristic by default)
       ▼  if approved & action != none
   Execute ──▶ connected wallet sends a TESTNET tx  (live)
           └─▶ POST /api/agents/execute simulates it (mock, default)
```

GenLayer decides; your wallet executes. The agent's on-chain authority is bounded by an **allowlisted action** that is re-checked on-chain (see the audit).

### Project layout

```
app/
  page.tsx                  # the dashboard (overview · agents · detail)
  providers.tsx             # wagmi + react-query
  api/
    health/route.ts         # mock vs live mode
    agents/respond/route.ts # GenLayer decision
    agents/execute/route.ts # mock testnet executor (live runs in the wallet)
components/
  Sidebar · Topbar · ConnectWallet
  agent-ui (cards/stats) · CreateAgentModal · AgentDetail (run panel + activity)
lib/
  genlayer.ts   # agent AI adapter (mock heuristic + live genlayer-js)
  templates.ts  # starter agent templates
  agents-store.ts # localStorage persistence (swap for KV/DB in prod)
  wagmi.ts · chains.ts · config.ts · types.ts
contracts/
  agent_registry.py         # the GenLayer Intelligent Contract
tests/direct/               # fast in-memory contract tests
AUDIT.md                    # security audit of the contract
```

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Click **+ New agent**, pick a template, **Run** it. No wallet or keys needed in mock mode.

---

## Deploy to Vercel via GitHub

Push the repo (root must contain `package.json`), then import at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected, no build settings, no env vars required for the first deploy. Every push to `main` redeploys.

---

## Going live

Mock mode is simulated. Set environment variables (copy `.env.example` → `.env.local`, or add in Vercel):

| Variable | Purpose | Default |
| --- | --- | --- |
| `AI_MODE=live` | Use GenLayer for decisions instead of the mock heuristic | `mock` |
| `GENLAYER_CONTRACT_ADDRESS` | Deployed `AgentRegistry` address | — |
| `GENLAYER_CHAIN` / `GENLAYER_PRIVATE_KEY` | GenLayer chain + signer (use a KMS in prod) | — |
| `TX_MODE=live` | Send **real testnet** transactions from the connected wallet | `mock` |
| `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | Default testnet | `84532` (Base Sepolia) |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Enables the WalletConnect option (free at reown.com) | off |

**GenLayer:** `npm install genlayer-js`, deploy `contracts/agent_registry.py` (GenLayer CLI / the `genlayer-dev` plugin), set the address + `AI_MODE=live`. The live adapter is already implemented in [`lib/genlayer.ts`](lib/genlayer.ts).

**Testnet execution:** set `TX_MODE=live`, connect a wallet, and fund it from a testnet faucet. Approved actions send a 0-value, memo-tagged self-transaction on the agent's chain — swap this for your real contract call in [`components/AgentDetail.tsx`](components/AgentDetail.tsx).

---

## The contract + audit

[`contracts/agent_registry.py`](contracts/agent_registry.py) is the on-chain brain: owners register agents, anyone can ask an agent to `decide`, and AI validators reach consensus on approve/reject + action. Security properties (prompt-injection fencing, on-chain action allowlist, write-once results, owner-gated mutations, clamped fields) are reviewed in **[AUDIT.md](AUDIT.md)** — 9 findings, 4 resolved + 1 mitigated, with open hardening recommendations. **Testnet only until an external re-audit.**

```bash
pip install genlayer-test
pytest tests/direct/ -v
```

## Security model
- **No private-key custody.** Live transactions are signed by the user's wallet. Testnet only for now.
- **Bounded authority.** An agent can only trigger its single configured action; the contract coerces anything else to `none`.
- **Prompt-injection aware.** The directive is authoritative; user input is fenced and treated as untrusted data, on-chain and in the mock adapter.

## License
MIT.
