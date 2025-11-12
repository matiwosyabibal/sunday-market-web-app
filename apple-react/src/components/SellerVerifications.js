import React, { useEffect, useRef, useState } from "react";
import API from "../api";

export default function SellerVerifications() {
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
      // camera optional
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
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 p-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Seller Verifications</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Pending Reviews</h3>
            <button onClick={refreshPending} className="text-sm rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Refresh</button>
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
                        <button onClick={() => openReview(p)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">Review</button>
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
}
