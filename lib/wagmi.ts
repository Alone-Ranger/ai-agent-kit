import { createConfig, http } from "wagmi";
import {
  mainnet,
  base,
  baseSepolia,
  arbitrum,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// ============================================================
//  wagmi configuration — the real wallet layer.
//  - injected() + EIP-6963 auto-discovery surfaces Rabby,
//    MetaMask, Brave and any other browser wallet.
//  - coinbaseWallet() adds Coinbase Wallet (extension + mobile).
//  - walletConnect() is added only when a project id is set, so
//    the app still builds and runs with zero configuration.
// ============================================================

const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "GenLayer × Arc Agent Kit";

export const chains = [
  base,
  baseSepolia,
  arbitrum,
  optimism,
  mainnet,
  polygon,
  sepolia,
] as const;

const defaultId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? base.id);
export const defaultChain =
  chains.find((c) => c.id === defaultId) ?? base;

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName }),
    ...(wcProjectId
      ? [walletConnect({ projectId: wcProjectId, showQrModal: true })]
      : []),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
});
