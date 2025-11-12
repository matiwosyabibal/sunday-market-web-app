import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
 import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminDashboard from "./components/AdminDashboard";
import ManageUsers from "./components/ManageUsers";
import SellerDashboard from "./components/SellerDashboard";
import AddProduct from "./components/AddProduct";
import SellerVerifications from "./components/SellerVerifications";
import CustomerDashboard from "./components/CustomerDashboard";
import DeliveryDashboard from "./components/DeliveryDashboard";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Support from "./components/Support";
import Services from "./components/Services";

function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-indigo-50 selection:bg-indigo-100 selection:text-indigo-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-400/30 blur-2xl" />
          <div className="absolute -top-14 -right-14 h-56 w-56 rounded-full ring-2 ring-amber-300/40" />
          <div className="absolute -top-6 -right-6 h-36 w-36 rounded-full ring-2 ring-amber-400/30" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-60 blur-sm bg-[conic-gradient(from_0deg,rgba(251,191,36,0.18),transparent_12%,rgba(251,191,36,0.12)_18%,transparent_30%)]" />
        </div>
        <div className="relative mx-auto w-full px-2 sm:px-4 lg:px-6 pt-0 pb-0 sm:pt-0 sm:pb-0 lg:grid lg:grid-cols-2 lg:gap-0 items-stretch min-h-[calc(100vh-64px)]">
          <div
            className="relative flex items-center w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/hback.png)" }}
          >
            <div className="w-full max-w-3xl px-6 sm:px-8 lg:px-10">
              <div className="mt-6 flex items-center gap-3">
                <a href="/customer" className="rounded-xl bg-black px-6 py-3 text-base font-medium text-white shadow-lg shadow-black/20 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-neutral-900">Start Shopping</a>
                <a href="/seller" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:bg-slate-50">Sell with Us</a>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:flex lg:items-stretch">
            <div className="relative w-full h-full">
              <div className="relative w-full h-full overflow-hidden bg-black">
                <video
                  src="/videos/demo.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-0 py-12 sm:py-14">
        <h2 className="text-xl font-semibold text-slate-900">Explore Products</h2>
        <p className="text-sm text-slate-600">Preview the customer shopping experience. To buy or add to cart, please create an account and login.</p>
        <div className="mt-4 w-full p-0">
          <CustomerDashboard preview={true} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <h2 className="text-xl font-semibold text-slate-900">Shop by Category</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 lg:gap-5">
          {[{k:"phones",t:"Phones"},{k:"laptops",t:"Laptops"},{k:"tvs",t:"TVs"},{k:"audio",t:"Audio"},{k:"gaming",t:"Gaming"},{k:"accessories",t:"Accessories"}].map((c) => (
            <a
              key={c.k}
              href={`/customer?category=${c.k}&preview=1`}
              className="group relative rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-indigo-50/60 to-purple-50/60" />
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 ring-1 ring-slate-200/60 transition-transform duration-200 group-hover:scale-110 group-hover:from-indigo-50 group-hover:to-indigo-100">
                {c.k === "phones" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="7" y="2" width="10" height="20" rx="2"/>
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                )}
                {c.k === "laptops" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="5" width="16" height="10" rx="2"/>
                    <path d="M2 18h20"/>
                  </svg>
                )}
                {c.k === "tvs" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="12" rx="2"/>
                    <path d="M12 17v3"/>
                  </svg>
                )}
                {c.k === "audio" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="8" width="4" height="8" rx="1"/>
                    <rect x="16" y="8" width="4" height="8" rx="1"/>
                    <path d="M8 12h8"/>
                  </svg>
                )}
                {c.k === "gaming" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 15l3-2h6l3 2a3 3 0 003-3V9a3 3 0 00-3-3H6A3 3 0 003 9v3a3 3 0 003 3z"/>
                    <path d="M8 12h2m-1-1v2M16 11h.01M18 13h.01"/>
                  </svg>
                )}
                {c.k === "accessories" && (
                  <svg className="h-8 w-8 text-slate-700 drop-shadow-sm transition-colors group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.364-6.364l-2.121 2.121M8.757 17.243l-2.121 2.121"/>
                  </svg>
                )}
              </div>
              <div className="mt-3 text-center text-sm font-semibold tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">{c.t}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-6 sm:p-10 text-white shadow-xl ring-1 ring-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight">Join our seller community</div>
              <div className="text-sm opacity-95">Reach more customers with a trusted marketplace experience.</div>
            </div>
            <a href="/seller" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-900/10 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:bg-slate-100">Open Seller Dashboard</a>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">What our customers say</h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">Real feedback from smart shoppers.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[{
            q: "Fast delivery and great price for my new phone.",
            a: "Lidiya T.",
            r: 5,
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format"
          },{
            q: "Smooth checkout and helpful support.",
            a: "Samuel K.",
            r: 5,
            img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format"
          },{
            q: "Quality laptop, exactly as described.",
            a: "Eden M.",
            r: 4,
            img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&auto=format"
          }].map((t, i) => (
            <div key={i} className="relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-lg">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100" />
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.a} className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.a}</div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} className={`h-4 w-4 ${s < t.r ? "opacity-100" : "opacity-30"}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-700 leading-relaxed">“{t.q}”</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function App() {
  function isSeller() {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return !!token && role === "seller";
    } catch {
      return false;
    }
  }

  function SellerOnlyRoute({ children }) {
    if (!isSeller()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
  function isCustomer() {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return !!token && role === "customer";
    } catch {
      return false;
    }
  }
  function CustomerOnlyRoute({ children }) {
    if (!isCustomer()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/admin/seller-verifications" element={<SellerVerifications />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route
          path="/add-product"
          element={
            <SellerOnlyRoute>
              <AddProduct />
            </SellerOnlyRoute>
          }
        />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
