"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900" data-testid="page-title">Featured Products</h1>
        <p className="text-slate-500 mt-2">Explore our latest collection.</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-lg text-center shadow-sm border border-slate-200 text-slate-500">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
