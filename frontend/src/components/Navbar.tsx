"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingCart, LogOut, Sun, Moon, Menu, X, Heart } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-brand-bg text-brand-text shadow-md border-b border-brand-surface sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 group" data-testid="nav-home-link">
              <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-text group-hover:text-brand-accent transition-colors">
                Shop<span className="text-brand-accent">Sphere</span>
              </span>
            </Link>

            <Link href="/dashboard" className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-brand-surface text-brand-muted hover:text-brand-accent hover:bg-brand-surface/80 rounded-lg transition-colors font-medium text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>QualityPilot</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-brand-surface text-brand-muted hover:text-brand-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-sm text-brand-muted" data-testid="nav-user-greeting">
                  Hi, {user?.full_name || user?.email}
                </span>

                <Link href="/wishlist" className="relative text-brand-muted hover:text-brand-accent transition-colors p-2" data-testid="nav-wishlist-link">
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="relative text-brand-muted hover:text-brand-accent transition-colors p-2" data-testid="nav-cart-link">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center" data-testid="nav-cart-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-brand-muted hover:text-red-500 transition-colors p-2"
                  data-testid="nav-logout-btn"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-brand-muted hover:text-brand-accent font-medium transition-colors text-sm" data-testid="nav-login-link">
                  Login
                </Link>
                <Link href="/register" className="bg-brand-accent hover:bg-brand-accent-hover text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" data-testid="nav-register-link">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-brand-muted hover:text-brand-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t border-brand-surface mt-2 pt-4 space-y-3">
            <Link href="/dashboard" className="flex items-center space-x-2 text-brand-muted hover:text-brand-accent text-sm py-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>QualityPilot Dashboard</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-brand-muted hover:text-brand-accent text-sm py-2 w-full"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="flex items-center space-x-2 text-brand-muted hover:text-brand-accent text-sm py-2" onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingCart size={16} />
                  <span>Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 text-red-400 hover:text-red-500 text-sm py-2 w-full">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center text-brand-muted border border-brand-surface py-2 rounded-xl text-sm font-medium hover:text-brand-accent transition-colors">Login</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center bg-brand-accent text-white py-2 rounded-xl text-sm font-semibold">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
