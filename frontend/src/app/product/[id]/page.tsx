"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../services/api";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { ShoppingBag } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (product) {
      await addToCart(product.id, quantity);
      router.push("/cart");
    }
  };

  if (loading) return <div className="text-center py-20">Loading product details...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="md:flex">
        <div className="md:w-1/2 aspect-square bg-slate-100 flex items-center justify-center p-10">
          <ShoppingBag className="text-slate-300 w-32 h-32" />
        </div>
        <div className="md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="product-title">{product.name}</h1>
          <p className="text-2xl font-semibold text-slate-800 mb-6" data-testid="product-price">${product.price.toFixed(2)}</p>
          
          <div className="prose text-slate-600 mb-8" data-testid="product-description">
            {product.description}
          </div>

          <div className="mb-6">
            <span className="text-sm text-slate-500">
              Availability: {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-medium" data-testid="product-stock-status">In Stock ({product.stock_quantity})</span>
              ) : (
                <span className="text-red-600 font-medium" data-testid="product-stock-status">Out of Stock</span>
              )}
            </span>
          </div>

          {product.stock_quantity > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="text-sm font-medium text-slate-700">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded border-slate-300 py-1.5 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 border"
                data-testid="product-quantity-select"
              >
                {[...Array(Math.min(10, product.stock_quantity))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition disabled:bg-slate-300"
            data-testid="add-to-cart-btn"
          >
            {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
