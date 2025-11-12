import React from "react";

export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">Updated</div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
          <p className="mt-1 text-slate-600">Please read these terms carefully before using Sunday Market.</p>
        </header>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              By accessing or using Sunday Market, you agree to be bound by these Terms. If you do not agree, please discontinue use.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">2. Accounts</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">3. Listings and Transactions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Sellers must provide accurate product information. Buyers should review listings and policies before purchase. We may suspend accounts for policy violations.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">4. Limitation of Liability</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              To the fullest extent permitted by law, Sunday Market is not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">5. Changes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              We may update these Terms from time to time. Continued use indicates acceptance of the updated Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
