import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const authItems = [
  { to: "/register", label: "Register", highlight: false },
  { to: "/login", label: "Login", highlight: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 shadow-lg backdrop-blur-xl border-b border-gray-200/60' 
        : 'bg-white/90 backdrop-blur-lg border-b border-gray-100/50'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg ring-1 ring-black/5 transition-all duration-500 group-hover:rotate-12 group-hover:shadow-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <svg className="h-6 w-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10l1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l1-11Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent leading-tight">
                Sunday Market
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">Premium Shopping Experience</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl ${
                    isActive 
                      ? 'text-amber-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10 tracking-wide">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-x-2 -bottom-1 flex justify-center">
                        <span className="h-1 w-1 bg-amber-500 rounded-full animate-pulse"></span>
                        <span className="h-0.5 w-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full absolute -bottom-1"></span>
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-4"></div>
            
            {authItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  item.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-0.5 relative overflow-hidden group'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {item.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 tracking-wide">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Additional Desktop Elements */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2.5 rounded-xl text-gray-600 hover:text-amber-600 hover:bg-white/80 transition-all duration-300 transform hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Cart Icon */}
            <button className="p-2.5 rounded-xl text-gray-600 hover:text-amber-600 hover:bg-white/80 transition-all duration-300 transform hover:scale-110 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                3
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setOpen(!open)}
            className="lg:hidden inline-flex items-center justify-center p-3 rounded-2xl text-gray-700 hover:bg-white/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 transform hover:scale-105"
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                open ? 'rotate-45 top-3' : ''
              }`}></span>
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}></span>
              <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                open ? '-rotate-45 top-3' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2 bg-white/95 backdrop-blur-lg border-t border-gray-200/60 shadow-inner">
          {[...navItems, ...authItems].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 transform hover:translate-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-l-4 border-amber-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md'
                } ${
                  item.highlight && !isActive ? 'bg-amber-50 text-amber-700' : ''
                }`
              }
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.highlight && !location.pathname === item.to && (
                  <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
                )}
              </div>
            </NavLink>
          ))}
          
          {/* Mobile Additional Actions */}
          <div className="flex space-x-4 pt-4 px-4">
            <button className="flex-1 flex items-center justify-center p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
            <button className="flex-1 flex items-center justify-center p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300 relative">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              <span className="absolute top-2 right-4 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}