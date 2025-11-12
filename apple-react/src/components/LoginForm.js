import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/users/login", {
        email: String(formData.email).toLowerCase().trim(),
        password: formData.password,
      });


      setMessage("Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      if (res.data.user) {
        const uid = res.data.user._id || res.data.user.id;
        if (uid) localStorage.setItem("userId", uid);
      }

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "admin") navigate("/AdminDashboard");
      else if (role === "seller") navigate("/seller");
      else if (role === "delivery") navigate("/delivery");
      else navigate("/customer");
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      setMessage(backendMsg || "Login failed!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-fuchsia-400/20 blur-2xl" />
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/90 backdrop-blur p-8 sm:p-10 rounded-3xl shadow-2xl ring-1 ring-slate-200/70"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg ring-1 ring-black/5">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5"/><path d="M3 22a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600">Login to continue to your dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-3 text-slate-900 shadow-sm ring-1 ring-transparent transition focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-3 text-slate-900 shadow-sm ring-1 ring-transparent transition focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3.5 shadow-lg shadow-amber-500/20 ring-1 ring-amber-600/20 transition hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700"
            >
              Login
            </button>

            {message && (
              <p
                className={`text-center mt-3 text-sm font-medium ${
                  message.includes("successful") ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
