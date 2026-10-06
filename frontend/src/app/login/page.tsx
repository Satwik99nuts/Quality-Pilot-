"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      login(res.data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      // Mock Google Login: Create/Login as a default Google User
      const googleEmail = "demo.google@example.com";
      const googlePass = "MockGooglePass123!";
      
      try {
         // Attempt to login first
         const formData = new URLSearchParams();
         formData.append("username", googleEmail);
         formData.append("password", googlePass);
         const res = await api.post("/auth/login", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
         });
         login(res.data.access_token);
         router.push("/");
      } catch {
         // If login fails, register them, then login
         await api.post("/auth/register", {
            email: googleEmail,
            password: googlePass,
            full_name: "Google User"
         });
         
         const formData = new URLSearchParams();
         formData.append("username", googleEmail);
         formData.append("password", googlePass);
         const res = await api.post("/auth/login", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
         });
         login(res.data.access_token);
         router.push("/");
      }
    } catch (err: any) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="bg-brand-surface rounded-2xl p-8 shadow-lg border border-brand-bg/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Welcome Back</h2>
            <p className="text-brand-muted text-sm mt-1">Sign in to your ShopSphere account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl mb-6 text-sm text-center" data-testid="login-error">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-brand-bg hover:bg-brand-bg/80 text-brand-text border border-brand-bg rounded-xl py-3 px-4 font-medium transition-all mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-brand-bg"></div>
            <span className="text-brand-muted text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-brand-bg"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl bg-brand-bg border border-brand-bg text-brand-text placeholder-brand-muted/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent p-3 outline-none transition-all"
                data-testid="login-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-brand-bg border border-brand-bg text-brand-text placeholder-brand-muted/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent p-3 pr-12 outline-none transition-all"
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-accent transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-brand-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-accent hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
