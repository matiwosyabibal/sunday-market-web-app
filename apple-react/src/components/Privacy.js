import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">Updated</div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="mt-1 text-slate-600">Your privacy matters. This notice explains how we collect, use, and protect your data.</p>
        </header>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">1. Information We Collect</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Account details, contact information, and usage data to provide and improve our services.</p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">2. How We Use Information</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">To operate the marketplace, process orders, personalize content, and ensure safety.</p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">3. Sharing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">We share with service providers and as required by law. We do not sell personal data.</p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">4. Your Choices</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Access, update, or delete your data. Manage preferences in your account.</p>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">5. Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">privacy@sundaymarket.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
