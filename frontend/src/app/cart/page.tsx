"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Trash2, ShoppingCart } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal, isLoading } = useCart();

  if (isLoading) return <div className="text-center py-20">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
        <ShoppingCart className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8" data-testid="page-title">Shopping Cart</h1>
      
      <div className="lg:flex gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" data-testid="cart-items">
            <ul className="divide-y divide-slate-200">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between" data-testid={`cart-item-${item.id}`}>
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{item.product.name}</h3>
                    <p className="text-sm text-slate-500">${item.product.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`quantity-${item.id}`} className="text-sm text-slate-600">Qty:</label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="border border-slate-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        data-testid={`cart-item-quantity-${item.id}`}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="text-lg font-bold text-slate-800 w-24 text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      aria-label="Remove item"
                      data-testid={`cart-item-remove-${item.id}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span data-testid="cart-total">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition"
              data-testid="checkout-link"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
