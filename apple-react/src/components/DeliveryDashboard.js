import React, { useEffect, useMemo, useState } from "react";
import API from "../api";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function DeliveryDashboard() {
  const [tab, setTab] = useState("assignments");
  const [toast, setToast] = useState(null);

  const [assignments, setAssignments] = useLocalStorage("delivery_assignments", []);
  const [active, setActive] = useLocalStorage("delivery_active", null);
  const [history, setHistory] = useLocalStorage("delivery_history", []);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactOrder, setContactOrder] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    function refreshAssignments() {
      try {
        const raw = localStorage.getItem("delivery_assignments");
        const list = raw ? JSON.parse(raw) : [];
        setAssignments(list);
      } catch {}
    }
    window.addEventListener("delivery_assignments_updated", refreshAssignments);
    window.addEventListener("storage", (e) => {
      if (e.key === "delivery_assignments") refreshAssignments();
    });
    return () => {
      window.removeEventListener("delivery_assignments_updated", refreshAssignments);
      window.removeEventListener("storage", refreshAssignments);
    };
  }, [setAssignments]);

  function updateCustomerOrderStatus(orderId, status, timelineLabel) {
    try {
      const raw = localStorage.getItem("orders");
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((o) => o.id === orderId);
      if (idx >= 0) {
        const o = list[idx];
        const timeline = Array.isArray(o.timeline) ? [...o.timeline] : [];
        if (timelineLabel) timeline.push({ t: Date.now(), label: timelineLabel });
        list[idx] = { ...o, status, timeline };
        localStorage.setItem("orders", JSON.stringify(list));
        try { window.dispatchEvent(new Event("orders_updated")); } catch {}
      }
    } catch {}
  }

  const canStart = useMemo(() => !!active && (active.status === "accepted" || active.status === "issue_reported"), [active]);
  const canDeliver = useMemo(() => !!active && active.status === "out_for_delivery", [active]);

  function seedAssignments() {
    try {
      if (active) return showToast("An active delivery is in progress");
      const ordersRaw = localStorage.getItem("orders");
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      const existing = new Set(assignments.map((a) => a.orderId));
      const toAssign = orders
        .filter((o) => o && o.id && !existing.has(o.id) && (o.status === "processing" || o.status === "accepted"))
        .map((o) => ({
          id: `A-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
          orderId: o.id,
          customer: { name: "Customer", phone: o.phone, address: o.address },
          items: (o.items||[]).map((it) => ({ name: it.name, qty: it.qty })),
          total: o.total, // Note: This is just an assignment, no currency symbol needed
          status: "pending",
          assignedAt: new Date().toISOString(),
        }));
      if (toAssign.length === 0) return showToast("No new assignments found");
      const next = [...toAssign, ...assignments];
      setAssignments(next);
      localStorage.setItem("delivery_assignments", JSON.stringify(next));
      try { window.dispatchEvent(new Event("delivery_assignments_updated")); } catch {}
      showToast(`${toAssign.length} assignment(s) loaded`);
    } catch {
      showToast("Failed to load assignments", "error");
    }
  }

  function acceptAssignment(a) {
    if (active) {
      setAssignments((prev) => prev.map((x) => x.id === a.id ? { ...x, status: "accepted", timeline: [ ...(x.timeline||[]), { t: Date.now(), label: "Accepted" } ] } : x));
      try {
        const raw = localStorage.getItem("delivery_assignments");
        const list = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((x) => x.id === a.id);
        if (idx >= 0) {
          const x = list[idx];
          const tl = Array.isArray(x.timeline) ? [...x.timeline] : [];
          tl.push({ t: Date.now(), label: "Accepted" });
          list[idx] = { ...x, status: "accepted", timeline: tl };
          localStorage.setItem("delivery_assignments", JSON.stringify(list));
          try { window.dispatchEvent(new Event("delivery_assignments_updated")); } catch {}
        }
      } catch {}
      updateCustomerOrderStatus(a.orderId, "accepted", "Order accepted");
      showToast("Assignment accepted (queued)");
      return;
    }
    setActive({ ...a, status: "accepted", timeline: [ { t: Date.now(), label: "Accepted" } ] });
    updateCustomerOrderStatus(a.orderId, "accepted", "Order accepted");
    setAssignments((prev) => prev.filter((x) => x.id !== a.id));
    try {
      const raw = localStorage.getItem("delivery_assignments");
      const list = raw ? JSON.parse(raw) : [];
      const next = list.filter((x) => x.id !== a.id);
      localStorage.setItem("delivery_assignments", JSON.stringify(next));
      try { window.dispatchEvent(new Event("delivery_assignments_updated")); } catch {}
    } catch {}
    showToast("Assignment accepted");
    setTab("active");
  }

  function startDelivery() {
    if (!canStart || !active || !(active.status === "accepted" || active.status === "issue_reported")) return;
    setActive((prev) => ({ ...prev, status: "out_for_delivery", timeline: [ ...(prev.timeline||[]), { t: Date.now(), label: "Out for delivery" } ] }));
    updateCustomerOrderStatus(active.orderId, "out_for_delivery", "Out for delivery");
    showToast("Started delivery");
  }

  function markDelivered() {
    if (!canDeliver || !active || active.status !== "out_for_delivery") return;
    const delivered = { ...active, status: "delivered", deliveredAt: new Date().toISOString(), timeline: [ ...(active.timeline||[]), { t: Date.now(), label: "Delivered" } ] };
    setHistory((prev) => [ delivered, ...prev ]);
    setActive(null);
    updateCustomerOrderStatus(delivered.orderId, "delivered", "Delivered");
    showToast("Delivery completed");
    setTab("history");
  }

  function reportIssue(note) {
    if (!active) return;
    setActive((prev) => ({ ...prev, status: "issue_reported", issue: note, timeline: [ ...(prev.timeline||[]), { t: Date.now(), label: "Issue Reported" } ] }));
    showToast("Issue reported");
  }

  function openContact(o) {
    setContactOrder(o);
    setContactOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <header className="relative bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/40 via-rose-400/40 to-indigo-400/40" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow ring-1 ring-black/5">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h1l3 9h11l2-6H7"/><path d="M16 17a2 2 0 110 4 2 2 0 010-4zm-8 0a2 2 0 110 4 2 2 0 010-4z"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Delivery Dashboard</h1>
              <p className="text-sm text-slate-600">Receive assignments, update status, and complete deliveries.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab("assignments")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "assignments" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Assignments</button>
            <button onClick={() => setTab("active")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "active" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Active</button>
            <button onClick={() => setTab("history")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "history" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>History</button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {tab === "assignments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Available Assignments</h2>
              <button onClick={seedAssignments} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-sm font-semibold text-white shadow ring-1 ring-amber-600/20 hover:from-amber-600 hover:to-orange-700">Fetch Assignments</button>
            </div>
            {assignments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 text-slate-500">No assignments yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {assignments.map((a) => (
                  <div key={a.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-3 transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">{a.orderId}</div>
                      <span className="text-xs inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200">{a.status}</span>
                    </div>
                    <div className="text-sm text-slate-700">
                      <div>Customer: {a.customer?.name}</div>
                      <div>Phone: {a.customer?.phone}</div>
                      <div>Address: {a.customer?.address}</div>
                    </div>
                    <div className="text-sm text-slate-600">Items: {a.items.map((it) => `${it.name} x${it.qty}`).join(", ")}</div>
                    <div className="text-sm text-slate-600">Total: ETB {Number(a.total || 0).toLocaleString('en-ET')}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => acceptAssignment(a)} disabled={a.status !== "pending"} className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${(a.status === "pending") ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-400"}`}>Accept</button>
                      <button onClick={() => openContact(a)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-amber-50 hover:border-amber-200">Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "active" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Delivery</h2>
            {!active ? (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 text-slate-500">No active delivery</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-900 font-medium">{active.orderId}</div>
                    <div className="text-slate-600 text-sm">{active.customer?.name} • {active.customer?.phone}</div>
                    <div className="text-slate-600 text-sm">{active.customer?.address}</div>
                  </div>
                  <span className="text-xs inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200 capitalize">{active.status.replaceAll("_"," ")}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(active.status === "accepted" || active.status === "issue_reported") && (
                    <button onClick={startDelivery} disabled={!canStart} aria-disabled={!canStart} className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${canStart ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-400 cursor-not-allowed"}`}>Start Delivery</button>
                  )}
                  {active.status === "out_for_delivery" && (
                    <button onClick={markDelivered} disabled={!canDeliver} aria-disabled={!canDeliver} className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${canDeliver ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-400 cursor-not-allowed"}`}>Mark Delivered</button>
                  )}
                  <button onClick={() => openContact(active)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-amber-50 hover:border-amber-200">Contact Customer</button>
                  <button onClick={() => reportIssue("Customer not available")} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">Report Issue</button>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-slate-500 grid place-items-center h-40">
                  Map placeholder (dropoff area)
                </div>

                <div>
                  <div className="text-sm text-slate-700 mb-2">Timeline</div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {(active.timeline||[]).map((ev, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-600" />
                        <div className="text-xs text-slate-600 whitespace-nowrap">{ev.label}</div>
                        {i < (active.timeline||[]).length - 1 && <div className="h-px w-10 bg-slate-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Completed Deliveries</h2>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 text-slate-500">No deliveries completed yet</div>
            ) : (
              <div className="space-y-3">
                {history.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-slate-800 font-medium">{o.orderId}</div>
                      <div className="text-xs inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">Delivered</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{o.customer?.name} • {o.customer?.phone} • {o.customer?.address}</div>
                    <div className="text-xs text-slate-500 mt-1">Items: {o.items.map((it) => `${it.name} x${it.qty}`).join(", ")} • ETB {Number(o.total || 0).toLocaleString('en-ET')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white ${toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"}`}>{toast.message}</div>
      )}

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Contact Customer">
        {contactOrder ? (
          <div className="space-y-3 text-sm text-slate-700">
            <div><span className="font-medium">Name:</span> {contactOrder.customer?.name}</div>
            <div><span className="font-medium">Phone:</span> {contactOrder.customer?.phone}</div>
            <div><span className="font-medium">Address:</span> {contactOrder.customer?.address}</div>
            <div className="flex items-center gap-2 pt-1">
              <a href={`tel:${contactOrder.customer?.phone || ""}`} className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Call</a>
              <button onClick={() => { try { navigator.clipboard.writeText(contactOrder.customer?.phone || ""); showToast("Phone copied"); } catch {} }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-amber-50 hover:border-amber-200">Copy Number</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
