import React, { useState } from "react";

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [siteName, setSiteName] = useState("Sunday Market");
  const [theme, setTheme] = useState("system");
  const [maintenance, setMaintenance] = useState(false);
  const [emailFrom, setEmailFrom] = useState("no-reply@sundaymarket.com");

  async function handleSave() {
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    alert("Settings saved");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow ring-1 ring-black/5">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.96 7.96 0 00.1-2l2.1-1.6a1 1 0 00.2-1.4l-2-3.4a1 1 0 00-1.3-.4l-2.5 1a8.2 8.2 0 00-1.7-1l-.4-2.7A1 1 0 0012 0h-4a1 1 0 00-1 .8l-.4 2.7a8.2 8.2 0 00-1.7 1l-2.5-1a1 1 0 00-1.3.4l-2 3.4a1 1 0 00.2 1.4L2 11a7.96 7.96 0 000 2L.9 14.6a1 1 0 00-.2 1.4l2 3.4a1 1 0 001.3.4l2.5-1c.5.4 1.1.7 1.7 1l.4 2.7a1 1 0 001 .8h4a1 1 0 001-.8l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1a1 1 0 001.3-.4l2-3.4a1 1 0 00-.2-1.4L19.4 13zM10 16a4 4 0 110-8 4 4 0 010 8z"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">System Settings</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">General</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Site name</label>
                  <input value={siteName} onChange={(e)=>setSiteName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Theme</label>
                  <select value={theme} onChange={(e)=>setTheme(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Email From</label>
                  <input value={emailFrom} onChange={(e)=>setEmailFrom(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Maintenance mode</div>
                    <div className="text-xs text-slate-500">Temporarily take the site offline</div>
                  </div>
                  <button onClick={()=>setMaintenance(v=>!v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${maintenance ? "bg-emerald-500" : "bg-slate-300"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${maintenance ? "translate-x-5" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Security</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Two-factor authentication</div>
                    <div className="text-xs text-slate-500">Require admins to use 2FA</div>
                  </div>
                  <button className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700">Configure</button>
                </div>
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Password policy</div>
                    <div className="text-xs text-slate-500">Set minimum length and complexity</div>
                  </div>
                  <button className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700">Edit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Danger zone</h2>
              <p className="mt-2 text-sm text-slate-600">Actions that can impact the whole system.</p>
              <div className="mt-4 space-y-3">
                <button className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">Purge caches</button>
                <button className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100">Rotate API keys</button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Save changes</h2>
              <p className="mt-2 text-sm text-slate-600">Apply updates to your system configuration.</p>
              <div className="mt-4 flex items-center gap-3">
                <button disabled={saving} onClick={handleSave} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-600/20 transition hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700 disabled:opacity-60">{saving ? "Saving..." : "Save Settings"}</button>
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
