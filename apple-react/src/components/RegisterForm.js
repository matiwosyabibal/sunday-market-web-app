import React, { useState } from "react";
import axios from "axios";
import API from "../api";

const RegisterForm = () => {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const roleHint = params ? params.get("role") : null;
  const sellerOnly = roleHint === "seller";
  const [formData, setFormData] = useState(() => ({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: sellerOnly ? "seller" : "customer",
  }));

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage("User registered successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: sellerOnly ? "seller" : "customer",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-400/30 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-400/20 blur-2xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <form
              onSubmit={handleSubmit}
              className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl ring-1 ring-slate-200/70 w-full max-w-lg mx-auto"
            >
              <div className="mb-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">Welcome</div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>
                <p className="mt-1 text-sm text-slate-700">Join Sunday Market and start shopping or selling smart.</p>
              </div>

              <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXX"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={sellerOnly}
            >
              {sellerOnly ? (
                <option value="seller">Seller</option>
              ) : (
                <>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </>
              )}
            </select>
          </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 ring-1 ring-white/20 hover:from-amber-600 hover:to-orange-700 transition"
                >
                  Create account
                </button>

                {message && (
                  <p
                    className={`text-center mt-4 text-sm font-medium ${
                      message.includes("successfully")
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto max-w-lg">
              <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-90 shadow-2xl"></div>
              <div className="absolute inset-3 rounded-3xl bg-[url('https://images.unsplash.com/photo-1510557880182-3d4d3cba35f6?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center shadow-2xl ring-1 ring-black/5" />
            </div>
            <div className="mt-6 text-center md:text-left">
              <div className="text-2xl font-semibold tracking-tight text-slate-900">Sunday Market</div>
              <div className="text-sm text-slate-700">Premium electronics. Smart prices. Secure marketplace.</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RegisterForm;
