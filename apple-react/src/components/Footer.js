import React from "react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/40 via-rose-400/40 to-indigo-400/40" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_60%)] blur-xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.18),transparent_60%)] blur-2xl" />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow ring-1 ring-white/10">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7h10l1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l1-11Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-100">Sunday Market</span>
            </div>
            <p className="text-sm text-slate-400">Premium electronics at smart prices. Simple checkout. Fast delivery.</p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-100">Shop</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a className="transition-colors hover:text-white" href="/customer">Phones</a></li>
              <li><a className="transition-colors hover:text-white" href="/customer">Laptops</a></li>
              <li><a className="transition-colors hover:text-white" href="/customer">TVs</a></li>
              <li><a className="transition-colors hover:text-white" href="/customer">Accessories</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-100">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a className="transition-colors hover:text-white" href="/about">About Us</a></li>
              <li><a className="transition-colors hover:text-white" href="/contact">Contact</a></li>
              <li><a className="transition-colors hover:text-white" href="/seller">Sell with Us</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-100">Newsletter</div>
            <p className="mt-3 text-sm text-slate-400">Get weekly smart deals.</p>
            <div className="mt-3 flex items-center gap-2">
              <input type="email" placeholder="you@example.com" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-400" />
              <button className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-amber-600">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-3">
            <button aria-label="Facebook" type="button" className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 9H15V6h-1.5a3 3 0 00-3 3v1.5H9V12h1.5v6H12v-6h1.3L13.5 9z"/></svg>
            </button>
            <button aria-label="X" type="button" className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 6H15.7l-3.1 3.8L9.7 6H6.47l4.6 6.08L6 18h1.83l3.3-4.04L14.3 18h3.23l-4.86-6.37L17.53 6z"/></svg>
            </button>
            <button aria-label="Instagram" type="button" className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm6-1a1 1 0 110 2 1 1 0 010-2zM12 9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/></svg>
            </button>
            <button aria-label="LinkedIn" type="button" className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 6.5A1.94 1.94 0 114 4.56 1.94 1.94 0 016.94 6.5zM4.38 20h5.1V9.94h-5.1V20zM13.12 9.94h-4.4V20h4.4v-5.4c0-2.87 3.72-3.1 3.72 0V20h4.4v-6.78c0-5.6-6.33-5.4-8.12-2.64V9.94z"/></svg>
            </button>
            <button aria-label="YouTube" type="button" className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 7.5s-.23-1.62-.94-2.33c-.9-.94-1.9-.94-2.36-.99C17.8 4 12 4 12 4h0s-5.8 0-8.2.18c-.46.05-1.46.05-2.36.99C.73 5.88.5 7.5.5 7.5S.32 9.37.32 11.25v1.5C.32 14.63.5 16.5.5 16.5s.23 1.62.94 2.33c.9.94 2.08.91 2.61 1.01C5.5 20 12 20 12 20s5.8 0 8.2-.18c.46-.05 1.46-.05 2.36-.99.71-.71.94-2.33.94-2.33s.18-1.87.18-3.75v-1.5c0-1.88-.18-3.75-.18-3.75zM9.75 14.5v-5l5 2.5-5 2.5z"/></svg>
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <div>© {new Date().getFullYear()} Sunday Market. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="transition-colors hover:text-slate-200" href="/privacy">Privacy</a>
            <a className="transition-colors hover:text-slate-200" href="/terms">Terms</a>
            <a className="transition-colors hover:text-slate-200" href="/contact">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
