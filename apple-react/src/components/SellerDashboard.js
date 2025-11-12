import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const initialProduct = { name: "", description: "", price: "", image: "", stock: "", category: "electronics", brand: "" };

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

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [products, setProducts] = useState([]);
  const [pLoading, setPLoading] = useState(false);
  const [pQ, setPQ] = useState("");
  const [pPage, setPPage] = useState(1);
  const [pPages, setPPages] = useState(1);
  const [pTotal, setPTotal] = useState(0);
  const [pLimit] = useState(10);

  const canPrev = useMemo(() => pPage > 1, [pPage]);
  const canNext = useMemo(() => pPage < pPages, [pPage, pPages]);

  const [addOpen, setAddOpen] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [addForm, setAddForm] = useState(initialProduct);

  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", ...initialProduct });

  const [orders, setOrders] = useState([]);
  const [oLoading, setOLoading] = useState(false);
  const [oQ, setOQ] = useState("");
  const [oStatus, setOStatus] = useState("");
  const [oFrom, setOFrom] = useState("");
  const [oTo, setOTo] = useState("");
  const [oSort, setOSort] = useState("date_desc");

  const [analytics, setAnalytics] = useState({ totalSales: 0, totalOrders: 0, revenue: 0, topProduct: "-" });
  const [aLoading, setALoading] = useState(false);
  const [aRange, setARange] = useState("last_30");

  const [sellerStatus, setSellerStatus] = useState({ registered: false, verified: false });
  const [profileForm, setProfileForm] = useState({ fullName: "", businessName: "", phone: "", address: "", city: "", country: "", idNumber: "", bankAccount: "" });
  const [profileBusy, setProfileBusy] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifStatus, setVerifStatus] = useState({ status: "none", profilePhotoUrl: null, idDocumentUrl: null, selfieUrl: null });
  const [selfieOpen, setSelfieOpen] = useState(false);
  const [selfieBusy, setSelfieBusy] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  function isLoggedIn() {
    try {
      const hasToken = !!localStorage.getItem("token") || !!localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      return hasToken && role === "seller";
    } catch {
      return false;
    }
  }

  function absoluteUrl(u) {
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    const base = (API.defaults?.baseURL || "").replace(/\/?api\/?$/, "");
    return `${base}${u}`;
  }

  function formatDate(v) {
    if (!v) return "-";
    try { return new Date(v).toLocaleString(); } catch { return String(v); }
  }

  function statusText(s) {
    if (s === "pending") return "Pending";
    if (s === "ready_for_delivery") return "Ready";
    if (s === "out_for_delivery") return "Out for delivery";
    if (s === "delivered") return "Delivered";
    if (s === "cancelled") return "Cancelled";
    return s || "-";
  }

  function statusStyles(s) {
    if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-200";
    if (s === "ready_for_delivery") return "bg-sky-50 text-sky-700 ring-sky-200";
    if (s === "out_for_delivery") return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    if (s === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (s === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  function filteredAndSortedOrders(items, opts) {
    const q = (opts?.q || "").toLowerCase().trim();
    const sort = opts?.sort || "date_desc";
    const status = opts?.status || "";
    const from = opts?.from ? new Date(opts.from) : null;
    const to = opts?.to ? new Date(opts.to) : null;
    let list = Array.isArray(items) ? [...items] : [];
    if (status) list = list.filter((o) => (o.status || "").toLowerCase() === status.toLowerCase());
    if (from) list = list.filter((o) => new Date(o.createdAt || o.placedAt || 0) >= from);
    if (to) list = list.filter((o) => new Date(o.createdAt || o.placedAt || 0) <= to);
    if (q) {
      list = list.filter((o) => {
        const id = String(o.orderNumber || o._id || "").toLowerCase();
        const name = String(o.customer?.name || "").toLowerCase();
        return id.includes(q) || name.includes(q);
      });
    }
    list.sort((a, b) => {
      if (sort === "date_asc") return new Date(a.createdAt || a.placedAt || 0) - new Date(b.createdAt || b.placedAt || 0);
      if (sort === "total_desc") return Number(b.total || 0) - Number(a.total || 0);
      if (sort === "total_asc") return Number(a.total || 0) - Number(b.total || 0);
      return new Date(b.createdAt || b.placedAt || 0) - new Date(a.createdAt || a.placedAt || 0);
    });
    return list;
  }

  function mapLocalOrdersToSellerOrders() {
    try {
      const raw = localStorage.getItem("orders");
      const list = raw ? JSON.parse(raw) : [];
      return (Array.isArray(list) ? list : []).map((o) => {
        const st = String(o.status || "processing");
        const status = st === "processing" ? "pending" : (st === "accepted" ? "ready_for_delivery" : st);
        return {
          _id: o.id,
          orderNumber: o.id,
          customer: { name: "Customer" },
          items: (o.items || []).map((it) => ({ name: it.name, qty: it.qty })),
          total: o.total,
          status,
          createdAt: o.placedAt || o.createdAt || new Date().toISOString(),
        };
      });
    } catch {
      return [];
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  useEffect(() => {
    if (tab !== "products") return;
    if (!isLoggedIn()) { setProducts([]); setPTotal(0); setPPages(1); return; }
    let alive = true;
    (async () => {
      setPLoading(true);
      try {
        const res = await API.get("/products", { params: { q: pQ, page: pPage, limit: pLimit, own: true } });
        if (!alive) return;
        setProducts(res.data.items || []);
        setPTotal(res.data.total || 0);
        setPPages(res.data.pages || 1);
      } catch (e) {
        showToast(e?.response?.data?.message || "Failed to load products", "error");
      } finally {
        if (alive) setPLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tab, pQ, pPage, pLimit]);

  async function reloadProducts(toPage = pPage) {
    setPLoading(true);
    const pLimit = 10;
    const qParam = (pQ || "").trim() || undefined;
    const res = await API.get("/products", { params: { q: qParam, page: toPage, limit: pLimit, own: true } });
    setProducts(res.data.items || []);
    setPTotal(res.data.total || 0);
    setPPages(res.data.pages || 1);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setAddBusy(true);
    try {
      if (!isLoggedIn()) { showToast("Please login/register first", "error"); try { window.location.assign("/login"); } catch {} return; }
      const payload = { name: addForm.name.trim(), description: addForm.description.trim(), price: Number(addForm.price), image: addForm.image.trim(), stock: Number(addForm.stock), category: (addForm.category || "electronics"), brand: (addForm.brand || "").trim() };
      await API.post("/products", payload);
      setAddOpen(false);
      setAddForm(initialProduct);
      setPPage(1);
      await reloadProducts(1);
      showToast("Product added");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to add product", "error");
    } finally {
      setAddBusy(false);
    }
  }

  function openEditProduct(p) {
    const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.url : undefined;
    setEditForm({ id: p._id, name: p.name, description: p.description, price: p.price, image: firstImage || p.image || "", stock: p.stock, category: p.category || "electronics", brand: p.brand || "" });
    setEditOpen(true);
  }

  async function handleEditProduct(e) {
    e.preventDefault();
    setEditBusy(true);
    try {
      if (!isLoggedIn()) { showToast("Please login/register first", "error"); try { window.location.assign("/login"); } catch {} return; }
      const { id, ...rest } = editForm;
      const payload = { name: rest.name.trim(), description: rest.description.trim(), price: Number(rest.price), image: rest.image.trim(), stock: Number(rest.stock), category: (rest.category || "electronics"), brand: (rest.brand || "").trim() };
      await API.put(`/products/${id}`, payload);
      setEditOpen(false);
      await reloadProducts();
      showToast("Product updated");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to update product", "error");
    } finally {
      setEditBusy(false);
    }
  }

  async function handleAddImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setAddForm((f) => ({ ...f, image: url }));
      showToast("Image uploaded");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to upload image", "error");
    }
  }

  async function handleEditImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setEditForm((f) => ({ ...f, image: url }));
      showToast("Image uploaded");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to upload image", "error");
    }
  }

  async function askDeleteProduct(p) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${p._id}`);
      await reloadProducts();
      showToast("Product deleted");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to delete product", "error");
    }
  }

  useEffect(() => {
    if (tab !== "orders") return;
    if (!isLoggedIn()) { setOrders([]); return; }
    let alive = true;
    (async () => {
      setOLoading(true);
      try {
        const params = {};
        if (oStatus) params.status = oStatus;
        if (oFrom) params.from = oFrom;
        if (oTo) params.to = oTo;
        const res = await API.get("/seller/orders", { params });
        if (!alive) return;
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        setOrders(items);
      } catch (e) {
        const items = mapLocalOrdersToSellerOrders();
        setOrders(items);
        if (!items.length) {
          showToast(e?.response?.data?.message || "Failed to load orders", "error");
        }
      } finally {
        if (alive) setOLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tab, oStatus, oFrom, oTo]);

  async function markReady(orderId) {
    if (!isLoggedIn()) { showToast("Please login/register as a seller first", "error"); try { window.location.assign("/login"); } catch {} return; }
    try {
      await API.post(`/seller/orders/${orderId}/ready`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: "ready_for_delivery" } : o)));
      showToast("Marked ready for delivery");
    } catch (e) {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: "ready_for_delivery" } : o)));
      try {
        const raw = localStorage.getItem("orders");
        const list = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((x) => x.id === orderId);
        if (idx >= 0) {
          const st = String(list[idx].status || "processing");
          const nextStatus = st === "processing" ? "accepted" : list[idx].status;
          const tl = Array.isArray(list[idx].timeline) ? [...list[idx].timeline] : [];
          tl.push({ t: Date.now(), label: "Seller marked ready" });
          list[idx] = { ...list[idx], status: nextStatus, timeline: tl };
          localStorage.setItem("orders", JSON.stringify(list));
          try { window.dispatchEvent(new Event("orders_updated")); } catch {}
        }
      } catch {}
      showToast("Marked ready (offline)");
    }
  }

  useEffect(() => {
    if (tab !== "analytics") return;
    if (!isLoggedIn()) { setAnalytics({ totalSales: 0, totalOrders: 0, revenue: 0, topProduct: "-" }); return; }
    let alive = true;
    (async () => {
      setALoading(true);
      try {
        const res = await API.get("/seller/analytics", { params: { range: aRange } });
        if (!alive) return;
        setAnalytics({ totalSales: res.data.totalSales ?? 0, totalOrders: res.data.totalOrders ?? 0, revenue: res.data.revenue ?? 0, topProduct: res.data.topProduct ?? "-" });
      } catch (e) {
        try {
          const raw = localStorage.getItem("orders");
          const list = raw ? JSON.parse(raw) : [];
          const range = computeRange(aRange);
          const inRange = (Array.isArray(list) ? list : []).filter((o) => {
            const d = new Date(o.placedAt || o.createdAt || 0);
            return (!range.start || d >= range.start) && (!range.end || d <= range.end);
          });
          const delivered = inRange.filter((o) => o.status === "delivered");
          const totalOrders = inRange.length;
          const revenue = delivered.reduce((s, o) => s + Number(o.total || 0), 0);
          const counts = {};
          delivered.forEach((o) => (o.items || []).forEach((it) => { counts[it.name] = (counts[it.name] || 0) + (Number(it.qty) || 0); }));
          let topProduct = "-";
          let max = 0;
          Object.entries(counts).forEach(([k, v]) => { if (v > max) { max = v; topProduct = k; } });
          setAnalytics({ totalSales: Object.values(counts).reduce((a, b) => a + b, 0), totalOrders, revenue, topProduct });
        } catch {
          showToast(e?.response?.data?.message || "Failed to load analytics", "error");
        }
      } finally {
        if (alive) setALoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tab, aRange]);

  function computeRange(range) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === "today") return { start: startOfDay, end: null };
    if (range === "last_7") return { start: new Date(now.getTime() - 6*24*60*60*1000), end: null };
    if (range === "last_30") return { start: new Date(now.getTime() - 29*24*60*60*1000), end: null };
    if (range === "this_month") return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: null };
    if (range === "this_year") return { start: new Date(now.getFullYear(), 0, 1), end: null };
    return { start: null, end: null };
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const params = userId ? { params: { userId } } : undefined;
        const res = await API.get("/seller/account", params);
        if (!alive) return;
        const hasProfile = !!res.data.profile || !!res.data.registered;
        if (res.data.profile) {
          const p = res.data.profile;
          setProfileForm({ fullName: p.fullName || "", businessName: p.businessName || "", phone: p.phone || "", address: p.address || "", city: p.city || "", country: p.country || "", idNumber: p.idNumber || "", bankAccount: p.bankAccount || "" });
        }
        setSellerStatus({ registered: hasProfile, verified: !!res.data.verified });
        try {
          const sres = await API.get("/seller/verification/status", params);
          setVerifStatus((prev) => ({ ...prev, ...sres.data }));
        } catch (_) {}
      } catch (_) {}
    })();
    return () => { alive = false; };
  }, [userId]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileBusy(true);
    try {
      if (!userId) {
        showToast("Missing user session. Please log in again.", "error");
        return;
      }
      const payload = { fullName: profileForm.fullName.trim(), businessName: profileForm.businessName.trim(), phone: profileForm.phone.trim(), address: profileForm.address.trim(), city: profileForm.city.trim(), country: profileForm.country.trim(), idNumber: profileForm.idNumber.trim(), bankAccount: profileForm.bankAccount.trim(), userId };
      const res = await API.post("/seller/account", payload);
      setSellerStatus((s) => ({ ...s, registered: true, verified: s.verified }));
      showToast(res.data?.message || "Information saved");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to save information", "error");
    } finally {
      setProfileBusy(false);
    }
  }

  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("image", file);
    const res = await API.post("/upload/single", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data?.url;
  }

  async function handleUploadProfilePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      await API.post("/seller/verification/profile-photo", { url, userId });
      setVerifStatus((s) => ({ ...s, profilePhotoUrl: url }));
      showToast("Profile photo uploaded");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to upload photo", "error");
    }
  }

  async function handleUploadIdDoc(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      await API.post("/seller/verification/id-document", { url, userId });
      setVerifStatus((s) => ({ ...s, idDocumentUrl: url }));
      showToast("ID document uploaded");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to upload document", "error");
    }
  }

  async function handleUploadSelfie(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      await API.post("/seller/verification/selfie", { url, userId });
      setVerifStatus((s) => ({ ...s, selfieUrl: url }));
      showToast("Selfie uploaded");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to upload selfie", "error");
    }
  }

  async function openSelfie() {
    try {
      setSelfieOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      setSelfieOpen(false);
      showToast("Camera access failed. Check permissions.", "error");
    }
  }

  function closeSelfie() {
    const v = videoRef.current;
    const s = v && v.srcObject;
    if (s && typeof s.getTracks === "function") {
      s.getTracks().forEach((t) => t.stop());
    }
    if (v) v.srcObject = null;
    setSelfieOpen(false);
  }

  async function captureSelfie() {
    if (!videoRef.current) return;
    setSelfieBusy(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement("canvas");
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);
      await new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          try {
            if (!blob) return reject(new Error("No image"));
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            const url = await uploadImage(file);
            await API.post("/seller/verification/selfie", { url, userId });
            setVerifStatus((s) => ({ ...s, selfieUrl: url }));
            resolve();
          } catch (err) {
            reject(err);
          }
        }, "image/jpeg", 0.9);
      });
      showToast("Selfie captured");
      closeSelfie();
    } catch (e) {
      showToast("Failed to capture selfie", "error");
    } finally {
      setSelfieBusy(false);
    }
  }

  async function handleSubmitVerification() {
    setVerifyBusy(true);
    try {
      if (!sellerStatus.registered) {
        showToast("Save your personal information first", "error");
        return;
      }
      if (!verifStatus.profilePhotoUrl || !verifStatus.idDocumentUrl) {
        showToast("Upload profile photo and ID document first", "error");
        return;
      }
      await API.post("/seller/verification/submit", { userId });
      setVerifStatus((s) => ({ ...s, status: "under_review" }));
      showToast("Submitted for verification");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to submit verification", "error");
    } finally {
      setVerifyBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <header className="relative bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/40 via-rose-400/40 to-indigo-400/40" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow ring-1 ring-black/5">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10l1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l1-11Z"/><path d="M9 7a3 3 0 1 1 6 0"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Seller Dashboard</h1>
              <p className="text-sm text-slate-600">Sell electronics: computers, phones, tablets, earphones, and more.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab("products")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "products" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Products</button>
            <button onClick={() => setTab("orders")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "orders" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Orders</button>
            <button onClick={() => setTab("analytics")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "analytics" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Analytics</button>
            <button onClick={() => setTab("account")} className={`rounded-xl px-3 py-2 text-sm font-medium border ${tab === "account" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200"}`}>Account</button>
            <button onClick={handleLogout} className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {!isLoggedIn() ? (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Seller Dashboard</h2>
              <p className="text-slate-600 text-sm">You must be registered and logged in as a seller to access products, orders, or analytics.</p>
              <div className="flex items-center gap-2">
                <a href="/login" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Login</a>
                <a href="/register?role=seller" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50">Create Account</a>
              </div>
            </div>
          </div>
        ) : (
        <>
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                <p className="text-sm text-slate-600">Manage electronics listings with images, price (in ETB), and stock.</p>
              </div>
              <div className="flex items-center gap-2">
                <input value={pQ} onChange={(e) => { setPPage(1); setPQ(e.target.value); }} placeholder="Search products" className="w-64 max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/60" />
                <button onClick={() => { if (!isLoggedIn()) { showToast("Please login/register first", "error"); try { window.location.assign("/login"); } catch {} return; } setAddOpen(true); }} disabled={!sellerStatus.verified || !isLoggedIn()} className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${(sellerStatus.verified && isLoggedIn()) ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-400 cursor-not-allowed"}`}>{(!isLoggedIn()) ? "Login to Add" : (sellerStatus.verified ? "Add Product" : "Verify to Add")}</button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Image</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Category</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Brand</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Price</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Stock</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {pLoading ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No products found</td></tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50">
                          <td className="px-6 py-3">{(Array.isArray(p.images) && p.images[0]?.url) || p.image ? (
                            <img src={absoluteUrl((Array.isArray(p.images) && p.images[0]?.url) || p.image)} alt={p.name} className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-slate-100" />
                          )}</td>
                          <td className="px-6 py-3 text-slate-900 font-medium">{p.name}</td>
                          <td className="px-6 py-3 text-slate-700 capitalize">{(p.category || "-")}</td>
                          <td className="px-6 py-3 text-slate-700">{p.brand || "-"}</td>
                          <td className="px-6 py-3 text-slate-700">ETB {Number(p.price).toLocaleString('en-ET')}</td>
                          <td className="px-6 py-3 text-slate-700">{p.stock}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditProduct(p)} className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">Edit</button>
                              <button onClick={() => askDeleteProduct(p)} className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
                <div className="text-slate-600">Total: {pTotal}</div>
                <div className="flex items-center gap-2">
                  <button disabled={!canPrev} onClick={() => setPPage((p) => Math.max(p - 1, 1))} className={`rounded-md px-3 py-1.5 ${canPrev ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Prev</button>
                  <span className="text-slate-600">Page {pPage} / {pPages}</span>
                  <button disabled={!canNext} onClick={() => setPPage((p) => p + 1)} className={`rounded-md px-3 py-1.5 ${canNext ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Next</button>
                </div>
              </div>
            </div>

            <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Product">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">ETB</span>
                    <input className="rounded-lg border border-slate-200 px-3 py-2 pl-10 text-sm" placeholder="Price" type="number" step="0.01" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} required />
                  </div>
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Stock qty" type="number" value={addForm.stock} onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })} required />
                  <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm capitalize" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}>
                    <option value="electronics">Electronics</option>
                    <option value="phones">Phones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tvs">TVs</option>
                  </select>
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Brand (optional)" value={addForm.brand} onChange={(e) => setAddForm({ ...addForm, brand: e.target.value })} />
                  <textarea className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" rows={3} value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  {addForm.image ? (<img src={absoluteUrl(addForm.image)} alt="preview" className="h-12 w-12 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-12 w-12 rounded bg-slate-100" />)}
                  <label className="inline-block cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleAddImageFile} />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setAddOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
                  <button disabled={addBusy} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">{addBusy ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </Modal>

            <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Product">
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">ETB</span>
                    <input className="rounded-lg border border-slate-200 px-3 py-2 pl-10 text-sm" placeholder="Price" type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
                  </div>
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image URL" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Stock qty" type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} required />
                  <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm capitalize" value={editForm.category || "electronics"} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                    <option value="electronics">Electronics</option>
                    <option value="phones">Phones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tvs">TVs</option>
                  </select>
                  <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Brand (optional)" value={editForm.brand || ""} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} />
                  <textarea className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  {editForm.image ? (<img src={absoluteUrl(editForm.image)} alt="preview" className="h-12 w-12 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-12 w-12 rounded bg-slate-100" />)}
                  <label className="inline-block cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50" required>
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleEditImageFile} />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
                  <button disabled={editBusy} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">{editBusy ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </Modal>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Customer Orders</h2>
                <p className="text-sm text-slate-600">Filter, sort, and update order readiness.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <input value={oQ} onChange={(e) => setOQ(e.target.value)} placeholder="Search by ID or customer" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                <select value={oStatus} onChange={(e) => setOStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="ready_for_delivery">Ready</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input type="date" value={oFrom} onChange={(e) => setOFrom(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                <input type="date" value={oTo} onChange={(e) => setOTo(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                <select value={oSort} onChange={(e) => setOSort(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm col-span-2 md:col-span-1 focus:outline-none focus:ring-2 focus:ring-amber-400/60">
                  <option value="date_desc">Newest</option>
                  <option value="date_asc">Oldest</option>
                  <option value="total_desc">Highest total</option>
                  <option value="total_asc">Lowest total</option>
                </select>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Order</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Customer</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Items</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Total</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Placed</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {oLoading ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                    ) : filteredAndSortedOrders(orders, { q: oQ, sort: oSort, status: oStatus, from: oFrom, to: oTo }).length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No orders found</td></tr>
                    ) : (
                      filteredAndSortedOrders(orders, { q: oQ, sort: oSort, status: oStatus, from: oFrom, to: oTo }).map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50">
                          <td className="px-6 py-3 text-slate-800">{o.orderNumber || o._id}</td>
                          <td className="px-6 py-3 text-slate-700">{o.customer?.name || "-"}</td>
                          <td className="px-6 py-3 text-slate-700">{Array.isArray(o.items) ? o.items.map((it) => `${it.name} x${it.qty}`).join(", ") : "-"}</td>
                          <td className="px-6 py-3 text-slate-900 font-medium">ETB {Number(o.total || 0).toLocaleString('en-ET')}</td>
                          <td className="px-6 py-3 text-slate-600">{formatDate(o.createdAt || o.placedAt)}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles(o.status)}`}>{statusText(o.status)}</span>
                          </td>
                          <td className="px-6 py-3">{o.status === "pending" ? (
                            <button onClick={() => markReady(o._id)} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">Mark Ready</button>
                          ) : (
                            <span className="text-slate-500 text-xs">No actions</span>
                          )}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Analytics</h2>
                <p className="text-sm text-slate-300">Track performance across key metrics.</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={aRange} onChange={(e) => setARange(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900 text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60">
                  <option value="today">Today</option>
                  <option value="last_7">Last 7 days</option>
                  <option value="last_30">Last 30 days</option>
                  <option value="this_month">This month</option>
                  <option value="this_year">This year</option>
                </select>
                <button onClick={() => setARange(aRange)} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-slate-200 hover:border-amber-500 hover:bg-zinc-800">Refresh</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800">
                <p className="text-sm text-slate-400">Total Sales</p>
                <p className="text-2xl font-semibold text-white">{analytics.totalSales}</p>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800">
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-2xl font-semibold text-white">{analytics.totalOrders}</p>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800">
                <p className="text-sm text-slate-400">Revenue</p>
                <p className="text-2xl font-semibold text-white">ETB {Number(analytics.revenue).toLocaleString('en-ET')}</p>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800">
                <p className="text-sm text-slate-400">Avg. Order Value</p>
                <p className="text-2xl font-semibold text-white">ETB {(Number(analytics.totalOrders) ? (Number(analytics.revenue)/Number(analytics.totalOrders)) : 0).toLocaleString('en-ET', {maximumFractionDigits: 2})}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800 lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Sales Trend</h3>
                  <span className="text-xs text-slate-400">{aRange.replace("_"," ").toUpperCase()}</span>
                </div>
                <div className="h-64 grid place-items-center text-slate-500">Chart Placeholder</div>
              </div>
              <div className="rounded-2xl bg-zinc-900 p-6 shadow ring-1 ring-zinc-800">
                <h3 className="text-white font-semibold mb-3">Highlights</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Top Product</span>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-amber-400 ring-1 ring-amber-500/20">{analytics.topProduct}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Orders</span>
                    <span className="text-slate-200">{analytics.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Revenue</span>
                    <span className="text-slate-200">ETB {Number(analytics.revenue).toLocaleString('en-ET')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "account" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Seller Personal Information</h2>
            <p className="text-sm text-slate-600">Provide your details to register as a seller. Fields marked with * are required.</p>
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Full name *" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} required />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Business name" value={profileForm.businessName} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Phone *" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} required />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Address *" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} required />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="City *" value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} required />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Country *" value={profileForm.country} onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} required />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="ID Number" value={profileForm.idNumber} onChange={(e) => setProfileForm({ ...profileForm, idNumber: e.target.value })} />
                <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" placeholder="Bank Account" value={profileForm.bankAccount} onChange={(e) => setProfileForm({ ...profileForm, bankAccount: e.target.value })} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <span>Status:</span>
                  <span className={`font-medium ${sellerStatus.registered ? "text-emerald-600" : "text-amber-600"}`}>{sellerStatus.registered ? "Registered" : "Not registered"}</span>
                  <span>• Verification:</span>
                  {verifStatus.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Verified</span>
                  ) : verifStatus.status === "under_review" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">Under review</span>
                  ) : verifStatus.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200">Rejected</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">Not verified</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {verifStatus.profilePhotoUrl ? (
                    <img src={verifStatus.profilePhotoUrl} alt="profile" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-slate-100" />
                  )}
                  <label className="inline-block cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-amber-50 hover:border-amber-200">
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadProfilePhoto} />
                  </label>
                  <button disabled={profileBusy} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">{profileBusy ? "Saving..." : "Save Information"}</button>
                </div>
              </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-slate-700">Government ID</div>
                  {verifStatus.idDocumentUrl ? (
                    <img src={verifStatus.idDocumentUrl} alt="id" className="h-24 w-24 rounded object-cover ring-1 ring-slate-200" />
                  ) : (
                    <div className="h-24 w-24 rounded bg-slate-100" />
                  )}
                  <label className="inline-block cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                    Upload ID
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadIdDoc} />
                  </label>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-slate-700">Selfie (optional)</div>
                  {verifStatus.selfieUrl ? (
                    <img src={verifStatus.selfieUrl} alt="selfie" className="h-24 w-24 rounded object-cover ring-1 ring-slate-200" />
                  ) : (
                    <div className="h-24 w-24 rounded bg-slate-100" />
                  )}
                  <button onClick={openSelfie} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">Capture Selfie</button>
                </div>
              </div>
              <div>
                <button onClick={handleSubmitVerification} disabled={verifyBusy || verifStatus.status === "under_review" || verifStatus.status === "verified"} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${verifyBusy || verifStatus.status === "under_review" || verifStatus.status === "verified" ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                  {verifyBusy ? "Submitting..." : verifStatus.status === "verified" ? "Verified" : verifStatus.status === "under_review" ? "Under Review" : "Verify Account"}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      {toast && (
        <div className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm shadow ${toast.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <Modal open={selfieOpen} onClose={closeSelfie} title="Capture Selfie">
        <div className="space-y-4">
          <video ref={videoRef} className="w-full rounded-lg bg-black/5" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex justify-end gap-2">
            <button onClick={closeSelfie} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button onClick={captureSelfie} disabled={selfieBusy} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">{selfieBusy ? "Capturing..." : "Capture & Upload"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
