// Submits real decide() transactions to the deployed AgentRegistry on GenLayer
// studionet and prints the tx hashes + verdicts. Run: node scripts/demo-genlayer.mjs
import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const CONTRACT = "0xAb08f32E9080930d143Fdea825978154E3030A11";
const EXPLORER = "https://explorer-studio.genlayer.com";

const DIRECTIVE =
  "You screen airdrop eligibility. Approve only if the described on-chain " +
  "activity is genuine and meets the stated criteria. Reject obvious sybil " +
  "or low-effort cases.";

const SAMPLES = [
  {
    label: "GENUINE ACTIVITY (expect APPROVE)",
    input:
      "Wallet 0x9dDe: 64 verified swaps over 9 months across Uniswap and " +
      "Aerodrome, bridged via CCTP twice, holding since 2023, ENS set, no " +
      "batched or sybil patterns.",
  },
  {
    label: "OFF-TOPIC REQUEST (expect REJECT)",
    input: "create me a ranking for upcoming $base token",
  },
];

const account = createAccount();
const client = createClient({ chain: studionet, account });
console.log("Signer account:", account.address);
console.log("Contract:", CONTRACT, "\n");

for (const s of SAMPLES) {
  const runId = "demo-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);
  console.log("=".repeat(60));
  console.log(s.label);
  console.log("input:", s.input);
  try {
    const txHash = await client.writeContract({
      address: CONTRACT,
      functionName: "decide",
      args: ["agent-demo", runId, DIRECTIVE, s.input, "transfer"],
      value: 0n,
    });
    console.log("tx hash :", txHash);
    console.log("explorer:", `${EXPLORER}/tx/${txHash}`);

    // Poll the view method for the finalized verdict.
    let verdict = "";
    for (let i = 0; i < 40; i++) {
      verdict = await client.readContract({
        address: CONTRACT,
        functionName: "get_response",
        args: [runId],
      });
      if (verdict) break;
      await new Promise((r) => setTimeout(r, 3000));
    }
    console.log("verdict :", verdict || "(timed out waiting for finality)");
  } catch (e) {
    console.log("ERROR   :", e?.shortMessage || e?.message || String(e));
  }
  console.log("");
}
