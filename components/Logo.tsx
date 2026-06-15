// Brand mark for GenLayer Agent Studio: a consensus ring (◑) — the filled half
// is the decision, the ring is the validators around it — in the indigo→teal
// gradient. Self-contained SVG, works on any background.

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="agsGrad"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b7cf0" />
          <stop offset="1" stopColor="#22a39a" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#agsGrad)" />
      <circle cx="20" cy="20" r="9" stroke="#fff" strokeWidth="2.6" />
      <path d="M20 11 A9 9 0 0 1 20 29 Z" fill="#fff" />
    </svg>
  );
}
