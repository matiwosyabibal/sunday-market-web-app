import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 selection:bg-amber-100 selection:text-amber-900">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200/50 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                Our Story
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                About Sunday Market
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                We help people buy premium electronics at smart prices with simple checkout and fast, reliable delivery.
              </p>
            </div>
            <a 
              href="/register?role=seller" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ring-1 ring-amber-600/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6v6l4 2"/>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Become a Seller
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        {/* Mission Section */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 backdrop-blur-xl p-8 ring-1 ring-slate-200/50 shadow-lg shadow-slate-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Our Mission</h2>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              To build a trusted marketplace for electronics where customers enjoy fair pricing, clear information, and delightful delivery—while sellers grow with the tools and support they need.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: "M12 6v6l4 2", bg: "amber", value: "24/7", label: "Smart support" },
                { icon: "M3 12h18M12 3v18", bg: "indigo", value: "2h–24h", label: "Typical delivery" },
                { icon: "M3 12l6 6L21 6", bg: "purple", value: "99.9%", label: "Payment uptime" }
              ].map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-indigo-200/50">
                  <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-${item.bg}-100/50 group-hover:scale-110 transition-transform duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-${item.bg}-500 to-${item.bg}-600 text-white shadow-lg`}>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d={item.icon}/>
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 font-medium">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Values Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl shadow-purple-500/20 ring-1 ring-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1.5 w-8 rounded-full bg-white/60"></div>
              <h3 className="text-xl font-bold">What We Value</h3>
            </div>
            <ul className="space-y-4">
              {["Trust & transparency", "Fair pricing & quality", "Fast delivery", "Customer-first experience"].map((value, index) => (
                <li key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="h-2 w-2 rounded-full bg-white/80 flex-shrink-0"></div>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 backdrop-blur-xl p-8 ring-1 ring-amber-200/50 shadow-lg shadow-amber-200/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Browse & Compare",
                description: "Find phones, laptops, TVs, audio and more with clear pricing and details.",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                step: 1
              },
              {
                title: "Secure Checkout",
                description: "Pay with trusted methods including Telebirr, and receive instant confirmation.",
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                step: 2
              },
              {
                title: "Fast Delivery",
                description: "Track your order from acceptance to delivery with real-time updates.",
                icon: "M3 7h18M5 7l2 10h10l2-10M10 11v4M14 11v4",
                step: 3
              }
            ].map((step, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 ring-1 ring-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-amber-200/50">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100/50 via-indigo-100/50 to-purple-100/50 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg flex-shrink-0">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={step.icon}/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2">
                    <span className="rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200/50">
                      Step {step.step}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team & Contact */}
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Team Section */}
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200/50 shadow-lg shadow-slate-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <h2 className="text-2xl font-bold text-slate-900">Our Team</h2>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed">
              We're a group of engineers, designers, and operators focused on building a marketplace people trust.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((member) => (
                <div key={member} className="flex items-center gap-4 rounded-xl bg-slate-50/50 p-4 ring-1 ring-slate-200/50 hover:ring-slate-300/50 transition-all duration-300 hover:bg-white">
                  <div className="relative">
                    <img
                      src={member === 1 
                        ? `/images/team-member-1-custom.jpg`
                        : `${process.env.PUBLIC_URL}/images/team-member-${member}.jpg`}
                      alt={`Team member ${member}`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
                      onError={(e) => { 
                        e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format"; 
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Team Member {member}</div>
                    <div className="text-sm text-slate-600">Role Position</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200/50 shadow-lg shadow-slate-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed">
              Have a question or feedback? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 ring-1 ring-slate-200/50 hover:bg-white transition-colors duration-300">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Email</div>
                  <a href="mailto:support@sunday.market" className="text-amber-600 hover:text-amber-700 hover:underline transition-colors duration-200">
                    support@sunday.market
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 ring-1 ring-slate-200/50 hover:bg-white transition-colors duration-300">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Phone</div>
                  <a href="tel:+251900000000" className="text-amber-600 hover:text-amber-700 hover:underline transition-colors duration-200">
                    +251 900 000 000
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 text-white shadow-xl shadow-orange-500/30 ring-1 ring-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Join Thousands of Smart Shoppers</h3>
              <p className="text-amber-100 text-lg">
                Sign in or create your account to get the best deals every Sunday.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="/login" 
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Login
              </a>
              <a 
                href="/register?role=seller" 
                className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20 hover:ring-white/50 transition-all duration-300 hover:scale-105"
              >
                Create Account
              </a>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
}