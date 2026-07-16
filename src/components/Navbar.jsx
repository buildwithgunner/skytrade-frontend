import React from 'react';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/70 px-8 py-4 backdrop-blur flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded bg-violet-700/25 shadow-[0_0_24px_rgba(168,85,247,.4)]">
          <span className="h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-violet-300 via-fuchsia-500 to-blue-500" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Skytrade</span>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-white/60">
        <a href="#" className="text-fuchsia-300">Dashboard</a>
        <a href="#" className="hover:text-white transition">Assets</a>
        <a href="#" className="hover:text-white transition">Transactions</a>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-white">
          ST
        </div>
      </div>
    </nav>
  );
}
