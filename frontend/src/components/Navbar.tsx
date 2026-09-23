"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, LogOut } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight" data-testid="nav-home-link">
              ShopSphere
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-300" data-testid="nav-user-greeting">
                  Hello, {user?.full_name || user?.email}
                </span>
                
                <Link href="/cart" className="relative text-slate-300 hover:text-white" data-testid="nav-cart-link">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" data-testid="nav-cart-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-slate-300 hover:text-red-400"
                  data-testid="nav-logout-btn"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white" data-testid="nav-login-link">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition" data-testid="nav-register-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
