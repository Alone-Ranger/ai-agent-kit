# GenLayer × Arc — AI Agent Kit

An AI-agent starter that splits responsibilities the way the two protocols are designed to be used:

- **GenLayer** is the **brain** — Intelligent Contracts (Python) reach AI-validator consensus on questions that need *judgment*: "does this deliverable meet the spec?"
- **Arc** is the **rails** — USDC escrow, settlement, and platform fees (the agentic-economy / App-Kit layer).
- **Vercel** hosts the **UI + orchestrator** that ties the two chains together.
- **Wallets are real** — connect Rabby, MetaMask, Coinbase Wallet, or any EIP-6963 / WalletConnect wallet (via `wagmi` + `viem`); the connected address is the job's client.

The flagship use case shipped here is **freelance escrow with AI adjudication**, but the structure (orchestrator + adapters + one Intelligent Contract) is reusable for bounties, insurance claims, content rewards, compliance gating, and more.

> **It runs out of the box in mock mode** — no chain credentials, no API keys. That means it deploys to Vercel immediately, and you can wire real GenLayer + Arc when ready.

---

## How it works

```
User → Vercel UI
        │
        ├─ POST /api/escrow/open   →  Arc: lock budget in USDC escrow
        ├─ POST /api/adjudicate    →  GenLayer: verdict (meets spec? + reasoning)
        └─ POST /api/settle        →  Arc: release to freelancer OR refund client (− fee)
```

The two chains never call each other directly. The Vercel orchestrator reads the GenLayer verdict and triggers the Arc settlement — it is the bridge.

### Project layout

```
app/
  page.tsx              # UI: create job → submit → adjudicate → settle
  api/
    health/route.ts     # reports mock vs live mode
    escrow/open/route.ts# Arc: fund escrow
    adjudicate/route.ts # GenLayer: verdict
    settle/route.ts     # Arc: release / refund
  providers.tsx         # wagmi + react-query providers (client)
components/
  Header.tsx            # brand + Connect Wallet button
  ConnectWallet.tsx     # wallet modal (Rabby / MetaMask / Coinbase / WalletConnect)
lib/
  wagmi.ts              # chains + connectors config
  genlayer.ts           # adjudicator adapter (mock heuristic + live genlayer-js)
  arc.ts                # settlement adapter (mock + live App-Kit stub)
  config.ts, types.ts
contracts/
  escrow_adjudicator.py # the GenLayer Intelligent Contract
tests/direct/           # fast in-memory contract tests
```

---

## Wallet connection

Built on **wagmi v2 + viem v2**. The connect modal auto-detects wallets:

- **Rabby, MetaMask, Brave** and other browser wallets via EIP-6963 discovery — no config.
- **Coinbase Wallet** (extension + mobile) — no config.
- **WalletConnect** (QR + mobile wallets) — only appears when you set a project id.

Everything works with **zero setup**. To enable WalletConnect, grab a free project id from [cloud.reown.com](https://cloud.reown.com) and set it (these vars are public — safe in the client bundle):

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Enables the WalletConnect option | _(off)_ |
| `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | Chain for the "switch network" button | `8453` (Base) |
| `NEXT_PUBLIC_APP_NAME` | Name shown in wallet prompts | `GenLayer x Arc Agent Kit` |

Supported chains are configured in [`lib/wagmi.ts`](lib/wagmi.ts) (Base, Arbitrum, Optimism, Polygon, mainnet + Base Sepolia / Sepolia testnets) — edit that list to taste.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Click **Load example**, create the job, paste a deliverable, and watch the escrow → adjudication → settlement flow. No setup required.

---

## Deploy to Vercel via GitHub

1. **Push to GitHub** (this folder is the repo root):

   ```bash
   git init
   git add .
   git commit -m "GenLayer + Arc agent kit"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. **Import on Vercel:** go to [vercel.com/new](https://vercel.com/new), pick the repo. Vercel auto-detects Next.js — no build settings needed. Click **Deploy**.

3. **(Optional) add env vars** in *Project → Settings → Environment Variables* (see below). With none set, it deploys in mock mode.

That's it — every push to `main` redeploys.

---

## Going live (real chains)

Mock mode is simulated. To use real protocols, set environment variables (copy `.env.example` → `.env.local` locally, or add them in Vercel):

| Variable | Purpose |
| --- | --- |
| `ADJUDICATOR_MODE=live` | Use GenLayer instead of the mock heuristic |
| `GENLAYER_CONTRACT_ADDRESS` | Deployed `EscrowAdjudicator` address |
| `GENLAYER_CHAIN` | `testnetAsimov` / `testnetBradbury` / `studionet` |
| `GENLAYER_PRIVATE_KEY` | Signer for adjudication txs *(use a KMS in prod)* |
| `SETTLEMENT_MODE=live` | Use Arc instead of mock settlement |
| `ARC_RPC_URL`, `ARC_USDC_ADDRESS`, `ARC_OPERATOR_PRIVATE_KEY` | Arc settlement |
| `PLATFORM_FEE_BPS` | Your fee on a successful release (250 = 2.5%) |

**Enable GenLayer:**
```bash
npm install genlayer-js
# deploy the contract (GenLayer CLI or the genlayer-dev Claude Code plugin):
#   claude /plugin marketplace add genlayerlabs/skills
# then set GENLAYER_CONTRACT_ADDRESS + ADJUDICATOR_MODE=live
```
The live adapter is already implemented in [`lib/genlayer.ts`](lib/genlayer.ts).

**Enable Arc:** implement the two stubs in [`lib/arc.ts`](lib/arc.ts) (`liveOpenEscrow`, `liveSettle`) with the Arc App Kit (`send()` / escrow). Then set `SETTLEMENT_MODE=live`.

---

## Production checklist (before real money)

- [ ] Replace raw private keys with a KMS / signer (Turnkey, Privy, AWS KMS).
- [ ] Make the settlement orchestrator **idempotent** — a verdict must never settle twice.
- [ ] Move any long-running waits off Vercel functions (use a queue + worker; Vercel functions time out).
- [ ] Persist jobs in a real store (Vercel KV / Postgres) instead of client state.
- [ ] Add auth and rate limiting on the API routes.
- [ ] Stay on testnet until audited.

---

## Test the contract

```bash
pip install genlayer-test     # or use the genlayer-dev plugin
pytest tests/direct/ -v
```

## License

MIT — use it as a starting point.
