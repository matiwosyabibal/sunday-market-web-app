import React, { useEffect, useMemo, useState } from "react";
import API from "../api";

function Modal({ open, onClose, title, children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  useEffect(() => {
    try {
      const cw = window.innerWidth || 0;
      const ch = window.innerHeight || 0;
      setPos({ x: cw / 2, y: ch / 2 });
    } catch {}
  }, [open]);
  useEffect(() => {
    function onMove(e) {
      if (!drag) return;
      setPos({ x: e.clientX - drag.dx, y: e.clientY - drag.dy });
    }
    function onUp() { setDrag(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag]);
  function onDown(e) {
    try {
      const el = document.getElementById("modal-panel");
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
      const dx = e.clientX - rect.left;
      const dy = e.clientY - rect.top;
      setDrag({ dx, dy });
    } catch {}
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 p-4">
        <div
          id="modal-panel"
          className="absolute w-full max-w-4xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
          style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
        >
          <div onMouseDown={onDown} className="flex items-center justify-between border-b border-slate-200 px-5 py-3 cursor-move select-none">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
          </div>
          <div className="p-5 max-h-[80vh] overflow-auto">{children}</div>
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

export default function CustomerDashboard({ preview = false }) {
  const [tab, setTab] = useState("browse");
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState([0, 5000]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ q: "", category: "", brand: "", price: [0, 5000] });

  const [cart, setCart] = useLocalStorage("cart", []);
  const [orders, setOrders] = useLocalStorage("orders", []);
  const [reviews, setReviews] = useLocalStorage("reviews", {});

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const [checkoutMethod, setCheckoutMethod] = useState("telebirr");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payerPhone, setPayerPhone] = useState("");

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  function isLoggedIn() {
    try {
      // Respect preview mode via prop or URL (?preview=1|true)
      if (preview) return false;
      const params = new URLSearchParams(window.location.search);
      const pv = (params.get("preview") || "").toLowerCase();
      if (pv === "1" || pv === "true") return false;
      const hasToken = !!localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return hasToken && role === "customer";
    } catch {
      return false;
    }
  }

  // Allow unauthenticated users to preview/browse without redirecting.
  // Actions like add to cart / checkout remain disabled until login.

  // Apply category from URL if provided (e.g., /customer?category=phones)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = (params.get("category") || "").trim();
      if (c) {
        setCategory(c);
        setActiveFilters((f) => ({ ...f, category: c }));
        setPage(1);
        setTab("browse");
      }
    } catch {}
    // run once on mount
  }, []);

  useEffect(() => {
    function onOrdersUpdated() {
      try {
        const raw = localStorage.getItem("orders");
        const list = raw ? JSON.parse(raw) : [];
        setOrders(list);
      } catch {}
    }
    window.addEventListener("orders_updated", onOrdersUpdated);
    window.addEventListener("storage", (e) => {
      if (e.key === "orders") onOrdersUpdated();
    });
    return () => {
      window.removeEventListener("orders_updated", onOrdersUpdated);
      window.removeEventListener("storage", onOrdersUpdated);
    };
  }, [setOrders]);

  function statusLabel(s) {
    if (s === "accepted") return "Your order is accepted";
    if (s === "out_for_delivery") return "Out for delivery";
    if (s === "delivered") return "Delivered";
    return "Processing";
  }

  function absoluteUrl(u) {
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    const base = (API.defaults?.baseURL || "").replace(/\/?api\/?$/, "");
    return `${base}${u}`;
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { q: aq, category: ac, brand: ab, price: ap } = activeFilters;
        const params = { q: aq, category: ac || undefined, brand: ab || undefined, page, limit: 12 };
        const res = await API.get("/products", { params });
        if (!alive) return;
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        const filtered = items.filter((p) => Number(p.price) >= (ap?.[0] ?? 0) && Number(p.price) <= (ap?.[1] ?? 999999));
        setProducts(filtered);
        setPages(res.data.pages || 1);
      } catch (e) {
        if (alive) showToast(e?.response?.data?.message || "Failed to load products", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [activeFilters, page]);

  function addToCart(p) {
    if (preview) { showToast("Open your account to add items to cart", "error"); return; }
    if (!isLoggedIn()) { showToast("Please login/register as a customer to add to cart", "error"); try { window.location.assign("/login"); } catch {} return; }
    setCart((prev) => {
      const idx = prev.findIndex((it) => it._id === p._id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = { ...cp[idx], qty: cp[idx].qty + 1 };
        return cp;
      }
      return [...prev, { ...p, qty: 1 }];
    });
    showToast("Added to cart");
  }

  const cartTotal = useMemo(() => cart.reduce((s, it) => s + Number(it.price) * it.qty, 0), [cart]);

  function openDetail(p) {
    setDetailItem(p);
    setDetailOpen(true);
  }

  function placeOrder() {
    if (preview) { showToast("Open your account to place an order", "error"); return; }
    if (!isLoggedIn()) {
      showToast("Please login/register as a customer to place an order", "error");
      try { window.location.assign("/login"); } catch {}
      return;
    }
    if (!cart.length) return showToast("Cart is empty", "error");
    if (!address.trim() || !phone.trim()) return showToast("Enter delivery address and phone", "error");
    if (checkoutMethod === "telebirr" && !/^\+?\d{9,15}$/.test(payerPhone.trim())) return showToast("Enter valid Telebirr phone number", "error");
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total: cartTotal,
      method: checkoutMethod,
      address: address.trim(),
      phone: phone.trim(),
      status: "processing",
      placedAt: new Date().toISOString(),
      timeline: [
        { t: Date.now(), label: "Order placed" },
        { t: Date.now() + 1000 * 60 * 60, label: "Packed" },
        { t: Date.now() + 1000 * 60 * 60 * 3, label: "Out for delivery" },
        { t: Date.now() + 1000 * 60 * 60 * 8, label: "Delivered" },
      ],
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setAddress("");
    setPhone("");

    try {
      const deliveryAssignmentsRaw = localStorage.getItem("delivery_assignments");
      const deliveryAssignments = deliveryAssignmentsRaw ? JSON.parse(deliveryAssignmentsRaw) : [];
      const assignment = {
        id: `A-${Date.now()}`,
        orderId: order.id,
        customer: { name: "Customer", phone: order.phone, address: order.address },
        items: order.items.map((it) => ({ name: it.name, qty: it.qty })),
        total: order.total,
        status: "pending",
        assignedAt: new Date().toISOString(),
        timeline: [],
      };
      const next = [assignment, ...deliveryAssignments];
      localStorage.setItem("delivery_assignments", JSON.stringify(next));
      try { window.dispatchEvent(new Event("delivery_assignments_updated")); } catch {}
    } catch {}

    setTab("orders");
    showToast("Order placed");
  }

  function payWithTelebirr() {
    if (preview) { showToast("Open your account to pay with Telebirr", "error"); return; }
    if (!isLoggedIn()) {
      showToast("Please login/register to place an order", "error");
      try { window.location.assign("/login"); } catch {}
      return;
    }
    // In a real integration, call backend to initiate Telebirr payment, then confirm.
    // For now, we mark order placed with method telebirr.
    // Keep method in state for audit and UI.
    // eslint-disable-next-line no-unused-expressions
    setCheckoutMethod && setCheckoutMethod("telebirr");
    placeOrder();
  }

  function submitReview(productId, rating, comment) {
    setReviews((prev) => {
      const list = prev[productId] || [];
      const next = { ...prev, [productId]: [{ rating, comment, date: new Date().toISOString() }, ...list] };
      return next;
    });
    showToast("Thanks for your feedback");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Dashboard</h1>
          <p className="text-sm text-slate-600">Discover electronics. Buy smart. Track easily.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("browse")} disabled={!isLoggedIn()} className={`rounded-lg px-3 py-2 text-sm font-medium border ${tab === "browse" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Browse</button>
          <button onClick={() => { if (preview || !isLoggedIn()) return; setTab("cart"); }} disabled={preview || !isLoggedIn()} className={`rounded-lg px-3 py-2 text-sm font-medium border ${tab === "cart" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Cart ({cart.length})</button>
          <button onClick={() => { if (preview || !isLoggedIn()) return; setTab("checkout"); }} disabled={preview || !isLoggedIn()} className={`rounded-lg px-3 py-2 text-sm font-medium border ${tab === "checkout" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Checkout</button>
          <button onClick={() => { if (preview || !isLoggedIn()) return; setTab("orders"); }} disabled={preview || !isLoggedIn()} className={`rounded-lg px-3 py-2 text-sm font-medium border ${tab === "orders" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Orders</button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {tab === "browse" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4 space-y-3">
                <input value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="Search products" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                <select value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="phones">Phones</option>
                  <option value="laptops">Laptops</option>
                  <option value="tvs">TVs</option>
                </select>
                <input value={brand} onChange={(e) => { setPage(1); setBrand(e.target.value); }} placeholder="Brand" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                <div>
                  <div className="text-xs text-slate-600 mb-1">Price range</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={price[0]} min={0} onChange={(e) => setPrice([Number(e.target.value), price[1]])} className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm" />
                    <span className="text-slate-500">-</span>
                    <input type="number" value={price[1]} min={0} onChange={(e) => setPrice([price[0], Number(e.target.value)])} className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm" />
                  </div>
                </div>
                <button onClick={() => { if (!isLoggedIn()) return; setActiveFilters({ q, category, brand, price }); setPage(1); }} disabled={!isLoggedIn()} className="w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600">Browse</button>
              </div>
              <div className="lg:col-span-5">
                {loading ? (
                  <div className="grid place-items-center h-40 text-slate-500">Loading...</div>
                ) : products.length === 0 ? (
                  <div className="grid place-items-center h-40 text-slate-500">No products found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((p) => (
                      <div key={p._id} className="group bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-3 hover:shadow-md transition">
                        {(p.images && p.images[0]?.url) || p.image ? (
                          <img src={absoluteUrl(((p.images && p.images[0]?.url) || p.image))} alt={p.name} className="h-36 w-full object-cover rounded-lg ring-1 ring-slate-200" />
                        ) : (
                          <div className="h-36 w-full rounded-lg bg-slate-100" />
                        )}
                        <div className="mt-3">
                          <div className="text-slate-900 font-medium truncate">{p.name}</div>
                          <div className="text-slate-600 text-sm">ETB {Number(p.price).toLocaleString('en-ET')}</div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => openDetail(p)} className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">View</button>
                          <button
                            onClick={() => addToCart(p)}
                            disabled={preview || !isLoggedIn()}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium text-white ${(!preview && isLoggedIn()) ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-400 cursor-not-allowed pointer-events-none"}`}
                          >
                            {(!preview && isLoggedIn()) ? "Add to Cart" : "Login to Add"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 text-sm">
                  <div className="text-slate-600">Page {page} / {pages}</div>
                  <div className="flex items-center gap-2">
                    <button disabled={!isLoggedIn() || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={`rounded-md px-3 py-1.5 ${page > 1 ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Prev</button>
                    <button disabled={!isLoggedIn() || page >= pages} onClick={() => setPage((p) => p + 1)} className={`rounded-md px-3 py-1.5 ${page < pages ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "cart" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200">
              <div className="divide-y divide-slate-200">
                {cart.length === 0 ? (
                  <div className="p-6 text-slate-500">Cart is empty</div>
                ) : cart.map((it, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {it.image ? (<img src={absoluteUrl(it.image)} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-10 w-10 rounded bg-slate-100" />)}
                      <div>
                        <div className="text-slate-900 font-medium">{it.name}</div>
                        <div className="text-slate-600 text-sm">ETB {Number(it.price).toLocaleString('en-ET')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} value={it.qty} onChange={(e) => {
                        const v = Math.max(1, Number(e.target.value) || 1);
                        setCart((prev) => prev.map((x, i) => i === idx ? { ...x, qty: v } : x));
                      }} className="w-16 rounded border border-slate-200 px-2 py-1 text-sm" />
                      <button onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <div className="text-slate-700">Total: <span className="font-semibold">ETB {cartTotal.toLocaleString('en-ET')}</span></div>
                <button onClick={() => setTab("checkout")} disabled={preview || cart.length === 0 || !isLoggedIn()} className={`rounded-md px-3 py-1.5 text-sm font-medium text-white ${(!preview && cart.length && isLoggedIn()) ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-400 cursor-not-allowed pointer-events-none"}`}>{(!preview && isLoggedIn()) ? "Proceed to Checkout" : "Login to Checkout"}</button>
              </div>
            </div>
          </div>
        )}

        {tab === "checkout" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5 space-y-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">Pay with Telebirr</div>
                  <p className="text-xs text-slate-600">Enter your Telebirr phone number to proceed with payment.</p>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Telebirr phone number" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
                    <button onClick={payWithTelebirr} disabled={preview || !isLoggedIn()} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${(!preview && isLoggedIn()) ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-400 cursor-not-allowed pointer-events-none"}`}>{(!preview && isLoggedIn()) ? "Pay with Telebirr" : "Login to Pay"}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5 space-y-3">
                <div className="text-sm text-slate-700">Order Summary</div>
                <div className="text-slate-600 text-sm">Items: {cart.length}</div>
                <div className="text-slate-600 text-sm">Total: <span className="font-semibold">ETB {cartTotal.toLocaleString('en-ET')}</span></div>
                <button onClick={payWithTelebirr} disabled={preview || !isLoggedIn()} className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white ${(!preview && isLoggedIn()) ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-400 cursor-not-allowed pointer-events-none"}`}>{(!preview && isLoggedIn()) ? "Pay with Telebirr" : "Login to Pay"}</button>
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 text-slate-500">No orders yet</div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-slate-800 font-medium">{o.id}</div>
                      <div className="text-xs inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200">{statusLabel(o.status)}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {o.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {it.image ? (<img src={(/^https?:\/\//i.test(it.image)) ? it.image : `${(API.defaults?.baseURL || "").replace(/\/?api\/?$/, "")} ${it.image}`.replace(/\s+/g, "")} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-10 w-10 rounded bg-slate-100" />)}
                            <div>
                              <div className="text-slate-900 text-sm">{it.name}</div>
                              <div className="text-slate-600 text-xs">x{it.qty} • ETB {Number(it.price).toLocaleString('en-ET')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select defaultValue={5} onChange={(e) => {}} className="rounded border border-slate-200 px-2 py-1 text-xs">
                              {[5,4,3,2,1].map((r) => (<option key={r} value={r}>{r}★</option>))}
                            </select>
                            <button onClick={() => {
                              const rating = 5;
                              const comment = "Great!";
                              submitReview(it._id, rating, comment);
                            }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">Quick Review</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-slate-600 mb-2">Delivery timeline</div>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {o.timeline.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-600" />
                            <div className="text-xs text-slate-600 whitespace-nowrap">{ev.label}</div>
                            {i < o.timeline.length - 1 && <div className="h-px w-10 bg-slate-300" />}
                          </div>
                        ))}
                      </div>
                    </div>
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

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={detailItem?.name || "Product"}>
        <div className="space-y-3">
          {(detailItem?.images && detailItem.images[0]?.url) || detailItem?.image ? (
            <img src={absoluteUrl(((detailItem?.images && detailItem.images[0]?.url) || detailItem?.image))} alt="" className="max-h-[80vh] w-full object-contain rounded-lg bg-black" />
          ) : (
            <div className="max-h-[80vh] w-full aspect-video rounded-lg bg-slate-100" />
          )}
          <div className="text-slate-700 text-sm whitespace-pre-wrap">{detailItem?.description || "No description"}</div>
          <div className="flex items-center justify-between">
            <div className="text-slate-900 font-semibold">ETB {Number(detailItem?.price || 0).toLocaleString('en-ET')}</div>
            <button onClick={() => { addToCart(detailItem); setDetailOpen(false); }} disabled={preview || !isLoggedIn()} className={`rounded-md px-4 py-2 text-sm font-medium text-white ${(!preview && isLoggedIn()) ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-400 cursor-not-allowed pointer-events-none"}`}>{(!preview && isLoggedIn()) ? "Add to Cart" : "Login to Add"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
