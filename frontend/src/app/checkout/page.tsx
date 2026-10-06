"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setError("");

    try {
      await api.post("/orders/");
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Checkout failed", err);
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-10 border border-slate-200 rounded-lg shadow-sm text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4" data-testid="checkout-success">Order Confirmed!</h2>
        <p className="text-slate-600 mb-8">Thank you for your purchase. Your order is being processed.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition"
          data-testid="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Your cart is empty</h2>
        <button onClick={() => router.push("/")} className="text-blue-600 hover:underline">Return to store</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-8" data-testid="page-title">Checkout</h1>
      
      <div className="lg:flex gap-8">
        <div className="lg:w-2/3">
          <div className="bg-brand-surface rounded-2xl shadow-sm border border-brand-bg/50 p-8">
            <h2 className="text-xl font-bold text-brand-text mb-6">Payment Information</h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm" data-testid="checkout-error">
                {error}
              </div>
            )}
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4" data-testid="checkout-form">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1.5">Card Number (Mock)</label>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  className="mt-1 block w-full rounded-xl bg-brand-bg border border-brand-bg text-brand-text placeholder-brand-muted/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent p-3 outline-none transition-all"
                  data-testid="checkout-card"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-brand-muted mb-1.5">Expiry (Mock)</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="mt-1 block w-full rounded-xl bg-brand-bg border border-brand-bg text-brand-text placeholder-brand-muted/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent p-3 outline-none transition-all"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-brand-muted mb-1.5">CVC (Mock)</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    className="mt-1 block w-full rounded-xl bg-brand-bg border border-brand-bg text-brand-text placeholder-brand-muted/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent p-3 outline-none transition-all"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-brand-surface rounded-2xl shadow-sm border border-brand-bg/50 p-8 sticky top-6">
            <h2 className="text-xl font-bold text-brand-text mb-4">Order Summary</h2>
            
            <div className="divide-y divide-slate-100 mb-6">
              {items.map(item => (
                <div key={item.id} className="py-3 flex justify-between">
                  <span className="text-slate-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-slate-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-900 mb-6">
              <span>Total</span>
              <span data-testid="checkout-total">${cartTotal.toFixed(2)}</span>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 mb-4"
              data-testid="checkout-submit"
            >
              {loading ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
            </button>
            
            <div className="relative flex items-center py-2 mb-4">
               <div className="flex-grow border-t border-brand-bg"></div>
               <span className="flex-shrink-0 mx-4 text-brand-muted text-sm font-semibold uppercase tracking-wider">Or pay with</span>
               <div className="flex-grow border-t border-brand-bg"></div>
            </div>
            
            <div className="space-y-3">
               {/* Mock PayPal Button */}
               <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-[#FFC439] hover:bg-[#F4BB33] text-black font-bold py-3 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  <svg viewBox="0 0 124 33" className="h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M46.21 21.43c-3.13 0-5.83-1.12-7.51-3.11-1.68-1.99-2.31-4.83-1.78-7.97.55-3.32 2.29-6.07 4.79-7.58C44.13 1.34 47.01.5 50.36.5h11.23c2.09 0 3.73.53 4.88 1.57 1.13 1.02 1.62 2.5 1.45 4.38-.41 4.54-2.82 7.79-7.1 9.56-1.55.64-3.35.97-5.3.97H53.1l-1.63 7.85c-.09.43-.46.73-.9.73H46.21zm4.84-17.18c-.37 2.18-.01 3.96 1.05 5.2 1.08 1.25 2.78 1.89 5 1.89h1.79c1.69 0 3.25-.33 4.62-.97 3.32-1.54 5.23-4.33 5.56-8.2.06-.69-.14-1.28-.58-1.72-.45-.44-1.2-.66-2.22-.66h-8.08c-2.73 0-4.99.71-6.66 2.08-1.46 1.18-2.07 2.72-1.84 4.59zM80.08 17.65c-.07.35-.38.6-.74.6H74.4c-.37 0-.7-.25-.78-.61l-.64-3.03h-6.26l-.99 3.03c-.11.35-.44.59-.8.59h-4.88c-.5 0-.84-.49-.71-.98l5.85-17.2c.11-.34.44-.57.8-.57h5.81c.36 0 .69.25.77.6l6.51 17.57zm-8.22-7.15l-1.96-5.83c-.11-.34-.6-.34-.72 0l-2.03 5.83h4.71zM97.74 21.43c-3.13 0-5.83-1.12-7.51-3.11-1.68-1.99-2.31-4.83-1.78-7.97.55-3.32 2.29-6.07 4.79-7.58C95.66 1.34 98.54.5 101.89.5h11.23c2.09 0 3.73.53 4.88 1.57 1.13 1.02 1.62 2.5 1.45 4.38-.41 4.54-2.82 7.79-7.1 9.56-1.55.64-3.35.97-5.3.97h-2.42l-1.63 7.85c-.09.43-.46.73-.9.73H97.74zm4.84-17.18c-.37 2.18-.01 3.96 1.05 5.2 1.08 1.25 2.78 1.89 5 1.89h1.79c1.69 0 3.25-.33 4.62-.97 3.32-1.54 5.23-4.33 5.56-8.2.06-.69-.14-1.28-.58-1.72-.45-.44-1.2-.66-2.22-.66h-8.08c-2.73 0-4.99.71-6.66 2.08-1.46 1.18-2.07 2.72-1.84 4.59zM120.35 17.65c-.07.35-.38.6-.74.6h-4.88c-.37 0-.7-.25-.78-.61l-3.35-15.65c-.09-.44.25-.85.7-.85h4.94c.36 0 .69.26.77.61l1.52 7.73c.09.48.79.48.88 0l2.5-7.73c.12-.35.45-.6.82-.6h4.82c.5 0 .84.5.7.99l-5.8 15.51h-2.1z" fill="#003087"/>
                     <path d="M23.11 21.43c-3.13 0-5.83-1.12-7.51-3.11-1.68-1.99-2.31-4.83-1.78-7.97.55-3.32 2.29-6.07 4.79-7.58 2.42-1.43 5.3-2.27 8.65-2.27h11.23c2.09 0 3.73.53 4.88 1.57 1.13 1.02 1.62 2.5 1.45 4.38-.41 4.54-2.82 7.79-7.1 9.56-1.55.64-3.35.97-5.3.97H29.9l-1.63 7.85c-.09.43-.46.73-.9.73H23.11zm4.84-17.18c-.37 2.18-.01 3.96 1.05 5.2 1.08 1.25 2.78 1.89 5 1.89h1.79c1.69 0 3.25-.33 4.62-.97 3.32-1.54 5.23-4.33 5.56-8.2.06-.69-.14-1.28-.58-1.72-.45-.44-1.2-.66-2.22-.66h-8.08c-2.73 0-4.99.71-6.66 2.08-1.46 1.18-2.07 2.72-1.84 4.59z" fill="#0079C1"/>
                  </svg>
               </button>
               
               {/* Mock GPay Button */}
               <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-black hover:bg-black/90 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  <svg viewBox="0 0 40 16" className="h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M14.92 7.15v2.85h4.63c-.19 1.24-.71 2.18-1.4 2.87-.85.85-2.2 1.78-4.63 1.78-3.71 0-6.61-3.05-6.61-6.84S9.81 1 13.52 1c1.99 0 3.44.78 4.52 1.83l2.02-2.02C18.66-.54 16.51-1.5 13.52-1.5 6.13-1.5 0 4.52 0 11.9s6.13 13.4 13.52 13.4c3.96 0 7.02-1.3 9.38-3.74 2.4-2.4 3.14-5.78 3.14-8.49 0-.69-.06-1.34-.17-1.92h-10.95zM36.19 8.2c-.89-2.31-3.32-6.19-7.14-6.19-3.78 0-6.85 2.97-6.85 6.84 0 3.73 3.05 6.84 7.24 6.84 3.32 0 5.25-2.04 6.06-3.23l-2.33-1.55c-.81 1.21-1.8 1.93-3.73 1.93-1.93 0-3.05-.87-3.78-2.61l10.37-4.29-.24-.59zm-11.02.48c0-2.58 1.99-4.14 3.96-4.14 1.5 0 2.76.77 3.23 1.83l-7.19 2.98v-.67zm-3.01 6.81V2.36h-2.91v13.13h2.91zm-4.32-8.31c-.74-.89-1.91-1.63-3.37-1.63-3.14 0-5.91 2.85-5.91 6.81 0 3.94 2.77 6.81 5.91 6.81 1.46 0 2.63-.74 3.37-1.66v1.34c0 2.72-1.46 4.19-3.4 4.19-1.59 0-2.56-1.15-2.95-2.09l-2.51 1.05C10 24.36 12 26.2 15.22 26.2c3.34 0 6.22-1.97 6.22-6.84v-11.4h-2.85v1.32zm-3.26 4.02c0 2.21 1.57 3.94 3.65 3.94 2.08 0 3.69-1.75 3.69-3.94 0-2.21-1.61-4.02-3.69-4.02-2.08.01-3.65 1.82-3.65 4.02z" fill="#FFF"/>
                  </svg>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
