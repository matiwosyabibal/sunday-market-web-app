import React from "react";

export default function Support() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">We’re here to help</div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Support</h1>
          <p className="mt-1 text-slate-600">Find quick answers or contact us for assistance.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-3 text-sm">
              <details className="rounded-xl border border-slate-200 p-4 open:bg-slate-50">
                <summary className="cursor-pointer font-medium text-slate-800">How do I track my order?</summary>
                <p className="mt-2 text-slate-700">Go to your Account → Orders and select an order to see status updates.</p>
              </details>
              <details className="rounded-xl border border-slate-200 p-4 open:bg-slate-50">
                <summary className="cursor-pointer font-medium text-slate-800">How do I become a seller?</summary>
                <p className="mt-2 text-slate-700">Register, go to Seller Dashboard → Account, and complete verification.</p>
              </details>
              <details className="rounded-xl border border-slate-200 p-4 open:bg-slate-50">
                <summary className="cursor-pointer font-medium text-slate-800">How do I request a refund?</summary>
                <p className="mt-2 text-slate-700">Contact the seller from your order details page or reach support.</p>
              </details>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Contact us</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-slate-700">Email</span>
                <a href="mailto:support@sundaymarket.com" className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Send email</a>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-slate-700">Phone</span>
                <a href="tel:+251000000000" className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Call</a>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-slate-700">Business hours</div>
                <div className="text-slate-500">Mon–Fri, 9:00–17:00 (EAT)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
