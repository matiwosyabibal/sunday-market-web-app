import React, { useEffect, useMemo, useState } from "react";

export default function Reports() {
  const [range, setRange] = useState("30d");
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});

  function loadOrders() {
    try {
      const raw = localStorage.getItem("orders");
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  useEffect(() => {
    setOrders(loadOrders());
    function onStorage(e) {
      if (e && e.key && e.key !== "orders") return;
      setOrders(loadOrders());
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("orders_updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("orders_updated", onStorage);
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reviews");
      const obj = raw ? JSON.parse(raw) : {};
      setReviews(obj && typeof obj === "object" ? obj : {});
    } catch {
      setReviews({});
    }
  }, []);

  function inRange(date) {
    const d = new Date(date);
    const now = new Date();
    if (range === "7d") {
      const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      return d >= start && d <= now;
    }
    if (range === "30d") {
      const start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      return d >= start && d <= now;
    }
    if (range === "90d") {
      const start = new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000);
      return d >= start && d <= now;
    }
    if (range === "ytd") {
      const start = new Date(now.getFullYear(), 0, 1);
      return d >= start && d <= now;
    }
    return true;
  }

  const filtered = useMemo(() => {
    return (orders || []).filter((o) => inRange(o.placedAt || o.createdAt || Date.now()));
  }, [orders, range]);

  const delivered = useMemo(() => (filtered || []).filter((o) => String(o.status || "").toLowerCase() === "delivered"), [filtered]);

  const revenue = useMemo(() => delivered.reduce((s, o) => s + Number(o.total || 0), 0), [delivered]);
  const totalOrders = filtered.length;
  const avgOrder = totalOrders ? (revenue / Math.max(1, delivered.length)) : 0;
  const refundsPct = 0;

  const topProducts = useMemo(() => {
    const counts = {};
    (delivered || []).forEach((o) => (o.items || []).forEach((it) => { counts[it.name] = (counts[it.name] || 0) + (Number(it.qty) || 0); }));
    return Object.entries(counts)
      .map(([n, v]) => ({ n, v }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 4);
  }, [delivered]);

  const topSellers = useMemo(() => {
    const bySeller = {};
    (delivered || []).forEach((o) => {
      const seenInOrder = new Set();
      (o.items || []).forEach((it) => {
        const sellerId = it.sellerId || it.seller?.id || it.seller || it.brand || "unknown";
        const sellerName = it.sellerName || it.seller?.name || it.brand || "Unknown Seller";
        const key = String(sellerId);
        if (!bySeller[key]) {
          bySeller[key] = { name: sellerName, orders: 0, revenue: 0, ratings: [] };
        }
        const lineRevenue = (Number(it.price) || 0) * (Number(it.qty) || 0);
        bySeller[key].revenue += lineRevenue;
        if (!seenInOrder.has(key)) {
          bySeller[key].orders += 1;
          seenInOrder.add(key);
        }
        const pid = it._id || it.id;
        const list = pid && reviews && reviews[pid];
        if (Array.isArray(list) && list.length) {
          list.forEach((r) => { const rv = Number(r.rating); if (!Number.isNaN(rv)) bySeller[key].ratings.push(rv); });
        }
      });
    });
    const rows = Object.values(bySeller).map((s) => {
      const avg = s.ratings.length ? (s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length) : 0;
      return { name: s.name, orders: s.orders, revenue: s.revenue, rating: avg };
    });
    rows.sort((a, b) => b.revenue - a.revenue || b.orders - a.orders);
    return rows.slice(0, 10);
  }, [delivered, reviews]);

  function exportCSV() {
    const rows = [["Order ID","Status","Placed At","Items","Total"]];
    filtered.forEach((o) => {
      const items = (o.items || []).map((it) => `${it.name} x${it.qty}`).join("; ");
      rows.push([o.id || o._id || "", o.status || "", new Date(o.placedAt || o.createdAt || Date.now()).toISOString(), items, String(o.total || 0)]);
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${range}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow ring-1 ring-black/5">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3V3zm0 6h18v12H3V9zm5 2v8h10v-8H8z"/></svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="ytd">Year to date</option>
            </select>
            <button onClick={exportCSV} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-600/20 transition hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[{t:"Revenue",v:`ETB ${revenue.toLocaleString('en-ET')}`,s:""},{t:"Orders",v:totalOrders.toLocaleString(),s:""},{t:"Avg. Order",v:`ETB ${(avgOrder||0).toLocaleString('en-ET')}`,s:""},{t:"Refunds",v:`${refundsPct}%`,s:""}].map((k,i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm text-slate-500">{k.t}</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{k.v}</div>
              <div className="mt-1 text-xs text-emerald-600">{k.s}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Sales Trend</h2>
              <div className="text-xs text-slate-500">{range.toUpperCase()}</div>
            </div>
            <div className="h-72 grid place-items-center text-slate-400">Chart Placeholder</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Top Categories</h2>
            <div className="space-y-3">
              {(topProducts.length ? topProducts : [{n:"-",v:0}]).map((c,i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm">
                  <span className="font-medium text-slate-800">{c.n}</span>
                  <span className="text-slate-600">{c.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Top Sellers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Seller</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Orders</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Revenue (ETB)</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(topSellers.length ? topSellers : [{ name: "-", orders: 0, revenue: 0, rating: 0 }]).map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">{s.name}</td>
                    <td className="px-6 py-4 text-slate-600">{s.orders}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-900">ETB {s.revenue.toLocaleString('en-ET')}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">{(s.rating||0).toFixed(1)} ★</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
