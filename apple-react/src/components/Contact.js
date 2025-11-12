import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("Thanks! We received your message and will get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 selection:bg-amber-100 selection:text-amber-900">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Contact Us</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-600">We'd love to hear from you. Send us a message and our team will respond as soon as possible.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-10">
        {/* Info + Form */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Info card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h2 className="text-xl font-semibold">Get in touch</h2>
            <p className="mt-2 text-white/80 text-sm">Reach us via email or phone, or use the form to drop a message.</p>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 ring-1 ring-white/10">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <a href="mailto:support@sunday.market" className="text-white/90 hover:text-white underline-offset-2 hover:underline">support@sunday.market</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 ring-1 ring-white/10">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <a href="tel:+251900000000" className="text-white/90 hover:text-white underline-offset-2 hover:underline">+251 900 000 000</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 ring-1 ring-white/10">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C7 2 2 6 2 12c0 4 3 7 6 8v-3l2-2-2-2 2-2-2-2 2-2 2 2 2-2 2 2-2 2 2 2-2 2 2 2v3c3-1 6-4 6-8 0-6-5-10-10-10z"/></svg>
                </div>
                <div>
                  <div className="font-medium">Hours</div>
                  <div className="text-white/90">Mon–Sun: 9:00–20:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="lg:col-span-2 rounded-3xl bg-white/80 backdrop-blur p-8 ring-1 ring-slate-200/60 shadow-lg">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your name" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} type="text" placeholder="What can we help with?" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Write your message..." className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400" required />
              </div>
              {status && (
                <div className="sm:col-span-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">{status}</div>
              )}
              <div className="sm:col-span-2">
                <button type="submit" className="inline-flex items-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 ring-1 ring-amber-600/20 transition hover:-translate-y-0.5 hover:bg-amber-600">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Map / Location */}
        <section className="rounded-3xl bg-white/80 backdrop-blur p-4 ring-1 ring-slate-200/60 shadow-lg">
          <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-2 ring-1 ring-slate-200">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps?q=Addis%20Ababa&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
