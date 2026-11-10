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
        <a href="https://wa.me/15753862748" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-400 transition" title="Chat with admin on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M20.52 3.48A11.93 11.93 0 0012 .5C5.53.5.5 5.53.5 12c0 2.12.55 4.14 1.52 5.9L0 24l6.33-1.65c1.68.92 3.59 1.45 5.67 1.45h.02c6.47 0 11.5-5.03 11.5-11.5 0-3.06-1.22-5.84-3.2-7.82zM12 22c-1.93 0-3.78-.51-5.38-1.38l-.38-.22-3.76 1 1-3.68-.24-.39A9.98 9.98 0 012 12c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.5-7.5c-.29-.14-1.71-.84-1.97-.94-.26-.09-.45-.14-.64.14-.19.29-.73.94-.89 1.13-.16.19-.33.21-.62.07-.29-.14-1.23-.44-2.34-1.39-.87-.78-1.46-1.74-1.63-2.03-.16-.29-.02-.45.12-.59.13-.13.29-.33.44-.5.14-.16.19-.29.29-.48.09-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.46-.48-.64-.48-.17 0-.36-.02-.55-.02-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44s1.02 2.84 1.16 3.04c.14.19 2 3.06 4.84 4.29.68.29 1.2.46 1.61.59.68.22 1.3.19 1.79.12.55-.08 1.71-.7 1.95-1.38.23-.68.23-1.26.16-1.38-.07-.12-.26-.19-.55-.33z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-white">
          ST
        </div>
      </div>
    </nav>
  );
}
