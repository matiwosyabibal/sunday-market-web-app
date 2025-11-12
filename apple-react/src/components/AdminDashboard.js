import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [snapshotBusy, setSnapshotBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [snapshotUrl, setSnapshotUrl] = useState("");

  function absoluteUrl(u) {
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    const base = (API.defaults?.baseURL || "").replace(/\/?api\/?$/, "");
    return `${base}${u}`;
  }

  const handleLogout = () => {
    // Clear stored login data and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/admin/verification/pending");
        if (!alive) return;
        setPending(res.data.items || []);
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load pending verifications");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function refreshPending() {
    const res = await API.get("/admin/verification/pending");
    setPending(res.data.items || []);
  }

  async function openReview(item) {
    setSelected(item);
    setReviewNotes("");
    setSnapshotUrl("");
    setReviewOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setTimeout(() => { autoCaptureSnapshot(item); }, 600);
    } catch (e) {
      // camera optional; continue
    }
  }

  function closeReview() {
    const v = videoRef.current;
    const s = v && v.srcObject;
    if (s && typeof s.getTracks === "function") s.getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
    setReviewOpen(false);
    setSelected(null);
    setSnapshotUrl("");
  }

  async function autoCaptureSnapshot(item) {
    if (!videoRef.current) return;
    setSnapshotBusy(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement("canvas");
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("No image");
      const file = new File([blob], "admin_snapshot.jpg", { type: "image/jpeg" });
      const fd = new FormData();
      fd.append("image", file);
      const upload = await API.post("/upload/single", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = upload.data?.url;
      if (url) {
        await API.post(`/admin/verification/${item.userId}/snapshot`, { url });
        setSnapshotUrl(url);
      }
    } catch (_) {
    } finally {
      setSnapshotBusy(false);
    }
  }

  async function approve() {
    if (!selected) return;
    setActionBusy(true);
    try {
      await API.post(`/admin/verification/${selected.userId}/approve`, { reviewNotes });
      await refreshPending();
      closeReview();
    } catch (_) {
      setActionBusy(false);
    }
  }

  async function reject() {
    if (!selected) return;
    setActionBusy(true);
    try {
      await API.post(`/admin/verification/${selected.userId}/reject`, { reviewNotes });
      await refreshPending();
      closeReview();
    } catch (_) {
      setActionBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/40 via-rose-400/40 to-indigo-400/40" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow ring-1 ring-black/5">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10l1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l1-11Z" stroke="currentColor" strokeWidth="1.5" /><path d="M9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-600/20 transition hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Welcome, Admin 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Manage users, view system reports, and oversee operations from here.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 flex items-center gap-4 transition hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2a5 5 0 00-5 5v1H6a3 3 0 00-3 3v7a3 3 0 003 3h12a3 3 0 003-3v-7a3 3 0 00-3-3h-1V7a5 5 0 00-5-5zm3 6V7a3 3 0 10-6 0v1h6z"/></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-semibold text-slate-900">1,284</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 flex items-center gap-4 transition hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3 3h18v4H3V3zm0 6h18v12H3V9zm5 2v8h10v-8H8z"/></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Listings</p>
              <p className="text-2xl font-semibold text-slate-900">342</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 flex items-center gap-4 transition hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 21c-4.97 0-9-4.03-9-9S7.03 3 12 3s9 4.03 9 9-4.03 9-9 9zm-1-13v4l3 1"/></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Response</p>
              <p className="text-2xl font-semibold text-slate-900">1.2h</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 flex items-center gap-4 transition hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 8c-2.21 0-4 .9-4 2v1h8v-1c0-1.1-1.79-2-4-2z"/><path d="M6 12v5c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-5H6z"/></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Support Tickets</p>
              <p className="text-2xl font-semibold text-slate-900">27</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">User Growth</h3>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </div>
            <div className="h-56 grid place-items-center text-slate-400">
              <span>Chart Placeholder</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate("/manage-users")} className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 transition">
                <span>Manage Users</span>
                <span className="text-amber-600">→</span>
              </button>
              <button onClick={() => navigate("/admin/seller-verifications")} className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 transition">
                <span>Seller Verifications</span>
                <span className="text-amber-600">→</span>
              </button>
              <button onClick={() => navigate("/reports")} className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 transition">
                <span>View Reports</span>
                <span className="text-amber-600">→</span>
              </button>
              <button onClick={() => navigate("/settings")} className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-amber-50 hover:border-amber-200 transition">
                <span>System Settings</span>
                <span className="text-amber-600">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Action</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">User {i}</td>
                    <td className="px-6 py-4 text-slate-600">Updated listing</td>
                    <td className="px-6 py-4 text-slate-600">2025-10-30</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">Success</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Seller Verifications</h3>
            <button onClick={refreshPending} className="text-sm rounded-xl border border-slate-200 px-3 py-1.5 hover:bg-amber-50 hover:border-amber-200">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Seller</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Location</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Submitted</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-6 text-center text-slate-500">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={5} className="px-6 py-6 text-center text-rose-600">{error}</td></tr>
                ) : pending.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-6 text-center text-slate-500">No pending verifications</td></tr>
                ) : (
                  pending.map((p) => (
                    <tr key={String(p.userId)} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {p.profilePhotoUrl ? (<img src={absoluteUrl(p.profilePhotoUrl)} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-10 w-10 rounded bg-slate-100" />)}
                          <div>
                            <div className="font-medium text-slate-900">{p.fullName}</div>
                            <div className="text-slate-500 text-xs">{p.businessName || "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-700">{p.phone}</td>
                      <td className="px-6 py-3 text-slate-700">{p.city}, {p.country}</td>
                      <td className="px-6 py-3 text-slate-600">{p.verification?.submittedAt ? new Date(p.verification.submittedAt).toLocaleString() : "-"}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => openReview(p)} className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Review</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {reviewOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={closeReview} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                  <h3 className="text-lg font-semibold text-slate-900">Review Seller</h3>
                  <button onClick={closeReview} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Profile Photo</div>
                      {selected?.profilePhotoUrl ? (<img src={absoluteUrl(selected.profilePhotoUrl)} alt="" className="h-24 w-24 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-24 w-24 rounded bg-slate-100" />)}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Government ID</div>
                      {selected?.idDocumentUrl ? (<img src={absoluteUrl(selected.idDocumentUrl)} alt="" className="h-24 w-36 rounded object-cover ring-1 ring-slate-200" />) : (<div className="h-24 w-36 rounded bg-slate-100" />)}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Admin Snapshot</div>
                      {snapshotUrl ? (<img src={absoluteUrl(snapshotUrl)} alt="snapshot" className="h-24 w-36 rounded object-cover ring-1 ring-slate-200" />) : (
                        <div className="h-24 w-36 rounded bg-slate-50 grid place-items-center text-xs text-slate-500">{snapshotBusy ? "Capturing..." : "Waiting"}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Live Camera</div>
                      <video ref={videoRef} className="w-full rounded-lg ring-1 ring-slate-200" playsInline muted />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Seller Info</div>
                      <div className="text-sm text-slate-900">{selected?.fullName}</div>
                      <div className="text-xs text-slate-600">{selected?.phone}</div>
                      <div className="text-xs text-slate-600">{selected?.city}, {selected?.country}</div>
                      <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Notes (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={4} />
                      <div className="flex items-center gap-2">
                        <button disabled={actionBusy} onClick={approve} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">{actionBusy ? "Processing..." : "Approve"}</button>
                        <button disabled={actionBusy} onClick={reject} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">{actionBusy ? "Processing..." : "Reject"}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
