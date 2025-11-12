import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const initialForm = { fullName: "", email: "", phone: "", password: "", role: "customer" };

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
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

export default function ManageUsers() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [addBusy, setAddBusy] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", fullName: "", email: "", phone: "", role: "customer" });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [delBusy, setDelBusy] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  function handleClosePage() {
    navigate("/AdminDashboard");
  }

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => page < pages, [page, pages]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await API.get("/users", { params: { q, page, limit } });
        if (!alive) return;
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      } catch (e) {
        showToast(e?.response?.data?.message || "Failed to load users", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [q, page, limit]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  async function reload(toPage = page) {
    const res = await API.get("/users", { params: { q, page: toPage, limit } });
    setItems(res.data.items || []);
    setTotal(res.data.total || 0);
    setPages(res.data.pages || 1);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAddBusy(true);
    try {
      const payload = {
        fullName: addForm.fullName.trim(),
        email: addForm.email.toLowerCase().trim(),
        phone: addForm.phone.trim(),
        password: addForm.password,
        role: addForm.role,
      };
      await API.post("/users", payload);
      setAddOpen(false);
      setAddForm(initialForm);
      setPage(1);
      await reload(1);
      showToast("User created");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to create user", "error");
    } finally {
      setAddBusy(false);
    }
  }

  async function openView(id) {
    try {
      const res = await API.get(`/users/${id}`);
      setViewUser(res.data);
      setViewOpen(true);
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to fetch user", "error");
    }
  }

  function openEdit(u) {
    setEditForm({ id: u._id, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role });
    setEditOpen(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    setEditBusy(true);
    try {
      const { id, ...rest } = editForm;
      const payload = {
        fullName: rest.fullName.trim(),
        email: rest.email.toLowerCase().trim(),
        phone: rest.phone.trim(),
        role: rest.role,
      };
      await API.put(`/users/${id}`, payload);
      setEditOpen(false);
      await reload();
      showToast("User updated");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to update user", "error");
    } finally {
      setEditBusy(false);
    }
  }

  function askDelete(u) {
    setConfirmId(u._id);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDelBusy(true);
    try {
      await API.delete(`/users/${confirmId}`);
      setConfirmOpen(false);
      setConfirmId(null);
      const prevPage = page;
      await reload();
      const hasItems = items.length > 1;
      if (!hasItems && prevPage > 1) {
        setPage(prevPage - 1);
      }
      showToast("User deleted");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setDelBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Users</h1>
            <p className="text-sm text-slate-600">Add, search, update, and delete user accounts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClosePage}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Close Page
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              Logout
            </button>
            <input
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              placeholder="Search by name, email, phone"
              className="w-64 max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button onClick={() => setAddOpen(true)} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Add User</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">UserID</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Full Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found</td>
                  </tr>
                ) : (
                  items.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-700">{u.userId ?? "-"}</td>
                      <td className="px-6 py-3 text-slate-900 font-medium">{u.fullName}</td>
                      <td className="px-6 py-3 text-slate-700">{u.email}</td>
                      <td className="px-6 py-3 text-slate-700">{u.phone}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">{u.role}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openView(u._id)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50">View</button>
                          <button onClick={() => openEdit(u)} className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">Edit</button>
                          <button onClick={() => askDelete(u)} className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
            <div className="text-slate-600">Total: {total}</div>
            <div className="flex items-center gap-2">
              <button disabled={!canPrev} onClick={() => setPage((p) => Math.max(p - 1, 1))} className={`rounded-md px-3 py-1.5 ${canPrev ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Prev</button>
              <span className="text-slate-600">Page {page} / {pages}</span>
              <button disabled={!canNext} onClick={() => setPage((p) => p + 1)} className={`rounded-md px-3 py-1.5 ${canNext ? "bg-white border border-slate-200 hover:bg-slate-50" : "bg-slate-100 text-slate-400"}`}>Next</button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add User">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Full name" value={addForm.fullName} onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })} required />
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Email" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required />
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Phone" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} required />
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Password" type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAddOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button disabled={addBusy} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{addBusy ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="User Details">
        {viewUser && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">UserID</span><span className="col-span-2">{viewUser.userId ?? "-"}</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Name</span><span className="col-span-2">{viewUser.fullName}</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Email</span><span className="col-span-2">{viewUser.email}</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Phone</span><span className="col-span-2">{viewUser.phone}</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Role</span><span className="col-span-2">{viewUser.role}</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Created</span><span className="col-span-2">{new Date(viewUser.createdAt).toLocaleString()}</span></div>
          </div>
        )}
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit User">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Full name" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
            <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button disabled={editBusy} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{editBusy ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-sm text-slate-700">Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirmOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button disabled={delBusy} onClick={handleDelete} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">{delBusy ? "Deleting..." : "Delete"}</button>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm shadow ${toast.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
