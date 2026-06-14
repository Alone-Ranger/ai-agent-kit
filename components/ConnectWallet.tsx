"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { chains, defaultChain } from "@/lib/wagmi";

function short(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const currentChain = chains.find((c) => c.id === chainId);

  // Dedupe discovered connectors by display name; relabel the generic one.
  const wallets = useMemo(() => {
    const seen = new Set<string>();
    const list: { connector: Connector; label: string; icon?: string }[] = [];
    for (const c of connectors) {
      let label = c.name;
      if (c.id === "injected" && /injected/i.test(c.name)) label = "Browser Wallet";
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      list.push({ connector: c, label, icon: (c as { icon?: string }).icon });
    }
    return list;
  }, [connectors]);

  // Avoid hydration mismatch: render a stable placeholder until mounted.
  if (!mounted) {
    return <button className="wallet-btn">Connect Wallet</button>;
  }

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        {!currentChain ? (
          <button
            className="wallet-btn warn"
            onClick={() => switchChain({ chainId: defaultChain.id })}
          >
            Wrong network · Switch
          </button>
        ) : (
          <span className="chip">{currentChain.name}</span>
        )}
        <span className="chip addr" title={address}>
          {short(address)}
        </span>
        <button className="wallet-btn ghost" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="wallet-btn" onClick={() => setOpen(true)}>
        Connect Wallet
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-head">
              <h3>Connect a wallet</h3>
              <button className="x" aria-label="Close" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <p className="modal-sub">
              Rabby, MetaMask, Coinbase Wallet and any EIP-6963 browser wallet
              are detected automatically.
            </p>

            <div className="wallet-list">
              {wallets.map(({ connector, label, icon }) => (
                <button
                  key={connector.uid}
                  className="wallet-row"
                  disabled={isPending}
                  onClick={() => {
                    connect({ connector });
                    setOpen(false);
                  }}
                >
                  {icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={icon} alt="" width={22} height={22} />
                  ) : (
                    <span className="wallet-emoji">👛</span>
                  )}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {error && <div className="error">{error.message}</div>}

            <p className="modal-foot">
              No wallet?{" "}
              <a href="https://rabby.io" target="_blank" rel="noreferrer">
                Rabby
              </a>{" "}
              ·{" "}
              <a href="https://metamask.io" target="_blank" rel="noreferrer">
                MetaMask
              </a>{" "}
              ·{" "}
              <a
                href="https://www.coinbase.com/wallet"
                target="_blank"
                rel="noreferrer"
              >
                Coinbase Wallet
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
