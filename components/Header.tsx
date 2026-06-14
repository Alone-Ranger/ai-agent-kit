"use client";

import { ConnectWallet } from "./ConnectWallet";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/">
          <span className="brand-mark">◑</span>
          <span>
            GenLayer <span className="brand-x">×</span> Arc
          </span>
        </a>
        <ConnectWallet />
      </div>
    </header>
  );
}
