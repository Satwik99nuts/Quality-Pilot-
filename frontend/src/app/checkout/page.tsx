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
      <h1 className="text-3xl font-bold text-slate-900 mb-8" data-testid="page-title">Checkout</h1>
      
      <div className="lg:flex gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Information</h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm" data-testid="checkout-error">
                {error}
              </div>
            )}
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4" data-testid="checkout-form">
              <div>
                <label className="block text-sm font-medium text-slate-700">Card Number (Mock)</label>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  data-testid="checkout-card"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700">Expiry (Mock)</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700">CVC (Mock)</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>
            
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition disabled:bg-slate-300"
              data-testid="checkout-submit"
            >
              {loading ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
